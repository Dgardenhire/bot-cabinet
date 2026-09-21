import { describe, expect, it, vi } from "vitest";

import {
  BOT_PROGRESS_SCHEMA,
  BOT_RUN_OUTCOME_EVENT,
  BOT_WORKBENCH_STARTED_EVENT,
  botProgressStorageKey,
  buildBotWorkbenchStartedReport,
  buildBotRunOutcomeReport,
  clearBotProgress,
  emptyBotProgress,
  markBotProgressStarted,
  readBotProgress,
  recordBotRun,
  saveBotProgress,
  sendBotRunOutcomeReport,
  sendBotWorkbenchStartedReport,
} from "./bot-progress";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("standalone Bot progress", () => {
  const checkpoints = ["downloaded", "imported", "access-reviewed", "task-run", "result-reviewed"];

  it("isolates progress by Bot and pack version", () => {
    const storage = memoryStorage();
    const record = { ...emptyBotProgress("2.0.0"), checked: { downloaded: true as const } };
    saveBotProgress(storage, "scout", record);
    expect(readBotProgress(storage, "scout", "2.0.0", checkpoints)).toEqual(record);
    expect(readBotProgress(storage, "writer", "2.0.0", checkpoints)).toEqual(emptyBotProgress("2.0.0"));
    expect(readBotProgress(storage, "scout", "2.1.0", checkpoints)).toEqual(emptyBotProgress("2.1.0"));
    expect(botProgressStorageKey("scout")).toBe("bot-cabinet-bot-progress:scout");
  });

  it("filters unknown checkpoints and rejects malformed run history", () => {
    const storage = memoryStorage();
    storage.setItem(botProgressStorageKey("scout"), JSON.stringify({
      schema: BOT_PROGRESS_SCHEMA,
      packVersion: "2.0.0",
      checked: { downloaded: true, unknown: true },
      runs: [{ run: 2, outcome: "useful", reportedAt: 1 }],
    }));
    expect(readBotProgress(storage, "scout", "2.0.0", checkpoints)).toEqual(emptyBotProgress("2.0.0"));

    storage.setItem(botProgressStorageKey("scout"), JSON.stringify({
      schema: BOT_PROGRESS_SCHEMA,
      packVersion: "2.0.0",
      checked: { downloaded: true, unknown: true },
      runs: [],
    }));
    expect(readBotProgress(storage, "scout", "2.0.0", checkpoints).checked).toEqual({ downloaded: true });
  });

  it("keeps setup checks, resets run checks, and stops after three outcomes", () => {
    const initial = {
      ...emptyBotProgress("2.0.0"),
      checked: Object.fromEntries(checkpoints.map(id => [id, true])) as Record<string, true>,
    };
    const first = recordBotRun(initial, "useful", ["task-run", "result-reviewed"], 1_000);
    expect(first.checked).toEqual({ downloaded: true, imported: true, "access-reviewed": true });
    expect(first.runs).toEqual([{ run: 1, outcome: "useful", reportedAt: 1_000 }]);
    const second = recordBotRun(first, "needs-work", ["task-run", "result-reviewed"], 2_000);
    const third = recordBotRun(second, "useful", ["task-run", "result-reviewed"], 3_000);
    expect(recordBotRun(third, "useful", ["task-run", "result-reviewed"], 4_000)).toBe(third);
    expect(third.runs.map(run => run.run)).toEqual([1, 2, 3]);
  });

  it("marks a workbench started once and reports only the public Bot and pack identifiers", () => {
    const initial = emptyBotProgress("2.0.0");
    const started = markBotProgressStarted(initial);
    expect(started.started).toBe(true);
    expect(markBotProgressStarted(started)).toBe(started);
    expect(buildBotWorkbenchStartedReport("scout", "2.0.0")).toEqual({
      event: BOT_WORKBENCH_STARTED_EVENT,
      properties: { bot: "scout", packVersion: "2.0.0" },
    });
    const send = vi.fn();
    sendBotWorkbenchStartedReport("scout", "2.0.0", false, send);
    expect(send).toHaveBeenCalledWith(BOT_WORKBENCH_STARTED_EVENT, {
      bot: "scout",
      packVersion: "2.0.0",
    });
    expect(sendBotWorkbenchStartedReport("scout", "2.0.0", true, send)).toBeUndefined();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("reports only bounded public identifiers and outcomes", () => {
    expect(buildBotRunOutcomeReport("scout", "2.0.0", "useful", 1)).toEqual({
      event: BOT_RUN_OUTCOME_EVENT,
      properties: { bot: "scout", packVersion: "2.0.0", outcome: "useful", run: 2 },
    });
    const send = vi.fn();
    sendBotRunOutcomeReport("scout", "2.0.0", "needs-work", 0, send);
    expect(send).toHaveBeenCalledWith(BOT_RUN_OUTCOME_EVENT, {
      bot: "scout",
      packVersion: "2.0.0",
      outcome: "needs-work",
      run: 1,
    });
    expect(sendBotRunOutcomeReport("scout", "2.0.0", "useful", 3, send)).toBeUndefined();
  });

  it("clears one Bot record without affecting another", () => {
    const storage = memoryStorage();
    saveBotProgress(storage, "scout", emptyBotProgress("2.0.0"));
    saveBotProgress(storage, "writer", emptyBotProgress("2.0.1"));
    expect(clearBotProgress(storage, "scout", "2.0.0")).toEqual(emptyBotProgress("2.0.0"));
    expect(storage.getItem(botProgressStorageKey("scout"))).toBeNull();
    expect(storage.getItem(botProgressStorageKey("writer"))).not.toBeNull();
  });
});
