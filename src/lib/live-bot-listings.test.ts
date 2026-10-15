import { afterEach, describe, expect, it, vi } from "vitest";
import { AGENT_WATCH_SOURCES } from "../data/agent-watch-sources";
import { loadLiveBotListings } from "../../supabase/functions/agent-watch/live-listings";
import { loadLiveBotListings as loadServerLiveBotListings } from "./live-bot-listings-server";
import { LIVE_BOT_SOURCES, newestListings, parseBotDirectoryListings, parseBotUsecasesListings, parseGitHubReleases, parseGitHubRepositorySearch, parseGitLabProjects, parseGrokBotDevFeed, parseGrokBotFieldNotes, parseGrokBotsBestListings, parseGrokHubListings, parseMuseAtWorkConfig, parseMuseAtWorkListings, parseMyBotFarmListings, parseOfficialGrokMarketplaceListings, parseOfficialGrokMarketplacePage, parseReallyBotListings, type LiveBotSourceName } from "./live-bot-listings";

const reportedUse = {
  id: 2, title: "Client meeting follow-up", description: "A creator reports preparing follow-ups from meeting notes.",
  sourceHandle: "@maker", sourceUrl: "https://x.com/maker/status/2108825299420926295",
  date: "2026-10-10T07:41:46+00:00", image: "assets/media/example.webp", links: [],
};

afterEach(() => { vi.unstubAllGlobals(); });

