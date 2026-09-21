import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { buildRss, latestPublications, mergePublishedWithFallback, parseAgentWatchItem } from "./core.ts";

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

Deno.test("accepts a complete reviewed item and rejects unsafe links", () => {
  assertEquals(parseAgentWatchItem(item), item);
  assertEquals(parseAgentWatchItem({ ...item, sources: [{ label: "bad", href: "javascript:alert(1)" }] }), null);
});

Deno.test("keeps only the newest valid revision", () => {
  const rows = [
    { slug: item.slug, revision: 1, payload: item, published_at: "2026-09-20T10:00:00Z" },
    { slug: item.slug, revision: 2, payload: { ...item, title: "Revised title" }, published_at: "2026-09-20T11:00:00Z" },
  ];
  assertEquals(latestPublications(rows).map((entry) => entry.title), ["Revised title"]);
});

Deno.test("builds RSS from the same reviewed item", () => {
  const rss = buildRss([item], "https://example.supabase.co/functions/v1/agent-watch?format=rss");
  assertStringIncludes(rss, "<title>A useful new agent</title>");
  assertStringIncludes(rss, "https://botcabinet.com/watch/#useful-new-agent");
});

Deno.test("keeps built-in notes until a reviewed revision replaces them", () => {
  assertEquals(mergePublishedWithFallback([{ ...item, title: "Revised title" }], [item]).map((entry) => entry.title), ["Revised title"]);
  assertEquals(mergePublishedWithFallback([], [item]), [item]);
});
