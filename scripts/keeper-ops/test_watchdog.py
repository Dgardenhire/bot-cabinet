from datetime import datetime, timedelta, timezone
import unittest
import json

from watchdog import TITLE, TARGETS, evaluate, incident, parse_watch_page, sync_issue

NOW = datetime(2026, 11, 12, 18, tzinfo=timezone.utc)
RUN = "https://github.com/Dgardenhire/bot-cabinet/actions/runs/123"


def item(slug="example", observed="2026-11-12", review="2026-11-13"):
    return {"slug": slug, "observedOn": observed, "reviewAgainBy": review}


def fixture():
    checks = [{"key": key, "last_run": (NOW - timedelta(minutes=30)).isoformat(),
               "late_after_hours": 1, "result": "passed"}
              for key in ("public-site", "github-public", "download-inventory", "agent-watch", "agent-landscape")]
    payloads = {"keeper": {"publication": {"publishedAt": NOW.isoformat(), "status": {
        "schema": "bot-cabinet-trust-status-candidate/v1", "generated_at": NOW.isoformat(), "checks": checks}}},
        "watch_api": {"items": [item()]}, "watch": [item()]}
    endpoints = {key: {"status": 200, "bytes": 1} for key in TARGETS}
    return payloads, [item()], endpoints


class HealthTests(unittest.TestCase):
    def result(self, change=None, seed=None):
        payloads, original_seed, endpoints = fixture()
        if change:
            change(payloads, endpoints)
        if seed is not None:
            payloads["watch"] = seed
        return evaluate(payloads, original_seed if seed is None else seed, endpoints, NOW)

    def test_current_valid_data_passes(self):
        self.assertTrue(self.result()["healthy"])

    def test_stale_publication_is_not_hidden_by_200(self):
        def change(payloads, _):
            publication = payloads["keeper"]["publication"]
            publication["publishedAt"] = (NOW - timedelta(days=48)).isoformat()
            publication["status"]["generated_at"] = publication["publishedAt"]
        self.assertIn("keeper-publication-stale", self.result(change)["findings"])

    def test_new_publication_cannot_disguise_old_generated_results(self):
        def change(payloads, _):
            payloads["keeper"]["publication"]["status"]["generated_at"] = (NOW - timedelta(days=48)).isoformat()
        self.assertIn("keeper-results-stale", self.result(change)["findings"])

    def test_old_individual_check_fails_even_when_snapshot_is_new(self):
        def change(payloads, _):
            payloads["keeper"]["publication"]["status"]["checks"][0]["last_run"] = (NOW - timedelta(hours=2)).isoformat()
        self.assertIn("keeper-check-stale:public-site", self.result(change)["findings"])

    def test_attention_result_fails(self):
        def change(payloads, _):
            payloads["keeper"]["publication"]["status"]["checks"][0]["result"] = "attention"
        self.assertIn("keeper-check-attention:public-site", self.result(change)["findings"])

    def test_missing_and_naive_dates_fail(self):
        for value in (None, "2026-11-12T18:00:00"):
            def change(payloads, _):
                payloads["keeper"]["publication"]["publishedAt"] = value
            self.assertIn("keeper-invalid-or-missing", self.result(change)["findings"])

    def test_future_snapshot_fails(self):
        def change(payloads, _):
            payloads["keeper"]["publication"]["publishedAt"] = (NOW + timedelta(hours=1)).isoformat()
        self.assertIn("keeper-invalid-time", self.result(change)["findings"])

    def test_threshold_cannot_be_inflated_to_hide_old_checks(self):
        def change(payloads, _):
            payloads["keeper"]["publication"]["status"]["checks"][0]["late_after_hours"] = 999999
        self.assertIn("keeper-invalid-or-missing", self.result(change)["findings"])

    def test_repository_takes_precedence_for_equally_dated_watch_item(self):
        def change(payloads, _):
            payloads["watch_api"]["items"] = [item(review="2026-10-01")]
        self.assertTrue(self.result(change)["healthy"])

    def test_new_repository_item_overrides_old_api(self):
        def change(payloads, _):
            payloads["watch_api"]["items"] = [item(observed="2026-10-01", review="2026-10-08")]
        self.assertTrue(self.result(change)["healthy"])

    def test_newer_live_item_wins(self):
        report = self.result(seed=[item(observed="2026-10-01", review="2026-10-08")])
        self.assertTrue(report["healthy"])

    def test_missing_api_stays_failed_with_good_fallback(self):
        def change(payloads, _):
            payloads["watch_api"] = None
        self.assertIn("watch-api-invalid-or-missing", self.result(change)["findings"])

    def test_endpoint_failure_stays_failed_with_good_fallback(self):
        def change(_, endpoints):
            endpoints["watch_api"] = {"status": "unavailable"}
        self.assertIn("endpoint-unavailable:watch_api", self.result(change)["findings"])

    def test_invalid_live_date_fails(self):
        def change(payloads, _):
            payloads["watch_api"]["items"][0]["reviewAgainBy"] = "2026-02-30"
        self.assertIn("watch-api-invalid-or-missing", self.result(change)["findings"])

    def test_any_future_watch_item_fails(self):
        self.assertIn("watch-future-observation", self.result(seed=[item("future", "2026-12-01")])["findings"])

    def test_fresh_observation_does_not_hide_overdue_other_review(self):
        self.assertIn("watch-reviews-overdue", self.result(seed=[item("overdue", "2026-10-01", "2026-10-08")])["findings"])

    def test_seven_day_boundary(self):
        for observed, stale in (("2026-11-05", False), ("2026-11-04", True)):
            def change(payloads, _):
                payloads["watch_api"]["items"] = [item(observed=observed)]
            report = self.result(change, [item(observed=observed)])
            self.assertEqual("watch-observations-stale" in report["findings"], stale)

    def test_retired_live_item_does_not_trigger_overdue_review(self):
        def change(payloads, _):
            payloads["watch_api"]["items"].append(item("bounce-rate-is-not-useful-action", "2026-01-01", "2026-01-02"))
        self.assertTrue(self.result(change)["healthy"])

    def test_new_repository_cannot_hide_stale_production(self):
        def change(payloads, _):
            old = item(observed="2026-10-01", review="2026-10-08")
            payloads["watch"] = [old]
            payloads["watch_api"]["items"] = [old]
        report = self.result(change)
        self.assertIn("watch-deployment-differs-from-repository", report["findings"])
        self.assertIn("watch-observations-stale", report["findings"])

    def test_missing_deployed_data_fails_closed(self):
        def change(payloads, _):
            payloads["watch"] = None
        self.assertIn("watch-page-invalid-or-missing", self.result(change)["findings"])

    def test_deployed_json_parser_handles_split_chunks_without_executing_scripts(self):
        content = '1:["$","Feed",null,{"fallbackItems":' + json.dumps([item()]) + '}]'
        chunks = [content[:45], content[45:]]
        html = ''.join('<script>self.__next_f.push(' + json.dumps([1, chunk]) + ')</script>' for chunk in chunks)
        html += '<script>throw new Error("must never execute")</script>'
        self.assertEqual(parse_watch_page(html), [item()])

    def test_changed_page_format_is_reported_not_assumed_healthy(self):
        with self.assertRaises(ValueError):
            parse_watch_page('<html><h1>Agent Watch</h1></html>')


