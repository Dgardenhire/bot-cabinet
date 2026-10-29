/**
 * Publication dates for the sitemap and the RSS feed. Hand-reviewed and committed;
 * nothing here, and no test, runs git. Look dates up by exact key only.
 *
 * How each date was found (read-only git, branch content/gemini-guide-2026-10-28 at 28adb69
 * plus PR #70 at 340d718):
 * - addedAt: the oldest `git log --diff-filter=A` date for the item's own files.
 *   Bots: public/downloads/starter-bots/<slug>/, portable-bot-packs/<slug>.md and .json,
 *   grok-bot-templates/<slug>.md. Specialists: public/downloads/specialists/<slug>.md.
 *   Use cases: public/downloads/use-cases/<slug>.md.
 * - updatedAt: the newest commit that changed the item's own entry (`git log -L` over the
 *   entry's lines in src/data/starter-bots.ts, public/downloads/specialists/collection.json
 *   or src/data/use-cases.ts), never earlier than addedAt.
 * - Static routes: the newest commit that changed the route's own page files or its data.
 * - Guides are not here. Each guide's only date is `updated` in src/data/guides.ts.
 *
 * Commits left out because they changed wording only, across many items at once:
 * - 3a3425e (2026-10-22) Replace "Codex" with neutral AI-review wording (all 18 specialists)
 * - def2b88 (2026-10-15) plain-language Bot and crew copy (17 of 21 Bot entries)
 * - 340d718 (2026-10-27) PR #70: rel and analytics attributes only (static routes)
 */

export type ContentDates = { addedAt: string; updatedAt: string };

