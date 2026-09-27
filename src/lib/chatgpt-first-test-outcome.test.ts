import { describe, expect, it, vi } from "vitest";

import {
  CHATGPT_FIRST_TEST_EVENT,
  firstTestStorageKey,
  readChatGPTFirstTestOutcome,
  reportChatGPTFirstTestOnce,
} from "./chatgpt-first-test-outcome";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe("ChatGPT first-test outcome", () => {
  it("records a visitor-reported result only once per Bot", () => {
    const local = storage();
    const send = vi.fn();
    expect(reportChatGPTFirstTestOnce(local, "chief-of-staff", "worked", send)).toEqual({ outcome: "worked", sent: true });
    expect(reportChatGPTFirstTestOnce(local, "chief-of-staff", "stuck", send)).toEqual({ outcome: "worked", sent: false });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(CHATGPT_FIRST_TEST_EVENT, { bot: "chief-of-staff", outcome: "worked" });
    expect(local.getItem(firstTestStorageKey("chief-of-staff"))).toBe("worked");
  });

  it("keeps results separate across Bots and ignores invalid stored values", () => {
    const local = storage();
    const send = vi.fn();
    local.setItem(firstTestStorageKey("scout"), "not-a-result");
    expect(readChatGPTFirstTestOutcome(local, "scout")).toBeUndefined();
    reportChatGPTFirstTestOnce(local, "scout", "stuck", send);
    reportChatGPTFirstTestOnce(local, "chief-of-staff", "worked", send);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
