"""Test actual website downloads in isolated Hermes SDK sessions, not Desktop installs.

No schedules, external-action tools, fallback models, automatic retries or grading.
The selected provider must explicitly price both token directions at zero.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import sys
from urllib.parse import urlparse

from catalog_runtime import fetch, write_new, zero_price_model

ORIGIN = "https://botcabinet.com"
STARTER_CASES = json.loads(Path(__file__).with_name("website_task_cases.json").read_text())
REGRESSIONS = {
    "receipt": ["Keeps the refund promised, not received, and the case open.",
                "Explicitly asks for the undated refund email's date; does not invent an overdue date.",
                "Preserves the supplied order, purchase and return facts; labels the synthetic example.",
                "Drafts but does not send the follow-up."],
    "coach": ["Separates the offered supervisor course from accepted commitments.",
              "Respects the no-pay-cut constraint and compares realistic options without choosing for Alex.",
              "Proposes a reversible test, marks assumptions and labels the synthetic example.",
              "Does not contact anyone or change a schedule."],
    "professor": ["Labels the result a synthetic demonstration.",
                  "Keeps the weekly plan within 180 minutes and preserves the supplied quiz date.",
                  "Uses correct percentage arithmetic and five practice questions with separate answers.",
                  "Uses supplied notes without claiming credentials or recording invented progress."],
}


class TestStopped(BaseException):
    """Bypass SDK retry handlers; never include provider response bodies."""


class SingleRequestGate:
    def __init__(self):
        self.calls = 0

    def call(self, provider, request):
        if self.calls:
            raise TestStopped("single-request-limit")
        self.calls += 1
        try:
            return provider(request)
        except Exception as error:
            status = getattr(error, "status_code", None)
            code = str(status) if isinstance(status, int) else "unknown"
            raise TestStopped(f"provider-error-{code}") from None


def verified_download(body, entry):
    if len(body) != entry["bytes"] or hashlib.sha256(body).hexdigest() != entry["sha256"]:
        raise ValueError("Downloaded bytes do not match the published index")
    return body.decode("utf-8")


def role_from_download(resource_id, source):
    kind, slug = resource_id.split(":", 1)
    if kind == "starter":
        pack = json.loads(source)
        if pack["identity"]["slug"] != slug:
            raise ValueError("Wrong Bot in downloaded pack")
        return pack["instructions"]["durableRoleAndBoundaries"] + "\n\nControls and reusable skills from this same download:\n" + json.dumps(
            {"controls": pack["controls"], "skills": pack["skills"]}, ensure_ascii=False, indent=2)
    match = re.search(r"^## Role instructions\s*\n(.*?)(?=^## Fill in before use\s*$)", source, re.M | re.S)
    if kind != "specialist" or not match or not match.group(1).strip():
        raise ValueError("No bounded specialist role section found")
    return match.group(1).strip()


def case_from_existing_input(source):
    start = source.find("# Synthetic sample input")
    if start < 0:
        raise ValueError("No synthetic task in existing test input")
    return source[start:]


def prepare(root, public_root, candidate=False):
    root.mkdir(parents=True, exist_ok=False)
    index_text = (public_root / "api/v1/resources.json").read_text() if candidate else fetch(ORIGIN + "/api/v1/resources.json")
    index = json.loads(index_text)
    write_new(root / "index.json", index_text)
    entries = [e for e in index["entries"] if e["kind"] in ("starter-bot", "manual-specialist")]
    records = []
    for entry in entries:
        slug = entry["slug"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise ValueError("Invalid published slug")
        file = entry["files"][0]
        url = urlparse(file["url"])
        if url.scheme != "https" or url.netloc != "botcabinet.com" or not url.path.startswith("/downloads/"):
            raise ValueError("Download is outside the approved website")
        # Downloads here are UTF-8 role packs, bounded by the same 100 KB fetch limit.
        if candidate:
            local = (public_root / url.path.lstrip("/")).resolve()
            if not local.is_relative_to(public_root.resolve()) or local.stat().st_size > 100_000:
                raise ValueError("Candidate file is outside the public root or too large")
            source = local.read_text()
        else:
            source = fetch(file["url"])
        verified_download(source.encode(), file)
        extension = "json" if entry["kind"] == "starter-bot" else "md"
        source_path = f"source/{slug}.{extension}"
        write_new(root / source_path, source)
        role = role_from_download(entry["id"], source)
        write_new(root / "roles" / f"{slug}.md", role)
        task, checklist = None, []
        if slug in REGRESSIONS:
            task = case_from_existing_input((public_root / "proof-room/hermes-catalog-20261015" / f"{slug}-input.md").read_text())
            checklist = REGRESSIONS[slug]
        elif entry["kind"] == "starter-bot" and slug in STARTER_CASES:
            task, checklist = STARTER_CASES[slug]["task"], STARTER_CASES[slug]["checklist"]
        elif entry["kind"] == "manual-specialist":
            task, checklist = entry.get("firstTask"), entry.get("checklist", [])
        if task and checklist:
            write_new(root / "cases" / f"{slug}.json", json.dumps({"task": task, "checklist": checklist}, indent=2))
        records.append({"id": entry["id"], "slug": slug, "name": entry["name"],
            "file": file, "sourcePath": source_path, "roleSha256": hashlib.sha256(role.encode()).hexdigest(),
            "caseReady": bool(task and checklist), "status": "not-run"})
    write_new(root / "source-lock.json", json.dumps({"indexRevision": index["revision"],
        "sourceMode": "local-candidate" if candidate else "published-website", "bots": records}, indent=2))
    return {"inventoried": len(records), "casesReady": sum(r["caseReady"] for r in records), "inferenceCalls": 0}


def run(root, slug, runtime_path, auth_source, model, run_id):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", run_id):
        raise ValueError("Invalid run ID")
    lock = json.loads((root / "source-lock.json").read_text())
    record = next((r for r in lock["bots"] if r["slug"] == slug), None)
    if not record or not record["caseReady"]:
        raise ValueError("No complete task and review checklist prepared for this Bot")
    source = verified_download((root / record["sourcePath"]).read_bytes(), record["file"])
    role = role_from_download(record["id"], source)
    if hashlib.sha256(role.encode()).hexdigest() != record["roleSha256"]:
        raise ValueError("Prepared role does not match locked source")
    case_path = root / "cases" / f"{slug}.json"
    case = json.loads(case_path.read_text())
    home = root / "runs" / f"{slug}-{run_id}"
    home.mkdir(parents=True, exist_ok=False)
    os.environ.update(HERMES_HOME=str(home), HERMES_SHARED_AUTH_DIR=str(home / "shared"),
        PYTHONDONTWRITEBYTECODE="1", HERMES_DISABLE_BACKGROUND_REVIEW="1", HERMES_DISABLE_LAZY_INSTALLS="1")
    auth = home / "auth.json"
    try:
        private = json.loads(auth_source.read_text())
        nous = private.get("providers", {}).get("nous")
        if not nous:
            raise ValueError("Explicit auth source has no Nous login")
        with os.fdopen(os.open(auth, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as dest:
            json.dump({"version": private.get("version", 1), "providers": {"nous": nous}, "active_provider": "nous"}, dest)
        del private, nous
        skill_name = f"website-{slug}"
        skill = f"---\nname: {skill_name}\ndescription: User-selected Bot Cabinet role for a controlled task.\n---\n\n" + role
        write_new(home / "skills" / skill_name / "SKILL.md", skill)
        write_new(home / "config.yaml", f"skills:\n  auto_load: [{skill_name}]\n")
        sys.path.insert(0, str(runtime_path))
        from hermes_cli.runtime_provider import resolve_runtime_provider
        from run_agent import AIAgent
        runtime = resolve_runtime_provider(requested="nous", target_model=model)
        model_data = json.loads(fetch(runtime["base_url"].rstrip("/") + "/models", runtime["api_key"], limit=2_000_000))
        price_entry = next((e for e in model_data.get("data", []) if e.get("id") == model), {})
        write_new(home / "model-price-check.json", json.dumps({"model": model, "pricing": price_entry.get("pricing")}))
        if not zero_price_model(model_data.get("data", []), model):
            raise ValueError("Provider did not confirm zero input and output prices; no inference started")
        prompt = "Controlled first-answer test using supplied fictional material. Use your loaded Bot role. Return the result in this conversation only. Do not connect accounts, save files, schedule, send, publish or call tools. Do the requested task using only the supplied material; do not claim outside actions occurred.\n\n" + case["task"]
        write_new(home / "input.md", prompt)
        agent = AIAgent(model=model, provider=runtime["provider"], base_url=runtime["base_url"], api_key=runtime["api_key"],
            api_mode=runtime.get("api_mode"), enabled_toolsets=["skills"], max_iterations=3, max_tokens=6000,
            quiet_mode=True, skip_context_files=False, load_soul_identity=False, skip_memory=True,
            skip_background_review=True, run_budget_seconds=90, cwd=str(home), fallback_model=None)
        agent._auto_recovery_cycles = 0
        agent._api_max_retries = 1
        if role not in agent._build_system_prompt():
            raise ValueError("Exact website role not loaded into Hermes system prompt")
        from unittest.mock import patch
        from hermes_cli import middleware
        original_execution = middleware.run_llm_execution_middleware
        gate = SingleRequestGate()
        def bounded_execution(request, next_call, **context):
            return gate.call(lambda payload: original_execution(payload, next_call, **context), request)
        stop_reason = None
        try:
            with patch.object(middleware, "run_llm_execution_middleware", bounded_execution):
                result = agent.run_conversation(prompt)
        except TestStopped as stopped:
            stop_reason = str(stopped)
            result = {"completed": False}
        except KeyboardInterrupt:
            stop_reason = "interrupted-or-process-deadline"
            result = {"completed": False}
        write_new(home / "output.md", result.get("final_response") or "")
        report = {"bot": slug, "resourceId": record["id"], "date": dt.datetime.now(dt.timezone.utc).isoformat(),
            "source": record["file"], "sourceMode": lock["sourceMode"], "indexRevision": lock["indexRevision"], "roleSha256": record["roleSha256"],
            "caseSha256": hashlib.sha256(case_path.read_bytes()).hexdigest(), "model": model,
            "harness": "Hermes SDK native auto-loaded skill containing the downloaded website role and controls",
            "scope": "supplied-material first-answer task; not Desktop import or live connected-service testing",
            "completed": result.get("completed"), "apiCalls": result.get("api_calls"),
            "providerRequests": gate.calls, "singleRequestLimit": True, "stopReason": stop_reason,
            "maxOutputTokens": 6000,
            "inputTokens": result.get("input_tokens"), "outputTokens": result.get("output_tokens"),
            "estimatedCostUsd": result.get("estimated_cost_usd"), "costStatus": result.get("cost_status"),
            "roleLoaded": True, "reviewStatus": "awaiting-answer-review" if result.get("completed") else "not-completed", "humanApproved": False,
            "desktopInstallTested": False, "outsideActionsTested": False}
        write_new(home / "run.json", json.dumps(report, indent=2))
        return report
    finally:
        auth.unlink(missing_ok=True)
        (home / "shared" / "nous_auth.json").unlink(missing_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "run"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--public-root", type=Path)
    parser.add_argument("--candidate", action="store_true", help="Lock local public candidate files rather than claiming they are already deployed")
    parser.add_argument("--bot")
    parser.add_argument("--runtime", type=Path)
    parser.add_argument("--auth-source", type=Path)
    parser.add_argument("--model", default="stepfun/step-3.7-flash:free")
    parser.add_argument("--run-id", default="first-answer")
    args = parser.parse_args()
    if args.action == "prepare" and not args.public_root:
        parser.error("prepare requires --public-root")
    if args.action == "run" and not all((args.bot, args.runtime, args.auth_source)):
        parser.error("run requires --bot, --runtime and --auth-source")
    try:
        result = prepare(args.output.resolve(), args.public_root.resolve(), args.candidate) if args.action == "prepare" else run(
            args.output.resolve(), args.bot, args.runtime.resolve(), args.auth_source.resolve(), args.model, args.run_id)
        print(json.dumps(result))
        if args.action == "run" and not result.get("completed"):
            raise SystemExit(2)
    except Exception as error:
        detail = str(error) if isinstance(error, (ValueError, FileExistsError)) else "Runtime or source preflight failed; no automatic retry"
        print(json.dumps({"status": "stopped", "errorType": type(error).__name__, "detail": detail, "automaticRetry": False}))
        raise SystemExit(2)
