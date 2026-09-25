import {
  LIVE_BOT_SOURCES,
  newestListings,
  parseBotDirectoryListings,
  parseGitHubReleases,
  parseGitHubRepositorySearch,
  parseGitLabProjects,
  parseGrokBotFieldNotes,
  parseGrokHubListings,
  parseGrokBotDevFeed,
  parseGrokBotsBestListings,
  parseMuseAtWorkConfig,
  parseMuseAtWorkListings,
  parseMyBotFarmListings,
  parseOfficialGrokMarketplacePage,
  parseReallyBotListings,
  type LiveBotListing,
} from "@/lib/live-bot-listings";

type LiveBotSource = typeof LIVE_BOT_SOURCES[number];

async function responseJson(response: Response, sourceName: string) {
  if (!response.ok) throw new Error(`${sourceName} returned ${response.status}`);
  return response.json() as Promise<unknown>;
}

async function fetchSource(source: LiveBotSource): Promise<LiveBotListing[]> {
  const signal = AbortSignal.timeout(8_000);
  if (source.format === "official-grok-html") {
    const response = await fetch(source.url, { signal, headers: { Accept: "text/html" }, cache: "no-store" });
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
    return parseOfficialGrokMarketplacePage(await response.text());
  }
  if (source.format === "github-releases") {
    const data = await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }), source.name);
    return parseGitHubReleases(data, source.name, source.creator);
  }
  if (source.format === "github-search") {
    const data = await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }), source.name);
    return parseGitHubRepositorySearch(data);
  }
  if (source.format === "gitlab-projects") {
    const data = await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" }), source.name);
    return parseGitLabProjects(data);
  }
  if (source.format === "botdirectory") {
    return parseBotDirectoryListings(await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" }), source.name));
  }
  if (source.format === "grokbots-best") {
    return parseGrokBotsBestListings(await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" }), source.name));
  }
  if (source.format === "rss") {
    const response = await fetch(source.url, { signal, headers: { Accept: "application/rss+xml, application/xml, text/xml" }, cache: "no-store" });
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
    return parseGrokBotDevFeed(await response.text());
  }
  if (source.format === "really-bot") {
    return parseReallyBotListings(await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" }), source.name));
  }
  if (source.format === "muse") {
    const configResponse = await fetch(source.url, { signal, cache: "no-store" });
    if (!configResponse.ok) throw new Error(`${source.name} returned ${configResponse.status}`);
    const { apiUrl, apiKey } = parseMuseAtWorkConfig(await configResponse.text());
    const directoryUrl = `${apiUrl}/rest/v1/workflows?select=id,title,outcome,x_handle,created_at&status=eq.approved&order=created_at.desc&limit=100`;
    const data = await responseJson(await fetch(directoryUrl, {
      signal,
      headers: { Accept: "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    }), source.name);
    return parseMuseAtWorkListings(data);
  }
  if (source.format === "field-notes") {
    const response = await fetch(source.url, { signal, headers: { Accept: "text/plain" }, cache: "no-store" });
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
    return parseGrokBotFieldNotes(await response.text());
  }
  const data = await responseJson(await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" }), source.name);
  return source.name === "My Bot Farm" ? parseMyBotFarmListings(data) : parseGrokHubListings(data);
}

export async function loadLiveBotListings() {
  const results = await Promise.allSettled(LIVE_BOT_SOURCES.map(fetchSource));
  const sources = results.map((result, index) => ({
    name: LIVE_BOT_SOURCES[index].name,
    ok: result.status === "fulfilled" && result.value.length > 0,
    count: result.status === "fulfilled" ? result.value.length : 0,
  }));
  const available = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  return {
    checkedAt: new Date().toISOString(),
    sources,
    totalCount: available.length,
    items: newestListings(available, 120, 12),
  };
}