// Starter Bots, in src/data/starter-bots.ts order.
export const BOT_DATES: Record<string, ContentDates> = {
  scout: { addedAt: "2026-08-26", updatedAt: "2026-08-26" }, // added bf55e20, updated bf55e20
  researcher: { addedAt: "2026-08-26", updatedAt: "2026-08-26" }, // added bf55e20, updated bf55e20
  writer: { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated a934fc2
  editor: { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated a934fc2
  planner: { addedAt: "2026-08-26", updatedAt: "2026-08-26" }, // added bf55e20, updated bf55e20
  client: { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  coder: { addedAt: "2026-08-26", updatedAt: "2026-08-26" }, // added bf55e20, updated bf55e20
  ops: { addedAt: "2026-08-26", updatedAt: "2026-10-17" }, // added bf55e20, updated 47f3c06
  professor: { addedAt: "2026-08-26", updatedAt: "2026-10-15" }, // added bf55e20, updated 816fc24
  architect: { addedAt: "2026-08-26", updatedAt: "2026-09-10" }, // added bf55e20, updated 44508f3
  "founding-engineer": { addedAt: "2026-08-26", updatedAt: "2026-08-26" }, // added bf55e20, updated bf55e20
  "chief-of-staff": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  coach: { addedAt: "2026-08-26", updatedAt: "2026-10-15" }, // added bf55e20, updated 816fc24
  nova: { addedAt: "2026-08-26", updatedAt: "2026-09-10" }, // added bf55e20, updated 44508f3
  pulse: { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  story: { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  "daily-newspaper": { addedAt: "2026-09-21", updatedAt: "2026-10-07" }, // added f36db51, updated 55fe5ce
  curator: { addedAt: "2026-09-05", updatedAt: "2026-10-07" }, // added 52bfe4d, updated 55fe5ce
  reentry: { addedAt: "2026-09-05", updatedAt: "2026-09-08" }, // added 52bfe4d, updated a4d9288
  receipt: { addedAt: "2026-09-05", updatedAt: "2026-10-15" }, // added 52bfe4d, updated 816fc24
  "unstick-me": { addedAt: "2026-10-19", updatedAt: "2026-10-19" }, // added b21ae67, updated b21ae67
};

// Specialists, in collection.json order.
export const SPECIALIST_DATES: Record<string, ContentDates> = {
  "ad-spend-review": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "bot-porter": { addedAt: "2026-10-06", updatedAt: "2026-10-07" }, // added 7a8158f, updated 55fe5ce
  "bug-examiner": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "call-coach": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "campaign-builder": { addedAt: "2026-10-06", updatedAt: "2026-10-17" }, // added 7a8158f, updated 47f3c06
  "change-reviewer": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "clip-planner": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "competitor-brief": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "deal-reviewer": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "habit-coach": { addedAt: "2026-10-06", updatedAt: "2026-10-17" }, // added 7a8158f, updated 47f3c06
  "lead-qualifier": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "outreach-coordinator": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "pipeline-review": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "pitch-coach": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "search-presence": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "skill-builder": { addedAt: "2026-10-06", updatedAt: "2026-10-07" }, // added 7a8158f, updated 55fe5ce
  "subscription-review": { addedAt: "2026-10-06", updatedAt: "2026-10-06" }, // added 7a8158f, updated 7a8158f
  "visual-producer": { addedAt: "2026-10-06", updatedAt: "2026-10-17" }, // added 7a8158f, updated 47f3c06
};

// Use cases, in src/data/use-cases.ts order.
export const USE_CASE_DATES: Record<string, ContentDates> = {
  "sort-inbox-for-review": { addedAt: "2026-10-18", updatedAt: "2026-10-18" }, // added 7b6c85f, updated 7b6c85f
  "check-outdated-guide": { addedAt: "2026-10-18", updatedAt: "2026-10-18" }, // added 7b6c85f, updated 7b6c85f
  "review-product-feedback": { addedAt: "2026-10-18", updatedAt: "2026-10-18" }, // added 7b6c85f, updated 7b6c85f
  "school-paperwork": { addedAt: "2026-10-15", updatedAt: "2026-10-18" }, // added e7621ce, updated 7b6c85f
  "check-unbilled-work": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "check-contractor-invoices": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "preserve-family-stories": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "prepare-warranty-claim": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "draft-product-listings": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "plan-home-project": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "turn-feedback-into-issues": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "practice-a-language": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "practice-customer-conversations": { addedAt: "2026-10-15", updatedAt: "2026-10-15" }, // added e7621ce, updated e7621ce
  "personal-morning-newspaper": { addedAt: "2026-09-20", updatedAt: "2026-10-07" }, // added a934fc2, updated 55fe5ce
  "morning-industry-briefing": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "weekly-newsletter": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  "social-media-content-set": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "client-meeting-follow-up": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "client-proposal": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "grant-opportunity-review": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated 2454942
  "website-content-update": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated b56554c
  "project-launch-plan": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  "software-feature-build": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated 2454942
  "operations-status-report": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "study-and-certification-plan": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "customer-request-response": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated aab10de
  "new-venture-evaluation": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated b56554c
  "growth-experiment": { addedAt: "2026-08-26", updatedAt: "2026-09-20" }, // added bf55e20, updated 2454942
  "leadership-weekly-review": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  "product-technology-direction": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
  "narrative-message-system": { addedAt: "2026-08-26", updatedAt: "2026-10-07" }, // added bf55e20, updated 55fe5ce
};

// Static routes, keyed exactly as src/app/sitemap.ts lists them ("" is the home page).
export const STATIC_ROUTE_DATES: Record<string, string> = {
  "": "2026-10-27", // 3bb559c
  "/fit": "2026-09-05", // 0b3a965
  "/start": "2026-10-15", // e7621ce
  "/start/hermes": "2026-10-16", // c09f698
  "/hermes": "2026-10-27", // 3bb559c
  "/hermes/manual": "2026-10-16", // 8222e64
  "/start/grok": "2026-10-27", // 3bb559c
  "/start/dots": "2026-10-27", // 3bb559c
  "/compare": "2026-10-28", // 28adb69
  "/bots": "2026-10-19", // b21ae67
  "/workbench": "2026-10-07", // 55fe5ce
  "/workshop": "2026-10-07", // 55fe5ce
  "/portraits": "2026-09-04", // acf99ee
  "/use-cases": "2026-10-18", // 7b6c85f
  "/starter-pack": "2026-10-27", // 3bb559c
  "/crew-kits": "2026-10-16", // 68367bd
  "/proof": "2026-10-17", // 47f3c06
  "/watch": "2026-10-28", // 28adb69
  "/platforms/grok-bot": "2026-10-27", // 3bb559c
  "/community": "2026-10-07", // 55fe5ce
  "/guides": "2026-10-28", // 28adb69
  "/trust": "2026-10-27", // 3bb559c
  "/contribute": "2026-08-27", // 86c65fa
  "/about": "2026-08-27", // 86c65fa
};

// The /start/chatgpt/<slug> and /start/grok/<slug> page templates. Each page is dated by
// whichever is newer: its template or its Bot's updatedAt.
export const START_PAGE_TEMPLATE_DATES: Record<"chatgpt" | "grok", string> = {
  chatgpt: "2026-09-29", // c33e0eb
  grok: "2026-10-07", // 55fe5ce
};

function lookup<T>(table: Record<string, T>, key: string, kind: string): T {
  if (!Object.hasOwn(table, key)) {
    throw new Error(`content-dates: no ${kind} entry for "${key}"`);
  }
  return table[key];
}

export const botDates = (slug: string) => lookup(BOT_DATES, slug, "Bot");
export const specialistDates = (slug: string) => lookup(SPECIALIST_DATES, slug, "specialist");
export const useCaseDates = (slug: string) => lookup(USE_CASE_DATES, slug, "use case");
export const staticRouteDate = (route: string) => lookup(STATIC_ROUTE_DATES, route, "static route");

export function startPageDate(platform: "chatgpt" | "grok", slug: string) {
  const template = START_PAGE_TEMPLATE_DATES[platform];
  const bot = botDates(slug).updatedAt;
  return bot > template ? bot : template;
}
