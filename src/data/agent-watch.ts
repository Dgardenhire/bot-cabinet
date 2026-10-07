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
      "Test this as a possible new standalone Bot. Compare it with Coach and Planner using the same stalled task, and keep it only if the smaller approach helps someone start sooner.",
    responseStatus: "testing",
    limits:
      "Bot Cabinet has reviewed the public description and links but has not run the Grok template or built a Hermes adaptation.",
    sources: [
      { label: "Creator's post", href: "https://x.com/YanqingCheng/status/2099206038368977179" },
      { label: "Open the Grok Bot template", href: "https://x.ai/bot/EahHaI-kwO0hgWj6I45jC" },
      { label: "GrokHub listing", href: "https://www.grokhub.io/use-cases/unstick-me-bot" },
    ],
    cabinetLinks: [
      { label: "Compare with Coach", href: "/bots/coach" },
      { label: "Compare with Planner", href: "/bots/planner" },
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
      cabinetFit: "Test it against Coach and Planner first, then add it only if the smaller approach works better.",
      closestCabinetMatch: { label: "Coach", href: "/bots/coach" },
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
    title: "Grok Bot is pushing beyond one assistant into managed Bot fleets",
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
      "Muse and Gemini Spark describe agents that keep working after the conversation ends. Instinct describes an assistant reached by text or phone that connects to applications and devices.",
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
      { label: "Google: Gemini Spark", href: "https://gemini.google/overview/agent/spark/" },
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

export const AGENT_WATCH_UPDATED = "2026-09-24";
