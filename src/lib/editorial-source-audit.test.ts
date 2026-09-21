import { expect, it } from "vitest";
import { checkEditorialAudit, checkEditorialAuditQuotes, prepareEditorialEvidenceOptions, segmentEditorialAssertions } from "./editorial-source-audit";

it("prepares stable exact evidence choices rather than reconstructed quotations", () => {
  expect(prepareEditorialEvidenceOptions([{
    id: "S1",
    text: "Reservations open October 27 through an online catalog, but the URL is missing. Admission is free.",
  }])).toEqual([
    {
      evidenceId: "S1-1",
      sourceId: "S1",
      originalSourcePassage: "Reservations open October 27 through an online catalog, but the URL is missing.",
    },
    {
      evidenceId: "S1-2",
      sourceId: "S1",
      originalSourcePassage: "Admission is free.",
    },
  ]);
});

it("separates a numeric social sentence after a plus-sign age shorthand", () => {
  expect(segmentEditorialAssertions("Free loans for cardholders 18+. 86 tools.")).toEqual([
    "Free loans for cardholders 18+.",
    "86 tools.",
  ]);
});

it("rejects reconstructed source quotations and invented draft excerpts", () => {
  const result = checkEditorialAuditQuotes([
    { exactDraftQuote: "Registration opens October 1.", originalSourcePassage: "Registration opens October 1. Registration link has NOT been supplied." },
    { exactDraftQuote: "Volunteers arrived", originalSourcePassage: null },
  ], "Registration opens October 1.", ["Registration opens October 1. Admission is free. Registration link has NOT been supplied."]);
  expect(result.quotationsVerified).toBe(false);
  expect(result.issues).toHaveLength(2);
});

it("accepts literal evidence without claiming semantic correctness or approval", () => {
  const result = checkEditorialAuditQuotes([
    { exactDraftQuote: "Volunteers repaired 11 items.", originalSourcePassage: "11 items were repaired" },
  ], "Volunteers repaired 11 items.", ["18 people attended; 11 items were repaired."]);
  expect(result.quotationsVerified).toBe(true);
  expect(result.factualAccuracyVerified).toBe(false);
  expect(result.humanApproved).toBe(false);
});

it("does not treat an empty audit as a pass", () => {
  expect(checkEditorialAuditQuotes([], "draft", ["source"]).quotationsVerified).toBe(false);
});

it("requires one audit entry for every exact sentence", () => {
  const draft = "Registration opens October 1. The link will arrive tomorrow.";
  expect(segmentEditorialAssertions(draft)).toEqual([
    "Registration opens October 1.",
    "The link will arrive tomorrow.",
  ]);
  const result = checkEditorialAudit([
    {
      exactDraftQuote: "Registration opens October 1.",
      status: "supported",
      sourceId: "S1",
      originalSourcePassage: "Registration opens October 1.",
      explanation: "Literal logistics claim.",
    },
  ], draft, [{ id: "S1", text: "Registration opens October 1. Registration link has NOT been supplied." }]);
  expect(result.quotationsVerified).toBe(false);
  expect(result.issues.join(" ")).toContain("The link will arrive tomorrow");
});

it("fails the publishable gate when unsupported assertions remain", () => {
  const result = checkEditorialAudit([
    {
      exactDraftQuote: "Volunteers repaired 11 items.",
      status: "unsupported",
      sourceId: null,
      originalSourcePassage: null,
      explanation: "The packet does not identify who repaired the items.",
    },
  ], "Volunteers repaired 11 items.", [{ id: "S2", text: "11 items were repaired." }]);
  expect(result.quotationsVerified).toBe(true);
  expect(result.unsupportedAssertions).toBe(1);
  expect(result.noUnsupportedAssertions).toBe(false);
  expect(result.factualAccuracyVerified).toBe(false);
});

it("validates exact coverage without pretending quotation match proves meaning", () => {
  const result = checkEditorialAudit([
    {
      exactDraftQuote: "Volunteers repaired 11 items.",
      status: "supported",
      sourceId: "S2",
      originalSourcePassage: "11 items were repaired",
      explanation: "The auditor claims the passage supports the sentence.",
    },
  ], "Volunteers repaired 11 items.", [{ id: "S2", text: "18 people attended; 11 items were repaired." }]);
  expect(result.quotationsVerified).toBe(true);
  expect(result.noUnsupportedAssertions).toBe(true);
  expect(result.semanticSupportVerified).toBe(false);
  expect(result.factualAccuracyVerified).toBe(false);
  expect(result.humanApproved).toBe(false);
});

it("rejects source passages attached to unresolved claims", () => {
  const result = checkEditorialAudit([
    {
      exactDraftQuote: "Registration opens October 1.",
      status: "ambiguous",
      sourceId: "S9",
      originalSourcePassage: "Registration opens October 1.",
      explanation: "Needs review.",
    },
  ], "Registration opens October 1.", [{ id: "S1", text: "Registration opens October 1." }]);
  expect(result.issues.join(" ")).toContain("must not masquerade as sourced");
});

it("supports a compound assertion only when every evidence passage is literal", () => {
  const sources = [{ id: "S1", text: "Capacity is 24. Registration opens October 1. Admission is free." }];
  const exact = checkEditorialAudit([{
    exactDraftQuote: "Free admission. 24 capacity.",
    status: "supported",
    sourceId: null,
    originalSourcePassage: null,
    evidence: [
      { sourceId: "S1", originalSourcePassage: "Admission is free." },
      { sourceId: "S1", originalSourcePassage: "Capacity is 24." },
    ],
    explanation: "Both atomic facts are present in S1.",
  }], "Free admission. 24 capacity.", sources);
  expect(exact.noUnsupportedAssertions).toBe(true);

  const reconstructed = checkEditorialAudit([{
    exactDraftQuote: "Free admission. 24 capacity.",
    status: "supported",
    sourceId: null,
    originalSourcePassage: null,
    evidence: [{ sourceId: "S1", originalSourcePassage: "Admission is free. Capacity is 24." }],
    explanation: "This passage was reconstructed in a different order.",
  }], "Free admission. 24 capacity.", sources);
  expect(reconstructed.noUnsupportedAssertions).toBe(false);
  expect(reconstructed.issues.join(" ")).toContain("absent or not exact");
});

it("allows consistent legacy source fields beside evidence but rejects conflicts", () => {
  const sources = [
    { id: "S1", text: "Admission is free." },
    { id: "S2", text: "Admission is $5." },
  ];
  const base = {
    exactDraftQuote: "Free.",
    status: "supported" as const,
    sourceId: "S1",
    originalSourcePassage: null,
    evidence: [{ sourceId: "S1", originalSourcePassage: "Admission is free." }],
    explanation: "The legacy source ID agrees with the literal evidence item.",
  };
  expect(checkEditorialAudit([base], "Free.", sources).noUnsupportedAssertions).toBe(true);
  const conflicting = { ...base, sourceId: "S2" };
  const result = checkEditorialAudit([conflicting], "Free.", sources);
  expect(result.noUnsupportedAssertions).toBe(false);
  expect(result.issues.join(" ")).toContain("conflicts with the evidence array");
});
