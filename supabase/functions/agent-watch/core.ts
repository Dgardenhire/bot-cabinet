export type WatchEvidence = "observed" | "provider-claim" | "cabinet-tested";
export type WatchResponseStatus = "published" | "prepared" | "testing" | "watching";

export type AgentWatchItem = {
  slug: string;
  observedOn: string;
  reviewAgainBy: string;
  title: string;
  signal: string;
  evidence: WatchEvidence;
  whyItMatters: string;
  cabinetResponse: string;
  responseStatus: WatchResponseStatus;
  limits: string;
  sources: { label: string; href: string }[];
  cabinetLinks?: { label: string; href: string }[];
};

type PublicationRow = { slug: string; revision: number; payload: unknown; published_at: string };

const evidence = new Set<WatchEvidence>(["observed", "provider-claim", "cabinet-tested"]);
const statuses = new Set<WatchResponseStatus>(["published", "prepared", "testing", "watching"]);

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isText(value: unknown, max = 2_000): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isLink(value: unknown): value is { label: string; href: string } {
  if (!value || typeof value !== "object") return false;
  const link = value as Record<string, unknown>;
  if (!isText(link.label, 160) || !isText(link.href, 1_000)) return false;
  if (String(link.href).startsWith("/")) return true;
  try {
    return new URL(String(link.href)).protocol === "https:";
  } catch {
    return false;
  }
}

export function parseAgentWatchItem(value: unknown): AgentWatchItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (!isText(item.slug, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) return null;
  if (!isDate(item.observedOn) || !isDate(item.reviewAgainBy)) return null;
  if (!isText(item.title, 180) || !isText(item.signal) || !isText(item.whyItMatters)) return null;
  if (!isText(item.cabinetResponse) || !isText(item.limits)) return null;
  if (!evidence.has(item.evidence as WatchEvidence) || !statuses.has(item.responseStatus as WatchResponseStatus)) return null;
  if (!Array.isArray(item.sources) || item.sources.length < 1 || item.sources.length > 12 || !item.sources.every(isLink)) return null;
  if (item.cabinetLinks !== undefined && (!Array.isArray(item.cabinetLinks) || item.cabinetLinks.length > 12 || !item.cabinetLinks.every(isLink))) return null;
  return item as AgentWatchItem;
}

export function latestPublications(rows: PublicationRow[]): AgentWatchItem[] {
  const seen = new Set<string>();
  return rows
    .sort((a, b) => b.revision - a.revision)
    .flatMap((row) => {
      if (seen.has(row.slug)) return [];
      const item = parseAgentWatchItem(row.payload);
      if (!item || item.slug !== row.slug) return [];
      seen.add(row.slug);
      return [item];
    })
    .sort((a, b) => b.observedOn.localeCompare(a.observedOn) || a.title.localeCompare(b.title));
}

export function mergePublishedWithFallback(published: AgentWatchItem[], fallback: AgentWatchItem[]) {
  const items = new Map(fallback.map((item) => [item.slug, item]));
  for (const item of published) items.set(item.slug, item);
  return [...items.values()].sort((a, b) => b.observedOn.localeCompare(a.observedOn) || a.title.localeCompare(b.title));
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function utcDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

export function buildRss(items: AgentWatchItem[], selfUrl: string) {
  const latestDate = items[0]?.observedOn ?? new Date().toISOString().slice(0, 10);
  const entries = items.flatMap((item) => {
    const link = `https://botcabinet.com/watch/#${item.slug}`;
    const description = [`What changed: ${item.signal}`, `Why it matters: ${item.whyItMatters}`, `What Bot Cabinet did: ${item.cabinetResponse}`, `What remains unproven: ${item.limits}`, `Review again by: ${item.reviewAgainBy}`].join("\n\n");
    return ["    <item>", `      <title>${escapeXml(item.title)}</title>`, `      <link>${escapeXml(link)}</link>`, `      <guid isPermaLink="false">${escapeXml(`bot-cabinet:watch:${item.slug}:${item.observedOn}`)}</guid>`, `      <description>${escapeXml(description)}</description>`, `      <category>${escapeXml(item.evidence)}</category>`, `      <pubDate>${utcDate(item.observedOn)}</pubDate>`, "    </item>"];
  });
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">', "  <channel>", "    <title>Bot Cabinet Agent Watch</title>", "    <link>https://botcabinet.com/watch/</link>", "    <description>Reviewed, source-linked updates about useful AI agents and ways to use them.</description>", "    <language>en-us</language>", `    <lastBuildDate>${utcDate(latestDate)}</lastBuildDate>`, `    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />`, ...entries, "  </channel>", "</rss>", ""].join("\n");
}
