import unittest
from website_trial_records import current_status


class CurrentStatusTests(unittest.TestCase):
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
