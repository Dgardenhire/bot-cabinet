import { assertEquals } from "jsr:@std/assert@1";
import { latestPublication, parseKeeperTrustCandidate } from "./core.ts";

const candidate = {
  schema: "bot-cabinet-trust-status-candidate/v1" as const,
  generated_at: "2026-09-23T12:00:00+00:00",
  approval_required: true as const,
  publication_status: "private-candidate" as const,
  checks: [
    { key: "public-site", label: "Pages, links and social cards", result: "passed" as const, last_run: "2026-09-23T11:55:00+00:00", late_after_hours: 1 },
    { key: "github-public", label: "Public repository and release", result: "passed" as const, last_run: "2026-09-23T11:30:00+00:00", late_after_hours: 2 },
    { key: "download-inventory", label: "Downloads, packages and file hashes", result: "attention" as const, last_run: "2026-09-23T08:10:36+00:00", late_after_hours: 36 },
    { key: "agent-watch", label: "Published Agent Watch feed", result: "passed" as const, last_run: "2026-09-23T08:00:00+00:00", late_after_hours: 36 },
    { key: "agent-landscape", label: "Registered discovery sources", result: "no-record" as const, last_run: null, late_after_hours: 36 },
  ],
};

Deno.test("accepts one complete bounded Trust candidate", () => {
  assertEquals(parseKeeperTrustCandidate(candidate), candidate);
  assertEquals(parseKeeperTrustCandidate({ ...candidate, approval_required: false }), null);
  assertEquals(parseKeeperTrustCandidate({ ...candidate, checks: candidate.checks.slice(0, 4) }), null);
  assertEquals(parseKeeperTrustCandidate({ ...candidate, checks: candidate.checks.map((item, index) => index === 0 ? { ...item, result: "green" } : item) }), null);
});

Deno.test("returns the newest valid publication", () => {
  assertEquals(latestPublication([
    { revision: 1, payload: candidate, published_at: "2026-09-23T12:05:00Z" },
    { revision: 2, payload: { ...candidate, checks: [] }, published_at: "2026-09-23T12:06:00Z" },
  ])?.revision, 1);
});
