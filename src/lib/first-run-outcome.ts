export const FIRST_BOT_RUN_EVENT = "first_bot_run_reported";
export const FIRST_BOT_RUN_FRICTION_EVENT = "first_bot_run_friction_reported";
export const REPEAT_BOT_RUN_EVENT = "repeat_bot_run_reported";
export const RETURN_AFTER_FIRST_RESULT_EVENT = "returned_after_first_bot_result";
export const FIRST_BOT_RUN_STORAGE_KEY = "bot-cabinet-first-bot-run-outcome";
export const FIRST_BOT_RUN_OUTCOMES = ["worked", "stuck"] as const;
export const REPEAT_BOT_RUN_OUTCOMES = ["usable", "needed-fixing"] as const;
export const FIRST_BOT_RUN_FRICTION_REASONS = [
  "install-hermes",
  "connect-provider",
  "import-profile",
  "run-assignment",
  "check-result",
  "something-else",
] as const;

const RETURN_THRESHOLD_MS = 12 * 60 * 60 * 1000;

export type FirstBotRunOutcome = (typeof FIRST_BOT_RUN_OUTCOMES)[number];
export type RepeatBotRunOutcome = (typeof REPEAT_BOT_RUN_OUTCOMES)[number];
export type RepeatBotRunNumber = 2 | 3;
export type FirstBotRunFrictionReason = (typeof FIRST_BOT_RUN_FRICTION_REASONS)[number];
export type ReturnElapsedBucket = "next-day" | "within-week" | "later";

export type FirstBotRunRecord = {
  outcome: FirstBotRunOutcome;
  reportedAt: number;
  returnTrackedAt?: number;
  repeatRuns?: {
    run: RepeatBotRunNumber;
    outcome: RepeatBotRunOutcome;
    reportedAt: number;
  }[];
};

type MinimalStorage = Pick<Storage, "getItem" | "setItem">;

export function buildFirstBotRunReport(outcome: FirstBotRunOutcome) {
  return {
    event: FIRST_BOT_RUN_EVENT,
    properties: { outcome },
  } as const;
}

export function sendFirstBotRunReport(
  outcome: FirstBotRunOutcome,
  send: (event: string, properties: { outcome: FirstBotRunOutcome }) => void,
) {
  const report = buildFirstBotRunReport(outcome);
  try {
    send(report.event, report.properties);
  } catch {
    // The answer remains visible in the interface when analytics is unavailable.
  }
  return report;
}

export function buildFirstBotRunFrictionReport(reason: FirstBotRunFrictionReason) {
  return {
    event: FIRST_BOT_RUN_FRICTION_EVENT,
    properties: { reason },
  } as const;
}

export function sendFirstBotRunFrictionReport(
  reason: FirstBotRunFrictionReason,
  send: (event: string, properties: { reason: FirstBotRunFrictionReason }) => void,
) {
  const report = buildFirstBotRunFrictionReport(reason);
  try {
    send(report.event, report.properties);
  } catch {
    // The interface remains usable when analytics is unavailable.
  }
  return report;
}

