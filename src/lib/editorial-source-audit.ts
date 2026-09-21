export type EditorialSource = { id: string; text: string };
export type EditorialEvidenceOption = {
  evidenceId: string;
  sourceId: string;
  originalSourcePassage: string;
};
export type EditorialAuditStatus = "supported" | "unsupported" | "ambiguous";
export type EditorialAuditEntry = {
  exactDraftQuote: string;
  status: EditorialAuditStatus;
  sourceId: string | null;
  originalSourcePassage: string | null;
  evidence?: Array<{
    sourceId: string;
    originalSourcePassage: string;
  }>;
  explanation: string;
};

/** Segment the publishable body so every sentence must receive an audit entry.
 * The segmenter is mechanical; a passing structure does not prove that a cited
 * passage semantically supports the claim.
 */
export function segmentEditorialAssertions(draft: string) {
  return Array.from(
    new Intl.Segmenter("en", { granularity: "sentence" }).segment(draft),
    ({ segment }) => segment.trim(),
  ).flatMap(segment => segment.split(/(?<=\+\.)\s+(?=\d)/u).map(part => part.trim()))
    .filter(Boolean);
}

/** Prepare immutable evidence choices so a model selects exact source text
 * instead of attempting to reproduce quotations character for character.
 */
export function prepareEditorialEvidenceOptions(
  sources: readonly EditorialSource[],
): EditorialEvidenceOption[] {
  return sources.flatMap(source => segmentEditorialAssertions(source.text).map(
    (originalSourcePassage, index) => ({
      evidenceId: `${source.id}-${index + 1}`,
      sourceId: source.id,
      originalSourcePassage,
    }),
  ));
}

export function checkEditorialAudit(
  entries: readonly EditorialAuditEntry[],
  draft: string,
  originalSources: readonly EditorialSource[],
) {
  const issues: string[] = [];
  const sentences = segmentEditorialAssertions(draft);
  const sentenceCounts = new Map<string, number>();
  for (const sentence of sentences) sentenceCounts.set(sentence, (sentenceCounts.get(sentence) ?? 0) + 1);
  const auditedCounts = new Map<string, number>();
  const sources = new Map(originalSources.map(source => [source.id, source.text]));

  if (!sentences.length) issues.push("Publishable draft is empty");
  if (!entries.length) issues.push("No audit entries supplied; an empty audit does not establish correctness");

  entries.forEach((entry, index) => {
    const label = `Entry ${index + 1}`;
    if (!entry.exactDraftQuote.trim() || !sentenceCounts.has(entry.exactDraftQuote)) {
      issues.push(`${label}: draft quotation is not one exact segmented sentence`);
    } else {
      auditedCounts.set(entry.exactDraftQuote, (auditedCounts.get(entry.exactDraftQuote) ?? 0) + 1);
    }
    if (!entry.explanation.trim()) issues.push(`${label}: explanation is blank`);

    if (entry.status === "supported") {
      const evidence = entry.evidence?.length
        ? entry.evidence
        : entry.sourceId && entry.originalSourcePassage?.trim()
          ? [{ sourceId: entry.sourceId, originalSourcePassage: entry.originalSourcePassage }]
          : [];
      if (!evidence.length) {
        issues.push(`${label}: supported assertion requires a source ID and exact passage`);
      }
      evidence.forEach((item, evidenceIndex) => {
        const evidenceLabel = evidence.length > 1 ? `${label}, evidence ${evidenceIndex + 1}` : label;
        if (!item.sourceId || !item.originalSourcePassage.trim()) {
          issues.push(`${evidenceLabel}: supported assertion requires a source ID and exact passage`);
        } else if (!sources.has(item.sourceId)) {
          issues.push(`${evidenceLabel}: source ID does not exist in the original packet`);
        } else if (!sources.get(item.sourceId)!.includes(item.originalSourcePassage)) {
          issues.push(`${evidenceLabel}: source quotation is absent or not exact`);
        }
      });
      if (entry.evidence?.length && entry.sourceId !== null
        && !entry.evidence.some(item => item.sourceId === entry.sourceId)) {
        issues.push(`${label}: legacy source ID conflicts with the evidence array`);
      }
      if (entry.evidence?.length && entry.originalSourcePassage !== null
        && !entry.evidence.some(item => item.originalSourcePassage === entry.originalSourcePassage)) {
        issues.push(`${label}: legacy source passage conflicts with the evidence array`);
      }
    } else if (entry.sourceId !== null || entry.originalSourcePassage !== null || entry.evidence?.length) {
      issues.push(`${label}: ${entry.status} assertion must not masquerade as sourced`);
    }
  });

  sentenceCounts.forEach((expectedCount, sentence) => {
    const auditedCount = auditedCounts.get(sentence) ?? 0;
    if (auditedCount !== expectedCount) {
      issues.push(`Draft sentence audited ${auditedCount} time(s), expected ${expectedCount}: ${sentence}`);
    }
  });

  const unsupportedAssertions = entries.filter(entry => entry.status === "unsupported").length;
  const ambiguousAssertions = entries.filter(entry => entry.status === "ambiguous").length;
  const quotationsVerified = issues.length === 0;
  return {
    issues,
    sentenceCount: sentences.length,
    auditedEntryCount: entries.length,
    unsupportedAssertions,
    ambiguousAssertions,
    quotationsVerified,
    noUnsupportedAssertions: quotationsVerified && unsupportedAssertions === 0 && ambiguousAssertions === 0,
    semanticSupportVerified: false as const,
    factualAccuracyVerified: false as const,
    humanApproved: false as const,
  };
}

/** Legacy quote-only helper retained for earlier evidence and callers. */
export function checkEditorialAuditQuotes(
  entries: readonly { exactDraftQuote: string; originalSourcePassage: string | null }[],
  draft: string,
  originalSources: readonly string[],
) {
  const issues: string[] = [];
  entries.forEach((entry, index) => {
    if (!entry.exactDraftQuote.trim() || !draft.includes(entry.exactDraftQuote)) {
      issues.push(`Entry ${index + 1}: draft quotation is absent or not exact`);
    }
    if (entry.originalSourcePassage !== null && (
      !entry.originalSourcePassage.trim()
      || !originalSources.some(source => source.includes(entry.originalSourcePassage!))
    )) {
      issues.push(`Entry ${index + 1}: source quotation is absent or not exact`);
    }
  });
  if (!entries.length) issues.push("No audit entries supplied; an empty audit does not establish correctness");
  return { issues, quotationsVerified: issues.length === 0, factualAccuracyVerified: false as const, humanApproved: false as const };
}
