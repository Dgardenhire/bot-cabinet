import { assertEquals, assertRejects } from "jsr:@std/assert@1";
import { latestPublications, mergePublishedWithFallback, parseAgentWatchItem } from "./core.ts";
import { parseGrokMarketplaceHtml, readBoundedText } from "./grok-marketplace.ts";

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
  botDetails: {
    name: "Useful Bot",
    creator: "A maker",
    platform: "Example",
    job: "Handles one useful job.",
    requiredAccess: "An account and one selected file.",
    outsideActions: "None during the first test.",
    evidenceStatus: "inspected" as const,
    cabinetDecision: "test-adaptation" as const,
    cabinetFit: "Test it before deciding whether to add it.",
    closestCabinetMatch: { label: "Scout", href: "/bots/scout" },
  },
};

Deno.test("accepts a complete reviewed item and rejects unsafe links", () => {
  assertEquals(parseAgentWatchItem(item), item);
  assertEquals(parseAgentWatchItem({ ...item, sources: [{ label: "bad", href: "javascript:alert(1)" }] }), null);
  assertEquals(parseAgentWatchItem({ ...item, botDetails: { ...item.botDetails, cabinetFit: "" } }), null);
  assertEquals(parseAgentWatchItem({ ...item, botDetails: { ...item.botDetails, closestCabinetMatch: { label: "bad", href: "javascript:alert(1)" } } }), null);
  assertEquals(parseAgentWatchItem({ ...item, botDetails: { ...item.botDetails, evidenceStatus: "downloaded" } }), null);
  assertEquals(parseAgentWatchItem({ ...item, botDetails: { ...item.botDetails, cabinetDecision: "copy-it" } }), null);
});

Deno.test("keeps only the newest valid revision", () => {
  const rows = [
    { slug: item.slug, revision: 1, payload: item, published_at: "2026-09-20T10:00:00Z" },
    { slug: item.slug, revision: 2, payload: { ...item, title: "Revised title" }, published_at: "2026-09-20T11:00:00Z" },
  ];
  assertEquals(latestPublications(rows).map((entry) => entry.title), ["Revised title"]);
});

Deno.test("keeps built-in notes until a reviewed revision replaces them", () => {
  assertEquals(mergePublishedWithFallback([{ ...item, title: "Revised title" }], [item]).map((entry) => entry.title), ["Revised title"]);
  assertEquals(mergePublishedWithFallback([], [item]), [item]);
});

Deno.test("parses bounded official Grok marketplace templates from public page data", () => {
  const templates = JSON.stringify([
    { id: "useful-bot", name: "Useful Bot", creatorName: "A Creator", description: "Does one useful job.", summary: "Does one useful job with a result a person can review." },
    { id: "useful-bot", name: "Duplicate", creatorName: "Someone Else", description: "Should be ignored." },
    { id: "../bad", name: "Bad", creatorName: "Bad", description: "Unsafe identifier." },
  ]).slice(1, -1);
  const encoded = JSON.stringify(templates).slice(1, -1);
  const html = `<script>self.__next_f.push([1,"{\\"featured\\":[],\\"templates\\":[${encoded}],\\"initialCategory\\":null}"])</script>`;
  assertEquals(parseGrokMarketplaceHtml(html), [{
    id: "useful-bot",
    name: "Useful Bot",
    job: "Does one useful job with a result a person can review.",
    creator: "A Creator",
    sourceUrl: "https://x.ai/bot/marketplace/bots/useful-bot",
  }]);
  assertEquals(parseGrokMarketplaceHtml("<html>no catalog</html>"), []);
});

Deno.test("stops reading an oversized marketplace response", async () => {
  assertEquals(await readBoundedText(new Response("small"), 5), "small");
  await assertRejects(
    () => readBoundedText(new Response("too large"), 5),
    Error,
    "marketplace response exceeded the byte limit",
  );
});
