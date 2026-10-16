import coverage from "../../public/proof-room/website-tasks-20261015/index.json";

type TaskAttempt = {
  id: string;
  sha256: string;
  completed: boolean;
  verdict: string;
  summary: string;
  files: { source: string; input: string; output?: string; run: string };
};

type TaskRecord = {
  id: string;
  slug: string;
  name: string;
  sha256: string;
  status: string;
  case: string;
  attempts: TaskAttempt[];
};

export const WEBSITE_TASK_COVERAGE = coverage as {
  date: string; reviewer: string; humanApproved: boolean; scope: string; records: TaskRecord[];
};
export const WEBSITE_TASK_TRIALS = WEBSITE_TASK_COVERAGE.records.filter(record => record.attempts.length);
export const getWebsiteTaskTrial = (slug: string) => WEBSITE_TASK_TRIALS.find(record => record.slug === slug);
export const WEBSITE_TASK_STATUS_NAMES: Record<string, string> = {
  "passed-sample": "Passed this sample",
  "needs-correction": "Needs correction",
  "awaiting-retest": "Correction awaiting retest",
  "not-run": "Not run in this series",
  "awaiting-review": "Answer awaiting review",
};
