import type { AgentWatchItem, WatchEvidence, WatchResponseStatus } from "@/data/agent-watch";

export const AGENT_WATCH_API_URL = "https://mdjchixwgvicovkwrgle.supabase.co/functions/v1/agent-watch";

const evidence = new Set<WatchEvidence>(["observed", "provider-claim", "cabinet-tested"]);
const statuses = new Set<WatchResponseStatus>(["published", "prepared", "testing", "watching"]);
const retiredSlugs = new Set(["bounce-rate-is-not-useful-action", "repeat-use-not-return-visits"]);

function validLink(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const link = value as Record<string, unknown>;
  if (typeof link.label !== "string" || typeof link.href !== "string") return false;
  if (link.href.startsWith("/")) return true;
  try { return new URL(link.href).protocol === "https:"; } catch { return false; }
}

export function parsePublicWatchItem(value: unknown): AgentWatchItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const textFields = ["slug", "observedOn", "reviewAgainBy", "title", "signal", "whyItMatters", "cabinetResponse", "limits"];
  if (textFields.some((key) => typeof item[key] !== "string" || !(item[key] as string).trim())) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug as string)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.observedOn as string) || !/^\d{4}-\d{2}-\d{2}$/.test(item.reviewAgainBy as string)) return null;
  if (!evidence.has(item.evidence as WatchEvidence) || !statuses.has(item.responseStatus as WatchResponseStatus)) return null;
  if (!Array.isArray(item.sources) || item.sources.length < 1 || !item.sources.every(validLink)) return null;
  if (item.cabinetLinks !== undefined && (!Array.isArray(item.cabinetLinks) || !item.cabinetLinks.every(validLink))) return null;
  return item as unknown as AgentWatchItem;
}

export function parsePublicWatchFeed(value: unknown): AgentWatchItem[] {
  if (!value || typeof value !== "object" || !Array.isArray((value as { items?: unknown }).items)) return [];
  return (value as { items: unknown[] }).items.flatMap((item) => {
    const parsed = parsePublicWatchItem(item);
    return parsed ? [parsed] : [];
  });
}

export function mergeWatchItems(live: AgentWatchItem[], fallback: AgentWatchItem[]) {
  if (live.length === 0) return fallback;
  const bySlug = new Map(live.filter((item) => !retiredSlugs.has(item.slug)).map((item) => [item.slug, item]));
  for (const item of fallback) {
    const current = bySlug.get(item.slug);
    if (!current || current.observedOn <= item.observedOn) bySlug.set(item.slug, item);
  }
  return [...bySlug.values()].sort((a, b) => b.observedOn.localeCompare(a.observedOn) || a.title.localeCompare(b.title));
}
