import { describe, expect, it } from "vitest";

import {
  AGENT_WATCH_PROGRESS_STORAGE_KEY,
  AGENT_WATCH_RETURN_AFTER_MS,
  beginAgentWatchVisit,
  markAgentWatchSeen,
  readAgentWatchProgress,
} from "./agent-watch-progress";

function memoryStorage(initial?: string) {
  let value = initial ?? null;
  return {
    getItem: (key: string) => key === AGENT_WATCH_PROGRESS_STORAGE_KEY ? value : null,
    setItem: (key: string, next: string) => { if (key === AGENT_WATCH_PROGRESS_STORAGE_KEY) value = next; },
  };
}

describe("Agent Watch browser progress", () => {
  it("saves the current note IDs on the first browser visit", () => {
    const storage = memoryStorage();
    const visit = beginAgentWatchVisit(storage, ["one-note", "two-note"], 100);

    expect(visit.firstVisit).toBe(true);
    expect(visit.returnVisit).toBe(false);
    expect(visit.newSlugs).toEqual([]);
    expect(readAgentWatchProgress(storage)?.seenSlugs).toEqual(["one-note", "two-note"]);
  });

  it("shows new notes without calling a same-day reload a return visit", () => {
    const storage = memoryStorage();
    beginAgentWatchVisit(storage, ["one-note"], 100);
    const visit = beginAgentWatchVisit(storage, ["one-note", "new-note"], 200);

    expect(visit.firstVisit).toBe(false);
    expect(visit.returnVisit).toBe(false);
    expect(visit.newSlugs).toEqual(["new-note"]);
  });

  it("reports a return only after twelve hours and keeps new notes unseen", () => {
    const storage = memoryStorage();
    beginAgentWatchVisit(storage, ["one-note"], 100);
    const visit = beginAgentWatchVisit(
      storage,
      ["one-note", "new-note"],
      100 + AGENT_WATCH_RETURN_AFTER_MS,
    );

    expect(visit.returnVisit).toBe(true);
    expect(visit.newSlugs).toEqual(["new-note"]);
    expect(visit.record.seenSlugs).toEqual(["one-note"]);
  });

  it("marks only the current public note IDs as seen", () => {
    const storage = memoryStorage();
    const first = beginAgentWatchVisit(storage, ["one-note"], 100);
    markAgentWatchSeen(storage, first.record, ["one-note", "new-note", "new-note", "Not valid"]);
    const saved = readAgentWatchProgress(storage);

    expect(saved?.seenSlugs).toEqual(["one-note", "new-note"]);
  });

  it("fails closed on malformed browser data", () => {
    expect(readAgentWatchProgress(memoryStorage("not json"))).toBeUndefined();
    expect(readAgentWatchProgress(memoryStorage(JSON.stringify({ schema: "wrong" })))).toBeUndefined();
  });
});
