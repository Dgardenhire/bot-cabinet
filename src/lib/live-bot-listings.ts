export const LIVE_BOT_SOURCES = [
  { name: "Grok Bot Marketplace", url: "https://x.ai/bot/marketplace", format: "official-grok-html" },
  { name: "My Bot Farm", url: "https://mybot.farm/api/stalls?sort=newest", format: "json" },
  { name: "GrokHub", url: "https://www.grokhub.io/feed", format: "json" },
  { name: "BotDirectory", url: "https://botdirectory.ai/updates.json", format: "botdirectory" },
  { name: "GrokBots.best", url: "https://grokbots.best/api/bots", format: "grokbots-best" },
  { name: "grokbot.dev", url: "https://grokbot.dev/rss.xml", format: "rss" },
  { name: "really.bot", url: "https://really.bot/feed.json", format: "really-bot" },
  { name: "Muse at Work", url: "https://museatwork.app/config.js", format: "muse" },
  { name: "Grok Bot Field Notes", url: "https://raw.githubusercontent.com/unicodef1wn/grokbot-field-notes/main/roster/README.md", format: "field-notes" },
  { name: "Hermes Agent", url: "https://api.github.com/repos/NousResearch/hermes-agent/releases?per_page=10", format: "github-releases", creator: "Nous Research" },
  { name: "OpenClaw", url: "https://api.github.com/repos/openclaw/openclaw/releases?per_page=10", format: "github-releases", creator: "OpenClaw maintainers" },
  { name: "OpenBot", url: "https://api.github.com/repos/nightly-labs/openbot/releases?per_page=10", format: "github-releases", creator: "OpenBot maintainers" },
  { name: "GitHub agent repositories", url: "https://api.github.com/search/repositories?q=topic%3Aai-agent&sort=updated&order=desc&per_page=100", format: "github-search" },
  { name: "GitLab agent repositories", url: "https://gitlab.com/api/v4/projects?topic=ai-agent&order_by=created_at&sort=desc&per_page=100", format: "gitlab-projects" },
] as const;

export type LiveBotSourceName = typeof LIVE_BOT_SOURCES[number]["name"];

export type LiveBotListing = {
  id: string;
  name: string;
  job: string;
  creator: string;
  source: LiveBotSourceName;
  sourceUrl: string;
  originalUrl?: string;
  listedAt?: string;
  kind: "Bot" | "Team" | "Workflow" | "Role" | "Tool" | "Repository" | "Release";
};

function object(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function shortText(value: unknown, limit: number): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, limit) : null;
}

function sourceUrl(value: unknown, host: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host ? url.href : null;
  } catch { return null; }
}

function date(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed <= Date.now() + 86_400_000 ? new Date(parsed).toISOString() : null;
}

export function parseOfficialGrokMarketplaceListings(value: unknown): LiveBotListing[] {
  const root = object(value);
  const marketplace = object(root?.marketplace);
  if (!marketplace || marketplace.available !== true || !Array.isArray(marketplace.listings)) return [];
  return marketplace.listings.slice(0, 200).flatMap((raw) => {
    const item = object(raw);
    const id = shortText(item?.id, 100);
    const name = shortText(item?.name, 120);
    const job = shortText(item?.job, 500);
    const creator = shortText(item?.creator, 120);
    const url = sourceUrl(item?.sourceUrl, "x.ai");
    if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(id) || !name || !job || !creator || !url) return [];
    return [{
      id: `grok-marketplace:${id}`,
      name,
      job,
      creator,
      source: "Grok Bot Marketplace" as const,
      sourceUrl: url,
      kind: "Bot" as const,
    }];
  });
}

export function parseOfficialGrokMarketplacePage(value: string): LiveBotListing[] {
  const startMarker = ',\\"templates\\":[';
  const endMarker = '],\\"initialCategory\\"';
  const start = value.indexOf(startMarker);
  const end = start < 0 ? -1 : value.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) return [];
  let records: unknown;
  try {
    const decoded = JSON.parse(`"${value.slice(start + startMarker.length, end)}"`) as string;
    records = JSON.parse(`[${decoded}]`) as unknown;
  } catch {
    return [];
  }
  if (!Array.isArray(records)) return [];
  return records.slice(0, 500).flatMap((raw) => {
    const item = object(raw);
    const id = shortText(item?.id, 100);
    const name = shortText(item?.name, 120);
    const job = shortText(item?.summary, 500) ?? shortText(item?.description, 500);
    const creator = shortText(item?.creatorName, 120);
    if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(id) || !name || !job || !creator) return [];
    return [{
      id: `grok-marketplace:${id}`, name, job, creator,
      source: "Grok Bot Marketplace" as const,
      sourceUrl: `https://x.ai/bot/marketplace/bots/${id}`,
      kind: "Bot" as const,
    }];
  });
}

