"""Publish allowlisted task evidence after a separate, explicit answer review."""
import argparse
import hashlib
import json
from pathlib import Path


def current_status(sha256, attempts):
    matching = [a for a in attempts if a["sha256"] == sha256]
    if not matching:
        return "awaiting-retest" if attempts else "not-run"
    latest = matching[-1]
    return latest["verdict"] if latest["completed"] else "awaiting-retest"


def safe(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError("Evidence path leaves the artifact root")
    return path


def preserve(path, body):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_bytes() != body:
        raise ValueError("Refusing to overwrite a different preserved test file")
    path.write_bytes(body)


def publish(artifacts, public):
    reviews = json.loads(Path(__file__).with_name("website_trial_reviews.json").read_text())
    prepared = artifacts / "final-candidate"
    lock = json.loads((prepared / "source-lock.json").read_text())
    target = public / "proof-room/website-tasks-20261015"
    prefix = "/proof-room/website-tasks-20261015"
    records = []
    allowed = {"bot", "resourceId", "date", "source", "sourceMode", "indexRevision", "roleSha256", "caseSha256", "model", "harness", "scope", "completed", "apiCalls", "inputTokens", "outputTokens", "estimatedCostUsd", "costStatus", "roleLoaded", "reviewStatus", "humanApproved", "desktopInstallTested", "outsideActionsTested", "providerRequests", "singleRequestLimit", "stopReason", "maxOutputTokens"}
    for bot in lock["bots"]:
        slug = bot["slug"]
        current_file = public / "downloads" / (f"portable-bot-packs/v2/{slug}.json" if bot["id"].startswith("starter:") else f"specialists/{slug}.md")
        current_sha = hashlib.sha256(current_file.read_bytes()).hexdigest()
        if current_sha != bot["file"]["sha256"]:
            raise ValueError("Regenerate the candidate lock after changing a download")
        case = (prepared / "cases" / f"{slug}.json").read_bytes()
        preserve(target / "cases" / f"{slug}.json", case)
        attempts = []
        for review in reviews.get(slug, []):
            home = safe(artifacts, review["folder"])
            attempt_root = target / slug / home.name
            run_path = home / "run.json"
            report = json.loads(run_path.read_text()) if run_path.exists() else {
                "bot": slug, "completed": False, "source": bot["file"], "sourceMode": "local-candidate",
                "stopReason": "Provider returned 429 after truncated responses; stopped at the 180-second process deadline. No final answer saved.",
                "apiCalls": None, "estimatedCostUsd": None, "humanApproved": False}
            snapshot_lock = json.loads((home.parent.parent / "source-lock.json").read_text())
            snapshot = next(b for b in snapshot_lock["bots"] if b["slug"] == slug)
            preserve(attempt_root / "source.json", safe(home.parent.parent, snapshot["sourcePath"]).read_bytes())
            files = {"source": f"{prefix}/{slug}/{home.name}/source.json"}
            for name in ("input.md", "output.md"):
                path = home / name
                if path.exists():
                    preserve(attempt_root / name, path.read_bytes())
                    files[name.split(".")[0]] = f"{prefix}/{slug}/{home.name}/{name}"
            preserve(attempt_root / "run.json", (json.dumps({k: v for k, v in report.items() if k in allowed}, indent=2) + "\n").encode())
            files["run"] = f"{prefix}/{slug}/{home.name}/run.json"
            attempts.append({"id": home.name, "sha256": snapshot["file"]["sha256"], "completed": report["completed"],
                "verdict": review["verdict"], "summary": review["summary"], "files": files})
        records.append({"id": bot["id"], "slug": slug, "name": bot["name"], "sha256": current_sha,
            "status": current_status(current_sha, attempts), "case": f"{prefix}/cases/{slug}.json", "attempts": attempts})
    result = {"date": "2026-10-15", "reviewer": "Codex", "humanApproved": False,
        "scope": "One supplied-material task using website role instructions in the Hermes SDK; not Desktop imports, connected accounts, tool execution or crew handoffs.",
        "records": records}
    target.mkdir(parents=True, exist_ok=True)
    (target / "index.json").write_text(json.dumps(result, indent=2) + "\n")
    return {"bots": len(records), "completedAnswers": sum(a["completed"] for r in records for a in r["attempts"]),
        "currentSamplePasses": sum(r["status"] == "passed-sample" for r in records)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifacts", required=True, type=Path)
    parser.add_argument("--public", required=True, type=Path)
    args = parser.parse_args()
    print(json.dumps(publish(args.artifacts.resolve(), args.public.resolve())))
