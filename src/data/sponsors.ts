// The sponsor program (CR-12). Sponsors appear only on SPONSOR_PAGES, are labeled "Advertisement", and never
// touch test records, Bot pages, compare pages, Hermes pages, downloads or the catalog.

export type Sponsor = {
  /** Stable id used in click analytics. */
  slug: string;
  name: string;
  /** One line shown after the name, up to SPONSOR_LINE_MAX characters. */
  line: string;
  /** https only. */
  url: string;
  /** Date the slot went live, YYYY-MM-DD. */
  startedOn: string;
  /** Clicks counted from Vercel Analytics, updated monthly with the date they were counted. */
  clicks?: { count: number; asOf: string };
};

export const SPONSOR_LINE_MAX = 90;

export const SPONSOR_PROGRAM = {
  foundingSlots: 3,
  foundingPrice: 199,
  laterPrice: 299,
  /** The Stripe Payment Link. Until it exists, the sponsor page offers email instead. */
  checkoutUrl: null as string | null,
  contact: "damon@linchpin.studio",
  /** When the first clean 30-day audience count is published. */
  audienceNumbersOn: "2026-12-01",
} as const;

/** The only pages that show the sponsor strip, as page directories under src/app ("" is the home page). */
export const SPONSOR_PAGES = ["", "bots", "start", "guides", "use-cases", "crew-kits"] as const;
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

export function openFoundingSlots(sponsors: readonly Sponsor[] = SPONSORS) {
  return Math.max(0, SPONSOR_PROGRAM.foundingSlots - sponsors.length);
}

/** The sponsor's host is a covered platform, or a subdomain of one. */
export function isExcludedSponsorUrl(url: string) {
  const host = new URL(url).hostname.toLowerCase();
  return EXCLUDED_SPONSOR_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}
