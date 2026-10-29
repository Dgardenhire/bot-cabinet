export type WatchEvidence = "observed" | "provider-claim" | "cabinet-tested";
export type WatchResponseStatus = "published" | "prepared" | "testing" | "watching";
export type WatchBotEvidence = "listed" | "inspected" | "imported" | "task-tested" | "repeated";
export type WatchBotDecision = "improve-existing" | "test-adaptation" | "write-guide" | "add-new" | "watch";

export type WatchBotDetails = {
  name: string;
  creator: string;
  platform: string;
  job: string;
  requiredAccess: string;
  outsideActions: string;
  evidenceStatus: WatchBotEvidence;
  cabinetDecision: WatchBotDecision;
  cabinetFit: string;
  closestCabinetMatch: { label: string; href: string };
  /** The Bot Cabinet template this bot became. Required once cabinetDecision is "add-new". */
  cabinetTemplate?: { label: string; href: string };
};

export type AgentWatchItem = {
  slug: string;
  observedOn: string;
  reviewAgainBy: string;
  title: string;
  signal: string;
  evidence: WatchEvidence;
  whyItMatters: string;
  cabinetResponse: string;
  responseStatus: WatchResponseStatus;
  limits: string;
  sources: { label: string; href: string }[];
  cabinetLinks?: { label: string; href: string }[];
  botDetails?: WatchBotDetails;
};

