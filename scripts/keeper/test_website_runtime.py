import hashlib
import json
import unittest
import tempfile
from pathlib import Path

from website_runtime import verified_download, role_from_download, case_from_existing_input, prepare, STARTER_CASES, REGRESSIONS, SingleRequestGate, TestStopped


class WebsiteDownloadTests(unittest.TestCase):
    def test_supplied_material_runs_disable_tools_but_keep_native_role_loading(self):
        from website_runtime import offline_agent_options
        options = offline_agent_options()
        self.assertEqual(options["enabled_toolsets"], ["skills"])
        self.assertFalse(options["skip_context_files"])
        self.assertTrue(options["skip_memory"])
        self.assertIsNone(options["fallback_model"])
        self.assertEqual(options["max_tokens"], 6000)
        self.assertEqual(options["reasoning_config"], {"enabled": False})
        from types import SimpleNamespace
        from website_runtime import disable_runtime_tools
        agent = SimpleNamespace(tools=[{"function": {"name": "skill_view"}}], valid_tool_names={"skill_view"})
        disable_runtime_tools(agent)
        self.assertEqual(agent.tools, [])
        self.assertEqual(agent.valid_tool_names, {"skill_view"})

    def test_single_request_gate_blocks_continuations_and_provider_retries(self):
        gate = SingleRequestGate()
        calls = []
        def provider(request):
            calls.append(request)
            return "answer"
        self.assertEqual(gate.call(provider, {}), "answer")
        with self.assertRaises(TestStopped):
            gate.call(provider, {})
        self.assertEqual(len(calls), 1)
        error_gate = SingleRequestGate()
        with self.assertRaises(TestStopped):
            error_gate.call(lambda _: (_ for _ in ()).throw(RuntimeError("private provider details")), {})
        self.assertEqual(error_gate.calls, 1)
        with self.assertRaises(TestStopped) as stopped:
            error_gate.call(provider, {})
        self.assertNotIn("private provider details", str(stopped.exception))

    def test_every_current_website_bot_has_a_complete_offline_case(self):
        public = Path(__file__).resolve().parents[2] / "public"
        index = json.loads((public / "api/v1/resources.json").read_text())
        starters = {e["slug"] for e in index["entries"] if e["kind"] == "starter-bot"}
        self.assertEqual(starters, set(STARTER_CASES) | set(REGRESSIONS))
        for case in STARTER_CASES.values():
            self.assertGreater(len(case["task"]), 100)
            self.assertGreaterEqual(len(case["checklist"]), 3)
        specialists = [e for e in index["entries"] if e["kind"] == "manual-specialist"]
        self.assertEqual(len(specialists), 18)
        for entry in specialists:
            self.assertTrue(entry["firstTask"])
            self.assertGreaterEqual(len(entry["checklist"]), 3)

    def test_rejects_changed_or_truncated_download_before_running(self):
        body = b"published role"
        entry = {"sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body)}
        self.assertEqual(verified_download(body, entry), body.decode())
        with self.assertRaises(ValueError):
            verified_download(b"changed", entry)
        with self.assertRaises(ValueError):
            verified_download(body, {**entry, "bytes": 1})

    def test_portable_role_includes_approval_and_prohibitions(self):
        source = json.dumps({"identity": {"slug": "coach"},
            "instructions": {"durableRoleAndBoundaries": "You are Coach."},
            "controls": {"requiresApproval": ["Ask before sending"], "prohibited": ["Do not diagnose"]},
            "skills": [{"steps": ["Compare options"]}]})
        role = role_from_download("starter:coach", source)
        for text in ("You are Coach.", "Ask before sending", "Do not diagnose", "Compare options"):
            self.assertIn(text, role)
        with self.assertRaises(ValueError):
            role_from_download("starter:receipt", source)

    def test_specialist_loads_role_not_embedded_sample_or_grading_answers(self):
        source = "# Bot\n\n## Role instructions\n\nDo the useful job.\n\n## Fill in before use\nprivate setup\n## First task\nTask\n## Check the answer\nExpected answer"
        self.assertEqual(role_from_download("specialist:bot", source), "Do the useful job.")
        with self.assertRaises(ValueError):
            role_from_download("specialist:bot", "# no role")

    def test_uses_same_task_and_template_without_old_harness_prompt(self):
        source = "Old harness directions\n\n# Synthetic sample input\nTask\n\nUse this output template:\n# Answer\n"
        self.assertTrue(case_from_existing_input(source).startswith("# Synthetic sample input"))
        self.assertIn("Use this output template:", case_from_existing_input(source))
        with self.assertRaises(ValueError):
            case_from_existing_input("No task")

    def test_candidate_sources_are_explicitly_distinguished_from_live_downloads(self):
        with tempfile.TemporaryDirectory(prefix="botcabinet-runtime-test-") as directory:
            root = Path(directory)
            public = root / "public"
            source = json.dumps({"identity": {"slug": "demo"}, "instructions": {"durableRoleAndBoundaries": "Role"}, "controls": {}, "skills": []})
            body = source.encode()
            (public / "downloads").mkdir(parents=True)
            (public / "api/v1").mkdir(parents=True)
            (public / "downloads/demo.json").write_text(source)
            index = {"revision": "r", "entries": [{"id": "starter:demo", "kind": "starter-bot", "slug": "demo", "name": "Demo",
                "files": [{"url": "https://botcabinet.com/downloads/demo.json", "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body)}]}]}
            (public / "api/v1/resources.json").write_text(json.dumps(index))
            self.assertEqual(prepare(root / "run", public, candidate=True)["inferenceCalls"], 0)
            lock = json.loads((root / "run/source-lock.json").read_text())
            self.assertEqual(lock["sourceMode"], "local-candidate")
            self.assertFalse(lock["bots"][0]["caseReady"])


if __name__ == "__main__":
    unittest.main()
