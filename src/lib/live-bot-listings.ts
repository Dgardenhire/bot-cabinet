export const LIVE_BOT_SOURCES = [
  { name: "My Bot Farm", url: "https://mybot.farm/api/stalls?sort=newest" },
  { name: "GrokHub", url: "https://www.grokhub.io/feed" },
] as const;

export type LiveBotListing = {
  id: string;
  name: string;
  job: string;
  creator: string;
  source: "My Bot Farm" | "GrokHub";
  sourceUrl: string;
  originalUrl?: string;
  listedAt: string;
  kind: "Bot" | "Team";
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

export function newestListings(items: LiveBotListing[], limit = 24): LiveBotListing[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return [...byId.values()].sort((a, b) => b.listedAt.localeCompare(a.listedAt) || a.name.localeCompare(b.name)).slice(0, limit);
}
