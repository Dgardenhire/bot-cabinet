export const CREW_PROGRESS_SCHEMA = "bot-cabinet-crew-progress/v1";
export const CREW_RUN_OUTCOME_EVENT = "crew_run_outcome_reported";
export const CREW_RUN_OUTCOMES = ["useful", "needs-work"] as const;

export type CrewRunOutcome = (typeof CREW_RUN_OUTCOMES)[number];
export type CrewRunSequence = "first" | "repeat";

export type CrewProgressRecord = {
  schema: typeof CREW_PROGRESS_SCHEMA;
  checked: Record<string, true>;
  completedRuns: number;
  lastRunOutcome?: CrewRunOutcome;
  lastRunAt?: number;
};

type MinimalStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function crewProgressStorageKey(kitSlug: string) {
  return `bot-cabinet-crew-progress:${kitSlug}`;
}

export function emptyCrewProgress(): CrewProgressRecord {
  return {
    schema: CREW_PROGRESS_SCHEMA,
    checked: {},
    completedRuns: 0,
  };
}

export function readCrewProgress(
  storage: Pick<Storage, "getItem">,
  kitSlug: string,
  validCheckpointIds: readonly string[],
): CrewProgressRecord {
  try {
    const value = JSON.parse(storage.getItem(crewProgressStorageKey(kitSlug)) ?? "null");
    if (
      !value
      || value.schema !== CREW_PROGRESS_SCHEMA
      || !value.checked
      || typeof value.checked !== "object"
      || Array.isArray(value.checked)
      || !Number.isSafeInteger(value.completedRuns)
      || value.completedRuns < 0
      || (value.lastRunOutcome !== undefined && !CREW_RUN_OUTCOMES.includes(value.lastRunOutcome))
      || (value.lastRunAt !== undefined && (
        typeof value.lastRunAt !== "number" || !Number.isFinite(value.lastRunAt)
      ))
    ) return emptyCrewProgress();
    const valid = new Set(validCheckpointIds);
    const checked = Object.fromEntries(
      Object.entries(value.checked).filter(([id, state]) => valid.has(id) && state === true),
    ) as Record<string, true>;
    return {
      schema: CREW_PROGRESS_SCHEMA,
      checked,
      completedRuns: value.completedRuns,
      ...(value.lastRunOutcome ? { lastRunOutcome: value.lastRunOutcome as CrewRunOutcome } : {}),
      ...(value.lastRunAt !== undefined ? { lastRunAt: value.lastRunAt as number } : {}),
    };
  } catch {
    return emptyCrewProgress();
  }
}

export function saveCrewProgress(
  storage: Pick<Storage, "setItem">,
  kitSlug: string,
  record: CrewProgressRecord,
) {
  try {
    storage.setItem(crewProgressStorageKey(kitSlug), JSON.stringify(record));
  } catch {
    // Local progress is useful but must never block the checklist.
  }
  return record;
}

export function clearCrewProgress(storage: MinimalStorage, kitSlug: string) {
  try {
    storage.removeItem(crewProgressStorageKey(kitSlug));
  } catch {
    // The visible checklist can still reset when browser storage is unavailable.
  }
  return emptyCrewProgress();
}

export function buildCrewRunOutcomeReport(
  kitSlug: string,
  outcome: CrewRunOutcome,
  previousCompletedRuns: number,
) {
  return {
    event: CREW_RUN_OUTCOME_EVENT,
    properties: {
      kit: kitSlug,
      outcome,
      run: (previousCompletedRuns > 0 ? "repeat" : "first") as CrewRunSequence,
    },
  } as const;
}

export function sendCrewRunOutcomeReport(
  kitSlug: string,
  outcome: CrewRunOutcome,
  previousCompletedRuns: number,
  send: (event: string, properties: {
    kit: string;
    outcome: CrewRunOutcome;
    run: CrewRunSequence;
  }) => void,
) {
  const report = buildCrewRunOutcomeReport(kitSlug, outcome, previousCompletedRuns);
  try {
    send(report.event, report.properties);
  } catch {
    // The user's local record remains useful when analytics is unavailable.
  }
  return report;
}

export function recordCrewRun(
  record: CrewProgressRecord,
  outcome: CrewRunOutcome,
  finalCheckpointIds: readonly string[],
  now = Date.now(),
): CrewProgressRecord {
  const finalIds = new Set(finalCheckpointIds);
  const checked = Object.fromEntries(
    Object.entries(record.checked).filter(([id]) => !finalIds.has(id)),
  ) as Record<string, true>;
  return {
    ...record,
    checked,
    completedRuns: record.completedRuns + 1,
    lastRunOutcome: outcome,
    lastRunAt: now,
  };
}
