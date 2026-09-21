export type WatchEvidence = "observed" | "provider-claim" | "cabinet-tested";
export type WatchResponseStatus = "published" | "prepared" | "testing" | "watching";

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
};

export const AGENT_WATCH_ITEMS: AgentWatchItem[] = [
  {
    slug: "bounce-rate-is-not-useful-action",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "A bounce can still contain a useful action",
    signal:
      "Vercel defines bounce rate from single-page sessions and explicitly excludes custom events from the calculation. A visitor can download a Bot, begin setup or report an outcome and still count as a bounce when no second pageview occurs.",
    evidence: "observed",
    whyItMatters:
      "Bot Cabinet should not treat a lower bounce rate as proof of greater usefulness—or a high bounce rate as proof that a focused guide or download page failed. Page navigation and completed-work evidence answer different questions.",
    cabinetResponse:
      "Corrected the local analytics baseline and kept deliberate action, first-result, friction, return and repeat-run events separate from Vercel's bounce metric. Product decisions should use those event families in sequence after deployment, without pretending separate counts form a cohort funnel.",
    responseStatus: "prepared",
    limits:
      "The current 51% production bounce rate describes single-page sessions in one small dashboard window. It does not reveal reading quality, task completion, repeat use or whether a custom event occurred within the session. The locally prepared outcome instrumentation is not deployed.",
    sources: [
      { label: "Vercel Web Analytics: bounce-rate calculation", href: "https://vercel.com/docs/analytics#bounce-rate" },
      { label: "Vercel Web Analytics: custom events", href: "https://vercel.com/docs/analytics/custom-events" },
    ],
    cabinetLinks: [
      { label: "Run the first-user walkthrough", href: "/start" },
      { label: "Open your Bot workbench", href: "/workbench" },
    ],
  },
  {
    slug: "repeat-use-not-return-visits",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "A return visit is not the same as repeat usefulness",
    signal:
      "Agent adoption reports often count very light activity, while evaluation guidance calls for multiple trials on realistic tasks. Downloads, activations and revisits cannot establish that the same workflow keeps producing useful work.",
    evidence: "observed",
    whyItMatters:
      "Cabinet needs to learn whether a person completes a real job, uses the same Bot again and receives a usable result—not merely whether the page was opened or the archive was downloaded.",
    cabinetResponse:
      "Added a local, privacy-minimal check-in for the second and third real Bot runs, plus a browser-private Three-Run Trial for comparing any recurring job across tools. The trial records use, revision, supervision, cost range and interruption recovery; its user-entered labels stay local and are excluded from analytics. This implementation is not deployed.",
    responseStatus: "prepared",
    limits:
      "No production responses exist yet. The trial is a self-reported record for one person and three attempts; it does not independently verify output quality, establish general reliability or demonstrate willingness to pay.",
    sources: [
      { label: "Microsoft WorkLab: active-agent measurement", href: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization" },
      { label: "Anthropic: evaluating agents across repeated trials", href: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
    ],
    cabinetLinks: [
      { label: "Run the first-user walkthrough", href: "/start" },
      { label: "Open the Three-Run Trial", href: "/workbench" },
    ],
  },
  {
    slug: "personal-agents-move-into-background",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "Personal agents are moving into background work",
    signal:
      "Muse and Gemini Spark describe agents that keep working after the conversation ends. Instinct describes an assistant reached by text or phone that connects to applications and devices.",
    evidence: "provider-claim",
    whyItMatters:
      "The important change is not another chat screen. These products are competing to own continuing jobs, connected context, schedules, approvals and follow-up. Cabinet should help people compare the job, access, controls and evidence instead of treating every platform as a separate universe.",
    cabinetResponse:
      "Prepared a local platform-selection guide and capability questions that start from the user's outcome. It is not deployed. Runtime comparisons are still needed before Cabinet recommends one service for a specific job.",
    responseStatus: "prepared",
    limits:
      "Cabinet has reviewed the linked provider materials but has not independently verified availability, reliability, account-specific integrations, pricing or completion rates.",
    sources: [
      { label: "Meta: Introducing Muse", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" },
      { label: "Instinct product page", href: "https://instinct.com/" },
      { label: "Google: Gemini Spark", href: "https://gemini.google/overview/agent/spark/" },
    ],
    cabinetLinks: [{ label: "Which agent path fits your work?", href: "/guides/choose-your-agent-path" }],
  },
  {
    slug: "morning-newspaper-is-a-finished-ritual",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-10-04",
    title: "The Morning Newspaper turns agent work into a finished ritual",
    signal:
      "Karen X. Cheng's Grok Bot listing describes a personalized newspaper assembled from email and calendar and printed while the user sleeps.",
    evidence: "observed",
    whyItMatters:
      "This is more distinctive than a generic briefing Bot. It combines personal context, a recurring schedule, finite editorial judgment and a physical result that can be read away from a feed.",
    cabinetResponse:
      "Prepared a local attributed use case and original setup guide with paths for the creator's Grok Bot and capability-limited adaptations for Hermes, Muse, Instinct and future hosts. They are not deployed.",
    responseStatus: "prepared",
    limits:
      "Cabinet verified the public listing, not the imported implementation or its end-to-end delivery. The adaptation paths and unattended printing remain untested.",
    sources: [
      { label: "Karen X. Cheng: The Morning Newspaper", href: "https://x.ai/bot/marketplace/bots/the-morning-newspaper" },
    ],
    cabinetLinks: [
      { label: "Read the cross-platform guide", href: "/guides/morning-newspaper-across-agents" },
      { label: "Open the Cabinet use case", href: "/use-cases/personal-morning-newspaper" },
    ],
  },
  {
    slug: "personal-agents-are-splitting-by-job",
    observedOn: "2026-09-20",
    reviewAgainBy: "2026-09-27",
    title: "Personal agents are splitting into different jobs",
    signal:
      "Ollie presents a family coordinator that works through shared household context; Wajo presents an action agent for calls, vendors, bookings and authorized purchases; Town presents an assistant that learns a person's work and operates across connected business systems.",
    evidence: "provider-claim",
    whyItMatters:
      "Calling all three a personal assistant hides the real decision. The user is choosing a job, an access model and an approval burden: shared family coordination, physical-world completion or a connected model of how they work.",
    cabinetResponse:
      "Expanded the local agent-selection guide with a source-linked job map and explicit comparisons to Home Admin, Personal Planning Desk and Small-Business Admin Desk. No duplicate Bot was added merely because a provider uses a new label.",
    responseStatus: "prepared",
    limits:
      "Cabinet reviewed provider materials but has not created accounts, connected personal data, spent money, placed calls or purchases, or measured repeated task completion. Pricing, access and integrations can change, and provider claims are not independent proof.",
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
    title: "Bot marketplaces are becoming workflow libraries",
    signal:
      "The Grok Bot marketplace now spans concrete personal and professional routines, while its template guide describes shared instructions, selected memories, skills and plugins as a recipe rather than a clone.",
    evidence: "observed",
    whyItMatters:
      "The useful unit is shifting from a job title to a reproducible way of working. Cabinet should find distinctive jobs, preserve attribution, inspect setup and permissions, and translate the useful pattern only when the target host can support it.",
    cabinetResponse:
      "The Keeper sensor now records new or changed marketplace entries for human review and flags possible overlap with Cabinet. It does not automatically promote novelty or discard an overlapping idea.",
    responseStatus: "testing",
    limits:
      "The sensor and review queue pass local tests but are not yet installed on the cloud Keeper. Native X search is not connected, and marketplace presence is not evidence of adoption or usefulness.",
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
    title: "Reusable procedures are becoming portable Agent Skills",
    signal:
      "The Agent Skills specification defines a skill directory around a required SKILL.md file, while skills.sh distributes individual skills and multi-skill packs across several agent clients. Its public rankings measure installations, not whether a skill produces useful repeated work.",
    evidence: "observed",
    whyItMatters:
      "A reusable procedure can move farther than a platform-specific Bot profile. Cabinet should expose the procedure it already packages, preserve its controls and test it on each claimed host instead of treating a shared filename as automatic compatibility.",
    cabinetResponse:
      "Bot Pack 2.0 already generates one prepared SKILL.md for every starter Bot. The local Bot detail interface now exposes that file directly beside the readable Markdown and JSON pack, identifies it as prepared and tells visitors to review permissions and test it in the target agent. It is not deployed.",
    responseStatus: "prepared",
    limits:
      "Cabinet has not published these files to an external skill registry, run them across the clients listed by skills.sh or measured repeat use. Existing Hermes import evidence covers the bundled profile and Skill where stated; it does not certify another host.",
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
    title: "Open agent runtimes are changing too quickly for static compatibility labels",
    signal:
      "Hermes Agent and OpenClaw both published multiple September releases. Their public release histories show continuing changes to runtime, integrations, reliability and distribution.",
    evidence: "observed",
    whyItMatters:
      "A download that imported once can still become stale. Cabinet needs versioned artifacts, dated import evidence, compatibility review and meaningful retests after relevant upstream changes.",
    cabinetResponse:
      "Keeper's source registry watches both official release feeds and can create a review candidate when a new release appears. That is triage, not automatic compatibility certification.",
    responseStatus: "testing",
    limits:
      "The release-feed sensor passes local tests but is not yet installed on the cloud Keeper. No new compatibility claim is made until the affected package is actually checked.",
    sources: [
      { label: "Hermes Agent releases", href: "https://github.com/NousResearch/hermes-agent/releases" },
      { label: "OpenClaw releases", href: "https://github.com/openclaw/openclaw/releases" },
    ],
  },
];

export const AGENT_WATCH_UPDATED = "2026-09-20";