class IssueTests(unittest.TestCase):
    def setUp(self):
        payloads, seed, endpoints = fixture()
        self.report = evaluate(payloads, seed, endpoints, NOW)
        self.report["healthy"] = False
        self.report["findings"] = ["keeper-publication-stale"]
        self.calls = []
        self.open = []

    def request(self, method, path, data=None):
        self.calls.append((method, path, data))
        return self.open if method == "GET" else {}

    def sync(self):
        return sync_issue(self.report, "Dgardenhire/bot-cabinet", self.request, RUN)

    def existing(self):
        return {"number": 1, "title": TITLE, "body": incident(self.report, RUN)}

    def test_first_failure_opens_one_incident(self):
        self.assertEqual(self.sync(), "opened")
        self.assertEqual([m for m, _, _ in self.calls], ["GET", "POST"])

    def test_same_failure_new_run_and_response_sizes_cause_no_write(self):
        self.open = [self.existing()]
        self.report["checked_at"] = (NOW + timedelta(hours=1)).isoformat()
        self.report["endpoints"]["home"]["bytes"] = 99
        self.assertEqual(sync_issue(self.report, "Dgardenhire/bot-cabinet", self.request, RUN + "4"), "unchanged")
        self.assertEqual(len(self.calls), 1)

    def test_changed_failure_updates_existing(self):
        self.open = [self.existing()]
        self.report["findings"].append("watch-observations-stale")
        self.assertEqual(self.sync(), "updated")
        self.assertEqual(self.calls[-1][0], "PATCH")

    def test_genuine_recovery_closes_existing(self):
        self.open = [self.existing()]
        self.report.update(healthy=True, findings=[])
        self.assertEqual(self.sync(), "closed")
        self.assertEqual(self.calls[-1][2]["state"], "closed")

    def test_unrelated_issue_is_never_modified(self):
        self.open = [{"number": 2, "title": "Other maintenance", "body": "Keep this"}]
        self.assertEqual(self.sync(), "opened")
        self.assertFalse(any(method == "PATCH" for method, _, _ in self.calls))

    def test_multiple_owned_incidents_fail_closed(self):
        self.open = [self.existing(), self.existing()]
        with self.assertRaises(ValueError):
            self.sync()
        self.assertEqual(len(self.calls), 1)

    def test_healthy_without_incident_writes_nothing(self):
        self.report.update(healthy=True, findings=[])
        self.assertEqual(self.sync(), "none")
        self.assertEqual(len(self.calls), 1)

    def test_rejects_untrusted_repository_and_run_url(self):
        for repository, run in (("../bad", RUN), ("Dgardenhire/bot-cabinet", "https://example.com/")):
            with self.assertRaises(ValueError):
                sync_issue(self.report, repository, self.request, run)
        self.assertEqual(self.calls, [])


if __name__ == "__main__":
    unittest.main()
