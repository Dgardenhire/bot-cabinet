export const BOT_PROGRESS_SCHEMA = "bot-cabinet-bot-progress/v1";
export const BOT_WORKBENCH_STARTED_EVENT = "bot_workbench_started";
export const BOT_RUN_OUTCOME_EVENT = "bot_real_run_outcome_reported";
export const BOT_RUN_OUTCOMES = ["useful", "needs-work"] as const;
export const BOT_MAX_RECORDED_RUNS = 3;
export const BOT_SETUP_CHECKPOINT_IDS = ["downloaded", "imported", "access-reviewed"] as const;
export const BOT_RUN_CHECKPOINT_IDS = ["task-run", "result-reviewed"] as const;
export const BOT_CHECKPOINT_IDS = [...BOT_SETUP_CHECKPOINT_IDS, ...BOT_RUN_CHECKPOINT_IDS] as const;

export type BotRunOutcome = (typeof BOT_RUN_OUTCOMES)[number];
export type BotRunNumber = 1 | 2 | 3;

export type BotProgressRecord = {
  schema: typeof BOT_PROGRESS_SCHEMA;
  packVersion: string;
  started?: true;
  checked: Record<string, true>;
  runs: {
    run: BotRunNumber;
    outcome: BotRunOutcome;
    reportedAt: number;
  }[];
};

type MinimalStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function botProgressStorageKey(botSlug: string) {
  return `bot-cabinet-bot-progress:${botSlug}`;
}

export function emptyBotProgress(packVersion: string): BotProgressRecord {
  return {
    schema: BOT_PROGRESS_SCHEMA,
    packVersion,
    checked: {},
    runs: [],
  };
}

export function readBotProgress(
  storage: Pick<Storage, "getItem">,
  botSlug: string,
  packVersion: string,
  validCheckpointIds: readonly string[],
): BotProgressRecord {
  try {
    const value = JSON.parse(storage.getItem(botProgressStorageKey(botSlug)) ?? "null");
    if (
      !value
      || value.schema !== BOT_PROGRESS_SCHEMA
      || value.packVersion !== packVersion
      || (value.started !== undefined && value.started !== true)
      || !value.checked
      || typeof value.checked !== "object"
      || Array.isArray(value.checked)
      || !Array.isArray(value.runs)
      || value.runs.length > BOT_MAX_RECORDED_RUNS
      || !value.runs.every((run: unknown, index: number) => isValidRun(run, index))
    ) return emptyBotProgress(packVersion);
    const valid = new Set(validCheckpointIds);
    const checked = Object.fromEntries(
      Object.entries(value.checked).filter(([id, state]) => valid.has(id) && state === true),
    ) as Record<string, true>;
    return { ...value, checked } as BotProgressRecord;
  } catch {
    return emptyBotProgress(packVersion);
  }
}

export function markBotProgressStarted(record: BotProgressRecord): BotProgressRecord {
  return record.started ? record : { ...record, started: true };
}

export function buildBotWorkbenchStartedReport(botSlug: string, packVersion: string) {
  return {
    event: BOT_WORKBENCH_STARTED_EVENT,
    properties: { bot: botSlug, packVersion },
  } as const;
}

export function sendBotWorkbenchStartedReport(
  botSlug: string,
  packVersion: string,
  alreadyStarted: boolean,
  send: (event: string, properties: { bot: string; packVersion: string }) => void,
) {
  if (alreadyStarted) return undefined;
  const report = buildBotWorkbenchStartedReport(botSlug, packVersion);
  try {
    send(report.event, report.properties);
  } catch {
    // The local workbench remains useful when analytics is unavailable.
  }
  return report;
}

function isValidRun(value: unknown, index: number) {
  if (!value || typeof value !== "object") return false;
  const run = value as Record<string, unknown>;
  return run.run === index + 1
    && BOT_RUN_OUTCOMES.includes(run.outcome as BotRunOutcome)
    && typeof run.reportedAt === "number"
    && Number.isFinite(run.reportedAt);
}

export function saveBotProgress(storage: Pick<Storage, "setItem">, botSlug: string, record: BotProgressRecord) {
  try {
    storage.setItem(botProgressStorageKey(botSlug), JSON.stringify(record));
  } catch {
    // Local progress must never block the page.
  }
  return record;
}

export function clearBotProgress(storage: MinimalStorage, botSlug: string, packVersion: string) {
  try {
    storage.removeItem(botProgressStorageKey(botSlug));
  } catch {
    // The visible workbench can still reset when storage is unavailable.
  }
  return emptyBotProgress(packVersion);
}

export function recordBotRun(
  record: BotProgressRecord,
  outcome: BotRunOutcome,
  runCheckpointIds: readonly string[],
  now = Date.now(),
): BotProgressRecord {
  if (record.runs.length >= BOT_MAX_RECORDED_RUNS) return record;
  const resetIds = new Set(runCheckpointIds);
  const checked = Object.fromEntries(
    Object.entries(record.checked).filter(([id]) => !resetIds.has(id)),
  ) as Record<string, true>;
  return {
    ...record,
    checked,
    runs: [...record.runs, {
      run: (record.runs.length + 1) as BotRunNumber,
      outcome,
      reportedAt: now,
    }],
  };
}

export function buildBotRunOutcomeReport(
  botSlug: string,
  packVersion: string,
  outcome: BotRunOutcome,
  previousRuns: number,
) {
  return {
    event: BOT_RUN_OUTCOME_EVENT,
    properties: {
      bot: botSlug,
      packVersion,
      outcome,
      run: (previousRuns + 1) as BotRunNumber,
    },
  } as const;
}

export function sendBotRunOutcomeReport(
  botSlug: string,
  packVersion: string,
  outcome: BotRunOutcome,
  previousRuns: number,
  send: (event: string, properties: {
    bot: string;
    packVersion: string;
    outcome: BotRunOutcome;
    run: BotRunNumber;
  }) => void,
) {
  if (previousRuns >= BOT_MAX_RECORDED_RUNS) return undefined;
  const report = buildBotRunOutcomeReport(botSlug, packVersion, outcome, previousRuns);
  try {
    send(report.event, report.properties);
  } catch {
    // The local workbench remains useful when analytics is unavailable.
  }
  return report;
}
