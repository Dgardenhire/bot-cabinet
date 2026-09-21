import { describe, expect, it } from "vitest";
import { gateEditorHandoff, gateWriterDraftForIndependentAudit, gateWriterHandoff } from "./publishing-desk-handoff";

const source = { id: "S1", text: "The workshop opens October 17. Admission is free." };
const writerValue = {
  newsletter: "The workshop opens October 17.",
  social: "Admission is free.",
  lengthException: {
    reason: "source-shortfall",
    explanation: "The supplied source supports a concise notice but not a longer article without invention.",
  },
  sourceChecks: [{
    exactSentence: "The workshop opens October 17.",
    sourceId: "S1",
    exactSourcePassage: "The workshop opens October 17.",
    status: "supported",
  }, {
    exactSentence: "Admission is free.",
    sourceId: "S1",
    exactSourcePassage: "Admission is free.",
    status: "supported",
  }],
  reviewNotes: ["Human publication approval is pending."],
};

const editorValue = {
  newsletterEntries: [{
    exactDraftQuote: "The workshop opens October 17.",
    status: "supported",
    sourceId: null,
    originalSourcePassage: null,
    evidence: [{ sourceId: "S1", originalSourcePassage: "The workshop opens October 17." }],
    explanation: "Direct source match.",
  }],
  socialEntries: [{
    exactDraftQuote: "Admission is free.",
    status: "supported",
    sourceId: null,
    originalSourcePassage: null,
    evidence: [{ sourceId: "S1", originalSourcePassage: "Admission is free." }],
    explanation: "Direct source match.",
  }],
  sourceShortfallAssessment: {
    status: "supported",
    reason: "The source cannot support the requested length without adding claims.",
  },
  publishRecommendation: "hold-for-human-review",
};

describe("Publishing Desk executable handoff gates", () => {
  it("accepts a bounded Writer handoff for independent Editor review without claiming facts are verified", () => {
    const result = gateWriterHandoff(JSON.stringify(writerValue));
    expect(result.acceptedForEditor).toBe(true);
    expect(result.newsletterAssertions).toEqual([writerValue.newsletter]);
    expect(result.socialAssertions).toEqual([writerValue.social]);
    expect(result.measurement?.newsletterLengthDisposition).toBe("declared-source-shortfall");
    expect(result.factualAccuracyVerified).toBe(false);
    expect(result.humanApproved).toBe(false);
  });

  it("records one isolated JSON fence but rejects the unseen-run Writer defects before Editor", () => {
    const malformed = {
      ...writerValue,
      newsletter: Array.from({ length: 360 }, (_, index) => `fact${index}`).join(" "),
      reviewNotes: "not an array",
    };
    const result = gateWriterHandoff(`\n\`\`\`json\n${JSON.stringify(malformed)}\n\`\`\`\n`);
    expect(result.transformed).toBe(true);
    expect(result.acceptedForEditor).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([
      "Writer reviewNotes must be a nonempty string array",
      "Writer newsletter fails the deterministic length/shortfall contract",
    ]));
  });

  it("rejects Writer source checks that omit or change a deterministic draft boundary", () => {
    const result = gateWriterHandoff(JSON.stringify({
      ...writerValue,
      sourceChecks: writerValue.sourceChecks.slice(0, 1),
    }));
    expect(result.acceptedForEditor).toBe(false);
    expect(result.issues).toContain(
      "Writer sourceChecks boundaries differ from the deterministic newsletter and social assertions",
    );
  });

  it("normalizes only deterministic metadata while leaving publishable text untouched", () => {
    const newsletter = Array.from({ length: 260 }, (_, index) => `fact${index}`).join(" ");
    const result = gateWriterHandoff(JSON.stringify({
      ...writerValue,
      newsletter,
      lengthException: { reason: "source-shortfall", explanation: "Contradicts the measured range." },
      sourceChecks: [{
        exactSentence: newsletter,
        sourceId: "S1",
        exactSourcePassage: "The workshop opens October 17.",
        status: "supported",
      }, writerValue.sourceChecks[1]],
      reviewNotes: ["Human approval pending.", "The draft is 999 words."],
    }));
    expect(result.acceptedForEditor).toBe(true);
    expect(result.draft?.newsletter).toBe(newsletter);
    expect(result.draft?.lengthException).toBeNull();
    expect(result.canonicalHandoff?.reviewNotes).toEqual(["Human approval pending."]);
    expect(result.normalizations).toHaveLength(2);
    expect(result.factualAccuracyVerified).toBe(false);
  });

  it("accepts only exact deterministic boundaries and literal evidence for human review", () => {
    const writer = gateWriterHandoff(JSON.stringify(writerValue));
    const result = gateEditorHandoff(JSON.stringify(editorValue), writer, [source]);
    expect(result.acceptedForHumanReview).toBe(true);
    expect(result.newsletterAudit?.noUnsupportedAssertions).toBe(true);
    expect(result.socialAudit?.noUnsupportedAssertions).toBe(true);
    expect(result.semanticSupportVerified).toBe(false);
    expect(result.factualAccuracyVerified).toBe(false);
    expect(result.humanApproved).toBe(false);
  });

  it("allows Writer to defer the exhaustive source audit to an independent Editor", () => {
    const result = gateWriterDraftForIndependentAudit(JSON.stringify({
      newsletter: writerValue.newsletter,
      social: writerValue.social,
      lengthException: writerValue.lengthException,
      reviewNotes: writerValue.reviewNotes,
    }));
    expect(result.acceptedForEditor).toBe(true);
    expect(result.newsletterAssertions).toEqual([writerValue.newsletter]);
    expect(result.canonicalHandoff).not.toHaveProperty("sourceChecks");
    expect(result.factualAccuracyVerified).toBe(false);
    expect(result.humanApproved).toBe(false);
  });

  it("rejects missing statuses, malformed evidence and changed boundaries", () => {
    const writer = gateWriterHandoff(JSON.stringify(writerValue));
    const malformed = structuredClone(editorValue) as unknown as Record<string, unknown>;
    malformed.newsletterEntries = [{
      exactDraftQuote: "Changed boundary.",
      sourceId: null,
      originalSourcePassage: null,
      evidence: ["not an evidence object"],
      explanation: "Malformed like the unseen run.",
    }];
    const result = gateEditorHandoff(JSON.stringify(malformed), writer, [source]);
    expect(result.acceptedForHumanReview).toBe(false);
    expect(result.issues.join("\n")).toMatch(/required audit schema|boundaries differ/);
  });

  it("refuses to run Editor when Writer has not passed", () => {
    const writer = gateWriterHandoff("not json");
    const result = gateEditorHandoff(JSON.stringify(editorValue), writer, [source]);
    expect(result.acceptedForHumanReview).toBe(false);
    expect(result.issues).toContain("Editor must not run because the Writer handoff did not pass its executable gate");
  });
});
