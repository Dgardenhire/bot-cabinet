export const THREE_RUN_TRIAL_SCHEMA = "bot-cabinet-three-run-trial/v1";
export const THREE_RUN_TRIAL_STORAGE_KEY = "bot-cabinet-three-run-trial";
export const THREE_RUN_TRIAL_LIMIT = 3;

export const TRIAL_OUTCOMES = ["used", "revised", "discarded"] as const;
export const TRIAL_SUPERVISION = ["under-5", "5-15", "16-30", "over-30"] as const;
export const TRIAL_COSTS = ["none-known", "under-1", "1-5", "over-5", "unknown"] as const;
export const TRIAL_RECOVERY = ["not-needed", "recovered", "failed"] as const;

export type TrialOutcome = (typeof TRIAL_OUTCOMES)[number];
export type TrialSupervision = (typeof TRIAL_SUPERVISION)[number];
export type TrialCost = (typeof TRIAL_COSTS)[number];
export type TrialRecovery = (typeof TRIAL_RECOVERY)[number];
export type TrialRunNumber = 1 | 2 | 3;

export type ThreeRunTrialRun = {
  run: TrialRunNumber;
  outcome: TrialOutcome;
  supervision: TrialSupervision;
  cost: TrialCost;
  recovery: TrialRecovery;
  reportedAt: number;
};

export type ThreeRunTrial = {
  schema: typeof THREE_RUN_TRIAL_SCHEMA;
  job: string;
  tool: string;
  successStandard: string;
  createdAt: number;
  runs: ThreeRunTrialRun[];
};

type TrialDraft = Pick<ThreeRunTrial, "job" | "tool" | "successStandard">;

const outcomeLabels: Record<TrialOutcome, string> = {
  used: "Used as delivered",
  revised: "Used after revision",
  discarded: "Not used",
};

const supervisionLabels: Record<TrialSupervision, string> = {
  "under-5": "Under 5 minutes",
  "5-15": "5–15 minutes",
  "16-30": "16–30 minutes",
  "over-30": "More than 30 minutes",
};

const costLabels: Record<TrialCost, string> = {
  "none-known": "$0 known marginal cost",
  "under-1": "Under $1",
  "1-5": "$1–$5",
  "over-5": "Over $5",
  unknown: "Unknown",
};

const recoveryLabels: Record<TrialRecovery, string> = {
  "not-needed": "No interruption",
  recovered: "Interrupted and recovered",
  failed: "Interrupted and did not recover",
};

function clean(value: string, limit: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, limit);
}

export function createThreeRunTrial(draft: TrialDraft, now = Date.now()): ThreeRunTrial | undefined {
  const job = clean(draft.job, 100);
  const tool = clean(draft.tool, 80);
  const successStandard = clean(draft.successStandard, 180);
  if (!job || !tool || !successStandard || !Number.isFinite(now)) return undefined;
  return { schema: THREE_RUN_TRIAL_SCHEMA, job, tool, successStandard, createdAt: now, runs: [] };
}

function isValidRun(value: unknown, index: number): value is ThreeRunTrialRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Record<string, unknown>;
  return run.run === index + 1
    && TRIAL_OUTCOMES.includes(run.outcome as TrialOutcome)
    && TRIAL_SUPERVISION.includes(run.supervision as TrialSupervision)
    && TRIAL_COSTS.includes(run.cost as TrialCost)
    && TRIAL_RECOVERY.includes(run.recovery as TrialRecovery)
    && typeof run.reportedAt === "number"
    && Number.isFinite(run.reportedAt);
}

export function readThreeRunTrial(storage: Pick<Storage, "getItem">): ThreeRunTrial | undefined {
  try {
    const value = JSON.parse(storage.getItem(THREE_RUN_TRIAL_STORAGE_KEY) ?? "null");
    if (
      !value
      || value.schema !== THREE_RUN_TRIAL_SCHEMA
      || typeof value.job !== "string"
      || typeof value.tool !== "string"
      || typeof value.successStandard !== "string"
      || !value.job.trim()
      || !value.tool.trim()
      || !value.successStandard.trim()
      || typeof value.createdAt !== "number"
      || !Number.isFinite(value.createdAt)
      || !Array.isArray(value.runs)
      || value.runs.length > THREE_RUN_TRIAL_LIMIT
      || !value.runs.every((run: unknown, index: number) => isValidRun(run, index))
    ) return undefined;
    return value as ThreeRunTrial;
  } catch {
    return undefined;
  }
}

export function saveThreeRunTrial(storage: Pick<Storage, "setItem">, trial: ThreeRunTrial) {
  try {
    storage.setItem(THREE_RUN_TRIAL_STORAGE_KEY, JSON.stringify(trial));
  } catch {
    // A storage failure must not make the visible scorecard unusable.
  }
  return trial;
}

export function clearThreeRunTrial(storage: Pick<Storage, "removeItem">) {
  try {
    storage.removeItem(THREE_RUN_TRIAL_STORAGE_KEY);
  } catch {
    // The visible scorecard can still reset when storage is unavailable.
  }
}

export function recordThreeRunTrial(
  trial: ThreeRunTrial,
  result: Omit<ThreeRunTrialRun, "run" | "reportedAt">,
  now = Date.now(),
) {
  if (trial.runs.length >= THREE_RUN_TRIAL_LIMIT || !Number.isFinite(now)) return trial;
  return {
    ...trial,
    runs: [...trial.runs, {
      ...result,
      run: (trial.runs.length + 1) as TrialRunNumber,
      reportedAt: now,
    }],
  };
}

export function summarizeThreeRunTrial(trial: ThreeRunTrial) {
  return {
    completed: trial.runs.length,
    delivered: trial.runs.filter(run => run.outcome === "used").length,
    revised: trial.runs.filter(run => run.outcome === "revised").length,
    discarded: trial.runs.filter(run => run.outcome === "discarded").length,
    recovered: trial.runs.filter(run => run.recovery === "recovered").length,
    recoveryFailures: trial.runs.filter(run => run.recovery === "failed").length,
  };
}

function markdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

export function threeRunTrialMarkdown(trial: ThreeRunTrial) {
  const summary = summarizeThreeRunTrial(trial);
  const rows = trial.runs.map(run => (
    `| ${run.run} | ${outcomeLabels[run.outcome]} | ${supervisionLabels[run.supervision]} | ${costLabels[run.cost]} | ${recoveryLabels[run.recovery]} |`
  ));
  return [
    "# Bot Cabinet Three-Run Trial",
    "",
    `- **Recurring job:** ${markdownCell(trial.job)}`,
    `- **Tool or agent:** ${markdownCell(trial.tool)}`,
    `- **Useful-result standard:** ${markdownCell(trial.successStandard)}`,
    `- **Runs recorded:** ${summary.completed}/${THREE_RUN_TRIAL_LIMIT}`,
    "",
    "| Run | Result | Human supervision | Known run cost | Recovery |",
    "| ---: | --- | --- | --- | --- |",
    ...(rows.length ? rows : ["| — | No runs recorded | — | — | — |"]),
    "",
    `Outputs used as delivered: ${summary.delivered}. Used after revision: ${summary.revised}. Not used: ${summary.discarded}.`,
    "",
    "> This is the user's three-run record, not independent verification or a reliability guarantee. Costs are user-reported ranges and may omit subscription, infrastructure or labor costs.",
    "",
  ].join("\n");
}