export const AGENT_WATCH_ITEMS: AgentWatchItem[] = [
  {
    slug: "claude-duet-research-preview",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Claude Duet opens as a waitlisted agent that works in the background",
    signal:
      "Anthropic opened a research preview of Claude Duet on October 21, 2026, by waitlist, starting with Pro and Max subscribers in the US. It is a standalone app on iOS and Android and also runs on claude.ai. Each morning it sends a short brief, it checks connected accounts every few hours, and it carries over the memory, skills and connected apps from your Claude account.",
    evidence: "provider-claim",
    whyItMatters:
      "Because Duet uses the skills already on your Claude account, a skill you add to Claude is one way to give Duet a specific job. Anthropic says Duet asks before it sends a message, makes a payment, signs a document or deletes anything. Its October 23 safety article adds that paying or sending money, deleting an order and creating an account are never covered by a “don't ask me again” rule, and that trading securities, moving money between accounts and accessing someone else's account are off-limits even with your approval.",
    cabinetResponse:
      "If you get access, start with one read-only job. Tell Duet in plain words what to watch, how often to tell you and what to leave alone; Anthropic says you can tell it what you want to hear about and how often. Read every approval card, including each recipient, before you confirm.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet does not have Duet access and has not run any Bot in it. Anthropic's help article describes no separate schedule screen and names plugins only by example, such as the small business plugin. Whether a skill you uploaded yourself behaves the same way in Duet is untested. Duet is not yet available on Team or Enterprise plans.",
    sources: [
      { label: "Anthropic: Introducing Claude Duet (October 21, 2026)", href: "https://claude.com/resources/articles/claude-duet" },
      { label: "Anthropic: Claude Duet safety, privacy and security (October 23, 2026)", href: "https://claude.com/resources/articles/claude-duet-safety-privacy-and-security" },
      { label: "Claude Help Center: Get started with Claude Duet", href: "https://support.claude.com/en/articles/17631495-get-started-with-claude-duet" },
    ],
    cabinetLinks: [{ label: "Use a Bot on another platform", href: "/guides/use-a-bot-on-another-platform" }],
  },
  {
    slug: "email-scam-filter",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Email Scam Filter scores suspicious mail without touching it",
    signal:
      "Brian Roemmele shared Email Scam Filter, a Grok Bot, on October 13, 2026. It checks Gmail every morning, gives each suspicious message a 0 to 100 risk score using current alerts from sources including the FTC, FBI, BBB, CISA and AARP, and names the red flags, such as a forged sender or a lookalike link. He says it is read-only and never clicks, replies or deletes.",
    evidence: "observed",
    whyItMatters:
      "A read-only check can warn about phishing, fake invoices and impostor messages without giving an agent power over your inbox. A score is a warning, not proof that a message is safe.",
    cabinetResponse:
      "Bot Cabinet is preparing its own read-only template from the idea and will credit Brian Roemmele's original; it is not available yet.",
    responseStatus: "testing",
    limits:
      "Bot Cabinet has not added or run the original template and did not copy its instructions. Bot Cabinet's own template is not available yet and has not been tested on a real inbox.",
    sources: [
      { label: "Brian Roemmele's post (October 13, 2026)", href: "https://x.com/BrianRoemmele/status/2110008406807568813" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/0iuz7X3hVDGJhJIBWTTZ_" },
    ],
    cabinetLinks: [{ label: "Sort an inbox for review", href: "/use-cases/sort-inbox-for-review" }],
    botDetails: {
      name: "Email Scam Filter",
      creator: "Brian Roemmele",
      platform: "Grok Bot",
      job: "Reads Gmail each morning and scores suspicious messages for scam risk, with the red flags and safe next steps.",
      requiredAccess: "A Grok Bot account and read access to Gmail.",
      outsideActions: "None described. The creator says it never clicks, replies or deletes. Never click a link in a flagged message to check it; go to the company's own site or app instead.",
      evidenceStatus: "inspected",
      cabinetDecision: "test-adaptation",
      cabinetFit: "No Bot Cabinet Bot checks mail for scams. A read-only cross-platform template written from the idea is being prepared and is not available yet.",
      closestCabinetMatch: { label: "Sort an inbox for review", href: "/use-cases/sort-inbox-for-review" },
    },
  },
  {
    slug: "gemini-gems-become-skills",
    observedOn: "2026-10-28",
    reviewAgainBy: "2026-11-10",
    title: "Gemini Gems on personal accounts (18 and over) go read-only and become skills on November 17, then disappear December 17",
    signal:
      "Google is replacing Gems with skills in the Gemini app. For personal Google accounts of people 18 and over, Gems transition to skills and become read-only on November 17, 2026, and are removed on December 17, 2026. Workspace business, enterprise and nonprofit accounts follow in March 2027 and education accounts in June 2027. Google has also renamed Gemini Spark to Task.",
    evidence: "provider-claim",
    whyItMatters:
      "Gemini accepts a SKILL.md file, or a folder or .zip with SKILL.md in its main folder. Each Bot's Agent Skill is a single SKILL.md that meets those rules; Bot Cabinet has not uploaded one to Gemini yet. Google says skills will be shareable in the coming weeks; until then, each person uploads their own. Skills work without a paid plan, while tasks need Google AI Pro or Ultra and are not offered in the European Economic Area, Nigeria, Switzerland or the United Kingdom.",
    cabinetResponse:
      "Google says it will turn your Gems into skills automatically, along with supported files. Files beyond the 100 MB limit are dropped, largest first, and some file types, including audio, video, older Office files and archives, are left out. Gems by Google Labs go away on November 17 as well. Before November 17, save each Gem's instructions. After it, check each converted skill and download any missing files from the Gem before December 17. To add a Bot, download its Agent Skill, a single SKILL.md file, from the Bot's page and upload it at gemini.google.com or in the Gemini app on a Mac. Upload that file by itself, since the Bot's .zip pack keeps it in a subfolder.",
    responseStatus: "published",
    limits:
      "Bot Cabinet has not uploaded a skill to Gemini. Google gives no date for skill sharing, and accounts for people under 18 will transition later. Scripts in a skill cannot make requests to outside websites.",
    sources: [
      { label: "Google Help: About the transition from Gems to skills", href: "https://support.google.com/gemini/answer/18560919?hl=en" },
      { label: "Google Help: Create and manage skills", href: "https://support.google.com/gemini/answer/17094296?hl=en" },
      { label: "Google Help: Manage your tasks (Where did Spark go?)", href: "https://support.google.com/gemini/answer/17094507?hl=en" },
    ],
    cabinetLinks: [
      { label: "Read the Gemini guide", href: "/guides/gemini-skills-and-tasks/" },
    ],
  },
  {
    slug: "grok-bot-october-sends-without-drafts",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Grok Bot can now send some emails and Slack messages without a draft card",
    signal:
      "Grok Bot's October 23, 2026 release (v0.75.5) says emails and Slack messages you ask a Bot to send go out once Auto-review allows them, while sends on routine and other turns still wait as drafts. The same release added the Vault, where a Bot can save your logins, cards and contact info and fill them in to sign in or check out. Earlier in October, Bots gained X Money and Stripe Link (October 11) and Shop Pay (October 22) as ways to pay. Grok Bot announced X search on October 7, and its October 11 changelog entry adds that no X account connection is needed. It announced Pages for reports, memos and dashboards on October 21. On October 2 it renamed the in-app Marketplace to Connect Apps and moved Bot templates to the web. Grok Bot is made by SpaceXSI (SpaceXAI LLC); accounts and help run through Cursor.",
    evidence: "provider-claim",
    whyItMatters:
      "Setup steps that assume every send becomes a draft are now out of date, including Bot Cabinet's own Grok Bot guide before this update. Since October 14, turning on Disable drafts for a Bot has also let it send email from its own address with no draft card. Grok Bot's documentation says Ask first rules always stop matching actions and win when an allow rule also matches.",
    cabinetResponse:
      "Before you ask a Bot to send anything, open Settings > General > Auto-review and add an Ask first rule, such as “Ask first before sending any email or Slack message.” Add another for purchases before you save a card in the Vault. Send a test message to yourself and confirm that an approval card appears. Look for templates on the web marketplace at x.ai/bot/marketplace.",
    responseStatus: "published",
    limits:
      "Bot Cabinet has not tested these changes in the app. Elon Musk posted on October 25 that Grok Bot can now call someone or a business for you; as of October 27, calling is not in the official changelog, whose newest release is v0.75.8 from October 24.",
    sources: [
      { label: "Grok Bot changelog", href: "https://x.ai/changelog/bot" },
      { label: "Grok Bot docs: Approvals, security and privacy", href: "https://docs.x.ai/grok-bot/approvals-security-and-privacy.md" },
      { label: "@bot on X: X search (October 7, 2026)", href: "https://x.com/bot/status/2107949161878606089" },
      { label: "@bot on X: Pages (October 21, 2026)", href: "https://x.com/bot/status/2112992872857252082" },
      { label: "Elon Musk on X: calling (October 25, 2026)", href: "https://x.com/elonmusk/status/2114365361068138990" },
      { label: "SpaceXSI terms of service", href: "https://x.ai/legal/terms-of-service" },
    ],
    cabinetLinks: [
      { label: "Read the Grok Bot guide", href: "/platforms/grok-bot" },
      { label: "Set up Scout in Grok Bot", href: "/start/grok" },
    ],
  },
  {
    slug: "hermes-plugin-catalog-passes-850",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Hermes's reviewed plugin catalog passes 850 listings, including Bot builders",
    signal:
      "Nous Research launched a Plugin Catalog for Hermes Agent with its v0.22.0 release, published October 14, 2026, which says each of its 600 entries is pinned to a reviewed commit. On October 27, the catalog folder held 860 plugin listings, up from 348 on October 1. Listings added since October 1 include Hermes Agent Builder, Crew, Hermes Teammates and Bot HQ, which help people build, coordinate or manage Bots, and Bot Cabinet's own Cabinet plugin at version 0.3.11.",
    evidence: "observed",
    whyItMatters:
      "Hermes users now have several ways to build and run Bots inside Hermes itself. The release notes say each listing is pinned to a reviewed commit; they do not say the plugins were tested on real tasks.",
    cabinetResponse:
      "Add one plugin at a time. Read its catalog listing first, including what it says it accesses, and check the Hermes version it requires. Cabinet's listing requires Hermes 0.22.0 or later.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet counted the listing files in the public repository and read the four Bot-related listings named here; it has not installed or tested them. Cabinet's own listing says it calls private Hermes modules, so a Hermes update can break it.",
    sources: [
      { label: "Hermes Agent v0.22.0 release notes", href: "https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0" },
      { label: "Hermes plugin catalog folder", href: "https://github.com/NousResearch/hermes-agent/tree/main/plugin-catalog" },
      { label: "Cabinet catalog listing", href: "https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/bot-cabinet-v2.yaml" },
      { label: "Hermes Agent Builder", href: "https://github.com/itsflownium/hermes-agent-builder" },
      { label: "Crew", href: "https://github.com/macd2/Crew" },
      { label: "Hermes Teammates", href: "https://github.com/100yenadmin/hermes-teammates" },
      { label: "Bot HQ", href: "https://github.com/RohanRJ389/hermes-bot-hq" },
    ],
    cabinetLinks: [{ label: "Bot Cabinet in Hermes", href: "/hermes" }],
  },
  {
    slug: "instinct-spending-balance-and-group-chats",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Instinct adds a spending balance, the iPhone Action Button and group chats",
    signal:
      "Instinct, a personal assistant you text or call, launched Link balance with Stripe on October 26, 2026: you add money and set a per-purchase limit, and Instinct can buy within those limits. It is rolling out across the US, with New York still pending. Founder Noah Shinn also announced Instinct on the iPhone Action Button for iPhone 15 Pro and newer on October 25, and on October 27 posted that group chats are open to everyone on iMessage, where each group gets its own Instinct that knows only what is in the chat.",
    evidence: "provider-claim",
    whyItMatters:
      "Instinct says there are no new interfaces: you text or call it, and its own setup steps tell you to ask your Instinct. A standing job is therefore a message you send. A per-purchase limit is a cap you can set before any job that buys things.",
    cabinetResponse:
      "Send one kickoff message that names the job, how often to check, when to stop, what it must ask before doing and the most it may spend. For any job that could buy something, set a small Link balance and a low per-purchase limit first.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not used Instinct. Instinct's terms say you must be 18 or older to use it. New users need an invite or a waitlist spot, and Instinct publishes no price. Fortune reported in September that it is free and in an invite-only beta. TechCrunch reported in August that people can reach it through WhatsApp, but Instinct's own pages do not mention WhatsApp.",
    sources: [
      { label: "Instinct", href: "https://instinct.com/" },
      { label: "Instinct terms of service", href: "https://instinct.com/terms" },
      { label: "Instinct on X: Link balance (October 26, 2026)", href: "https://x.com/instinct/status/2114799582760861732" },
      { label: "Noah Shinn on X: Action Button (October 25, 2026)", href: "https://x.com/noahrshinn/status/2114518299824553988" },
      { label: "Noah Shinn on X: group chats (October 27, 2026)", href: "https://x.com/noahrshinn/status/2115142114711646446" },
      { label: "Fortune (September 30, 2026)", href: "https://fortune.com/2026/09/30/noah-shinn-instinct-ai-assistant-meta-muse-alexandr-wang-tech-series-c-ai-agent-mark-zuckerberg/" },
      { label: "TechCrunch (August 24, 2026)", href: "https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/" },
    ],
  },
  {
    slug: "muse-canada-japan-and-shared-artifacts",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Muse reaches Canada and Japan, and its shared pages return after a fix",
    signal:
      "Meta's Muse account announced that Muse reached Canada on September 18, 2026, and Japan on October 22. In the week of October 19, Meta turned off sharing for Muse artifacts after a security researcher found that some shared artifact links could be discovered through passive DNS records. On October 22, David Singleton of Meta Superintelligence Labs said the flaw was fixed and sharing was back on, and that the problem affected shared artifacts, not chat sharing.",
    evidence: "provider-claim",
    whyItMatters:
      "Meta's About Muse subscriptions page says Muse is free with a usage limit, with Power ($20 a month) and Maximum ($100 a month) plans for more use. Meta says Muse's skills are built in and developed by Meta, and the page describes no way to add your own skills. You can ask Muse to build a custom connector to another service, but Meta does not review custom connectors or how they use your information.",
    cabinetResponse:
      "Give Muse a Bot Cabinet job as a message: what to do, how often, and what it must ask before doing. Under Settings > Permissions, keep connectors on Ask for some actions or Always ask, and do not choose Always allow for anything that sends or spends. Do not rely on Muse links shared before October 22; anyone opening one now sees a note asking for the new link.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not run a job in Muse. Meta says Muse and its subscriptions are in limited testing and not available in all locations. Muse's Canada announcement said Android was coming soon; whether it has arrived was not checked.",
    sources: [
      { label: "Muse on X: Canada (September 18, 2026)", href: "https://x.com/Muse/status/2101071767838372272" },
      { label: "Muse on X: iOS and web, Android coming soon (September 18, 2026)", href: "https://x.com/Muse/status/2101071769448935749" },
      { label: "Muse on X: Japan (October 22, 2026)", href: "https://x.com/Muse/status/2113404740931670283" },
      { label: "David Singleton on X: shared artifacts update (October 22, 2026)", href: "https://x.com/dps/status/2113317986635485559" },
      { label: "Meta Help: About Muse subscriptions", href: "https://www.meta.com/help/subscriptions/1021145227643680/" },
      { label: "Meta Help: How Muse works with skills", href: "https://www.meta.com/help/superintelligence/2797651547267109/" },
      { label: "Meta Help: How Muse works with Connectors", href: "https://www.meta.com/help/superintelligence/1687253048996149/" },
      { label: "Meta Help: How Muse works with your guidance and approval", href: "https://www.meta.com/help/superintelligence/1385290430137537/" },
    ],
  },
  {
    slug: "spam-call-scrubber",
    observedOn: "2026-10-27",
    reviewAgainBy: "2026-11-03",
    title: "Spam-Call Scrubber asks people-search sites to remove your phone number",
    signal:
      "Arash (@MinimalDuck) shared a Grok Bot on October 15, 2026, that finds your phone number on people-search sites and data brokers, submits the opt-outs, finishes the email confirmations and checks again on a schedule you choose. His post had about 4.8 million views when Bot Cabinet checked on October 27. Liam (@liam_fallen) shared a similar Grok Bot, Agent Zero, on September 17.",
    evidence: "observed",
    whyItMatters:
      "The job needs only a browser and an email inbox, so it can be set up on most agents. Removing a listing makes a number harder to find, but it does not stop a caller who already has it, and some people-search sites list people again or reject opt-outs.",
    cabinetResponse:
      "Bot Cabinet is preparing its own template from the idea and will credit Arash's original; it is not available yet.",
    responseStatus: "testing",
    limits:
      "Bot Cabinet has not added or run Arash's template and did not copy its instructions. Bot Cabinet's own template is not available yet and has not been tested on a real account. Some sites' terms ban automated requests; Spokeo's, for example, prohibit using any robot, spider or other automatic device to send it queries.",
    sources: [
      { label: "Arash's post (October 15, 2026)", href: "https://x.com/MinimalDuck/status/2110712459405464057" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/fUj6TYhiW_cjtzWvbsFgz" },
      { label: "Agent Zero by Liam", href: "https://x.ai/bot/DFnZYjCELW2QdywUWZRiG" },
      { label: "MonetizeAI: what the template can and cannot do (October 23, 2026)", href: "https://monetizeai.substack.com/p/free-grok-bot-template-goes-viral" },
      { label: "California DROP", href: "https://privacy.ca.gov/drop/" },
      { label: "Spokeo terms of use", href: "https://www.spokeo.com/terms-of-use-consumer" },
    ],
    cabinetLinks: [{ label: "Compare with Receipt", href: "/bots/receipt" }],
    botDetails: {
      name: "Spam-Call Scrubber",
      creator: "Arash (@MinimalDuck)",
      platform: "Grok Bot",
      job: "Finds a person's phone number on people-search and data-broker sites, files the opt-outs and checks again on a schedule.",
      requiredAccess: "A Grok Bot account, the person's name, phone number and city, and an email inbox for confirmation links.",
      outsideActions: "Submits opt-out forms to third-party sites and opens email confirmation links. If you live in California, start with the state's free DROP tool, which sends one deletion request to registered data brokers.",
      evidenceStatus: "inspected",
      cabinetDecision: "test-adaptation",
      cabinetFit: "Nothing in Bot Cabinet removes personal listings. A cross-platform template written from the idea, with a list-first approval step, is being prepared and is not available yet.",
      closestCabinetMatch: { label: "Receipt", href: "/bots/receipt" },
    },
  },
  {
    slug: "four-grok-bots-for-small-business-work",
    observedOn: "2026-10-01",
    reviewAgainBy: "2026-11-03",
    title: "Four Grok Bots for testing, prototyping, sales and marketing",
    signal:
      "Shub Gaur's Startup QA Bot checks a product using its own test account and reports broken steps with screenshots. Proto Bot turns a feature idea into a draft code change with pictures and video. Sell Bot drafts outreach, call preparation and customer follow-ups. Distro Bot combines campaign analysis, creative drafts and outreach. Their original marketplace pages include direct import links.",
    evidence: "provider-claim",
    whyItMatters:
      "These are useful jobs to look for when choosing an agent: catch a broken signup, show a proposed feature before releasing it, prepare a customer reply, or compare campaign results. You do not need to assemble a crew to try one of them.",
    cabinetResponse:
      "Choose one job and try a harmless example first. For product testing, use a separate test account, not a customer account. For a prototype, use a project copy and review the changed files. For sales, draft a reply without sending it. For marketing, start with campaign analysis and leave spending unchanged. Follow the original listing's setup instructions and review its requested access before importing.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet inspected the published instructions and import links, but has not imported or run these Bots. The stated approval rules are instructions, not proven safeguards. Proto Bot uses cloud coding agents and outside image services; its listing warns that FAL and Higgsfield upload links are public, so private screenshots should not be uploaded. Distro Bot can change creative and targeting without asking in an autopilot mode. Its spending changes still require explicit approval and caps. Sales and marketing require access to business records or accounts. Sell Bot's and Distro Bot's listings say their routines ship paused, and Startup QA Bot's listing says its morning walk ships off. Proto Bot's listing does not say, so check its routines before turning any on.",
    sources: [
      { label: "Startup QA Bot: instructions", href: "https://x.ai/bot/marketplace/bots/startup-qa-bot" },
      { label: "Startup QA Bot: open import", href: "https://x.ai/bot/XBauviUoNcdi05-ExoOo4" },
      { label: "Proto Bot: instructions", href: "https://x.ai/bot/marketplace/bots/proto-bot" },
      { label: "Proto Bot: open import", href: "https://x.ai/bot/p4sSEZV7xqcBgdT7m2O8i" },
      { label: "Sell Bot: instructions", href: "https://x.ai/bot/marketplace/bots/sell-bot" },
      { label: "Sell Bot: open import", href: "https://x.ai/bot/znrhzY4AYMg4v3QTfU0IJ" },
      { label: "Distro Bot: instructions", href: "https://x.ai/bot/marketplace/bots/distro-bot" },
      { label: "Distro Bot: open import", href: "https://x.ai/bot/XbN6iofs_Qjsi2Od1yjyI" },
    ],
    cabinetLinks: [
      { label: "Build a prototype with Founding Engineer", href: "/bots/founding-engineer/" },
      { label: "Check systems with Ops", href: "/bots/ops/" },
      { label: "Prepare client documents", href: "/bots/client/" },
    ],
  },
  {
    slug: "chatgpt-dots-one-agent-per-account",
    observedOn: "2026-09-29",
    reviewAgainBy: "2026-11-03",
    title: "ChatGPT dots give each account one agent that keeps working",
    signal:
      "OpenAI introduced dots on September 29, 2026: always-on agents in ChatGPT that run on GPT-6 Astra, have their own cloud computer and keep making progress between conversations. You start with one primary dot. In the week of October 5–9 OpenAI added dot creation in the ChatGPT mobile app, and in the week of October 12–16 an iPhone Home Screen widget and an Apple Shortcuts action, rolling out with ChatGPT for iOS 1.2026.279.",
    evidence: "provider-claim",
    whyItMatters:
      "You set up a dot by describing the responsibility in conversation and sharing the material it needs. Custom rules are instructions your dot tries to follow for a kind of action: Take action without asking, Take action when you say so, Ask before taking action, or Hand off to you. OpenAI says a dot can make mistakes.",
    cabinetResponse:
      "Give your dot one responsibility and the material it needs. Before you connect accounts, add custom rules; OpenAI's own examples are Ask before taking action for messages to customers and Hand off to you for deleting shared project files. Review the first result before you widen the job.",
    responseStatus: "published",
    limits:
      "Bot Cabinet has not run a dot. OpenAI's docs list Pro 100, Pro 200 and Pro 500 for users outside the European Economic Area, the United Kingdom and Switzerland, plus Business Premium and admin-enabled Enterprise workspaces. OpenAI Help limits Pro access to users 18 and older. OpenAI said dots usage would not count toward Pro, Business and Enterprise allowances for the first month and that it would then share usage terms for each plan; none were in its release notes when Bot Cabinet checked on October 27, 2026. OpenAI's Help Center calls the second custom rule Take action if pre-approved.",
    sources: [
      { label: "OpenAI: Introducing dots (September 29, 2026)", href: "https://openai.com/index/introducing-dots/" },
      { label: "OpenAI: Meet dots", href: "https://learn.chatgpt.com/docs/dots" },
      { label: "OpenAI: Control your dot", href: "https://learn.chatgpt.com/docs/dots/controls" },
      { label: "OpenAI: What's new", href: "https://learn.chatgpt.com/docs/whats-new" },
      { label: "ChatGPT release notes", href: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes" },
      { label: "OpenAI Help: Getting started with your dot", href: "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" },
    ],
    cabinetLinks: [{ label: "Try a first task with a dot", href: "/start/dots" }],
  },
  {
    slug: "nasiko-agent-control-plane",
    observedOn: "2026-09-24",
    reviewAgainBy: "2026-10-08",
    title: "Nasiko puts limits and records around a fleet of agents",
    signal:
      "Nasiko is an open-source control panel for agents that use the A2A standard. Its repository documents shared tool access, hidden provider keys, per-agent permissions, call tracing, cost records and limits that stop repeated or runaway work.",
    evidence: "observed",
    whyItMatters:
      "As people run more agents, the hard problem becomes control: what each agent may use, how much it may spend, what happened during a run and how to stop work that is going in circles.",
    cabinetResponse:
      "If you run several agents, write down a spending ceiling, a time limit, a maximum number of handoffs and the tools each agent may use. Keep a run log and make sure one person can stop the work. Treat Nasiko as a developer tool until you can test it safely in a disposable setup.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet reviewed the repository but has not installed or run Nasiko. It requires Docker and several supporting services. Setup, upgrades and daily operation have not been tested here.",
    sources: [
      { label: "Nasiko source repository", href: "https://github.com/Nasiko-Labs/nasiko" },
      { label: "Tony Simons' summary", href: "https://x.com/tonysimons_/status/2103184943027298585" },
    ],
  },
  {
    slug: "grok-import-bot",
    observedOn: "2026-09-23",
    reviewAgainBy: "2026-09-30",
    title: "Import Bot moves an existing agent setup into Grok Bot",
    signal: "The official Grok Bot marketplace lists a Bot that reads selected setups from Claude Cowork, Codex, ChatGPT, OpenClaw, and Hermes, removes secrets, and proposes matching Grok Bots.",
    evidence: "provider-claim",
    whyItMatters: "You could reuse an existing Bot's instructions when changing apps, rather than write them again. Its account connections and schedules may need new setup.",
    cabinetResponse: "Try a made-up Hermes profile first. Compare the original and copied instructions, check that passwords and private history stay out, and approve any new Bots before they are created.",
    responseStatus: "testing",
    limits: "Bot Cabinet read the marketplace description but has not installed or run Import Bot. Supported fields and secret removal have not been tested for each source app.",
    sources: [{ label: "Official Grok Bot Marketplace listing", href: "https://x.ai/bot/marketplace/bots/import-bot" }],
    cabinetLinks: [{ label: "Browse portable Bot Packs", href: "/bots" }],
    botDetails: {
      name: "Import Bot",
      creator: "Shub Gaur",
      platform: "Grok Bot",
      job: "The creator says it copies selected agent instructions into Grok Bot, removes secrets and leaves the original setup unchanged.",
      requiredAccess: "The selected source setup and a Grok Bot account. The exact account and file access should be checked before use.",
      outsideActions: "Creates or updates Bots in the destination service after reviewing the imported setup.",
      evidenceStatus: "inspected",
      cabinetDecision: "test-adaptation",
      cabinetFit: "Test it against Bot Porter's transfer checklist, including which instructions, tools and schedules need new setup.",
      closestCabinetMatch: { label: "Portable Bot Packs", href: "/bots" },
    },
  },
  {
    slug: "grok-tinkabot",
    observedOn: "2026-09-23",
    reviewAgainBy: "2026-09-30",
    title: "tinkabot turns an API into an agent plugin",
    signal: "The official Grok Bot marketplace describes a Bot that builds and tests a small plugin to connect another service, then asks before publishing it.",
    evidence: "provider-claim",
    whyItMatters: "A plugin can let your Bot use information and take actions in another service, such as reading records or preparing updates.",
    cabinetResponse: "Choose one connection to build. Test the plugin in a separate project copy and review its account permissions before publishing or installing it for everyday use.",
    responseStatus: "testing",
    limits: "Bot Cabinet inspected the official listing but has not run this Bot or reviewed a package it created. API permissions, generated code, dependencies, and marketplace rules still require separate review.",
    sources: [{ label: "Official Grok Bot Marketplace listing", href: "https://x.ai/bot/marketplace/bots/tinkabot" }],
    cabinetLinks: [{ label: "Read the Hermes profile guide", href: "/guides/install-a-profile" }],
    botDetails: {
      name: "tinkabot",
      creator: "Lauren Tan",
      platform: "Grok Bot",
      job: "The creator says it builds and tests a small plugin that connects another service, then asks before publishing.",
      requiredAccess: "The service's API documentation, a separate test project and narrowly limited credentials if the test needs them.",
      outsideActions: "Writes plugin files and may ask to publish them in a marketplace. Review and approve publication first.",
      evidenceStatus: "inspected",
      cabinetDecision: "improve-existing",
      cabinetFit: "A connection-building task for Founding Engineer, with account permissions and plugin tests included in the review.",
      closestCabinetMatch: { label: "Founding Engineer", href: "/bots/founding-engineer" },
    },
  },
  {
    slug: "muse-diagnose-agent-mistake",
    observedOn: "2026-09-23",
    reviewAgainBy: "2026-09-30",
    title: "Diagnose My Agent's Mistake looks for one fix after a bad result",
    signal: "Muse at Work lists a workflow that asks what happened, why it happened, and what single change would prevent the same AI mistake.",
    evidence: "observed",
    whyItMatters: "It helps you correct one bad answer and check whether the same mistake happens again.",
    cabinetResponse: "Bot Cabinet prepared this as a reusable Ops Skill. Download it, use a harmless failed example, and compare the result before and after one proposed correction.",
    responseStatus: "prepared",
    limits: "Bot Cabinet inspected the public Muse at Work listing but has not run the workflow. The listing does not identify a creator or show how well the diagnosis holds up across different kinds of failure.",
    sources: [{ label: "Muse at Work listing", href: "https://museatwork.app/#w=1d0661a5-1cf7-4013-9aff-9cf605bcbe8c" }],
    cabinetLinks: [
      { label: "Try the step-by-step guide", href: "/guides/fix-one-bad-ai-result" },
      { label: "Download the Skill", href: "/downloads/starter-bots/v2/ops/skills/diagnose-ai-result/SKILL.md" },
    ],
    botDetails: {
      name: "Diagnose My Agent's Mistake",
      creator: "Creator not listed",
      platform: "Muse at Work",
      job: "Finds a likely cause for a bad AI result and proposes one concrete fix.",
      requiredAccess: "The failed prompt, the result, and any details needed to understand what went wrong.",
      outsideActions: "None described. The workflow returns a diagnosis and proposed correction.",
      evidenceStatus: "inspected",
      cabinetDecision: "improve-existing",
      cabinetFit: "Bot Cabinet prepared an Ops troubleshooting Skill for this method. It is ready for a manual test but has not yet been task-tested.",
      closestCabinetMatch: { label: "Ops", href: "/bots/ops" },
    },
  },
  {
    slug: "unstick-me-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Unstick Me Bot helps someone take the first small step",
    signal:
      "Yanqing Cheng shared a Grok Bot that helps when a task feels hard to begin. It asks short questions one at a time instead of making a large plan.",
    evidence: "observed",
    whyItMatters:
      "A long plan can become one more obstacle. This narrower approach may help someone find one manageable action and begin it.",
    cabinetResponse:
      "Bot Cabinet turned it into a cross-platform template, Unstick Me, with versions for Hermes, Grok Bot and ChatGPT and setup notes for other apps. Yanqing Cheng's original Grok Bot is linked from the template.",
    responseStatus: "prepared",
    limits:
      "Bot Cabinet has reviewed the public description and links. Neither the original Grok template nor the Bot Cabinet versions have been task-tested yet.",
    sources: [
      { label: "Creator's post", href: "https://x.com/YanqingCheng/status/2099206038368977179" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/EahHaI-kwO0hgWj6I45jC" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/unstick-me-bot" },
    ],
    cabinetLinks: [
      { label: "Use the Unstick Me template", href: "/bots/unstick-me" },
      { label: "Compare with Coach", href: "/bots/coach" },
    ],
    botDetails: {
      name: "Unstick Me Bot",
      creator: "Yanqing Cheng",
      platform: "Grok Bot",
      job: "Helps someone begin a stalled task through short, one-at-a-time questions.",
      requiredAccess: "A Grok Bot account and the task the person wants help starting.",
      outsideActions: "None described. It asks questions and suggests a next step.",
      evidenceStatus: "inspected",
      cabinetDecision: "add-new",
      cabinetFit: "Added as Unstick Me, a cross-platform template. Coach remains the better fit for larger decisions.",
      closestCabinetMatch: { label: "Coach", href: "/bots/coach" },
      cabinetTemplate: { label: "Unstick Me", href: "/bots/unstick-me" },
    },
  },
  {
    slug: "bill-import-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Bill Import Bot turns statements into reviewed records",
    signal:
      "A public Grok Bot template accepts statement files or screenshots, finds likely duplicates, suggests categories and shows a preview before anything is saved.",
    evidence: "observed",
    whyItMatters:
      "You can check the proposed entries and categories before they are saved, which may reduce repetitive data entry.",
    cabinetResponse:
      "Test an adaptation as a new Bot because Receipt handles returns and warranties, not transaction entry. Begin with made-up records and require approval before any file is changed.",
    responseStatus: "testing",
    limits:
      "Bot Cabinet has not run the template or checked its duplicate detection. Financial files can contain sensitive information and should not be connected during an early test.",
    sources: [
      { label: "Creator's post", href: "https://x.com/coolbat1999/status/2099141007887777987" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/A3pcjyO0dAkvRGxD4VGeH" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/bill-import-bot" },
    ],
    cabinetLinks: [{ label: "Compare with Receipt", href: "/bots/receipt" }],
    botDetails: {
      name: "Bill Import Bot",
      creator: "@coolbat1999",
      platform: "Grok Bot",
      job: "Reads statement files, flags possible duplicates and previews entries for approval.",
      requiredAccess: "A Grok Bot account and statement files or screenshots selected by the user.",
      outsideActions: "May write approved records after showing a preview. The first test should stop before any write.",
      evidenceStatus: "inspected",
      cabinetDecision: "test-adaptation",
      cabinetFit: "Receipt covers returns and warranties, so this deserves a separate adaptation test.",
      closestCabinetMatch: { label: "Receipt", href: "/bots/receipt" },
    },
  },
  {
    slug: "stuck-signal-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Stuck Signal Bot stays quiet until a job needs attention",
    signal:
      "A shared Grok Bot watches a running job and sends a warning only when it passes a time limit, repeats itself or reports an error.",
    evidence: "observed",
    whyItMatters:
      "You can leave a long-running job alone and receive a warning when it needs attention.",
    cabinetResponse:
      "Use the idea to improve Ops and Cabinet Keeper rather than add a near-duplicate Bot. A first test should watch one harmless job with a clear time limit and one place for alerts.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not run the template. A monitor needs exact rules, limited access and a reliable way to avoid duplicate or false warnings.",
    sources: [
      { label: "Creator's post", href: "https://x.com/WeirdBotDrop/status/2096625291531538791" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/1JxNBfQ05cVYJGLLh6R-o" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/stuck-signal-bot" },
    ],
    cabinetLinks: [{ label: "See Ops", href: "/bots/ops" }],
    botDetails: {
      name: "Stuck Signal Bot",
      creator: "@WeirdBotDrop",
      platform: "Grok Bot",
      job: "Watches a running job and warns only when it stalls, loops or fails.",
      requiredAccess: "A Grok Bot account, the job's status information and a place to send alerts.",
      outsideActions: "Reads job status and sends an alert when a rule is met.",
      evidenceStatus: "inspected",
      cabinetDecision: "improve-existing",
      cabinetFit: "Add the quiet-alert pattern to Ops and Cabinet Keeper instead of making a duplicate Bot.",
      closestCabinetMatch: { label: "Ops", href: "/bots/ops" },
    },
  },
  {
    slug: "canonizer-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Canonizer Bot keeps one current project record",
    signal:
      "A shared Grok Bot turns updates from different chats or agents into one current status file, with decisions, open questions and next steps.",
    evidence: "observed",
    whyItMatters:
      "Work becomes hard to resume when important decisions are scattered. One short, dated record can make handoffs and restarts much easier.",
    cabinetResponse:
      "Use this pattern to improve Reentry rather than create another project-resumption Bot. Test whether it can update one record without erasing disagreement or treating a guess as a decision.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not run the template. A combined record can hide conflicting accounts unless every change keeps its source and date.",
    sources: [
      { label: "Creator's post", href: "https://x.com/hudcos/status/2097309182584094975" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/pOcrH-Rc7SdPWiHsX9vHg" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/canonizer-bot" },
    ],
    cabinetLinks: [{ label: "See Reentry", href: "/bots/reentry" }],
    botDetails: {
      name: "Canonizer Bot",
      creator: "@hudcos",
      platform: "Grok Bot",
      job: "Keeps one dated record of a project's decisions, questions and next steps.",
      requiredAccess: "A Grok Bot account and the project updates or files being combined.",
      outsideActions: "Creates or updates a shared project record.",
      evidenceStatus: "inspected",
      cabinetDecision: "improve-existing",
      cabinetFit: "Add source and date tracking to Reentry instead of making another restart Bot.",
      closestCabinetMatch: { label: "Reentry", href: "/bots/reentry" },
    },
  },
  {
    slug: "about-me-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "About Me Bot keeps a living personal brief",
    signal:
      "A shared Grok Bot builds and updates a personal profile that can help another assistant understand preferences, goals and working style.",
    evidence: "observed",
    whyItMatters:
      "People repeat the same background whenever they start with a new assistant. A portable brief could save time, but it can also collect more private information than the job needs.",
    cabinetResponse:
      "Study the idea before adapting it. Any Cabinet version should let a person see, edit and remove every saved fact, and should explain which details are unnecessary for the current job.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not tested the template. A personal profile can become inaccurate, overly revealing or difficult to move safely between services.",
    sources: [
      { label: "Creator's post", href: "https://x.com/TAftermath2020/status/2099183022193123784" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/7dfQ6zC2X2hmnIlnF4rSN" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/about-me-bot" },
    ],
    botDetails: {
      name: "About Me Bot",
      creator: "@TAftermath2020",
      platform: "Grok Bot",
      job: "Keeps an editable brief of a person's preferences, goals and working style.",
      requiredAccess: "A Grok Bot account and personal details the user chooses to provide.",
      outsideActions: "Stores and updates a personal profile for later use.",
      evidenceStatus: "inspected",
      cabinetDecision: "watch",
      cabinetFit: "Do not adapt it until the privacy, correction and deletion controls are clear.",
      closestCabinetMatch: { label: "Coach", href: "/bots/coach" },
    },
  },
  {
    slug: "scouty-bot",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Scouty Bot checks job openings against a person's experience",
    signal:
      "A shared Grok Bot starts with a resume and location, finds likely openings and checks the listings before presenting them.",
    evidence: "observed",
    whyItMatters:
      "Job search is a strong fit for focused research, but a useful result needs a current opening and a clear reason it matches—not a long list of scraped titles.",
    cabinetResponse:
      "Treat this as a new use case for Scout, not a new Bot. Test it with a made-up resume and require a direct employer link, location check and short explanation for every result.",
    responseStatus: "watching",
    limits:
      "Bot Cabinet has not run the template or checked the quality of its matches. Job listings expire quickly and a public post may not reflect current behavior.",
    sources: [
      { label: "Creator's post", href: "https://x.com/NickRoman/status/2097381626955055254" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/jc0tOHuVUAn4MHuH2zyDn" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/scouty-bot" },
    ],
    cabinetLinks: [{ label: "See Scout", href: "/bots/scout" }],
    botDetails: {
      name: "Scouty Bot",
      creator: "Nick Roman",
      platform: "Grok Bot",
      job: "Finds current job openings and explains how each one fits a person's experience.",
      requiredAccess: "A Grok Bot account, a resume or work history, a location and web search.",
      outsideActions: "Searches public job listings. No application submission is described.",
      evidenceStatus: "inspected",
      cabinetDecision: "write-guide",
      cabinetFit: "Add a job-search guide for Scout rather than create a second research Bot.",
      closestCabinetMatch: { label: "Scout", href: "/bots/scout" },
    },
  },
  {
    slug: "grok-bot-engineering-fleets",
    observedOn: "2026-09-24",
    reviewAgainBy: "2026-10-01",
    title: "How engineering teams divide work among Grok Bots",
    signal:
      "An X post points to a 57-minute workshop in which SpaceXAI engineer Lauren Tan describes running many engineering Bots with a Chief of Staff Bot above them. xAI's own launch and engineering guides separately confirm that teams run multiple Bots in parallel and sometimes place one Bot in charge of coordination.",
    evidence: "provider-claim",
    whyItMatters:
      "Separate Bots can build a change, test it and review the result. They need a shared task record and a clear owner for each next step.",
    cabinetResponse:
      "Try one small software task with a coordinator, builder and reviewer. Save the commands, test results and handoff notes. Review the finished change before adding more Bots.",
    responseStatus: "watching",
    limits:
      "The X post's claims about 20-plus Bots, 85 percent of engineers and overnight output have not been independently verified. xAI documents parallel Bot work, but that does not establish the post's numbers or the quality of the resulting code.",
    sources: [
      { label: "Kurisina's post and workshop video", href: "https://x.com/kurisinaa/status/2103079687392018834" },
      { label: "xAI: Introducing Grok Bot", href: "https://x.ai/news/introducing-grok-bot" },
      { label: "xAI: Grok Bot for Engineering", href: "https://x.ai/bot/guides/grok-bot-for-engineering" },
    ],
    cabinetLinks: [{ label: "Compare with Bot Cabinet Crew Kits", href: "/crew-kits" }],
  },
  {
    slug: "personal-agents-move-into-background",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "Personal agents are moving into background work",
    signal:
      "Muse and Gemini Tasks (formerly Spark) describe agents that keep working after the conversation ends. Instinct describes an assistant reached by text or phone that connects to applications and devices.",
    evidence: "provider-claim",
    whyItMatters:
      "These services offer to handle continuing jobs using connected apps and schedules. Compare what each can do, what it can access, how it asks permission and how much it costs.",
    cabinetResponse:
      "Choose one small recurring job and compare the services by what information they can use, what actions they can take, how they ask permission, what they cost, and how they show that the work was completed.",
    responseStatus: "published",
    limits:
      "Not yet tested here: current access, reliability, account connections, prices or how often the work is completed.",
    sources: [
      { label: "Meta: Introducing Muse", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" },
      { label: "Instinct product page", href: "https://instinct.com/" },
      { label: "Google: Gemini Tasks (formerly Spark)", href: "https://support.google.com/gemini/answer/17094507?hl=en" },
    ],
    cabinetLinks: [{ label: "Which agent path fits your work?", href: "/guides/choose-your-agent-path" }],
  },
  {
    slug: "morning-newspaper-is-a-finished-ritual",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "The Morning Newspaper prepares a personal paper edition",
    signal:
      "Karen X. Cheng's Grok Bot listing describes a personalized newspaper assembled from email and calendar and printed while the user sleeps.",
    evidence: "observed",
    whyItMatters:
      "You can read selected messages, calendar items and articles on paper before opening your apps.",
    cabinetResponse:
      "Read the original Grok Bot listing, then try one manual edition with made-up or selected information. Check every item before connecting private accounts, adding a schedule, or sending anything to a printer.",
    responseStatus: "published",
    limits:
      "Not yet tested here: a complete run of the original Bot, the other setup ideas or automatic printing.",
    sources: [
      { label: "Karen X. Cheng: The Morning Newspaper", href: "https://x.ai/bot/marketplace/bots/the-morning-newspaper" },
    ],
    cabinetLinks: [
      { label: "Read the cross-platform guide", href: "/guides/morning-newspaper-across-agents" },
      { label: "Try the manual Hermes first task", href: "/use-cases/personal-morning-newspaper" },
      { label: "Read the Hermes test result", href: "/proof-room/daily-newspaper/runtime-summary.md" },
    ],
  },
  {
    slug: "personal-agents-are-splitting-by-job",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "New personal agents are choosing different kinds of work",
    signal:
      "Ollie is presented as an organizer for families. Wajo's Fo is presented as an agent for phone calls, vendors, bookings and approved purchases. Town is designed to learn a person's working style across connected business tools.",
    evidence: "provider-claim",
    whyItMatters:
      "The label “personal assistant” hides important differences. Family coordination, real-world errands and help across business tools require different information, permissions and safeguards.",
    cabinetResponse:
      "Begin with the job, not the brand. Decide whether you need family coordination, outside actions or help across work tools, then compare access, approvals, cost and a low-risk first test.",
    responseStatus: "published",
    limits:
      "Not yet tested here: account setup, personal-data connections, spending, calls, purchases or repeated runs of the same job. Prices, access and connections can change.",
    sources: [
      { label: "Ollie: family assistant", href: "https://ollie.ai/" },
      { label: "Wajo: Fo and action agents", href: "https://wajo.ai/" },
      { label: "Town: getting-started documentation", href: "https://www.town.com/docs/getting-started" },
    ],
    cabinetLinks: [{ label: "Compare agent paths by job", href: "/guides/choose-your-agent-path" }],
  },
  {
    slug: "bot-marketplaces-are-becoming-workflow-libraries",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Bot marketplaces are becoming libraries of useful routines",
    signal:
      "The Grok Bot marketplace now includes many specific personal and work routines. Its guide explains that a shared template can include instructions, selected memories, skills and plugins without being an exact copy.",
    evidence: "observed",
    whyItMatters:
      "A shared template can give you a starting point for a specific job, including instructions, skills and connections to other tools.",
    cabinetResponse:
      "Look for a specific routine that solves a real problem. Check the creator, required access and first-run instructions before using it. Adapt the idea to another service only when that service can perform the same job safely.",
    responseStatus: "testing",
    limits:
      "Not every linked template has been tested. Check its instructions, permissions and first result before trusting it with private information or recurring work.",
    sources: [
      { label: "Grok Bot Marketplace", href: "https://x.ai/bot/marketplace" },
      { label: "Grok Bot template guide", href: "https://x.ai/bot/guides/templates-for-grok-bot" },
    ],
    cabinetLinks: [{ label: "Read the Grok Bot guide", href: "/platforms/grok-bot" }],
  },
  {
    slug: "skills-are-becoming-a-portable-unit",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "Agent Skills can carry instructions between services",
    signal:
      "The Agent Skills format uses a file named SKILL.md to hold instructions. Skills.sh shares single skills and skill packs for several AI services. Its rankings count installs, not whether the skill keeps producing useful work.",
    evidence: "observed",
    whyItMatters:
      "You may be able to use the same instructions in several apps. Check the required tools and run a sample task in each app you use.",
    cabinetResponse:
      "Open the SKILL.md file before installing it. Check its instructions and requested access, then run one low-risk test in the service you plan to use.",
    responseStatus: "published",
    limits:
      "The skills have not been tested here in every service named by skills.sh or over repeated runs. Test the same task in your chosen app before relying on it.",
    sources: [
      { label: "Agent Skills format specification", href: "https://agentskills.io/specification" },
      { label: "skills.sh documentation and measurement limits", href: "https://www.skills.sh/docs" },
      { label: "skills.sh supported-agent FAQ", href: "https://www.skills.sh/docs/faq" },
    ],
    cabinetLinks: [{ label: "Browse portable Bot Packs", href: "/bots" }],
  },
  {
    slug: "open-agent-runtimes-keep-changing",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Hermes and OpenClaw change too quickly for permanent “works with” labels",
    signal:
      "Hermes Agent and OpenClaw both released several updates in September. Their public release pages show frequent changes to how they run, connect to other tools and fix problems.",
    evidence: "observed",
    whyItMatters:
      "A download that worked once can later become outdated. Useful compatibility notes need a version number, a test date and another test after an important runtime update.",
    cabinetResponse:
      "Check the tested version and date before installing a Bot. After an important runtime update, repeat the Bot's first test before trusting it with recurring work or broader access.",
    responseStatus: "testing",
    limits:
      "Release notes do not show whether a particular Bot still works. A package should be treated as unconfirmed after a major runtime change until its first test is repeated.",
    sources: [
      { label: "Hermes Agent releases", href: "https://github.com/NousResearch/hermes-agent/releases" },
      { label: "OpenClaw releases", href: "https://github.com/openclaw/openclaw/releases" },
    ],
  },
];

export const AGENT_WATCH_UPDATED = "2026-10-27";
