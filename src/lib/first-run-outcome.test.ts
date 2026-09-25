import { describe, expect, it, vi } from "vitest";

import {
  FIRST_BOT_RUN_EVENT,
  FIRST_BOT_RUN_FRICTION_EVENT,
  FIRST_BOT_RUN_STORAGE_KEY,
  FIRST_BOT_RUN_OUTCOMES,
  REPEAT_BOT_RUN_EVENT,
  buildFirstBotRunFrictionReport,
  buildFirstBotRunReport,
  readFirstBotRunRecord,
  nextRepeatBotRun,
  reportRepeatBotRun,
  reportFirstBotRunOnce,
  saveFirstBotRunRecord,
  sendFirstBotRunFrictionReport,
  sendFirstBotRunReport,
  trackReturningVisit,
} from "./first-run-outcome";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("first Bot run outcome event contract", () => {
  it("allows only the two disclosed outcomes", () => {
    expect(FIRST_BOT_RUN_OUTCOMES).toEqual(["worked", "stuck"]);
  });

  it.each(FIRST_BOT_RUN_OUTCOMES)("builds the minimal %s report", (outcome) => {
    const report = buildFirstBotRunReport(outcome);
    expect(report).toEqual({
      event: "first_bot_run_reported",
      properties: { outcome },
    });
    expect(report.event).toBe(FIRST_BOT_RUN_EVENT);
    expect(Object.keys(report.properties)).toEqual(["outcome"]);
  });

  it("uses the exact event contract and does not fail the interface when analytics is unavailable", () => {
    const send = vi.fn();
    sendFirstBotRunReport("worked", send);
    expect(send).toHaveBeenCalledWith("first_bot_run_reported", { outcome: "worked" });

    const unavailable = vi.fn(() => {
      throw new Error("analytics disabled");
    });
    expect(() => sendFirstBotRunReport("stuck", unavailable)).not.toThrow();
  });

  it("records one bounded friction reason without visitor text", () => {
    expect(buildFirstBotRunFrictionReport("import-profile")).toEqual({
      event: FIRST_BOT_RUN_FRICTION_EVENT,
      properties: { reason: "import-profile" },
    });
    const send = vi.fn();
    sendFirstBotRunFrictionReport("check-result", send);
    expect(send).toHaveBeenCalledWith(FIRST_BOT_RUN_FRICTION_EVENT, { reason: "check-result" });
  });

  it("stores only the bounded outcome and timestamp", () => {
    const storage = memoryStorage();
    saveFirstBotRunRecord(storage, "worked", 1_000);
    expect(readFirstBotRunRecord(storage)).toEqual({ outcome: "worked", reportedAt: 1_000 });
    expect(JSON.parse(storage.getItem(FIRST_BOT_RUN_STORAGE_KEY)!)).toEqual({
      outcome: "worked",
      reportedAt: 1_000,
    });
  });

  it("reports a first result only once per browser record", () => {
    const storage = memoryStorage();
    const send = vi.fn();
    expect(reportFirstBotRunOnce(storage, "worked", send, 1_000)).toEqual({
      record: { outcome: "worked", reportedAt: 1_000 },
      sent: true,
    });
    expect(reportFirstBotRunOnce(storage, "stuck", send, 2_000)).toEqual({
      record: { outcome: "worked", reportedAt: 1_000 },
      sent: false,
    });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(FIRST_BOT_RUN_EVENT, { outcome: "worked" });
  });

  it("tracks a later return once and does not call it repeat use", () => {
    const storage = memoryStorage();
    const send = vi.fn();
    saveFirstBotRunRecord(storage, "worked", 1_000);
    expect(trackReturningVisit(storage, send, 1_000 + 11 * 60 * 60 * 1000)).toBeUndefined();
    expect(trackReturningVisit(storage, send, 1_000 + 24 * 60 * 60 * 1000)).toEqual({
      event: "returned_after_first_bot_result",
      properties: { elapsed: "next-day" },
    });
    expect(trackReturningVisit(storage, send, 1_000 + 48 * 60 * 60 * 1000)).toBeUndefined();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("does not treat a return after a stuck report as a success signal", () => {
    const storage = memoryStorage();
    const send = vi.fn();
    saveFirstBotRunRecord(storage, "stuck", 1_000);
    expect(trackReturningVisit(storage, send, 1_000 + 24 * 60 * 60 * 1000)).toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("offers bounded second and third real-run checkpoints, not an unlimited counter", () => {
    const storage = memoryStorage();
    const send = vi.fn();
    const halfDay = 12 * 60 * 60 * 1000;
    saveFirstBotRunRecord(storage, "worked", 1_000);

    expect(nextRepeatBotRun(readFirstBotRunRecord(storage), 1_000 + halfDay - 1)).toBeUndefined();
    expect(nextRepeatBotRun(readFirstBotRunRecord(storage), 1_000 + halfDay)).toBe(2);

    const second = reportRepeatBotRun(storage, "usable", send, 1_000 + halfDay);
    expect(second?.properties).toEqual({ run: 2, outcome: "usable" });
    expect(send).toHaveBeenLastCalledWith(REPEAT_BOT_RUN_EVENT, { run: 2, outcome: "usable" });
    expect(nextRepeatBotRun(readFirstBotRunRecord(storage), 1_000 + 2 * halfDay)).toBe(3);

    const third = reportRepeatBotRun(storage, "needed-fixing", send, 1_000 + 2 * halfDay);
    expect(third?.properties).toEqual({ run: 3, outcome: "needed-fixing" });
    expect(nextRepeatBotRun(readFirstBotRunRecord(storage), 1_000 + 3 * halfDay)).toBeUndefined();
    expect(readFirstBotRunRecord(storage)?.repeatRuns).toEqual([
      { run: 2, outcome: "usable", reportedAt: 1_000 + halfDay },
      { run: 3, outcome: "needed-fixing", reportedAt: 1_000 + 2 * halfDay },
    ]);
  });

  it("never asks for repeat-use evidence after a stuck first run", () => {
    const storage = memoryStorage();
    const send = vi.fn();
    saveFirstBotRunRecord(storage, "stuck", 1_000);
    expect(nextRepeatBotRun(readFirstBotRunRecord(storage), 100_000_000)).toBeUndefined();
    expect(reportRepeatBotRun(storage, "usable", send, 100_000_000)).toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed repeat-run history instead of treating it as evidence", () => {
    const storage = memoryStorage();
    storage.setItem(FIRST_BOT_RUN_STORAGE_KEY, JSON.stringify({
      outcome: "worked",
      reportedAt: 1_000,
      repeatRuns: [{ run: 3, outcome: "usable", reportedAt: 2_000 }],
    }));
    expect(readFirstBotRunRecord(storage)).toBeUndefined();
  });
});
