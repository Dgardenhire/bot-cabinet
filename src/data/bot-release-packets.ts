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
    xPost: "New in Bot Cabinet: Reentry helps you resume a project without pretending the newest file is the approved one. It reconstructs the last confirmed checkpoint, open decisions and next useful action: https://botcabinet.com/bots/reentry/",
    status: "draft",
    humanApprovalRequired: true,
  },
  {
    botSlug: "receipt",
    portrait: "/downloads/bot-portraits/hermes/receipt-1024.png",
    socialCard: "/brand/social/showcase-receipt-v2-1200x630.jpg",
    xPost: "New in Bot Cabinet: Receipt keeps evidence, approvals and delivery records together—without turning an intention into a completed result. Free Hermes archive, Bot Passport and Grok build brief: https://botcabinet.com/bots/receipt/",
    status: "draft",
    humanApprovalRequired: true,
  },
];
