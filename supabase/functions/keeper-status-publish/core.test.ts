import { assertEquals } from "jsr:@std/assert@1";
import { parsePublishRequest, secretsMatch, sha256Hex, stableStatusJson } from "./core.ts";

const status = {
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

Deno.test("requires an exact reviewed candidate hash", async () => {
  const contentSha256 = await sha256Hex(stableStatusJson(status));
  const request = { status, expectedRevision: 0, contentSha256, approval: { approvedBy: "Damon", approvedAt: "2026-09-23T12:10:00Z", note: "Publish the recorded checks." } };
  assertEquals(await parsePublishRequest(request), request);
  assertEquals(await parsePublishRequest({ ...request, contentSha256: "0".repeat(64) }), null);
  assertEquals(await parsePublishRequest({ ...request, approval: { ...request.approval, note: "" } }), null);
});

Deno.test("compares nonempty secrets", async () => {
  assertEquals(await secretsMatch("same", "same"), true);
  assertEquals(await secretsMatch("wrong", "same"), false);
  assertEquals(await secretsMatch("", ""), false);
});
