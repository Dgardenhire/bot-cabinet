export const CHATGPT_FIRST_TEST_EVENT = "chatgpt_agent_first_test_reported";

export type ChatGPTFirstTestOutcome = "worked" | "stuck";

type MinimalStorage = Pick<Storage, "getItem" | "setItem">;

export function firstTestStorageKey(bot: string) {
  return `bot-cabinet-chatgpt-first-test:${bot}`;
}

export function readChatGPTFirstTestOutcome(
  storage: Pick<Storage, "getItem">,
  bot: string,
): ChatGPTFirstTestOutcome | undefined {
  try {
    const value = storage.getItem(firstTestStorageKey(bot));
    return value === "worked" || value === "stuck" ? value : undefined;
  } catch {
    return undefined;
  }
}

/** A visitor's own report, never a claim that Cabinet tested the Workspace Agent. */
export function reportChatGPTFirstTestOnce(
  storage: MinimalStorage,
  bot: string,
  outcome: ChatGPTFirstTestOutcome,
  send: (event: string, properties: { bot: string; outcome: ChatGPTFirstTestOutcome }) => void,
) {
  const previous = readChatGPTFirstTestOutcome(storage, bot);
  if (previous) return { outcome: previous, sent: false } as const;
  try {
    storage.setItem(firstTestStorageKey(bot), outcome);
  } catch {
    // The visitor may still report a result when private browsing blocks storage.
  }
  try {
    send(CHATGPT_FIRST_TEST_EVENT, { bot, outcome });
    return { outcome, sent: true } as const;
  } catch {
    return { outcome, sent: false } as const;
  }
}
