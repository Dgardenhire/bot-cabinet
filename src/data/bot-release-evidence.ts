export const REPRODUCED_BOT_EVIDENCE: Record<string, {
  hermesVersion: "0.21.1";
  testedDate: "2026-09-09";
  publishedDate: "2026-09-05";
  proofSlug: string;
}> = {
  curator: { hermesVersion: "0.21.1", testedDate: "2026-09-09", publishedDate: "2026-09-05", proofSlug: "curator-lineup-review" },
  reentry: { hermesVersion: "0.21.1", testedDate: "2026-09-09", publishedDate: "2026-09-05", proofSlug: "reentry-project-resumption" },
  receipt: { hermesVersion: "0.21.1", testedDate: "2026-09-09", publishedDate: "2026-09-05", proofSlug: "receipt-refund-case" },
};

export function getReproducedBotEvidence(slug: string) {
  return REPRODUCED_BOT_EVIDENCE[slug];
}
