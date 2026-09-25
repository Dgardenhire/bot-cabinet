import { describe, expect, it } from "vitest";
import { newestListings, parseGitHubReleases, parseGrokBotFieldNotes, parseGrokHubListings, parseMuseAtWorkConfig, parseMuseAtWorkListings, parseMyBotFarmListings, parseOfficialGrokMarketplaceListings, type LiveBotSourceName } from "./live-bot-listings";

describe("live directory listings", () => {
  it("accepts bounded official Grok marketplace listings without inventing a date", () => {
    const items = parseOfficialGrokMarketplaceListings({ marketplace: { available: true, listings: [
      { id: "useful-bot", name: "Useful Bot", job: "Does one useful job.", creator: "A Creator", sourceUrl: "https://x.ai/bot/marketplace/bots/useful-bot" },
      { id: "bad", name: "Bad", job: "Bad link.", creator: "Bad", sourceUrl: "https://example.com/bad" },
    ] } });
    expect(items).toEqual([expect.objectContaining({
      id: "grok-marketplace:useful-bot", name: "Useful Bot", creator: "A Creator", source: "Grok Bot Marketplace", kind: "Bot",
    })]);
    expect(items[0].listedAt).toBeUndefined();
  });

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

  it("reads official GitHub releases without treating release notes as tested results", () => {
    const items = parseGitHubReleases([{
      tag_name: "v1.2.3", name: "Hermes Agent v1.2.3", html_url: "https://github.com/NousResearch/hermes-agent/releases/tag/v1.2.3",
      published_at: "2026-09-21T18:10:55Z", body: "# Hermes Agent v1.2.3\n\n**Release Date:** September 21\n\n> A small reliability release.",
    }], "Hermes Agent", "Nous Research");
    expect(items).toEqual([expect.objectContaining({
      name: "Hermes Agent v1.2.3", source: "Hermes Agent", kind: "Release", creator: "Nous Research",
      job: "A small reliability release.",
    })]);
  });

  it("shows at most one current item per connected source", () => {
    const make = (source: LiveBotSourceName, index: number) => ({
      id: `${source}:${index}`, name: `${source} ${index}`, job: "Does a job", creator: "Maker", source,
      sourceUrl: "https://example.com", listedAt: `2026-09-${String(22 - index).padStart(2, "0")}T00:00:00.000Z`, kind: source === "Muse at Work" ? "Workflow" as const : source.endsWith("Agent") || source === "OpenClaw" || source === "OpenBot" ? "Release" as const : "Bot" as const,
    });
    const sources: LiveBotSourceName[] = ["My Bot Farm", "GrokHub", "Muse at Work", "Grok Bot Field Notes", "Hermes Agent", "OpenClaw", "OpenBot"];
    const selected = newestListings([
      ...sources.flatMap((source) => Array.from({ length: 4 }, (_, index) => make(source, index))),
    ]);
    expect(selected).toHaveLength(7);
    expect(new Set(selected.map((item) => item.source)).size).toBe(7);
    expect(selected.every((item) => selected.filter((other) => other.source === item.source).length === 1)).toBe(true);
  });
});
