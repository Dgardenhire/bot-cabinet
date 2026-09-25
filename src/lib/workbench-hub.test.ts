import { describe, expect, it } from "vitest";

import { emptyBotProgress, recordBotRun } from "./bot-progress";
import { summarizeBotWorkbench, workbenchNextAction } from "./workbench-hub";

describe("workbench hub summaries", () => {
  it("keeps an untouched Bot out of the active workbench", () => {
    const summary = summarizeBotWorkbench(emptyBotProgress("2.0.0"));
    expect(summary.active).toBe(false);
    expect(summary.stage).toBe("setup");
  });

  it("shows the next setup, run, outcome and bounded-completion actions", () => {
    const started = { ...emptyBotProgress("2.0.0"), started: true as const, checked: { downloaded: true as const } };
    expect(workbenchNextAction(summarizeBotWorkbench(started))).toBe("Finish the one-time setup");

    const setupComplete = {
      ...started,
      checked: { downloaded: true as const, imported: true as const, "access-reviewed": true as const },
    };
    expect(workbenchNextAction(summarizeBotWorkbench(setupComplete))).toBe("Complete the checks for real run 1");

    const cycleComplete = {
      ...setupComplete,
      checked: { ...setupComplete.checked, "task-run": true as const, "result-reviewed": true as const },
    };
    expect(workbenchNextAction(summarizeBotWorkbench(cycleComplete))).toBe("Record the outcome for real run 1");

    const first = recordBotRun(cycleComplete, "useful", ["task-run", "result-reviewed"], 1_000);
    const second = recordBotRun(first, "needs-work", ["task-run", "result-reviewed"], 2_000);
    const third = recordBotRun(second, "useful", ["task-run", "result-reviewed"], 3_000);
    const summary = summarizeBotWorkbench(third);
    expect(summary.stage).toBe("complete");
    expect(summary.lastOutcome).toBe("useful");
    expect(summary.lastReportedAt).toBe(3_000);
    expect(workbenchNextAction(summary)).toBe("Three-run check complete");
  });
});