export function parseMyBotFarmListings(value: unknown): LiveBotListing[] {
  const root = object(value);
  if (!root || !Array.isArray(root.stalls)) return [];
  return root.stalls.slice(0, 1000).flatMap((raw) => {
    const item = object(raw);
    if (!item || (item.kind !== "agent" && item.kind !== "team")) return [];
    const name = shortText(item.name, 100);
    const job = shortText(item.description, 240) ?? shortText(item.title, 240);
    const url = sourceUrl(item.pageUrl, "mybot.farm");
    const listedAt = date(item.listedAt);
    if (!name || !job || !url || !listedAt) return [];
    const author = object(item.author);
    return [{
      id: `mybot-farm:${item.kind}:${shortText(item.slug, 100) ?? url}`,
      name, job, creator: shortText(author?.username, 80) ?? "Creator not listed",
      source: "My Bot Farm" as const, sourceUrl: url, listedAt,
      kind: item.kind === "team" ? "Team" as const : "Bot" as const,
    }];
  });
}

export function parseGrokHubListings(value: unknown): LiveBotListing[] {
  const root = object(value);
  if (!root || !Array.isArray(root.items)) return [];
  return root.items.slice(0, 2000).flatMap((raw) => {
    const item = object(raw);
    if (!item || item.type !== "use-case") return [];
    const name = shortText(item.headline, 100);
    const job = shortText(item.summary, 240);
    const url = sourceUrl(item.url, "www.grokhub.io");
    const listedAt = date(item.added_at);
    if (!name || !job || !url || !listedAt) return [];
    const origin = object(item.source);
    const originalUrl = sourceUrl(item.template_url, "x.ai") ?? sourceUrl(origin?.url, "x.com") ?? undefined;
    return [{
      id: `grokhub:${shortText(item.slug, 100) ?? url}`,
      name, job, creator: shortText(origin?.label, 80) ?? "Creator not listed",
      source: "GrokHub" as const, sourceUrl: url, originalUrl, listedAt,
      kind: "Bot" as const,
    }];
  });
}

export function parseBotDirectoryListings(value: unknown): LiveBotListing[] {
  const root = object(value);
  if (!root || !Array.isArray(root.items)) return [];
  return root.items.slice(0, 1000).flatMap((raw) => {
    const item = object(raw);
    const slug = shortText(item?.slug, 120);
    const name = shortText(item?.name, 120);
    const job = shortText(item?.summary, 500);
    const url = sourceUrl(item?.detailUrl, "botdirectory.ai");
    const listedAt = date(item?.addedAt);
    const sources = Array.isArray(item?.sources) ? item.sources.map(object).filter(Boolean) : [];
    const originalUrl = sourceUrl(item?.grokShareUrl, "x.ai")
      ?? sources.map((source) => sourceUrl(source?.url, "x.com")).find(Boolean)
      ?? undefined;
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) || !name || !job || !url || !listedAt) return [];
    return [{
      id: `botdirectory:${slug}`, name, job,
      creator: "BotDirectory contributor", source: "BotDirectory" as const,
      sourceUrl: url, originalUrl, listedAt, kind: "Bot" as const,
    }];
  });
}

export function parseGrokBotsBestListings(value: unknown): LiveBotListing[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 1500).flatMap((raw) => {
    const item = object(raw);
    const id = shortText(item?.id, 100);
    const name = shortText(item?.name, 120);
    const job = shortText(item?.description, 500);
    const url = sourceUrl(item?.url, "grokbots.best");
    const listedAt = date(item?.created_at);
    if (!id || !name || !job || !url || !listedAt) return [];
    return [{
      id: `grokbots-best:${id}`, name, job,
      creator: shortText(item?.author, 100) ?? "Creator not listed",
      source: "GrokBots.best" as const, sourceUrl: url,
      originalUrl: sourceUrl(item?.source_url, "x.com") ?? undefined,
      listedAt, kind: "Bot" as const,
    }];
  });
}

