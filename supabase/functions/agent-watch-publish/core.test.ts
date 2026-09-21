import { assertEquals } from "jsr:@std/assert@1";
import { parsePublishRequest, secretsMatch, sha256Hex, stableItemJson } from "./core.ts";

const item = {
  slug: "useful-new-agent",
  observedOn: "2026-09-20",
  reviewAgainBy: "2026-10-04",
  title: "A useful new agent",
  signal: "A source changed.",
  evidence: "observed" as const,
  whyItMatters: "It may help with a real job.",
  cabinetResponse: "Bot Cabinet reviewed the idea.",
  responseStatus: "published" as const,
  limits: "It has not been tested from start to finish.",
  sources: [{ label: "Official source", href: "https://example.com/source" }],
};

Deno.test("requires approval for the exact content", async () => {
  const contentSha256 = await sha256Hex(stableItemJson(item));
  const parsed = await parsePublishRequest({ item, expectedRevision: 0, contentSha256, approval: { approvedBy: "Damon", approvedAt: "2026-09-20T20:00:00Z", note: "Approved for Agent Watch" } });
  assertEquals(parsed?.item.slug, item.slug);
  assertEquals(await parsePublishRequest({ item: { ...item, title: "Changed after approval" }, expectedRevision: 0, contentSha256, approval: { approvedBy: "Damon", approvedAt: "2026-09-20T20:00:00Z", note: "Approved" } }), null);
});

Deno.test("compares publication secrets without returning them", async () => {
  assertEquals(await secretsMatch("correct", "correct"), true);
  assertEquals(await secretsMatch("wrong", "correct"), false);
});
