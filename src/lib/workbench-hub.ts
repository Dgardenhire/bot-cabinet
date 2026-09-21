import {
  BOT_MAX_RECORDED_RUNS,
  BOT_RUN_CHECKPOINT_IDS,
  BOT_SETUP_CHECKPOINT_IDS,
  type BotProgressRecord,
} from "./bot-progress";

export type WorkbenchStage = "setup" | "run" | "outcome" | "complete";

export type WorkbenchSummary = {
  active: boolean;
  setupCompleted: number;
  runChecksCompleted: number;
  outcomesCompleted: number;
  nextRun: number;
  stage: WorkbenchStage;
  lastOutcome?: "useful" | "needs-work";
  lastReportedAt: number;
};

export function summarizeBotWorkbench(record: BotProgressRecord): WorkbenchSummary {
  const setupCompleted = BOT_SETUP_CHECKPOINT_IDS.filter(id => record.checked[id]).length;
  const runChecksCompleted = BOT_RUN_CHECKPOINT_IDS.filter(id => record.checked[id]).length;
  const outcomesCompleted = record.runs.length;
  const active = Boolean(record.started || setupCompleted || runChecksCompleted || outcomesCompleted);
  const nextRun = Math.min(outcomesCompleted + 1, BOT_MAX_RECORDED_RUNS);
  const lastRun = record.runs[record.runs.length - 1];
  let stage: WorkbenchStage = "setup";
  if (outcomesCompleted >= BOT_MAX_RECORDED_RUNS) stage = "complete";
  else if (setupCompleted === BOT_SETUP_CHECKPOINT_IDS.length) {
    stage = runChecksCompleted === BOT_RUN_CHECKPOINT_IDS.length ? "outcome" : "run";
  }
  return {
    active,
    setupCompleted,
    runChecksCompleted,
    outcomesCompleted,
    nextRun,
    stage,
    lastOutcome: lastRun?.outcome,
    lastReportedAt: lastRun?.reportedAt ?? 0,
  };
}

export function workbenchNextAction(summary: WorkbenchSummary) {
  if (summary.stage === "setup") return "Finish the one-time setup";
  if (summary.stage === "run") return `Complete the checks for real run ${summary.nextRun}`;
  if (summary.stage === "outcome") return `Record the outcome for real run ${summary.nextRun}`;
  return "Three-run check complete";
}