function rssText(value: string): string {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function parseGrokBotDevFeed(value: string): LiveBotListing[] {
  return [...value.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 300).flatMap((match) => {
    const item = match[1];
    const field = (name: string) => rssText(item.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`))?.[1] ?? "");
    const name = shortText(field("title"), 120);
    const job = shortText(field("description"), 500);
    const rawUrl = field("link");
    const url = sourceUrl(rawUrl, "grokbot.dev");
    const listedAt = date(field("pubDate"));
    if (!name || !job || !url || !listedAt) return [];
    const kind = url.includes("/plugins/") ? "Tool" as const : url.includes("/marketplace/") ? "Bot" as const : "Workflow" as const;
    return [{
      id: `grokbot-dev:${new URL(url).pathname}`, name, job,
      creator: "grokbot.dev contributor", source: "grokbot.dev" as const,
      sourceUrl: url, listedAt, kind,
    }];
  });
}

export function parseReallyBotListings(value: unknown): LiveBotListing[] {
  const root = object(value);
  if (!root || !Array.isArray(root.items)) return [];
  return root.items.slice(0, 1500).flatMap((raw) => {
    const item = object(raw);
    const id = shortText(item?.id, 40);
    const name = shortText(item?.bot_name, 120) ?? shortText(item?.title, 120);
    const job = shortText(item?.title, 500);
    const url = sourceUrl(item?.url, "really.bot");
    const listedAt = date(item?.published_at);
    if (!id || !/^\d+$/.test(id) || !name || !job || !url || !listedAt) return [];
    return [{
      id: `really-bot:${id}`, name, job,
      creator: typeof item?.house === "number" ? `House ${String(item.house).padStart(3, "0")}` : "really.bot contributor",
      source: "really.bot" as const, sourceUrl: url,
      originalUrl: sourceUrl(item?.grok_share_url, "x.ai") ?? undefined,
      listedAt, kind: "Workflow" as const,
    }];
  });
}

export function parseMuseAtWorkConfig(value: string): { apiUrl: string; apiKey: string } {
  const urlMatch = value.match(/SUPABASE_URL\s*=\s*["'](https:\/\/[a-z0-9-]+\.supabase\.co)["']/i);
  const keyMatch = value.match(/SUPABASE_ANON_KEY\s*=\s*["']([A-Za-z0-9._-]+)["']/);
  if (!urlMatch || !keyMatch) throw new Error("Muse at Work public directory configuration is unavailable");
  return { apiUrl: urlMatch[1], apiKey: keyMatch[1] };
}

export function parseMuseAtWorkListings(value: unknown): LiveBotListing[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 200).flatMap((raw) => {
    const item = object(raw);
    const id = shortText(item?.id, 80);
    const name = shortText(item?.title, 100);
    const job = shortText(item?.outcome, 240);
    const listedAt = date(item?.created_at);
    if (!id || !/^[a-z0-9-]+$/i.test(id) || !name || !job || !listedAt) return [];
    const handle = shortText(item?.x_handle, 80)?.replace(/^@/, "");
    return [{
      id: `muse-at-work:${id}`,
      name,
      job,
      creator: handle ? `@${handle}` : "Creator not listed",
      source: "Muse at Work" as const,
      sourceUrl: `https://museatwork.app/#w=${id}`,
      listedAt,
      kind: "Workflow" as const,
    }];
  });
}

