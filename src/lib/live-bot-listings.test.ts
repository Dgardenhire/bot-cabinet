import { describe, expect, it } from "vitest";
import { newestListings, parseGrokBotFieldNotes, parseGrokHubListings, parseMuseAtWorkConfig, parseMuseAtWorkListings, parseMyBotFarmListings } from "./live-bot-listings";

describe("live directory listings", () => {
  it("accepts My Bot Farm Bots and teams with their real listed dates", () => {
    const items = parseMyBotFarmListings({ stalls: [
      { kind: "agent", slug: "patch", name: "Patch", description: "Fixes a defined issue", pageUrl: "https://mybot.farm/agents/patch", listedAt: "2026-09-18T00:00:00Z", author: { username: "Ada" } },
      { kind: "team", slug: "desk", name: "Desk", title: "A small team", pageUrl: "https://mybot.farm/teams/desk", listedAt: "2026-09-17T00:00:00Z" },
    ] });
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ name: "Patch", kind: "Bot", creator: "Ada", listedAt: "2026-09-18T00:00:00.000Z" });
    expect(items[1].kind).toBe("Team");
  });

  it("retains GrokHub's original x.ai Bot link and excludes non-Bot news", () => {
    const items = parseGrokHubListings({ items: [
      { type: "use-case", slug: "example", headline: "Example Bot", summary: "Does a job", url: "https://www.grokhub.io/use-cases/example", template_url: "https://x.ai/bot/abc", source: { label: "@maker" }, added_at: "2026-09-19T12:00:00Z" },
      { type: "news", slug: "event", headline: "Event", summary: "A meetup", url: "https://www.grokhub.io/news/event", added_at: "2026-09-19T12:00:00Z" },
    ] });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ creator: "@maker", originalUrl: "https://x.ai/bot/abc", source: "GrokHub" });
  });

  it("rejects off-site and malformed links and sorts without inventing a discovery date", () => {
    const bad = parseMyBotFarmListings({ stalls: [{ kind: "agent", name: "Bad", description: "Bad", pageUrl: "https://evil.example/", listedAt: "2026-09-18" }] });
    expect(bad).toEqual([]);
    const items = parseGrokHubListings({ items: [{ type: "use-case", slug: "safe", headline: "Safe", summary: "Job", url: "https://www.grokhub.io/use-cases/safe", template_url: "javascript:alert(1)", added_at: "2026-09-18" }] });
    expect(items[0].originalUrl).toBeUndefined();
    expect(newestListings([...items, ...items])).toHaveLength(1);
  });

  it("reads only public Muse workflow metadata and links back to the original entry", () => {
    expect(parseMuseAtWorkConfig('const SUPABASE_URL = "https://example.supabase.co"; const SUPABASE_ANON_KEY = "public.jwt-value";')).toEqual({
      apiUrl: "https://example.supabase.co", apiKey: "public.jwt-value",
    });
    const items = parseMuseAtWorkListings([{ id: "abc-123", title: "Morning brief", outcome: "Start with the decisions that matter.", x_handle: "@maker", created_at: "2026-09-22T12:00:00Z", prompt: "not retained" }]);
    expect(items).toEqual([expect.objectContaining({
      name: "Morning brief", creator: "@maker", source: "Muse at Work", kind: "Workflow", sourceUrl: "https://museatwork.app/#w=abc-123",
    })]);
    expect(items[0]).not.toHaveProperty("prompt");
  });

  it("reads attributed roles from the Grok Bot Field Notes roster without inventing a date", () => {
    const items = parseGrokBotFieldNotes([
      "| Role | One line |",
      "|---|---|",
      "| [`Commitment Tracker`](commitment-tracker.md) | Tracks promises and asks without sending anything. |",
      "| [Bad](../outside.md) | Must be rejected. |",
    ].join("\n"));
    expect(items).toEqual([expect.objectContaining({
      name: "Commitment Tracker", source: "Grok Bot Field Notes", kind: "Role",
      sourceUrl: "https://github.com/unicodef1wn/grokbot-field-notes/blob/main/roster/commitment-tracker.md",
    })]);
    expect(items[0].listedAt).toBeUndefined();
  });

  it("caps the feed and prevents one directory from taking every slot", () => {
    const make = (source: "My Bot Farm" | "GrokHub" | "Muse at Work" | "Grok Bot Field Notes", index: number) => ({
      id: `${source}:${index}`, name: `${source} ${index}`, job: "Does a job", creator: "Maker", source,
      sourceUrl: "https://example.com", listedAt: `2026-09-${String(22 - index).padStart(2, "0")}T00:00:00.000Z`, kind: source === "Muse at Work" ? "Workflow" as const : "Bot" as const,
    });
    const selected = newestListings([
      ...Array.from({ length: 10 }, (_, index) => make("My Bot Farm", index)),
      ...Array.from({ length: 4 }, (_, index) => make("GrokHub", index)),
      ...Array.from({ length: 4 }, (_, index) => make("Muse at Work", index)),
      ...Array.from({ length: 4 }, (_, index) => make("Grok Bot Field Notes", index)),
    ]);
    expect(selected).toHaveLength(6);
    expect(selected.filter((item) => item.source === "My Bot Farm").length).toBeLessThanOrEqual(3);
    expect(new Set(selected.map((item) => item.source)).size).toBe(4);
  });
});
