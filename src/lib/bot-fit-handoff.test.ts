import { describe, expect, it, vi } from "vitest";

import { handoffBotFitDraftToBotLab } from "./bot-fit-handoff";
import {
  EMPTY_WORKSHOP_DRAFT,
  WORKSHOP_BACKUP_STORAGE_KEY,
  WORKSHOP_STORAGE_KEY,
  type WorkshopDraft,
} from "./workshop-contract";

function draft(overrides: Partial<WorkshopDraft> = {}): WorkshopDraft {
  return {
    ...EMPTY_WORKSHOP_DRAFT,
    botName: "Research Bot",
    jobOutcome: "Create a weekly research brief.",
    inputsContext: "Approved sources",
    outputsDeliverables: "A cited brief",
    cadenceTrigger: "Every Friday",
    toolsIntegrations: "Read-only web research",
    approvalBoundaries: "Ask before publishing",
    firstRunTest: "Produce one brief",
    ...overrides,
  };
}

function storage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    value(key: string) {
      return values.get(key) ?? null;
    },
  };
}

describe("handoffBotFitDraftToBotLab", () => {
  it("transfers a draft without warning for an empty or malformed stored draft", () => {
    for (const stored of [JSON.stringify(EMPTY_WORKSHOP_DRAFT), "not json"]) {
      const localStorage = storage({ [WORKSHOP_STORAGE_KEY]: stored });
      const confirm = vi.fn(() => true);

      expect(
        handoffBotFitDraftToBotLab({
          storage: localStorage,
          draft: draft(),
          confirm,
        }),
      ).toEqual({ status: "transferred", preservedPreviousDraft: false });
      expect(confirm).not.toHaveBeenCalled();
      expect(JSON.parse(localStorage.value(WORKSHOP_STORAGE_KEY)!)).toEqual(draft());
    }
  });

  it("confirms before replacing a meaningful draft and preserves it", () => {
    const existing = draft({ botName: "Existing Bot" });
    const localStorage = storage({
      [WORKSHOP_STORAGE_KEY]: JSON.stringify(existing),
    });

    expect(
      handoffBotFitDraftToBotLab({
        storage: localStorage,
        draft: draft(),
        confirm: vi.fn(() => true),
      }),
    ).toEqual({ status: "transferred", preservedPreviousDraft: true });
    expect(JSON.parse(localStorage.value(WORKSHOP_BACKUP_STORAGE_KEY)!)).toEqual(
      existing,
    );
  });

  it("leaves both drafts unchanged when confirmation is cancelled", () => {
    const existing = draft({ botName: "Existing Bot" });
    const localStorage = storage({
      [WORKSHOP_STORAGE_KEY]: JSON.stringify(existing),
    });

    expect(
      handoffBotFitDraftToBotLab({
        storage: localStorage,
        draft: draft(),
        confirm: vi.fn(() => false),
      }),
    ).toEqual({ status: "cancelled" });
    expect(localStorage.value(WORKSHOP_STORAGE_KEY)).toBe(JSON.stringify(existing));
    expect(localStorage.value(WORKSHOP_BACKUP_STORAGE_KEY)).toBeNull();
  });

  it("never replaces a meaningful existing backup", () => {
    const existing = draft({ botName: "Current Bot" });
    const backup = draft({ botName: "Older Bot" });
    const localStorage = storage({
      [WORKSHOP_STORAGE_KEY]: JSON.stringify(existing),
      [WORKSHOP_BACKUP_STORAGE_KEY]: JSON.stringify(backup),
    });

    const confirm = vi.fn(() => true);
    expect(
      handoffBotFitDraftToBotLab({
        storage: localStorage,
        draft: draft(),
        confirm,
      }),
    ).toEqual({ status: "transferred", preservedPreviousDraft: false });
    expect(confirm).toHaveBeenCalledWith(
      "Bot Lab already has a preserved draft. Open this result and replace the current draft while keeping the existing backup?",
    );
    expect(localStorage.value(WORKSHOP_BACKUP_STORAGE_KEY)).toBe(
      JSON.stringify(backup),
    );
  });

  it("reports unavailable storage without changing the draft", () => {
    const setItem = vi.fn(() => {
      throw new Error("storage denied");
    });
    const localStorage = { getItem: vi.fn(() => null), setItem };

    expect(
      handoffBotFitDraftToBotLab({
        storage: localStorage,
        draft: draft(),
        confirm: vi.fn(() => true),
      }),
    ).toEqual({ status: "unavailable" });
  });
});
