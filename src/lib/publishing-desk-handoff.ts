import { parseEditorialJson, type EditorialJsonFormat } from "./editorial-json";
import { measureEditorialDraft, type EditorialDraft } from "./editorial-length";
import {
  checkEditorialAudit,
  segmentEditorialAssertions,
  type EditorialAuditEntry,
  type EditorialAuditStatus,
  type EditorialSource,
} from "./editorial-source-audit";

type JsonObject = Record<string, unknown>;

const WRITER_KEYS = ["newsletter", "social", "lengthException", "sourceChecks", "reviewNotes"];
const EDITOR_KEYS = ["newsletterEntries", "socialEntries", "sourceShortfallAssessment", "publishRecommendation"];
const AUDIT_ENTRY_KEYS = ["exactDraftQuote", "status", "sourceId", "originalSourcePassage", "evidence", "explanation"];
const AUDIT_STATUSES: EditorialAuditStatus[] = ["supported", "unsupported", "ambiguous"];

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value: JsonObject, expected: readonly string[], label: string, issues: string[]) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    issues.push(`${label} must contain exactly: ${expected.join(", ")}`);
  }
}

function nonemptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseHandoff(raw: string, issues: string[]) {
  try {
    return parseEditorialJson(raw);
  } catch (error) {
    issues.push(error instanceof Error ? error.message : String(error));
    return null;
  }
}

export interface WriterHandoffGateResult {
  acceptedForEditor: boolean;
  issues: string[];
  format: EditorialJsonFormat | null;
  transformed: boolean;
  normalizations: string[];
  canonicalHandoff: JsonObject | null;
  draft: EditorialDraft | null;
  newsletterAssertions: string[];
  socialAssertions: string[];
  measurement: ReturnType<typeof measureEditorialDraft> | null;
  factualAccuracyVerified: false;
  humanApproved: false;
}

export type WriterReviewInput = Pick<WriterHandoffGateResult,
  "acceptedForEditor" | "draft" | "newsletterAssertions" | "socialAssertions">;