describe("live directory listings", () => {
  it("preserves the creator, original post and source date of a reported use without inventing a native template", () => {
    const items = parseBotUsecasesListings([reportedUse]);
    expect(items).toEqual([{
      id: "bot-usecases:2", name: reportedUse.title, job: reportedUse.description,
      creator: "@maker", source: "Bot Usecases", sourceUrl: reportedUse.sourceUrl,
      listedAt: "2026-10-10T07:41:46.000Z", kind: "Workflow",
    }]);
    expect(items[0]).not.toHaveProperty("originalUrl");
    expect(items[0]).not.toHaveProperty("image");
    expect(items[0]).not.toHaveProperty("tested");
  });

  it("retains an explicitly supplied native template link but not generic or unsafe links", () => {
    const links = [
      { url: "javascript:alert(1)", label: "Bad" },
      { url: "https://x.ai.evil.example/bot/marketplace/bots/fake", label: "Wrong host" },
      { url: "https://x.ai/bot/guides", label: "Guide" },
      { url: "https://x.ai/bot/marketplace/bots/pg", label: "Template" },
    ];
    expect(parseBotUsecasesListings([{ ...reportedUse, links }])[0]).toMatchObject({
      sourceUrl: reportedUse.sourceUrl, originalUrl: "https://x.ai/bot/marketplace/bots/pg", kind: "Workflow",
    });
    expect(parseBotUsecasesListings([{ ...reportedUse, links: links.slice(0, 3) }])[0].originalUrl).toBeUndefined();
    expect(parseBotUsecasesListings([{ ...reportedUse, links: [{ url: "https://x.ai/bot/x3G0dAD1zxRXa5pdHw9NQ", label: "Bot" }] }])[0].originalUrl)
      .toBe("https://x.ai/bot/x3G0dAD1zxRXa5pdHw9NQ");
  });

  it("rejects invalid source records and leaves missing or invalid source dates unknown", () => {
    const invalidUrls = ["javascript:alert(1)", "http://x.com/maker/status/123", "https://x.com.evil.example/maker/status/123", "not a url"];
    expect(parseBotUsecasesListings(invalidUrls.map((sourceUrl) => ({ ...reportedUse, sourceUrl })))).toEqual([]);
    expect(parseBotUsecasesListings([{ ...reportedUse, id: null }, { ...reportedUse, title: " " }, { ...reportedUse, description: null }])).toEqual([]);
    expect(parseBotUsecasesListings({ items: [reportedUse] })).toEqual([]);
    for (const date of [undefined, "not a date", "2999-01-01"]) {
      expect(parseBotUsecasesListings([{ ...reportedUse, date }])[0].listedAt).toBeUndefined();
    }
  });

  it("adds Bot Usecases without dropping existing live sources or letting its volume dominate selection", () => {
    expect(LIVE_BOT_SOURCES.find((source) => source.name === "Bot Usecases")).toMatchObject({
      url: "https://botusecases.netlify.app/usecases.json", format: "bot-usecases",
    });
    expect(AGENT_WATCH_SOURCES.find((source) => source.name === "Bot Usecases")).toMatchObject({
      href: "https://botusecases.netlify.app/", coverage: "Live listings",
    });
    const items = LIVE_BOT_SOURCES.flatMap((source) => Array.from({ length: source.name === "Bot Usecases" ? 100 : 2 }, (_, index) => ({
      id: `${source.name}:${index}`, name: `${source.name} ${index}`, job: "A reported job", creator: "Maker", source: source.name,
      sourceUrl: source.url, listedAt: source.name === "Bot Usecases" ? "2026-10-10T00:00:00.000Z" : "2026-10-09T00:00:00.000Z", kind: "Workflow" as const,
    })));
    const selected = newestListings(items, LIVE_BOT_SOURCES.length * 2, 2);
    expect(new Set(selected.map((item) => item.source))).toEqual(new Set(LIVE_BOT_SOURCES.map((source) => source.name)));
    expect(selected.filter((item) => item.source === "Bot Usecases")).toHaveLength(2);
  });

  it.each([
    ["edge", loadLiveBotListings],
    ["server", loadServerLiveBotListings],
  ] as const)("loads reported uses through the %s feed and reports a source failure rather than an invented fresh item", async (_name, load) => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => new Response(JSON.stringify(
      String(input) === "https://botusecases.netlify.app/usecases.json" ? [reportedUse] : [],
    ), { headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const feed = await load();
    expect(feed.sources.find((source) => source.name === "Bot Usecases")).toEqual({ name: "Bot Usecases", ok: true, count: 1 });
    expect(feed.items[0]).toMatchObject({ source: "Bot Usecases", listedAt: "2026-10-10T07:41:46.000Z" });
    expect(feed.items[0].listedAt).not.toBe(feed.checkedAt);
    fetchMock.mockImplementation(async () => new Response("Unavailable", { status: 503 }));
    const unavailable = await load();
    expect(unavailable.sources.find((source) => source.name === "Bot Usecases")).toEqual({ name: "Bot Usecases", ok: false, count: 0 });
    expect(unavailable.items).toEqual([]);
  });

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

  it("reads the current official Grok marketplace page", () => {
    const records = [{ id: "useful-bot", name: "Useful Bot", creatorName: "A Creator", summary: "Does one useful job." }];
    const encoded = JSON.stringify(records).slice(1, -1).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const items = parseOfficialGrokMarketplacePage(`<script>,\\"templates\\":[${encoded}],\\"initialCategory\\":null</script>`);
    expect(items).toEqual([expect.objectContaining({
      id: "grok-marketplace:useful-bot", source: "Grok Bot Marketplace", creator: "A Creator", kind: "Bot",
    })]);
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

  it("reads newly created agent repositories from GitHub and GitLab", () => {
    const github = parseGitHubRepositorySearch({ items: [{
      id: 42, full_name: "maker/useful-agent", description: "Handles one clear job.",
      html_url: "https://github.com/maker/useful-agent", created_at: "2026-09-23T10:00:00Z", owner: { login: "maker" },
    }] });
    const gitlab = parseGitLabProjects([{
      id: 84, path_with_namespace: "builder/helpful-agent", description: "Helps with another clear job.",
      web_url: "https://gitlab.com/builder/helpful-agent", created_at: "2026-09-22T10:00:00Z", namespace: { full_path: "builder" },
    }]);
    expect(github[0]).toMatchObject({ kind: "Repository", source: "GitHub agent repositories", creator: "maker" });
    expect(gitlab[0]).toMatchObject({ kind: "Repository", source: "GitLab agent repositories", creator: "builder" });
  });

  it("reads the older Bot directories Damon supplied", () => {
    const directory = parseBotDirectoryListings({ items: [{
      slug: "useful-bot", name: "Useful Bot", summary: "Handles a clear recurring job.",
      detailUrl: "https://botdirectory.ai/bots/useful-bot/", addedAt: "2026-09-23T10:00:00Z",
      grokShareUrl: "https://x.ai/bot/abc", sources: [{ url: "https://x.com/maker/status/123" }],
    }] });
    const best = parseGrokBotsBestListings([{
      id: "bot-1", name: "Another Bot", description: "Handles another job.", author: "@maker",
      url: "https://grokbots.best/bots/another-bot", source_url: "https://x.com/maker/status/456", created_at: "2026-09-22T10:00:00Z",
    }]);
    expect(directory[0]).toMatchObject({ source: "BotDirectory", kind: "Bot", originalUrl: "https://x.ai/bot/abc" });
    expect(best[0]).toMatchObject({ source: "GrokBots.best", kind: "Bot", creator: "@maker" });
  });

  it("reads grokbot.dev updates and completed really.bot jobs without calling either tested by Cabinet", () => {
    const rss = `<?xml version="1.0"?><rss><channel><item><title>Useful Plugin</title><link>https://grokbot.dev/plugins/useful/</link><description>Connects one useful tool.</description><pubDate>Tue, 22 Sep 2026 10:00:00 GMT</pubDate></item></channel></rss>`;
    const dev = parseGrokBotDevFeed(rss);
    const runs = parseReallyBotListings({ items: [{
      id: "01255", title: "Scout Open-Source Alternatives", bot_name: "Open Alternative Scout", house: 0,
      url: "https://really.bot/house000/01255", published_at: "2026-09-22T16:30:39Z", grok_share_url: "https://x.ai/bot/abc",
    }] });
    expect(dev[0]).toMatchObject({ source: "grokbot.dev", kind: "Tool", name: "Useful Plugin" });
    expect(runs[0]).toMatchObject({ source: "really.bot", kind: "Workflow", creator: "House 000" });
  });

  it("can balance several current items per connected source", () => {
    const make = (source: LiveBotSourceName, index: number) => ({
      id: `${source}:${index}`, name: `${source} ${index}`, job: "Does a job", creator: "Maker", source,
      sourceUrl: "https://example.com", listedAt: `2026-09-${String(22 - index).padStart(2, "0")}T00:00:00.000Z`, kind: source === "Muse at Work" ? "Workflow" as const : source.endsWith("Agent") || source === "OpenClaw" || source === "OpenBot" ? "Release" as const : "Bot" as const,
    });
    const sources: LiveBotSourceName[] = ["My Bot Farm", "GrokHub", "Muse at Work", "Grok Bot Field Notes", "Hermes Agent", "OpenClaw", "OpenBot"];
    const selected = newestListings([
      ...sources.flatMap((source) => Array.from({ length: 4 }, (_, index) => make(source, index))),
    ], 14, 2);
    expect(selected).toHaveLength(14);
    expect(new Set(selected.map((item) => item.source)).size).toBe(7);
    expect(selected.every((item) => selected.filter((other) => other.source === item.source).length === 2)).toBe(true);
  });
});
