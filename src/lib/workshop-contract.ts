export type WorkshopDraft = {
  botName: string;
  jobOutcome: string;
  inputsContext: string;
  outputsDeliverables: string;
  cadenceTrigger: string;
  toolsIntegrations: string;
  approvalBoundaries: string;
  firstRunTest: string;
  audienceSuccess?: string;
  accessSensitive?: string;
  prohibitedUncertainty?: string;
  continuityMemory?: string;
  reviewCriteria?: string;
  profileTitle?: string;
  profileDescription?: string;
  roleInstructions?: string;
};

export const WORKSHOP_STORAGE_KEY = "hermes-registry.workshop-draft.v1";
export const WORKSHOP_BACKUP_STORAGE_KEY = `${WORKSHOP_STORAGE_KEY}:previous`;

export const EMPTY_WORKSHOP_DRAFT: WorkshopDraft = {
  botName: "",
  jobOutcome: "",
  inputsContext: "",
  outputsDeliverables: "",
  cadenceTrigger: "",
  toolsIntegrations: "",
  approvalBoundaries: "",
  firstRunTest: "",
  audienceSuccess: "",
  accessSensitive: "",
  prohibitedUncertainty: "",
  continuityMemory: "",
  reviewCriteria: "",
  profileTitle: "",
  profileDescription: "",
  roleInstructions: "",
};

const REQUIRED_WORKSHOP_DRAFT_KEYS = [
  "botName",
  "jobOutcome",
  "inputsContext",
  "outputsDeliverables",
  "cadenceTrigger",
  "toolsIntegrations",
  "approvalBoundaries",
  "firstRunTest",
] as const;

const OPTIONAL_WORKSHOP_DRAFT_KEYS = [
  "audienceSuccess",
  "accessSensitive",
  "prohibitedUncertainty",
  "continuityMemory",
  "reviewCriteria",
  "profileTitle",
  "profileDescription",
  "roleInstructions",
] as const;

/**
 * Accept only the serializable draft shape used by Bot Lab. This deliberately
 * lives in the light contract module so browser handoffs do not need to import
 * the blueprint-building code.
 */
export function coerceWorkshopDraft(value: unknown): WorkshopDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  const draft = { ...EMPTY_WORKSHOP_DRAFT };

  for (const key of REQUIRED_WORKSHOP_DRAFT_KEYS) {
    if (typeof candidate[key] !== "string") return null;
    draft[key] = candidate[key];
  }

  for (const key of OPTIONAL_WORKSHOP_DRAFT_KEYS) {
    if (candidate[key] !== undefined && typeof candidate[key] !== "string") {
      return null;
    }
    draft[key] = typeof candidate[key] === "string" ? candidate[key] : "";
  }

  return draft;
}