export function gateWriterHandoff(raw: string): WriterHandoffGateResult {
  const issues: string[] = [];
  const parsed = parseHandoff(raw, issues);
  if (!parsed) return {
    acceptedForEditor: false, issues, format: null, transformed: false,
    normalizations: [], canonicalHandoff: null, draft: null,
    newsletterAssertions: [], socialAssertions: [], measurement: null,
    factualAccuracyVerified: false, humanApproved: false,
  };

  const value = parsed.value;
  exactKeys(value, WRITER_KEYS, "Writer handoff", issues);
  if (!nonemptyString(value.newsletter)) issues.push("Writer newsletter must be a nonempty string");
  if (!nonemptyString(value.social)) issues.push("Writer social must be a nonempty string");

  if (value.lengthException !== null) {
    if (!isObject(value.lengthException)) {
      issues.push("Writer lengthException must be null or an object");
    } else {
      exactKeys(value.lengthException, ["reason", "explanation"], "Writer lengthException", issues);
      if (value.lengthException.reason !== "source-shortfall") issues.push("Writer lengthException reason must be source-shortfall");
      if (!nonemptyString(value.lengthException.explanation)) issues.push("Writer lengthException explanation must be nonempty");
    }
  }

  if (!Array.isArray(value.sourceChecks) || !value.sourceChecks.length) {
    issues.push("Writer sourceChecks must be a nonempty array");
  } else {
    value.sourceChecks.forEach((item, index) => {
      if (!isObject(item)) {
        issues.push(`Writer sourceChecks entry ${index + 1} must be an object`);
        return;
      }
      exactKeys(item, ["exactSentence", "sourceId", "exactSourcePassage", "status"], `Writer sourceChecks entry ${index + 1}`, issues);
      if (!nonemptyString(item.exactSentence) || !nonemptyString(item.sourceId) || !nonemptyString(item.exactSourcePassage)) {
        issues.push(`Writer sourceChecks entry ${index + 1} must contain nonempty strings`);
      }
      if (!AUDIT_STATUSES.includes(item.status as EditorialAuditStatus)) {
        issues.push(`Writer sourceChecks entry ${index + 1} has an invalid status`);
      } else if (item.status !== "supported") {
        issues.push(`Writer sourceChecks entry ${index + 1} admits an unresolved publishable assertion`);
      }
    });
  }

  const reviewNotesValid = Array.isArray(value.reviewNotes) && value.reviewNotes.length > 0 && value.reviewNotes.every(nonemptyString);
  if (!reviewNotesValid) {
    issues.push("Writer reviewNotes must be a nonempty string array");
  }

  const draft = nonemptyString(value.newsletter) && nonemptyString(value.social)
    ? {
        newsletter: value.newsletter,
        social: value.social,
        lengthException: value.lengthException === null || isObject(value.lengthException)
          ? value.lengthException as EditorialDraft["lengthException"]
          : undefined,
      }
    : null;
  const initialMeasurement = draft ? measureEditorialDraft(draft) : null;
  const normalizations: string[] = [];
  let canonicalLengthException = draft?.lengthException;
  if (initialMeasurement?.newsletterWithinRange && canonicalLengthException) {
    canonicalLengthException = null;
    normalizations.push("Cleared contradictory lengthException because the deterministic word count is within range");
  }
  const countClaim = /\b\d+\s+(?:words?|unicode\s+code\s+points?|characters?)\b/i;
  const canonicalReviewNotes = reviewNotesValid
    ? (value.reviewNotes as string[]).filter(note => !countClaim.test(note))
    : [];
  if (reviewNotesValid && canonicalReviewNotes.length !== (value.reviewNotes as string[]).length) {
    normalizations.push("Removed review note containing an unverified numeric length claim");
  }
  if (reviewNotesValid && !canonicalReviewNotes.length) {
    issues.push("Writer reviewNotes contain only unverified numeric length claims");
  }
  const canonicalDraft = draft ? { ...draft, lengthException: canonicalLengthException } : null;
  const measurement = canonicalDraft ? measureEditorialDraft(canonicalDraft) : null;
  if (measurement && !measurement.newsletterMechanicallyAccepted) {
    issues.push("Writer newsletter fails the deterministic length/shortfall contract");
  }
  if (measurement && !measurement.socialWithinCodePointLimit) {
    issues.push("Writer social is empty or exceeds 280 Unicode code points");
  }
  const newsletterAssertions = draft ? segmentEditorialAssertions(draft.newsletter) : [];
  const socialAssertions = draft ? segmentEditorialAssertions(draft.social) : [];
  const sourceCheckAssertions = Array.isArray(value.sourceChecks)
    ? value.sourceChecks.flatMap(item => isObject(item) && nonemptyString(item.exactSentence) ? [item.exactSentence] : [])
    : [];
  if (draft && JSON.stringify(sourceCheckAssertions) !== JSON.stringify([...newsletterAssertions, ...socialAssertions])) {
    issues.push("Writer sourceChecks boundaries differ from the deterministic newsletter and social assertions");
  }
  const canonicalHandoff = canonicalDraft && reviewNotesValid ? {
    newsletter: canonicalDraft.newsletter,
    social: canonicalDraft.social,
    lengthException: canonicalDraft.lengthException ?? null,
    sourceChecks: value.sourceChecks,
    reviewNotes: canonicalReviewNotes,
  } : null;

  return {
    acceptedForEditor: issues.length === 0,
    issues,
    format: parsed.format,
    transformed: parsed.transformed,
    normalizations,
    canonicalHandoff,
    draft: canonicalDraft,
    newsletterAssertions,
    socialAssertions,
    measurement,
    factualAccuracyVerified: false,
    humanApproved: false,
  };
}

/** Mechanical Writer-to-Editor contract for workflows where Editor performs
 * the exhaustive source audit. This avoids duplicating the complete audit in
 * Writer while preserving the same length, boundary and approval gates.
 */
