import {
  BOT_FIT_EMPTY_ANSWERS,
  botFitArtifactFileName,
  botFitRecommendationToMarkdown,
  recommendBotFit,
  type BotFitAnswers,
  type BotFitFrequency,
  type BotFitKind,
  type BotFitOverlap,
} from "./bot-fit-test";

export const BOT_FIT_CONTRACT_VERSION = 1 as const;

const FREQUENCIES = ["once", "repeat", "scheduled"] as const;
const OVERLAP_CHOICES = ["yes", "no", "unsure"] as const;
const OVERRIDES = [
  "auto",
  "assignment",
  "skill",
  "routine",
  "bot",
  "crew",
] as const;

const ALLOWED_INPUT_KEYS = new Set<keyof BotFitAnswers>([
  "result",
  "frequency",
  "needsContinuingContext",
  "needsMultipleSpecialists",
  "workProvenManually",
  "overlapsExistingRole",
  "access",
  "approvals",
  "trigger",
  "failurePlan",
  "costLimit",
  "shutdown",
  "override",
]);

const BOT_FIT_INPUT_PROPERTIES = {
  result: {
    type: "string",
    minLength: 1,
    maxLength: 2000,
    pattern: "\\S",
    description: "The concrete finished result the person needs.",
  },
  frequency: { type: "string", enum: FREQUENCIES, default: "once" },
  needsContinuingContext: { type: "boolean", default: false },
  needsMultipleSpecialists: { type: "boolean", default: false },
  workProvenManually: { type: "boolean", default: false },
  overlapsExistingRole: {
    type: "string",
    enum: OVERLAP_CHOICES,
    default: "unsure",
  },
  access: { type: "string", maxLength: 4000, default: "" },
  approvals: { type: "string", maxLength: 4000, default: "" },
  trigger: { type: "string", maxLength: 1000, default: "" },
  failurePlan: { type: "string", maxLength: 1000, default: "" },
  costLimit: { type: "string", maxLength: 1000, default: "" },
  shutdown: { type: "string", maxLength: 1000, default: "" },
  override: { type: "string", enum: OVERRIDES, default: "auto" },
} as const;

const NORMALIZED_INPUT_FIELDS = [
  "result",
  "frequency",
  "needsContinuingContext",
  "needsMultipleSpecialists",
  "workProvenManually",
  "overlapsExistingRole",
  "access",
  "approvals",
  "trigger",
  "failurePlan",
  "costLimit",
  "shutdown",
  "override",
] as const;

export const BOT_FIT_INPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://botcabinet.com/schemas/bot-fit-test-input-v1.json",
  title: "Bot Cabinet Bot Fit Test input",
  type: "object",
  additionalProperties: false,
  required: ["result"],
  properties: BOT_FIT_INPUT_PROPERTIES,
} as const;

const NORMALIZED_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: NORMALIZED_INPUT_FIELDS,
  properties: BOT_FIT_INPUT_PROPERTIES,
} as const;

const STRING_LIST_SCHEMA = {
  type: "array",
  items: { type: "string" },
} as const;

const OPERATING_CONTROLS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["trigger", "failureResponse", "costLimit", "shutdownMethod"],
  properties: {
    trigger: { type: "string" },
    failureResponse: { type: "string" },
    costLimit: { type: "string" },
    shutdownMethod: { type: "string" },
  },
} as const;

const WORKSHOP_DRAFT_FIELDS = [
  "botName",
  "jobOutcome",
  "inputsContext",
  "outputsDeliverables",
  "cadenceTrigger",
  "toolsIntegrations",
  "approvalBoundaries",
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

const WORKSHOP_DRAFT_PROPERTIES = {
  botName: { type: "string" },
  jobOutcome: { type: "string" },
  inputsContext: { type: "string" },
  outputsDeliverables: { type: "string" },
  cadenceTrigger: { type: "string" },
  toolsIntegrations: { type: "string" },
  approvalBoundaries: { type: "string" },
  firstRunTest: { type: "string" },
  audienceSuccess: { type: "string" },
  accessSensitive: { type: "string" },
  prohibitedUncertainty: { type: "string" },
  continuityMemory: { type: "string" },
  reviewCriteria: { type: "string" },
  profileTitle: { type: "string" },
  profileDescription: { type: "string" },
  roleInstructions: { type: "string" },
} as const;

const RECOMMENDATION_BASE_REQUIRED = [
  "kind",
  "label",
  "summary",
  "why",
  "owns",
  "excludes",
  "access",
  "approvals",
  "firstTest",
  "doneCheck",
  "nextAction",
] as const;

const RECOMMENDATION_BASE_PROPERTIES = {
  label: { type: "string" },
  summary: { type: "string" },
  why: { type: "string" },
  owns: STRING_LIST_SCHEMA,
  excludes: STRING_LIST_SCHEMA,
  access: STRING_LIST_SCHEMA,
  approvals: STRING_LIST_SCHEMA,
  firstTest: { type: "string" },
  doneCheck: STRING_LIST_SCHEMA,
  nextAction: { type: "string" },
} as const;

function recommendationVariant(
  kind: BotFitKind,
  properties: Record<string, unknown> = {},
  required: readonly string[] = [],
) {
  return {
    type: "object",
    additionalProperties: false,
    required: [...RECOMMENDATION_BASE_REQUIRED, ...required],
    properties: {
      kind: { const: kind },
      ...RECOMMENDATION_BASE_PROPERTIES,
      ...properties,
    },
  } as const;
}

const RECOMMENDATION_SCHEMA = {
  oneOf: [
    recommendationVariant("assignment"),
    recommendationVariant("skill", { graduation: STRING_LIST_SCHEMA }),
    recommendationVariant(
      "routine",
      {
        operatingControls: OPERATING_CONTROLS_SCHEMA,
        routineControls: OPERATING_CONTROLS_SCHEMA,
      },
      ["operatingControls", "routineControls"],
    ),
    recommendationVariant(
      "bot",
      {
        operatingControls: OPERATING_CONTROLS_SCHEMA,
        workshopDraft: {
          type: "object",
          additionalProperties: false,
          required: WORKSHOP_DRAFT_FIELDS,
          properties: WORKSHOP_DRAFT_PROPERTIES,
        },
      },
      ["workshopDraft"],
    ),
    recommendationVariant("crew"),
  ],
} as const;

export const BOT_FIT_OUTPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://botcabinet.com/schemas/bot-fit-test-output-v1.json",
  title: "Bot Cabinet Bot Fit Test output",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "input", "recommendation", "artifact"],
  properties: {
    schemaVersion: { const: BOT_FIT_CONTRACT_VERSION },
    input: NORMALIZED_INPUT_SCHEMA,
    recommendation: RECOMMENDATION_SCHEMA,
    artifact: {
      type: "object",
      additionalProperties: false,
      required: ["fileName", "markdown"],
      properties: {
        fileName: { type: "string" },
        markdown: { type: "string" },
      },
    },
  },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(
  input: Record<string, unknown>,
  key: keyof BotFitAnswers,
  maximum: number,
): string {
  const value = input[key];
  if (value === undefined) return "";
  if (typeof value !== "string") throw new Error(`${key} must be a string.`);
  if (Array.from(value).length > maximum) {
    throw new Error(`${key} must be ${maximum} characters or fewer.`);
  }
  return value;
}

