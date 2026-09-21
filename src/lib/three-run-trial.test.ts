import { describe, expect, it } from "vitest";

import {
  THREE_RUN_TRIAL_LIMIT,
  THREE_RUN_TRIAL_STORAGE_KEY,
  createThreeRunTrial,
  readThreeRunTrial,
  recordThreeRunTrial,
  summarizeThreeRunTrial,
  threeRunTrialMarkdown,
} from "./three-run-trial";

function memoryStorage(initial?: string) {
  let value = initial ?? null;
  return {
    getItem: (key: string) => key === THREE_RUN_TRIAL_STORAGE_KEY ? value : null,
    setItem: (key: string, next: string) => { if (key === THREE_RUN_TRIAL_STORAGE_KEY) value = next; },
    removeItem: (key: string) => { if (key === THREE_RUN_TRIAL_STORAGE_KEY) value = null; },
  };
}

const run = {
  outcome: "used" as const,
  supervision: "under-5" as const,
  cost: "under-1" as const,
  recovery: "not-needed" as const,
};

describe("Three-Run Trial", () => {
  it("requires one job, tool and useful-result standard and trims the local labels", () => {
    expect(createThreeRunTrial({ job: "", tool: "Hermes", successStandard: "A usable brief" })).toBeUndefined();
    expect(createThreeRunTrial({ job: "  Monday   brief  ", tool: " Hermes ", successStandard: "  Ready to send " }, 10)).toMatchObject({
      job: "Monday brief",
      tool: "Hermes",
      successStandard: "Ready to send",
      createdAt: 10,
      runs: [],
    });
  });

  it("records no more than three ordered real uses and summarizes outcomes", () => {
    let trial = createThreeRunTrial({ job: "Brief", tool: "Agent", successStandard: "Used" }, 1)!;
    trial = recordThreeRunTrial(trial, run, 2);
    trial = recordThreeRunTrial(trial, { ...run, outcome: "revised", recovery: "recovered" }, 3);
    trial = recordThreeRunTrial(trial, { ...run, outcome: "discarded", recovery: "failed" }, 4);
    const unchanged = recordThreeRunTrial(trial, run, 5);

    expect(unchanged.runs).toHaveLength(THREE_RUN_TRIAL_LIMIT);
    expect(unchanged.runs.map(item => item.run)).toEqual([1, 2, 3]);
    expect(summarizeThreeRunTrial(unchanged)).toEqual({
      completed: 3,
      delivered: 1,
      revised: 1,
      discarded: 1,
      recovered: 1,
      recoveryFailures: 1,
    });
  });

  it("rejects malformed browser data instead of inventing progress", () => {
    expect(readThreeRunTrial(memoryStorage("not json"))).toBeUndefined();
    expect(readThreeRunTrial(memoryStorage(JSON.stringify({ schema: "wrong", runs: [] })))).toBeUndefined();
  });

  it("exports a readable record while preserving the evidence boundary", () => {
    let trial = createThreeRunTrial({ job: "Morning | brief", tool: "Existing tool", successStandard: "Read before 8" }, 1)!;
    trial = recordThreeRunTrial(trial, run, 2);
    const markdown = threeRunTrialMarkdown(trial);

    expect(markdown).toContain("Morning \\| brief");
    expect(markdown).toContain("Used as delivered");
    expect(markdown).toContain("Under 5 minutes");
    expect(markdown).toContain("not independent verification or a reliability guarantee");
  });
});