export function gateWriterDraftForIndependentAudit(raw: string): WriterHandoffGateResult {
  const issues: string[] = [];
  const parsed = parseHandoff(raw, issues);
  if (!parsed) return {
    acceptedForEditor: false, issues, format: null, transformed: false,
    normalizations: [], canonicalHandoff: null, draft: null,
    newsletterAssertions: [], socialAssertions: [], measurement: null,
    factualAccuracyVerified: false, humanApproved: false,
  };
  const value = parsed.value;
  exactKeys(value, ["newsletter", "social", "lengthException", "reviewNotes"], "Writer draft handoff", issues);
  if (!nonemptyString(value.newsletter)) issues.push("Writer newsletter must be a nonempty string");
  if (!nonemptyString(value.social)) issues.push("Writer social must be a nonempty string");
  if (value.lengthException !== null) {
    if (!isObject(value.lengthException)) issues.push("Writer lengthException must be null or an object");
    else {
      exactKeys(value.lengthException, ["reason", "explanation"], "Writer lengthException", issues);
      if (value.lengthException.reason !== "source-shortfall") issues.push("Writer lengthException reason must be source-shortfall");
      if (!nonemptyString(value.lengthException.explanation)) issues.push("Writer lengthException explanation must be nonempty");
    }
  }
  const reviewNotesValid = Array.isArray(value.reviewNotes) && value.reviewNotes.length > 0 && value.reviewNotes.every(nonemptyString);
  if (!reviewNotesValid) issues.push("Writer reviewNotes must be a nonempty string array");
  const draft = nonemptyString(value.newsletter) && nonemptyString(value.social) ? {
    newsletter: value.newsletter,
    social: value.social,
    lengthException: value.lengthException === null || isObject(value.lengthException)
      ? value.lengthException as EditorialDraft["lengthException"] : undefined,
  } : null;
  const measurement = draft ? measureEditorialDraft(draft) : null;
  if (measurement && !measurement.newsletterMechanicallyAccepted) issues.push("Writer newsletter fails the deterministic length/shortfall contract");
  if (measurement && !measurement.socialWithinCodePointLimit) issues.push("Writer social is empty or exceeds 280 Unicode code points");
  const newsletterAssertions = draft ? segmentEditorialAssertions(draft.newsletter) : [];
  const socialAssertions = draft ? segmentEditorialAssertions(draft.social) : [];
  return {
    acceptedForEditor: issues.length === 0,
    issues,
    format: parsed.format,
    transformed: parsed.transformed,
    normalizations: [],
    canonicalHandoff: draft && reviewNotesValid ? {
      newsletter: draft.newsletter, social: draft.social,
      lengthException: draft.lengthException ?? null, reviewNotes: value.reviewNotes,
    } : null,
    draft, newsletterAssertions, socialAssertions, measurement,
    factualAccuracyVerified: false, humanApproved: false,
  };
}

function parseAuditEntries(value: unknown, label: string, issues: string[]): EditorialAuditEntry[] {
  if (!Array.isArray(value) || !value.length) {
    issues.push(`${label} must be a nonempty array`);
    return [];
  }
  const parsed: EditorialAuditEntry[] = [];
  value.forEach((item, index) => {
    if (!isObject(item)) {
      issues.push(`${label} entry ${index + 1} must be an object`);
      return;
    }
    exactKeys(item, AUDIT_ENTRY_KEYS, `${label} entry ${index + 1}`, issues);
    const evidenceValid = Array.isArray(item.evidence) && item.evidence.every(evidence => {
      if (!isObject(evidence)) return false;
      exactKeys(evidence, ["sourceId", "originalSourcePassage"], `${label} entry ${index + 1} evidence`, issues);
      return nonemptyString(evidence.sourceId) && nonemptyString(evidence.originalSourcePassage);
    });
    if (!nonemptyString(item.exactDraftQuote) || !AUDIT_STATUSES.includes(item.status as EditorialAuditStatus)
      || !(item.sourceId === null || nonemptyString(item.sourceId))
      || !(item.originalSourcePassage === null || nonemptyString(item.originalSourcePassage)) || !evidenceValid
      || !nonemptyString(item.explanation)) {
      issues.push(`${label} entry ${index + 1} does not match the required audit schema`);
      return;
    }
    parsed.push(item as unknown as EditorialAuditEntry);
  });
  return parsed;
}

