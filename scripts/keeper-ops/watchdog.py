"""Public-only monitoring, independent of Keeper. Python standard library only."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
from urllib.request import Request, urlopen

SITE = "https://botcabinet.com"
API = "https://mdjchixwgvicovkwrgle.supabase.co/functions/v1"
TARGETS = {"home": SITE + "/", "watch": SITE + "/watch/", "trust": SITE + "/trust/",
           "catalog": SITE + "/catalog.json", "sitemap": SITE + "/sitemap.xml",
           "feed": SITE + "/feed.xml", "agents": SITE + "/agents.md", "llms": SITE + "/llms.txt",
           "keeper": API + "/keeper-status", "watch_api": API + "/agent-watch"}
MARKER = "<!-- bot-cabinet-keeper-watchdog:v1 -->"
TITLE = "Keeper needs attention: public health or freshness checks failed"
RETIRED = {"bounce-rate-is-not-useful-action", "repeat-use-not-return-visits"}


class FlightScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.active = True

    def handle_endtag(self, tag):
        if tag == "script":
            self.active = False

    def handle_data(self, data):
        if self.active:
            self.parts.append(data)


def parse_watch_page(html):
    """Read serialized JSON, never execute website JavaScript."""
    parser = FlightScripts()
    parser.feed(html)
    chunks = []
    for script in parser.parts:
        marker = "self.__next_f.push("
        if marker in script:
            value, _ = json.JSONDecoder().raw_decode(script.split(marker, 1)[1])
            if isinstance(value, list) and len(value) > 1 and isinstance(value[1], str):
                chunks.append(value[1])
    content = "".join(chunks)
    marker = '"fallbackItems":'
    if marker not in content:
        raise ValueError("Missing deployed Watch items")
    items, _ = json.JSONDecoder().raw_decode(content.split(marker, 1)[1])
    return watch_items(items)


def fetch(target):
    key, url = target
    try:
        with urlopen(Request(url, headers={"User-Agent": "BotCabinet-Watchdog/1.0"}), timeout=15) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000:
                raise ValueError("oversize")
            # Redirected sign-in pages must not count as a healthy response.
            if response.url.rstrip("/") != url.rstrip("/"):
                raise ValueError("redirect")
            payload = json.loads(body) if key in {"keeper", "watch_api", "catalog"} else None
            if key == "watch":
                payload = parse_watch_page(body.decode("utf-8"))
            return key, {"status": response.status, "bytes": len(body)}, payload
    except (OSError, ValueError):
        return key, {"status": "unavailable"}, None


def stamp(value):
    if not isinstance(value, str):
        raise ValueError("missing timestamp")
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise ValueError("missing timezone")
    return result


def watch_items(value):
    if not isinstance(value, list) or not value:
        raise ValueError("missing items")
    slugs = set()
    for item in value:
        if not isinstance(item, dict) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(item.get("slug", ""))):
            raise ValueError("invalid item")
        for field in ("observedOn", "reviewAgainBy"):
            text = item.get(field)
            if not isinstance(text, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
                raise ValueError("invalid date")
            date.fromisoformat(text)
        if item["slug"] in slugs:
            raise ValueError("duplicate slug")
        slugs.add(item["slug"])
    return value


def evaluate(payloads, seed, endpoints, now):
    """Return stable, public diagnostics. Never include remote text or exceptions."""
    findings = [f"endpoint-unavailable:{key}" for key, status in sorted(endpoints.items()) if status.get("status") != 200]
    facts = {}
    try:
        publication = payloads["keeper"]["publication"]
        status = publication["status"]
        if status.get("schema") != "bot-cabinet-trust-status-candidate/v1":
            raise ValueError("schema")
        published, generated = stamp(publication["publishedAt"]), stamp(status["generated_at"])
        facts["keeper_published_at"] = published.isoformat()
        facts["keeper_generated_at"] = generated.isoformat()
        if published > now or generated > now or generated > published:
            findings.append("keeper-invalid-time")
        if now - published > timedelta(hours=48):
            findings.append("keeper-publication-stale")
        if now - generated > timedelta(hours=48):
            findings.append("keeper-results-stale")
        checks = status["checks"]
        expected = {"public-site", "github-public", "download-inventory", "agent-watch", "agent-landscape"}
        if not isinstance(checks, list) or len(checks) != 5 or {c["key"] for c in checks} != expected:
            raise ValueError("checks")
        for check in checks:
            key, last = check["key"], stamp(check["last_run"])
            limit = check["late_after_hours"]
            if type(limit) is not int or not 1 <= limit <= 48 or last > now:
                raise ValueError("check time")
            if check.get("result") != "passed":
                findings.append(f"keeper-check-attention:{key}")
            if now - last > timedelta(hours=limit):
                findings.append(f"keeper-check-stale:{key}")
    except (KeyError, TypeError, ValueError, AttributeError, OverflowError):
        findings.append("keeper-invalid-or-missing")
    try:
        live = watch_items(payloads["watch_api"]["items"])
    except (KeyError, TypeError, ValueError):
        live = []
        findings.append("watch-api-invalid-or-missing")
    try:
        fallback = watch_items(seed)
    except (TypeError, ValueError):
        fallback = []
        findings.append("watch-repository-invalid-or-missing")
    try:
        deployed = watch_items(payloads["watch"])
    except (KeyError, TypeError, ValueError):
        deployed = []
        findings.append("watch-page-invalid-or-missing")
    if deployed and fallback:
        signature = lambda items: {(i["slug"], i["observedOn"], i["reviewAgainBy"]) for i in items}
        if signature(deployed) != signature(fallback):
            findings.append("watch-deployment-differs-from-repository")
    merged = {item["slug"]: item for item in live if item["slug"] not in RETIRED}
    for item in deployed:
        current = merged.get(item["slug"])
        if not current or current["observedOn"] <= item["observedOn"]:
            merged[item["slug"]] = item
    items = list(merged.values())
    if not items:
        findings.append("watch-empty")
    else:
        newest = max(date.fromisoformat(item["observedOn"]) for item in items)
        facts["watch_newest_observation"] = newest.isoformat()
        facts["watch_items"] = len(items)
        facts["watch_overdue_reviews"] = sum(date.fromisoformat(item["reviewAgainBy"]) < now.date() for item in items)
        if any(date.fromisoformat(item["observedOn"]) > now.date() for item in items):
            findings.append("watch-future-observation")
        if now.date() - newest > timedelta(days=7):
            findings.append("watch-observations-stale")
        if facts["watch_overdue_reviews"]:
            findings.append("watch-reviews-overdue")
    return {"schema": "bot-cabinet-watchdog/v1", "checked_at": now.isoformat(),
            "healthy": not findings, "findings": sorted(set(findings)), "facts": facts, "endpoints": endpoints}


def incident(report, run_url):
    # checked_at and response sizes change on every run, and must not create noise.
    state = {"findings": report["findings"], "facts": report["facts"]}
    digest = hashlib.sha256(json.dumps(state, sort_keys=True).encode()).hexdigest()
    lines = [MARKER, f"<!-- state:{digest} -->", "## Public monitoring result", "",
             "Keeper's public health or freshness evidence needs agent attention. This is not a request for the owner to review research findings.", ""]
    lines.extend(f"- `{finding}`" for finding in report["findings"])
    lines.extend(["", "### Public evidence", ""])
    lines.extend(f"- {key}: {value}" for key, value in sorted(report["facts"].items()))
    lines.extend(["", f"[Latest changed result]({run_url})", "",
                  "A stale public report does not prove the cloud jobs stopped. This monitor cannot see private job execution or clear a private backlog."])
    return "\n".join(lines) + "\n"


def sync_issue(report, repository, request, run_url):
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise ValueError("Invalid repository")
    if not re.fullmatch(r"https://github\.com/" + re.escape(repository) + r"/actions/runs/\d+", run_url):
        raise ValueError("Invalid workflow run URL")
    base = f"/repos/{repository}"
    opened = []
    page = 1
    while True:
        batch = request("GET", f"{base}/issues?state=open&per_page=100&page={page}")
        opened.extend(i for i in batch if i.get("title") == TITLE and str(i.get("body", "")).startswith(MARKER) and not i.get("pull_request"))
        if len(batch) < 100:
            break
        page += 1
    if len(opened) > 1:
        raise ValueError("Multiple monitor-owned incidents; refusing ambiguous edits")
    existing = opened[0] if opened else None
    if report["healthy"]:
        if existing:
            request("PATCH", f"{base}/issues/{existing['number']}", {"state": "closed", "state_reason": "completed"})
            return "closed"
        return "none"
    body = incident(report, run_url)
    if not existing:
        request("POST", f"{base}/issues", {"title": TITLE, "body": body})
        return "opened"
    if existing.get("body") == body:
        return "unchanged"
    # Compare stable state markers so new workflow URLs alone do not trigger writes.
    digest = body.splitlines()[1]
    if digest in str(existing.get("body", "")):
        return "unchanged"
    request("PATCH", f"{base}/issues/{existing['number']}", {"body": body})
    return "updated"


def github_request(method, path, data=None):
    token = os.environ["GH_TOKEN"]
    request = Request("https://api.github.com" + path, method=method,
                      data=None if data is None else json.dumps(data).encode(),
                      headers={"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json",
                               "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"})
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--report-issue", action="store_true")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    try:
        text = (root / "supabase/functions/agent-watch/seed.ts").read_text()
        seed, _ = json.JSONDecoder().raw_decode(text.split("export const AGENT_WATCH_SEED: AgentWatchItem[] = ", 1)[1])
    except (OSError, IndexError, ValueError):
        seed = None
    payloads, endpoints = {}, {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        for key, status, payload in pool.map(fetch, TARGETS.items()):
            endpoints[key], payloads[key] = status, payload
    report = evaluate(payloads, seed, endpoints, datetime.now(timezone.utc))
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    summary = "## Keeper public watchdog\n\n" + ("All checks passed.\n" if report["healthy"] else "\n".join(f"- {item}" for item in report["findings"]) + "\n")
    (args.output / "summary.md").write_text(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as stream:
            stream.write(summary)
    if args.report_issue:
        repository = os.environ["GITHUB_REPOSITORY"]
        run_url = f"https://github.com/{repository}/actions/runs/{os.environ['GITHUB_RUN_ID']}"
        print("incident:", sync_issue(report, repository, github_request, run_url))
    print(json.dumps({"healthy": report["healthy"], "findings": report["findings"], "facts": report["facts"]}, indent=2))
    return 0 if report["healthy"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
