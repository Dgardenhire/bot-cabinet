export const LEGACY_BOT_SLUGS = [
  "scout",
  "researcher",
  "writer",
  "editor",
  "planner",
  "client",
  "coder",
  "ops",
  "professor",
  "architect",
  "founding-engineer",
  "chief-of-staff",
  "coach",
  "nova",
  "pulse",
  "story",
] as const;

export interface BotReleasePacket {
  botSlug: string;
  portrait: string;
  socialCard: string;
  xPost: string;
  status: "draft" | "approved" | "posted";
  humanApprovalRequired: true;
}

export const BOT_RELEASE_PACKETS: BotReleasePacket[] = [
  {
    botSlug: "daily-newspaper",
    portrait: "/downloads/bot-portraits/hermes/daily-newspaper-1024.png",
    socialCard: "/brand/social/showcase-daily-newspaper-v1-1200x630.jpg",
    xPost: "New in Bot Cabinet: Daily Newspaper turns the calendar notes, messages and reading you choose into one calm, source-linked page for the day ahead. Inspired by Karen X. Cheng's Grok Bot idea. Free Hermes files and first test: https://botcabinet.com/bots/daily-newspaper/",
    status: "draft",
    humanApprovalRequired: true,
  },
  {
    botSlug: "curator",
    portrait: "/downloads/bot-portraits/hermes/curator-1024.png",
    socialCard: "/brand/social/showcase-curator-v1-1200x630.jpg",
    xPost: "New in Bot Cabinet: Curator reviews your Bot lineup, spots overlap and drafts improvements with comparison tests. It proposes changes; you approve them. Free Hermes archive, Bot Passport and Grok build brief: https://botcabinet.com/bots/curator/",
    status: "draft",
    humanApprovalRequired: true,
  },
  {
    botSlug: "reentry",
    portrait: "/downloads/bot-portraits/hermes/reentry-1024.png",
    socialCard: "/brand/social/showcase-reentry-v1-1200x630.jpg",
    xPost: "New in Bot Cabinet: Reentry helps you pick up an interrupted project. Find the last approved files, decisions still to make and the next step: https://botcabinet.com/bots/reentry/",
    status: "draft",
    humanApprovalRequired: true,
  },
  {
    botSlug: "receipt",
    portrait: "/downloads/bot-portraits/hermes/receipt-1024.png",
    socialCard: "/brand/social/showcase-receipt-v2-1200x630.jpg",
    xPost: "New in Bot Cabinet: Receipt keeps receipts, emails, deadlines and next steps together while you resolve a return, refund or warranty issue. Free Hermes archive, Bot Passport and Grok build brief: https://botcabinet.com/bots/receipt/",
    status: "draft",
    humanApprovalRequired: true,
  },
];
