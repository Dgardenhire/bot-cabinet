export const LIVE_BOT_SOURCES = [
  { name: "My Bot Farm", url: "https://mybot.farm/api/stalls?sort=newest", format: "json" },
  { name: "GrokHub", url: "https://www.grokhub.io/feed", format: "json" },
  { name: "Muse at Work", url: "https://museatwork.app/config.js", format: "muse" },
  { name: "Grok Bot Field Notes", url: "https://raw.githubusercontent.com/unicodef1wn/grokbot-field-notes/main/roster/README.md", format: "field-notes" },
] as const;

export type LiveBotListing = {
  id: string;
  name: string;
  job: string;
  creator: string;
  source: "My Bot Farm" | "GrokHub" | "Muse at Work" | "Grok Bot Field Notes";
  sourceUrl: string;
  originalUrl?: string;
  listedAt?: string;
  kind: "Bot" | "Team" | "Workflow" | "Role";
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

export function newestListings(items: LiveBotListing[], limit = 6, maxPerSource = 3): LiveBotListing[] {
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
