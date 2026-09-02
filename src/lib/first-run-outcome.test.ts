import { describe, expect, it, vi } from "vitest";

import {
  FIRST_BOT_RUN_EVENT,
  FIRST_BOT_RUN_OUTCOMES,
  buildFirstBotRunReport,
  sendFirstBotRunReport,
} from "./first-run-outcome";

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
});
