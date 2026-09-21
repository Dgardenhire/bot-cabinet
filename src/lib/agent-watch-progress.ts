export const AGENT_WATCH_PROGRESS_SCHEMA = "bot-cabinet-agent-watch-progress/v1";
export const AGENT_WATCH_PROGRESS_STORAGE_KEY = "bot-cabinet-agent-watch-progress";
export const AGENT_WATCH_RETURN_AFTER_MS = 12 * 60 * 60 * 1000;
const MAX_SEEN_SLUGS = 500;

export type AgentWatchProgress = {
  schema: typeof AGENT_WATCH_PROGRESS_SCHEMA;
  seenSlugs: string[];
  firstVisitedAt: number;
  lastVisitedAt: number;
  lastReturnReportedAt?: number;
};

type MinimalStorage = Pick<Storage, "getItem" | "setItem">;

function validTime(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function uniqueSlugs(slugs: readonly string[]) {
  return [...new Set(slugs.filter(slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)))].slice(0, MAX_SEEN_SLUGS);
}

export function readAgentWatchProgress(storage: Pick<Storage, "getItem">) {
  try {
    const value = JSON.parse(storage.getItem(AGENT_WATCH_PROGRESS_STORAGE_KEY) ?? "null");
    if (
      !value
      || value.schema !== AGENT_WATCH_PROGRESS_SCHEMA
      || !Array.isArray(value.seenSlugs)
      || value.seenSlugs.length > MAX_SEEN_SLUGS
      || value.seenSlugs.some((slug: unknown) => typeof slug !== "string")
      || !validTime(value.firstVisitedAt)
      || !validTime(value.lastVisitedAt)
      || (value.lastReturnReportedAt !== undefined && !validTime(value.lastReturnReportedAt))
    ) return undefined;
    return { ...value, seenSlugs: uniqueSlugs(value.seenSlugs) } as AgentWatchProgress;
  } catch {
    return undefined;
  }
}

export function saveAgentWatchProgress(storage: Pick<Storage, "setItem">, record: AgentWatchProgress) {
  try {
    storage.setItem(AGENT_WATCH_PROGRESS_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // The visible update count remains useful when browser storage is unavailable.
  }
  return record;
}

export function beginAgentWatchVisit(
  storage: MinimalStorage,
  currentSlugs: readonly string[],
  now = Date.now(),
) {
  const slugs = uniqueSlugs(currentSlugs);
  const previous = readAgentWatchProgress(storage);
  const visitTime = validTime(now) ? now : 0;
  if (!previous || visitTime < previous.lastVisitedAt) {
    const record: AgentWatchProgress = {
      schema: AGENT_WATCH_PROGRESS_SCHEMA,
      seenSlugs: slugs,
      firstVisitedAt: visitTime,
      lastVisitedAt: visitTime,
    };
    saveAgentWatchProgress(storage, record);
    return { record, firstVisit: true, returnVisit: false, newSlugs: [] as string[] };
  }

  const returnVisit = visitTime - previous.lastVisitedAt >= AGENT_WATCH_RETURN_AFTER_MS;
  const seen = new Set(previous.seenSlugs);
  const record: AgentWatchProgress = {
    ...previous,
    lastVisitedAt: visitTime,
    ...(returnVisit ? { lastReturnReportedAt: visitTime } : {}),
  };
  saveAgentWatchProgress(storage, record);
  return {
    record,
    firstVisit: false,
    returnVisit,
    newSlugs: slugs.filter(slug => !seen.has(slug)),
  };
}

export function markAgentWatchSeen(
  storage: Pick<Storage, "setItem">,
  record: AgentWatchProgress,
  currentSlugs: readonly string[],
) {
  const next = { ...record, seenSlugs: uniqueSlugs(currentSlugs) };
  return saveAgentWatchProgress(storage, next);
}
