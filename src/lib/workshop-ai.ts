import type { WorkshopDraft } from "./workshop";

export const WORKSHOP_AI_LIST_KEYS = [
  "inputsContext",
  "outputsDeliverables",
  "toolsIntegrations",
  "approvalBoundaries",
] as const;

export const WORKSHOP_AI_TEXT_KEYS = [
  "cadenceTrigger",
  "firstRunTest",
  "audienceSuccess",
  "accessSensitive",
  "prohibitedUncertainty",
  "continuityMemory",
  "reviewCriteria",
  "profileTitle",
  "profileDescription",
  "roleInstructions",
] as const;

export type WorkshopAiListKey = (typeof WORKSHOP_AI_LIST_KEYS)[number];
export type WorkshopAiTextKey = (typeof WORKSHOP_AI_TEXT_KEYS)[number];
export type WorkshopAiSuggestionKey = WorkshopAiListKey | WorkshopAiTextKey;

export type WorkshopAiSuggestions = Record<WorkshopAiListKey, string[]> &
  Record<WorkshopAiTextKey, string>;

export type WorkshopAiResponse = {
  version: 1;
  source: "ai";
  suggestions: WorkshopAiSuggestions;
};

export type ApplyWorkshopAiSuggestionsResult = {
  draft: WorkshopDraft;
  filled: WorkshopAiSuggestionKey[];
};

export type WorkshopAiErrorCode =
  | "unavailable"
  | "invalid-input"
  | "rate-limited"
  | "network"
  | "invalid-response";

export class WorkshopAiError extends Error {
  readonly code: WorkshopAiErrorCode;

  constructor(code: WorkshopAiErrorCode) {
    super("Bot Lab AI request could not be completed.");
    this.name = "WorkshopAiError";
    this.code = code;
  }
}

const CONFIGURED_BOT_BLUEPRINT_API_URL =
  process.env.NEXT_PUBLIC_BOT_BLUEPRINT_API_URL;
const REQUEST_TIMEOUT_MS = 30_000;
const RESPONSE_KEYS = ["version", "source", "suggestions"] as const;
const SUGGESTION_KEYS = [
  ...WORKSHOP_AI_LIST_KEYS,
  ...WORKSHOP_AI_TEXT_KEYS,
] as const;
const LIST_ITEM_LIMIT = 240;
const LIST_ITEM_COUNT_LIMIT = 8;
const TEXT_LIMITS: Record<WorkshopAiTextKey, number> = {
  cadenceTrigger: 500,
  firstRunTest: 1200,
  audienceSuccess: 1000,
  accessSensitive: 1000,
  prohibitedUncertainty: 1000,
  continuityMemory: 1000,
  reviewCriteria: 1000,
  profileTitle: 180,
  profileDescription: 600,
  roleInstructions: 5000,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();

  return (
    actual.length === wanted.length &&
    actual.every((key, index) => key === wanted[index])
  );
}

function isBoundedText(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximum &&
    !value.includes("\u0000")
  );
}

export function parseWorkshopAiResponse(value: unknown): WorkshopAiResponse {
  if (!isRecord(value) || !hasExactKeys(value, RESPONSE_KEYS)) {
    throw new WorkshopAiError("invalid-response");
  }
  if (value.version !== 1 || value.source !== "ai" || !isRecord(value.suggestions)) {
    throw new WorkshopAiError("invalid-response");
  }
  if (!hasExactKeys(value.suggestions, SUGGESTION_KEYS)) {
    throw new WorkshopAiError("invalid-response");
  }

  const suggestions = value.suggestions;
  for (const key of WORKSHOP_AI_LIST_KEYS) {
    const items = suggestions[key];
    if (
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > LIST_ITEM_COUNT_LIMIT ||
      !items.every((item) => isBoundedText(item, LIST_ITEM_LIMIT))
    ) {
      throw new WorkshopAiError("invalid-response");
    }
  }

  for (const key of WORKSHOP_AI_TEXT_KEYS) {
    if (!isBoundedText(suggestions[key], TEXT_LIMITS[key])) {
      throw new WorkshopAiError("invalid-response");
    }
  }

  return value as WorkshopAiResponse;
}

export function getBotBlueprintApiUrl(
  configuredValue: string | undefined = CONFIGURED_BOT_BLUEPRINT_API_URL,
): string | null {
  const value = configuredValue?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    const localHttp =
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (url.protocol !== "https:" && !localHttp) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function generateWorkshopAiSuggestions(
  input: { botName: string; jobOutcome: string },
  options: {
    endpoint?: string | null;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
  } = {},
): Promise<WorkshopAiSuggestions> {
  const endpoint =
    options.endpoint === undefined
      ? getBotBlueprintApiUrl(CONFIGURED_BOT_BLUEPRINT_API_URL)
      : options.endpoint === null
        ? null
        : getBotBlueprintApiUrl(options.endpoint);
  if (!endpoint) throw new WorkshopAiError("unavailable");

  const botName = input.botName.trim();
  const jobOutcome = input.jobOutcome.trim();
  if (
    botName.length < 1 ||
    botName.length > 100 ||
    jobOutcome.length < 3 ||
    jobOutcome.length > 2000 ||
    botName.includes("\u0000") ||
    jobOutcome.includes("\u0000")
  ) {
    throw new WorkshopAiError("invalid-input");
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: 1, botName, jobOutcome }),
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new WorkshopAiError(
        response.status === 429 ? "rate-limited" : "network",
      );
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new WorkshopAiError("invalid-response");
    }
    return parseWorkshopAiResponse(body).suggestions;
  } catch (error) {
    if (error instanceof WorkshopAiError) throw error;
    throw new WorkshopAiError("network");
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export function applyWorkshopAiSuggestions(
  current: WorkshopDraft,
  suggestions: WorkshopAiSuggestions,
): ApplyWorkshopAiSuggestionsResult {
  const next = { ...current };
  const filled: WorkshopAiSuggestionKey[] = [];

  for (const key of WORKSHOP_AI_LIST_KEYS) {
    if (!current[key]?.trim()) {
      next[key] = suggestions[key].map((item) => item.trim()).join("\n");
      filled.push(key);
    }
  }
  for (const key of WORKSHOP_AI_TEXT_KEYS) {
    if (!current[key]?.trim()) {
      next[key] = suggestions[key].trim();
      filled.push(key);
    }
  }

  return { draft: next, filled };
}

export function getEmptyWorkshopAiSuggestionKeys(
  draft: WorkshopDraft,
): WorkshopAiSuggestionKey[] {
  return SUGGESTION_KEYS.filter((key) => !draft[key]?.trim());
}
