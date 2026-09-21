import { describe, expect, it, vi } from "vitest";

import {
  CREW_PROGRESS_SCHEMA,
  CREW_RUN_OUTCOME_EVENT,
  buildCrewRunOutcomeReport,
  clearCrewProgress,
  emptyCrewProgress,
  readCrewProgress,
  recordCrewRun,
  saveCrewProgress,
  sendCrewRunOutcomeReport,
} from "./crew-progress";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("browser-local Crew Kit progress", () => {
  it("persists only bounded checkpoint state for one kit", () => {
    const storage = memoryStorage();
    saveCrewProgress(storage, "publishing-desk", {
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "writer:0": true, "unknown:9": true },
      completedRuns: 0,
    });
    expect(readCrewProgress(storage, "publishing-desk", ["writer:0", "crew:0"])).toEqual({
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "writer:0": true },
      completedRuns: 0,
    });
    expect(readCrewProgress(storage, "another-kit", ["writer:0"])).toEqual(emptyCrewProgress());
  });

  it("rejects malformed or unbounded stored values", () => {
    const storage = memoryStorage();
    storage.setItem("bot-cabinet-crew-progress:publishing-desk", JSON.stringify({
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "writer:0": "yes" },
      completedRuns: -1,
    }));
    expect(readCrewProgress(storage, "publishing-desk", ["writer:0"])).toEqual(emptyCrewProgress());
  });

  it("distinguishes a user-confirmed first result from repeat use", () => {
    expect(buildCrewRunOutcomeReport("publishing-desk", "useful", 0)).toEqual({
      event: CREW_RUN_OUTCOME_EVENT,
      properties: { kit: "publishing-desk", outcome: "useful", run: "first" },
    });
    expect(buildCrewRunOutcomeReport("publishing-desk", "needs-work", 1).properties.run).toBe("repeat");
  });

  it("retains setup checks and resets only manual-cycle checks after a recorded run", () => {
    const next = recordCrewRun({
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "writer:0": true, "crew:0": true, "crew:1": true },
      completedRuns: 1,
    }, "useful", ["crew:0", "crew:1"], 4_000);
    expect(next).toEqual({
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "writer:0": true },
      completedRuns: 2,
      lastRunOutcome: "useful",
      lastRunAt: 4_000,
    });
  });

  it("keeps the local result when analytics fails and can clear saved progress", () => {
    const unavailable = vi.fn(() => { throw new Error("analytics disabled"); });
    expect(() => sendCrewRunOutcomeReport("publishing-desk", "useful", 1, unavailable)).not.toThrow();
    const storage = memoryStorage();
    saveCrewProgress(storage, "publishing-desk", {
      schema: CREW_PROGRESS_SCHEMA,
      checked: { "crew:0": true },
      completedRuns: 1,
    });
    expect(clearCrewProgress(storage, "publishing-desk")).toEqual(emptyCrewProgress());
    expect(readCrewProgress(storage, "publishing-desk", ["crew:0"])).toEqual(emptyCrewProgress());
  });
});
