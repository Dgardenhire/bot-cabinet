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

export const BOT_RUNTIME_EVIDENCE: Record<string, {
  testedDate: string;
  proofPath: string;
  summary: string;
}> = {
  "daily-newspaper": {
    testedDate: "2026-09-23",
    proofPath: "/proof-room/daily-newspaper/runtime-summary.md",
    summary: "One bounded first-mission run passed using supplied fictional material: it produced a cited one-page edition, kept a missing meeting link in a review note, flagged an inconsistent weekday, and made no outside changes.",
  },
};

export function getBotRuntimeEvidence(slug: string) {
  return BOT_RUNTIME_EVIDENCE[slug];
}
