import unittest
import tempfile
import json
import hashlib
from pathlib import Path
from website_trial_records import current_status


class CurrentStatusTests(unittest.TestCase):
    def test_append_batch_preserves_history_and_rejects_unfinished_pass(self):
        from website_trial_records import append_batch
        with tempfile.TemporaryDirectory(prefix="botcabinet-batch-test-") as directory:
            root = Path(directory)
            prepared, public = root / "prepared", root / "public"
            source = b"role"
            sha = hashlib.sha256(source).hexdigest()
            (prepared / "source").mkdir(parents=True)
            (prepared / "cases").mkdir()
            (prepared / "runs/demo-1").mkdir(parents=True)
            (prepared / "source/demo.md").write_bytes(source)
            (prepared / "cases/demo.json").write_text('{"task":"sample","checklist":["check"]}')
            (public / "downloads/specialists").mkdir(parents=True)
            (public / "downloads/specialists/demo.md").write_bytes(source)
            target = public / "proof-room/website-tasks-20261015/index.json"
            target.parent.mkdir(parents=True)
            target.write_text(json.dumps({"date":"2026-10-15","scope":"sample only","records":[{"id":"specialist:demo","slug":"demo","name":"Demo","sha256":sha,"status":"not-run","attempts":[]}]}))
            (prepared / "source-lock.json").write_text(json.dumps({"bots":[{"id":"specialist:demo","slug":"demo","name":"Demo","sourcePath":"source/demo.md","file":{"sha256":sha,"bytes":4}}]}))
            report = {"bot":"demo","completed":False,"source":{"sha256":sha},"humanApproved":False,"desktopInstallTested":False,"outsideActionsTested":False}
            (prepared / "runs/demo-1/run.json").write_text(json.dumps(report))
            (prepared / "runs/demo-1/input.md").write_text("exact request")
            (prepared / "runs/demo-1/output.md").write_text("")
            reviews = prepared / "reviews.json"
            reviews.write_text(json.dumps({"demo":[{"folder":"runs/demo-1","verdict":"passed-sample","summary":"invalid pass"}]}))
            with self.assertRaises(ValueError):
                append_batch(prepared, public, reviews, "2026-10-17")
            report["completed"] = True
            (prepared / "runs/demo-1/run.json").write_text(json.dumps(report))
            (prepared / "runs/demo-1/output.md").write_text("actual answer")
            append_batch(prepared, public, reviews, "2026-10-17")
            result = json.loads(target.read_text())
            self.assertEqual(result["records"][0]["status"], "passed-sample")
            self.assertEqual(len(result["records"][0]["attempts"]), 1)
            append_batch(prepared, public, reviews, "2026-10-17")
            self.assertEqual(len(json.loads(target.read_text())["records"][0]["attempts"]), 1)

    def test_old_pass_does_not_certify_a_changed_download(self):
        attempt = {"sha256": "old", "completed": True, "verdict": "passed-sample"}
        self.assertEqual(current_status("new", [attempt]), "awaiting-retest")

    def test_pass_needs_completed_same_hash_and_explicit_review(self):
        self.assertEqual(current_status("a", []), "not-run")
        for completed, verdict, expected in [(False, "passed-sample", "awaiting-retest"),
            (True, "needs-correction", "needs-correction"), (True, "awaiting-review", "awaiting-review"),
            (True, "passed-sample", "passed-sample")]:
            self.assertEqual(current_status("a", [{"sha256": "a", "completed": completed, "verdict": verdict}]), expected)

    def test_latest_matching_failure_overrides_an_earlier_pass(self):
        self.assertEqual(current_status("a", [{"sha256": "a", "completed": True, "verdict": "passed-sample"},
            {"sha256": "a", "completed": True, "verdict": "needs-correction"}]), "needs-correction")


if __name__ == "__main__":
    unittest.main()