export function saveFirstBotRunRecord(
  storage: MinimalStorage,
  outcome: FirstBotRunOutcome,
  reportedAt = Date.now(),
) {
  const record: FirstBotRunRecord = { outcome, reportedAt };
  try {
    storage.setItem(FIRST_BOT_RUN_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Local return measurement is optional and must not block the outcome report.
  }
  return record;
}

export function reportFirstBotRunOnce(
  storage: MinimalStorage,
  outcome: FirstBotRunOutcome,
  send: (event: string, properties: { outcome: FirstBotRunOutcome }) => void,
  reportedAt = Date.now(),
) {
  const existing = readFirstBotRunRecord(storage);
  if (existing) return { record: existing, sent: false } as const;
  const record = saveFirstBotRunRecord(storage, outcome, reportedAt);
  sendFirstBotRunReport(outcome, send);
  return { record, sent: true } as const;
}

export function readFirstBotRunRecord(storage: MinimalStorage): FirstBotRunRecord | undefined {
  try {
    const value = JSON.parse(storage.getItem(FIRST_BOT_RUN_STORAGE_KEY) ?? "null");
    if (
      !value
      || !FIRST_BOT_RUN_OUTCOMES.includes(value.outcome)
      || typeof value.reportedAt !== "number"
      || !Number.isFinite(value.reportedAt)
      || (value.returnTrackedAt !== undefined && (
        typeof value.returnTrackedAt !== "number" || !Number.isFinite(value.returnTrackedAt)
      ))
      || (value.repeatRuns !== undefined && !isValidRepeatRuns(value.repeatRuns))
    ) return undefined;
    return value as FirstBotRunRecord;
  } catch {
    return undefined;
  }
}

function isValidRepeatRuns(value: unknown): value is NonNullable<FirstBotRunRecord["repeatRuns"]> {
  if (!Array.isArray(value) || value.length > 2) return false;
  return value.every((run, index) => (
    run
    && run.run === index + 2
    && REPEAT_BOT_RUN_OUTCOMES.includes(run.outcome)
    && typeof run.reportedAt === "number"
    && Number.isFinite(run.reportedAt)
  ));
}

export function nextRepeatBotRun(
  record: FirstBotRunRecord | undefined,
  now = Date.now(),
): RepeatBotRunNumber | undefined {
  if (!record || record.outcome !== "worked") return undefined;
  const repeatRuns = record.repeatRuns ?? [];
  if (repeatRuns.length >= 2) return undefined;
  const lastReportedAt = repeatRuns.at(-1)?.reportedAt ?? record.reportedAt;
  if (now - lastReportedAt < RETURN_THRESHOLD_MS) return undefined;
  return (repeatRuns.length + 2) as RepeatBotRunNumber;
}

export function reportRepeatBotRun(
  storage: MinimalStorage,
  outcome: RepeatBotRunOutcome,
  send: (event: string, properties: { run: RepeatBotRunNumber; outcome: RepeatBotRunOutcome }) => void,
  reportedAt = Date.now(),
) {
  const current = readFirstBotRunRecord(storage);
  const run = nextRepeatBotRun(current, reportedAt);
  if (!current || !run) return undefined;
  const record: FirstBotRunRecord = {
    ...current,
    repeatRuns: [...(current.repeatRuns ?? []), { run, outcome, reportedAt }],
  };
  try {
    storage.setItem(FIRST_BOT_RUN_STORAGE_KEY, JSON.stringify(record));
    send(REPEAT_BOT_RUN_EVENT, { run, outcome });
  } catch {
    return undefined;
  }
  return { event: REPEAT_BOT_RUN_EVENT, properties: { run, outcome }, record } as const;
}

export function returnElapsedBucket(elapsedMs: number): ReturnElapsedBucket {
  if (elapsedMs < 48 * 60 * 60 * 1000) return "next-day";
  if (elapsedMs < 8 * 24 * 60 * 60 * 1000) return "within-week";
  return "later";
}

export function trackReturningVisit(
  storage: MinimalStorage,
  send: (event: string, properties: { elapsed: ReturnElapsedBucket }) => void,
  now = Date.now(),
) {
  const record = readFirstBotRunRecord(storage);
  if (!record || record.outcome !== "worked" || record.returnTrackedAt) return undefined;
  const elapsedMs = now - record.reportedAt;
  if (elapsedMs < RETURN_THRESHOLD_MS) return undefined;
  const elapsed = returnElapsedBucket(elapsedMs);
  try {
    send(RETURN_AFTER_FIRST_RESULT_EVENT, { elapsed });
    storage.setItem(
      FIRST_BOT_RUN_STORAGE_KEY,
      JSON.stringify({ ...record, returnTrackedAt: now }),
    );
  } catch {
    return undefined;
  }
  return { event: RETURN_AFTER_FIRST_RESULT_EVENT, properties: { elapsed } } as const;
}
