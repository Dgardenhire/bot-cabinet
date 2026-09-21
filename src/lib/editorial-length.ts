export interface EditorialDraft {
  newsletter: string;
  social: string;
  lengthException?: {
    reason: "source-shortfall";
    explanation: string;
  } | null;
}

/** Counts whitespace-separated body tokens containing a Unicode letter or number.
 * Headline, sources and review notes must be supplied separately, not in the body.
 * Social length is Unicode code points, NOT X's weighted URL/emoji rules.
 */
export function measureEditorialDraft(draft: EditorialDraft) {
  const newsletterWords = draft.newsletter.trim().split(/\s+/u)
    .filter(token => /[\p{L}\p{N}]/u.test(token)).length;
  const socialCodePoints = Array.from(draft.social).length;
  const newsletterWithinRange = newsletterWords >= 250 && newsletterWords <= 350;
  const hasLengthException = draft.lengthException !== undefined && draft.lengthException !== null;
  const declaredSourceShortfall = newsletterWords > 0
    && newsletterWords < 250
    && draft.lengthException?.reason === "source-shortfall"
    && draft.lengthException.explanation.trim().length > 0;
  const newsletterLengthDisposition = newsletterWithinRange
    ? "within-range"
    : declaredSourceShortfall
      ? "declared-source-shortfall"
      : "outside-range";
  return {
    newsletterWords,
    newsletterWithinRange,
    newsletterLengthDisposition,
    lengthExceptionConsistent: newsletterWithinRange ? !hasLengthException : declaredSourceShortfall,
    newsletterMechanicallyAccepted: (newsletterWithinRange && !hasLengthException) || declaredSourceShortfall,
    sourceShortfallVerified: false as const,
    socialCodePoints,
    socialWithinCodePointLimit: socialCodePoints > 0 && socialCodePoints <= 280,
    xWeightedLengthVerified: false as const,
    factualAccuracyVerified: false as const,
    humanApproved: false as const,
  };
}