function optionalBoolean(
  input: Record<string, unknown>,
  key: keyof BotFitAnswers,
): boolean {
  const value = input[key];
  if (value === undefined) return false;
  if (typeof value !== "boolean") throw new Error(`${key} must be true or false.`);
  return value;
}

function enumValue<T extends string>(
  input: Record<string, unknown>,
  key: keyof BotFitAnswers,
  choices: readonly T[],
  fallback: T,
): T {
  const value = input[key];
  if (value === undefined) return fallback;
  if (typeof value === "string" && choices.includes(value as T)) return value as T;
  throw new Error(`${key} must be one of: ${choices.join(", ")}.`);
}

export function parseBotFitAnswers(value: unknown): BotFitAnswers {
  if (!isRecord(value)) throw new Error("Bot Fit input must be a JSON object.");

  const unknownKeys = Object.keys(value).filter(
    (key) => !ALLOWED_INPUT_KEYS.has(key as keyof BotFitAnswers),
  );
  if (unknownKeys.length) {
    throw new Error(`Unknown Bot Fit field: ${unknownKeys.join(", ")}.`);
  }

  const result = optionalString(value, "result", 2000);
  if (!result.trim()) throw new Error("result is required.");

  return {
    ...BOT_FIT_EMPTY_ANSWERS,
    result,
    frequency: enumValue<BotFitFrequency>(
      value,
      "frequency",
      FREQUENCIES,
      "once",
    ),
    needsContinuingContext: optionalBoolean(value, "needsContinuingContext"),
    needsMultipleSpecialists: optionalBoolean(value, "needsMultipleSpecialists"),
    workProvenManually: optionalBoolean(value, "workProvenManually"),
    overlapsExistingRole: enumValue<BotFitOverlap>(
      value,
      "overlapsExistingRole",
      OVERLAP_CHOICES,
      "unsure",
    ),
    access: optionalString(value, "access", 4000),
    approvals: optionalString(value, "approvals", 4000),
    trigger: optionalString(value, "trigger", 1000),
    failurePlan: optionalString(value, "failurePlan", 1000),
    costLimit: optionalString(value, "costLimit", 1000),
    shutdown: optionalString(value, "shutdown", 1000),
    override: enumValue<BotFitKind | "auto">(
      value,
      "override",
      OVERRIDES,
      "auto",
    ),
  };
}

export function buildBotFitAgentResult(value: unknown) {
  const input = parseBotFitAnswers(value);
  const recommendation = recommendBotFit(input);

  return {
    schemaVersion: BOT_FIT_CONTRACT_VERSION,
    input,
    recommendation,
    artifact: {
      fileName: botFitArtifactFileName(recommendation),
      markdown: botFitRecommendationToMarkdown(recommendation),
    },
  };
}

export const BOT_FIT_PUBLIC_CONTRACT = {
  schemaVersion: BOT_FIT_CONTRACT_VERSION,
  name: "Bot Cabinet Bot Fit Test",
  page: "https://botcabinet.com/fit/",
  purpose:
    "Choose the smallest useful form for work: Assignment, Skill, Routine, Bot, or Crew.",
  interfaces: {
    web: {
      url: "https://botcabinet.com/fit/",
      processing: "Runs in the visitor's browser without an AI service.",
    },
    repositoryCli: {
      command: "npm run fit:bot -- ./bot-fit-input.json",
      stdin: "cat bot-fit-input.json | npm run fit:bot",
      output:
        "JSON containing the normalized input, full recommendation, Markdown plan, and Bot Lab workshopDraft when the result is a Bot.",
    },
  },
  resultKinds: ["assignment", "skill", "routine", "bot", "crew"],
  inputSchema: BOT_FIT_INPUT_SCHEMA,
  outputSchema: BOT_FIT_OUTPUT_SCHEMA,
} as const;