export interface EditorHandoffGateResult {
  acceptedForHumanReview: boolean;
  issues: string[];
  format: EditorialJsonFormat | null;
  transformed: boolean;
  newsletterAudit: ReturnType<typeof checkEditorialAudit> | null;
  socialAudit: ReturnType<typeof checkEditorialAudit> | null;
  publishRecommendation: string | null;
  semanticSupportVerified: false;
  factualAccuracyVerified: false;
  humanApproved: false;
}

export function gateEditorHandoff(
  raw: string,
  writer: WriterReviewInput,
  sources: readonly EditorialSource[],
): EditorHandoffGateResult {
  const issues: string[] = [];
  if (!writer.acceptedForEditor || !writer.draft) {
    issues.push("Editor must not run because the Writer handoff did not pass its executable gate");
  }
  const parsed = parseHandoff(raw, issues);
  if (!parsed || !writer.draft) return {
    acceptedForHumanReview: false, issues, format: parsed?.format ?? null,
    transformed: parsed?.transformed ?? false, newsletterAudit: null, socialAudit: null,
    publishRecommendation: null, semanticSupportVerified: false,
    factualAccuracyVerified: false, humanApproved: false,
  };

  const value = parsed.value;
  exactKeys(value, EDITOR_KEYS, "Editor handoff", issues);
  const newsletterEntries = parseAuditEntries(value.newsletterEntries, "Editor newsletterEntries", issues);
  const socialEntries = parseAuditEntries(value.socialEntries, "Editor socialEntries", issues);
  if (JSON.stringify(newsletterEntries.map(entry => entry.exactDraftQuote)) !== JSON.stringify(writer.newsletterAssertions)) {
    issues.push("Editor newsletter boundaries differ from the deterministic assertions");
  }
  if (JSON.stringify(socialEntries.map(entry => entry.exactDraftQuote)) !== JSON.stringify(writer.socialAssertions)) {
    issues.push("Editor social boundaries differ from the deterministic assertions");
  }

  const assessment = value.sourceShortfallAssessment;
  if (!isObject(assessment)) {
    issues.push("Editor sourceShortfallAssessment must be an object");
  } else {
    exactKeys(assessment, ["status", "reason"], "Editor sourceShortfallAssessment", issues);
    if (!AUDIT_STATUSES.includes(assessment.status as EditorialAuditStatus) || !nonemptyString(assessment.reason)) {
      issues.push("Editor sourceShortfallAssessment must contain a valid status and nonempty reason");
    }
    if (writer.draft.lengthException && assessment.status !== "supported") {
      issues.push("Editor did not support the Writer's declared source shortfall");
    }
    if (nonemptyString(assessment.reason) && /\b(?:draft|newsletter|body)\s+(?:is|has|contains|measures|measured)\s+\d+\s+words?\b/i.test(assessment.reason)) {
      issues.push("Editor sourceShortfallAssessment contains an unverified measured word-count claim");
    }
  }
  if (value.publishRecommendation !== "hold-for-human-review") {
    issues.push("Editor publishRecommendation must be hold-for-human-review");
  }

  const newsletterAudit = checkEditorialAudit(newsletterEntries, writer.draft.newsletter, sources);
  const socialAudit = checkEditorialAudit(socialEntries, writer.draft.social, sources);
  issues.push(...newsletterAudit.issues.map(issue => `Newsletter audit: ${issue}`));
  issues.push(...socialAudit.issues.map(issue => `Social audit: ${issue}`));
  if (!newsletterAudit.noUnsupportedAssertions) issues.push("Newsletter audit has unsupported or ambiguous assertions");
  if (!socialAudit.noUnsupportedAssertions) issues.push("Social audit has unsupported or ambiguous assertions");

  return {
    acceptedForHumanReview: issues.length === 0,
    issues,
    format: parsed.format,
    transformed: parsed.transformed,
    newsletterAudit,
    socialAudit,
    publishRecommendation: typeof value.publishRecommendation === "string" ? value.publishRecommendation : null,
    semanticSupportVerified: false,
    factualAccuracyVerified: false,
    humanApproved: false,
  };
}
