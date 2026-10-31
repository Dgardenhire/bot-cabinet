// The sponsor program (CR-12, CR-13 v3). Sponsors appear only on SPONSOR_PAGES, are labeled "Advertisement", and never
// touch test records, Bot pages, compare pages, Hermes pages, Agent Watch, downloads or the catalog.

/**
 * card: logo card near the top of every sponsored page, plus a line in the foot strip.
 * feature: name and two lines at the top of the foot strip.
 * line: name and one line in the foot strip (bot directories buy this).
 * setup: logo card on one setup guide only.
 */
export type SponsorTier = "card" | "feature" | "line" | "setup";

/** The setup guides that can carry a setup sponsor, keyed by their page directory under src/app. */
export type SetupGuide = "start/hermes" | "start/grok" | "start/dots";

export type Sponsor = {
  /** Stable id used in click analytics. */
  slug: string;
  tier: SponsorTier;
  name: string;
  /** Shown after the name, up to the tier's line limit. */
  line: string;
  /** https only. */
  url: string;
  /** Kind of product, such as "email for agents". Founding Cards are one per category. */
  category: string;
  /** Square logo hosted on botcabinet.com under /sponsors/, for card and setup sponsors. */
  logo?: string;
  /** The one guide a setup sponsor appears on. */
  setupPage?: SetupGuide;
  /** Date the slot went live, YYYY-MM-DD. */
  startedOn: string;
  /** Clicks counted from Vercel Analytics, updated monthly with the date they were counted. */
  clicks?: { count: number; asOf: string };
};

export const SPONSOR_LINE_MAX: Record<SponsorTier, number> = { card: 90, feature: 160, line: 60, setup: 120 };
export const SPONSOR_SLOTS: Record<Exclude<SponsorTier, "setup">, number> = { card: 3, feature: 4, line: 6 };

export const SETUP_GUIDES: Record<SetupGuide, { label: string; note: string }> = {
  "start/hermes": { label: "Hermes", note: "Bot Cabinet doesn't recommend a host. Hermes runs on your own computer too." },
  "start/grok": { label: "Grok Bot", note: "Bot Cabinet doesn't recommend one provider over another." },
  "start/dots": { label: "ChatGPT Dots", note: "Bot Cabinet doesn't recommend one provider over another." },
};

/** Prices for new buyers rise with monthly human visitors on sponsored pages; sponsors keep the price they joined at. */
export const SPONSOR_LADDER = [
  { label: "Under 2,500", card: 199, cardAfterFounding: 299, feature: 99, line: 49 },
  { label: "2,500 to 10,000", card: 399, cardAfterFounding: 399, feature: 149, line: 79 },
  { label: "10,000 to 50,000", card: 799, cardAfterFounding: 799, feature: 249, line: 129 },
] as const;

/** Index into SPONSOR_LADDER. Change it in a small PR when the published monthly count crosses a threshold. */
export const CURRENT_STAGE = 0;

export const SPONSOR_PROGRAM = {
  setupPrice: 99,
  newsletter: {
    issuePrice: 99,
    fourIssuePrice: 349,
    /** From the Oct 27, 2026 send. Update both when the list is re-counted. */
    recipients: 116,
    recipientsAsOf: "2026-10-27",
    weeklyClickers: "12 to 20",
    clickRate: "10 to 17 percent",
  },
  bundles: { cardAndNewsletter: 279, featureAndNewsletter: 179 },
  /** Stripe Payment Links. Each falls back to email until it exists. */
  checkout: {
    card: null as string | null,
    feature: null as string | null,
    line: null as string | null,
    setup: null as string | null,
    newsletterIssue: null as string | null,
    newsletterFour: null as string | null,
    cardAndNewsletter: null as string | null,
    featureAndNewsletter: null as string | null,
  },
  contact: "damon@linchpin.studio",
  /** When the first clean 30-day audience count is published. */
  audienceNumbersOn: "2026-12-01",
};

/** The pages that carry the top band and foot strip, as page directories under src/app ("" is the home page). */
export const SPONSOR_PAGES = ["", "bots", "start", "guides", "use-cases", "crew-kits", "start/hermes", "start/grok", "start/dots"] as const;
export type SponsorPage = (typeof SPONSOR_PAGES)[number];

/** AI platforms Bot Cabinet covers. Their companies can't sponsor, because Bot Cabinet compares and tests them. */
export const EXCLUDED_SPONSOR_DOMAINS = [
  "openai.com",
  "chatgpt.com",
  "anthropic.com",
  "claude.ai",
  "google.com",
  "gemini.google.com",
  "x.ai",
  "x.com",
  "meta.com",
  "meta.ai",
  "nousresearch.com",
];

export const SPONSORS: Sponsor[] = [];

export function sponsorsOfTier(tier: SponsorTier, sponsors: readonly Sponsor[] = SPONSORS) {
  return sponsors.filter((s) => s.tier === tier);
}

export function openSlots(tier: Exclude<SponsorTier, "setup">, sponsors: readonly Sponsor[] = SPONSORS) {
  return Math.max(0, SPONSOR_SLOTS[tier] - sponsorsOfTier(tier, sponsors).length);
}

export function setupSponsorFor(page: SponsorPage, sponsors: readonly Sponsor[] = SPONSORS) {
  return sponsors.find((s) => s.tier === "setup" && s.setupPage === page);
}

/** The current card price for a new buyer: the founding price until the founding slots fill, then the later price. */
export function currentCardPrice(sponsors: readonly Sponsor[] = SPONSORS) {
  const stage = SPONSOR_LADDER[CURRENT_STAGE];
  return openSlots("card", sponsors) > 0 ? stage.card : stage.cardAfterFounding;
}

/** The sponsor's host is a covered platform, or a subdomain of one. */
export function isExcludedSponsorUrl(url: string) {
  const host = new URL(url).hostname.toLowerCase();
  return EXCLUDED_SPONSOR_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}
