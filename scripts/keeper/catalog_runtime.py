"""Bounded, isolated Hermes SDK tests of the four contributed catalog skills.

Preparation reads public, commit-pinned files. A run requires explicit local auth
and a provider model listing that states zero input AND output token prices.
It does not test Desktop installation, connected accounts, saving or scheduling.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import sys
import urllib.request

COMMIT = "35d75fbe66c18e3e45c8340825b7d4d390a04c0d"
BOTS = ("daily-newspaper", "receipt", "coach", "professor")
FILES = ("SKILL.md", "references/sample-input.md", "references/expected-output-rubric.md")
TEMPLATES = {"daily-newspaper": "edition.md", "receipt": "case-record.md",
             "coach": "decision-frame.md", "professor": "study-plan.md"}
BASE = f"https://raw.githubusercontent.com/notwitcheer/hermes-agent-fork/{COMMIT}/"


def write_new(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as dest:
        dest.write(text)


def digest(text):
    return hashlib.sha256(text.encode()).hexdigest()


def fetch(url, token=None, limit=100_000):
    headers = {"User-Agent": "BotCabinet-Catalog-Test/1"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20) as response:
        body = response.read(limit + 1)
    if len(body) > limit:
        raise ValueError("Response exceeds the test's byte limit")
    return body.decode()


def prepare(root):
    records = []
    for bot in BOTS:
        paths = [f"optional-skills/bots/{bot}/{file}" for file in (*FILES, f"templates/{TEMPLATES[bot]}")]
        paths.append(f"bot-catalog/{bot}.yaml")
        for source in paths:
            text = fetch(BASE + source)
            write_new(root / "source" / source, text)
            records.append({"path": source, "sha256": digest(text), "url": BASE + source})
    write_new(root / "source-lock.json", json.dumps({"commit": COMMIT, "files": records}, indent=2))
    return {"prepared": len(records), "commit": COMMIT, "modelCalls": 0}


def verify_source(root, bot):
    lock = json.loads((root / "source-lock.json").read_text())
    if lock["commit"] != COMMIT:
        raise ValueError("Unexpected source commit")
    records = [entry for entry in lock["files"] if f"/{bot}/" in entry["path"] or entry["path"] == f"bot-catalog/{bot}.yaml"]
    if len(records) != 5:
        raise ValueError("Incomplete source lock")
    for entry in records:
        if digest((root / "source" / entry["path"]).read_text()) != entry["sha256"]:
            raise ValueError("Locked catalog source changed")
    return records


def zero_price_model(models, model):
    """A ':free' name alone does not prove free inference."""
    for entry in models:
        if entry.get("id") == model:
            pricing = entry.get("pricing", {})
            try:
                return all(key in pricing and float(pricing[key]) == 0 for key in ("prompt", "completion"))
            except (TypeError, ValueError):
                return False
    return False


def run(root, bot, runtime_path, auth_source, model, run_id):
    import shutil
    records = verify_source(root, bot)
    if not run_id or any(c not in "abcdefghijklmnopqrstuvwxyz0123456789-" for c in run_id):
        raise ValueError("Use a lowercase letter/number/hyphen run ID")
    home = root / "runs" / f"{bot}-{run_id}"
    home.mkdir(parents=True, exist_ok=False)
    os.environ.update(HERMES_HOME=str(home), HERMES_SHARED_AUTH_DIR=str(home / "shared"),
                      PYTHONDONTWRITEBYTECODE="1", HERMES_DISABLE_BACKGROUND_REVIEW="1",
                      HERMES_DISABLE_LAZY_INSTALLS="1")
    auth = home / "auth.json"
    try:
        private = json.loads(auth_source.read_text())
        nous = private.get("providers", {}).get("nous")
        if not nous:
            raise ValueError("Explicit auth source has no Nous login")
        with os.fdopen(os.open(auth, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as dest:
            json.dump({"version": private.get("version", 1), "providers": {"nous": nous}, "active_provider": "nous"}, dest)
        del private, nous
        skill = root / "source" / "optional-skills" / "bots" / bot
        shutil.copytree(skill, home / "skills" / bot)
        write_new(home / "config.yaml", f"skills:\n  auto_load: [{bot}]\n")
        sys.path.insert(0, str(runtime_path))
        from hermes_cli.runtime_provider import resolve_runtime_provider
        from run_agent import AIAgent
        runtime = resolve_runtime_provider(requested="nous", target_model=model)
        model_data = json.loads(fetch(runtime["base_url"].rstrip("/") + "/models", runtime["api_key"], limit=2_000_000))
        price_entry = next((entry for entry in model_data.get("data", []) if entry.get("id") == model), {})
        write_new(home / "model-price-check.json", json.dumps({"model": model, "pricing": price_entry.get("pricing"), "found": bool(price_entry)}))
        if not zero_price_model(model_data.get("data", []), model):
            raise ValueError("Provider did not confirm zero input and output token prices; no inference started")
        prompt = "Controlled fictional first-answer test. Use your loaded Bot role. Return the completed result in this conversation only; do not save files, connect accounts, schedule, send or publish anything. All source material and the template are supplied below; answer directly without calling tools.\n\n"
        prompt += (skill / "references/sample-input.md").read_text()
        prompt += "\n\nUse this output template:\n" + (skill / "templates" / TEMPLATES[bot]).read_text()
        write_new(home / "input.md", prompt)
        agent = AIAgent(model=model, provider=runtime["provider"], base_url=runtime["base_url"],
            api_key=runtime["api_key"], api_mode=runtime.get("api_mode"), enabled_toolsets=["skills"],
            max_iterations=3, max_tokens=2500, quiet_mode=True, skip_context_files=False,
            load_soul_identity=False, skip_memory=True, skip_background_review=True,
            run_budget_seconds=90, cwd=str(home), fallback_model=None)
        agent._auto_recovery_cycles = 0
        system = agent._build_system_prompt()
        body = (skill / "SKILL.md").read_text().split("---", 2)[-1].strip()
        if body not in system:
            raise ValueError("Exact catalog role was not loaded into Hermes's system prompt")
        result = agent.run_conversation(prompt)
        answer = result.get("final_response") or ""
        write_new(home / "output.md", answer)
        report = {"bot": bot, "date": dt.datetime.now(dt.timezone.utc).isoformat(), "commit": COMMIT,
                  "sourceFiles": records, "model": model, "harness": "Hermes SDK with native skills.auto_load",
                  "roleLoaded": True, "completed": result.get("completed"), "apiCalls": result.get("api_calls"),
                  "outputCharacters": len(answer), "inputTokens": result.get("input_tokens"),
                  "outputTokens": result.get("output_tokens"), "costStatus": result.get("cost_status"),
                  "estimatedCostUsd": result.get("estimated_cost_usd"), "reviewStatus": "awaiting-answer-review",
                  "desktopInstallTested": False, "outsideActionsTested": False, "humanApproved": False}
        write_new(home / "run.json", json.dumps(report, indent=2))
        return report
    finally:
        auth.unlink(missing_ok=True)
        (home / "shared" / "nous_auth.json").unlink(missing_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "run"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--bot", choices=BOTS)
    parser.add_argument("--runtime", type=Path)
    parser.add_argument("--auth-source", type=Path)
    parser.add_argument("--model", default="stepfun/step-3.7-flash:free")
    parser.add_argument("--run-id", default="first-answer")
    args = parser.parse_args()
    if args.action == "run" and not all((args.bot, args.runtime, args.auth_source)):
        parser.error("run requires --bot, --runtime and --auth-source")
    try:
        result = prepare(args.output.resolve()) if args.action == "prepare" else run(args.output.resolve(), args.bot, args.runtime.resolve(), args.auth_source.resolve(), args.model, args.run_id)
        print(json.dumps(result))
    except Exception as error:
        # Do not print provider exceptions or response bodies: they can contain auth details.
        detail = str(error) if isinstance(error, (ValueError, FileExistsError)) else "Runtime preflight failed; no automatic retry"
        print(json.dumps({"status": "blocked", "errorType": type(error).__name__, "detail": detail, "modelRetry": False}))
        raise SystemExit(2)
