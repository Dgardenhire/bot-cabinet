export type WatchEvidence = "observed" | "provider-claim" | "cabinet-tested";
export type WatchResponseStatus = "published" | "prepared" | "testing" | "watching";
export type WatchBotEvidence = "listed" | "inspected" | "imported" | "task-tested" | "repeated";
export type WatchBotDecision = "improve-existing" | "test-adaptation" | "write-guide" | "add-new" | "watch";

export type WatchBotDetails = {
  name: string;
  creator: string;
  platform: string;
  job: string;
  requiredAccess: string;
  outsideActions: string;
  evidenceStatus: WatchBotEvidence;
  cabinetDecision: WatchBotDecision;
  cabinetFit: string;
  closestCabinetMatch: { label: string; href: string };
};

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
  botDetails?: WatchBotDetails;
};

type PublicationRow = { slug: string; revision: number; payload: unknown; published_at: string };

const evidence = new Set<WatchEvidence>(["observed", "provider-claim", "cabinet-tested"]);
const statuses = new Set<WatchResponseStatus>(["published", "prepared", "testing", "watching"]);
const botEvidence = new Set<WatchBotEvidence>(["listed", "inspected", "imported", "task-tested", "repeated"]);
const botDecisions = new Set<WatchBotDecision>(["improve-existing", "test-adaptation", "write-guide", "add-new", "watch"]);

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

function isBotDetails(value: unknown): value is WatchBotDetails {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const details = value as Record<string, unknown>;
  if (!isText(details.name, 120) || !isText(details.creator, 120) || !isText(details.platform, 80)) return false;
  if (!isText(details.job, 500) || !isText(details.requiredAccess, 700) || !isText(details.outsideActions, 700)) return false;
  if (!botEvidence.has(details.evidenceStatus as WatchBotEvidence) || !botDecisions.has(details.cabinetDecision as WatchBotDecision)) return false;
  if (!isText(details.cabinetFit, 500) || !isLink(details.closestCabinetMatch)) return false;
  return true;
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
  if (item.botDetails !== undefined && !isBotDetails(item.botDetails)) return null;
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