export function parseGrokBotFieldNotes(value: string): LiveBotListing[] {
  const base = "https://github.com/unicodef1wn/grokbot-field-notes/blob/main/roster/";
  return value.split("\n").slice(0, 1000).flatMap((line) => {
    const match = line.match(/^\|\s*\[\`?([^\]`]+)\`?\]\(([^)]+\.md)\)\s*\|\s*(.+?)\s*\|\s*$/);
    if (!match) return [];
    const [, rawName, file, rawJob] = match;
    if (!/^[a-z0-9-]+\.md$/.test(file)) return [];
    const name = shortText(rawName, 100);
    const job = shortText(rawJob.replace(/\*\*/g, "").replace(/\`/g, ""), 240);
    if (!name || !job) return [];
    return [{
      id: `grok-bot-field-notes:${file.slice(0, -3)}`,
      name,
      job,
      creator: "Grok Bot Field Notes contributors",
      source: "Grok Bot Field Notes" as const,
      sourceUrl: `${base}${file}`,
      kind: "Role" as const,
    }];
  });
}

function releaseSummary(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const line = value
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith("#") && !/^\*\*Release Date:/.test(item));
  if (!line) return null;
  return shortText(line.replace(/^>\s*/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_]/g, ""), 240);
}

export function parseGitHubReleases(value: unknown, source: Extract<LiveBotSourceName, "Hermes Agent" | "OpenClaw" | "OpenBot">, creator: string): LiveBotListing[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).flatMap((raw) => {
    const item = object(raw);
    const tag = shortText(item?.tag_name, 100);
    const name = shortText(item?.name, 100) ?? tag;
    const url = sourceUrl(item?.html_url, "github.com");
    const listedAt = date(item?.published_at);
    if (!tag || !name || !url || !listedAt) return [];
    return [{
      id: `github-release:${source.toLowerCase().replace(/\s+/g, "-")}:${tag}`,
      name,
      job: releaseSummary(item?.body) ?? `A new ${source} release is available. Open the notes to see what changed.`,
      creator,
      source,
      sourceUrl: url,
      listedAt,
      kind: "Release" as const,
    }];
  });
}

export function parseGitHubRepositorySearch(value: unknown): LiveBotListing[] {
  const root = object(value);
  if (!root || !Array.isArray(root.items)) return [];
  return root.items.slice(0, 100).flatMap((raw) => {
    const item = object(raw);
    const id = typeof item?.id === "number" ? String(item.id) : null;
    const name = shortText(item?.full_name, 140);
    const job = shortText(item?.description, 240);
    const url = sourceUrl(item?.html_url, "github.com");
    const listedAt = date(item?.created_at);
    const owner = object(item?.owner);
    if (!id || !name || !job || !url || !listedAt) return [];
    return [{
      id: `github-agent-repo:${id}`,
      name,
      job,
      creator: shortText(owner?.login, 100) ?? "GitHub creator",
      source: "GitHub agent repositories" as const,
      sourceUrl: url,
      listedAt,
      kind: "Repository" as const,
    }];
  });
}

export function parseGitLabProjects(value: unknown): LiveBotListing[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap((raw) => {
    const item = object(raw);
    const id = typeof item?.id === "number" ? String(item.id) : null;
    const name = shortText(item?.path_with_namespace, 140) ?? shortText(item?.name_with_namespace, 140);
    const job = shortText(item?.description, 240);
    const url = sourceUrl(item?.web_url, "gitlab.com");
    const listedAt = date(item?.created_at);
    const namespace = object(item?.namespace);
    if (!id || !name || !job || !url || !listedAt) return [];
    return [{
      id: `gitlab-agent-repo:${id}`,
      name,
      job,
      creator: shortText(namespace?.full_path, 100) ?? "GitLab creator",
      source: "GitLab agent repositories" as const,
      sourceUrl: url,
      listedAt,
      kind: "Repository" as const,
    }];
  });
}

export function newestListings(items: LiveBotListing[], limit: number = LIVE_BOT_SOURCES.length, maxPerSource: number = 1): LiveBotListing[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const sorted = [...byId.values()].sort((a, b) => (b.listedAt ?? "").localeCompare(a.listedAt ?? "") || a.name.localeCompare(b.name));
  const bySource = new Map<LiveBotListing["source"], LiveBotListing[]>();
  for (const item of sorted) bySource.set(item.source, [...(bySource.get(item.source) ?? []), item]);
  const sourceQueues = [...bySource.entries()].sort((a, b) => (b[1][0].listedAt ?? "").localeCompare(a[1][0].listedAt ?? ""));
  const selected: LiveBotListing[] = [];
  let round = 0;
  while (selected.length < limit && round < maxPerSource) {
    let added = false;
    for (const [, queue] of sourceQueues) {
      const item = queue[round];
      if (!item) continue;
      selected.push(item);
      added = true;
      if (selected.length >= limit) break;
    }
    if (!added) break;
    round += 1;
  }
  return selected;
}
