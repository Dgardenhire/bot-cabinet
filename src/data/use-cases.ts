export interface BotUseCase {
  slug: string;
  title: string;
  audience: string;
  outcome: string;
  botSlugs: string[];
  inputs: string[];
  steps: { bot: string; action: string; output: string }[];
  humanDecisions: string[];
  firstTest: string;
  kickoffMessage: string;
  image?: { src: string; alt: string };
  setupNote?: string;
  optionalBotSlugs?: string[];
  adaptations?: WorkflowAdaptation[];
}

export type WorkflowAdaptationStatus =
  | "original-source"
  | "cabinet-tested"
  | "implementation-brief"
  | "capability-review";

export interface WorkflowAdaptation {
  platform: string;
  status: WorkflowAdaptationStatus;
  statusLabel: string;
  approach: string;
  setup: string;
  limitations: string;
  source?: { label: string; href: string };
  cabinetGuide?: string;
}

export const BOT_USE_CASES: BotUseCase[] = [
  {
    slug: "personal-morning-newspaper",
    title: "Personal morning newspaper",
    audience: "People who want a short, useful morning read instead of beginning with an endless feed",
    outcome: "A one-page edition built from selected calendar items, actionable messages and one chosen interest, ready for review and optional printing.",
    botSlugs: ["editor"],
    optionalBotSlugs: ["scout", "ops"],
    setupNote: "Start with one Bot. Add a separate Scout only for broader research, or Ops only after a manual edition works and you need a controlled delivery routine.",
    image: { src: "/use-cases/morning-industry-briefing.webp", alt: "A short morning edition prepared beside a reading table" },
    inputs: ["Selected or fictional calendar entries and messages", "An optional approved source about one interest", "Timezone, page size, exclusions and delivery preference"],
    steps: [
      { bot: "Editor", action: "Read the approved sources, choose and organize the useful items, write the one-page edition, save the file, and ask before printing or scheduling", output: "A readable edition, source notes, and a saved file ready for review" },
    ],
    humanDecisions: ["Choose sources and private-topic exclusions", "Approve every connected account, schedule and delivery path", "Approve a single print trial before recurring printing"],
    firstTest: "Use fictional appointments and messages to make one page. Check every detail in print preview; do not schedule or print it yet.",
    kickoffMessage: "Create a sample one-page morning newspaper from only the supplied calendar entries, messages and optional source. Preserve dates and timezones, cite every item, mark missing context, keep correction notes outside the edition, and do not connect accounts, schedule, send or print anything.",
    adaptations: [
      {
        platform: "Grok Bot",
        status: "original-source",
        statusLabel: "Original creator workflow",
        approach: "Karen X. Cheng's Morning Newspaper turns selected personal information into a short paper edition that can print overnight.",
        setup: "Review the original marketplace item and its imported instructions before connecting sources. Start with a preview and confirm the exact delivery and printer path.",
        limitations: "Bot Cabinet checked the official listing, but has not run the Bot, checked its account access, scheduled it or tested its printing.",
        source: { label: "The Morning Newspaper — Karen X. Cheng", href: "https://x.ai/bot/marketplace/bots/the-morning-newspaper" },
        cabinetGuide: "/guides/morning-newspaper-across-agents",
      },
      {
        platform: "Hermes",
        status: "implementation-brief",
        statusLabel: "Setup idea — not tested",
        approach: "Use a separate Hermes profile and saved instructions to make the approved edition. Add a morning schedule only after a person checks a sample.",
        setup: "Begin with selected or made-up information. Check the saved instructions, the proposed schedule, where the file will go and how Hermes will report a failure.",
        limitations: "Bot Cabinet has not run this from start to finish. A cloud Hermes agent cannot reach a home printer unless a safe local connection is set up for that printer.",
        cabinetGuide: "/guides/morning-newspaper-across-agents",
      },
      {
        platform: "Muse",
        status: "capability-review",
        statusLabel: "What to check — not tested",
        approach: "Ask Muse to make the same short edition from the connections your account can use. Then check whether it can save or deliver a printable file.",
        setup: "Make one sample first. Ask which information it can read, whether it can run each morning, where files are kept, what it costs and how to stop it.",
        limitations: "Meta says Muse can use connected apps and work in the background. Bot Cabinet has not tested this complete job or printing.",
        source: { label: "Muse provider announcement", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" },
        cabinetGuide: "/guides/morning-newspaper-across-agents",
      },
      {
        platform: "Instinct",
        status: "capability-review",
        statusLabel: "What to check — not tested",
        approach: "Give Instinct the same job and check which personal information, schedules and file types your account can use.",
        setup: "Ask for one preview. Before connecting accounts or making a daily routine, ask what it can access and what it needs permission to do.",
        limitations: "Bot Cabinet has not tested this with an Instinct account, confirmed its price, made a printable file or tested automatic printing.",
        source: { label: "Instinct provider page", href: "https://instinct.com/" },
        cabinetGuide: "/guides/morning-newspaper-across-agents",
      },
      {
        platform: "Another agent or emerging tool",
        status: "implementation-brief",
        statusLabel: "Use with another service",
        approach: "Take the job description to any AI service that can read the information you choose, make a short document and wait for your approval before delivery.",
        setup: "Test it with made-up information. Check what it can read, whether it can run on a schedule, save a file, protect private data, control costs, report errors and stop cleanly.",
        limitations: "A similar chat screen does not mean the service can do the same job. Treat it as untested until you see the complete result.",
        cabinetGuide: "/guides/morning-newspaper-across-agents",
      },
    ],
  },
  {
    slug: "morning-industry-briefing",
    title: "Morning industry briefing",
    audience: "Leaders and small teams who need a short update on a defined subject",
    outcome: "A concise morning brief with source links, important changes, and questions that need attention.",
    botSlugs: ["researcher"],
    optionalBotSlugs: ["scout", "editor"],
    setupNote: "One Researcher can make a small daily brief. Add Scout for wide discovery or Editor when independent checking matters.",
    inputs: ["A list of topics", "Approved news and industry sources", "Desired length and delivery time"],
    steps: [
      { bot: "Researcher", action: "Find the most relevant items in the approved sources, check them, add context, and make a short brief", output: "A concise source-linked brief with uncertain claims marked" },
    ],
    humanDecisions: ["Choose the topics and sources", "Approve any recurring schedule", "Decide whether to share the brief"],
    firstTest: "Use five approved sources to produce a three-item brief. Open every link and check every key claim.",
    kickoffMessage: "Prepare a three-item morning briefing from the approved source list. Explain why each item matters, link every source, and mark any fact that remains uncertain.",
  },
  {
    slug: "weekly-newsletter",
    title: "Weekly newsletter",
    audience: "Experts, executives, and organizations that publish a regular email",
    outcome: "A complete newsletter draft built from approved topics and source material a person approved.",
    botSlugs: ["writer"],
    optionalBotSlugs: ["scout", "editor"],
    setupNote: "One Writer is enough when you provide the topic and sources. Add Scout for recurring topic discovery or Editor for a separate review.",
    inputs: ["Audience and newsletter purpose", "Approved topics and source links", "Examples of the author's voice"],
    steps: [
      { bot: "Writer", action: "Draft the approved idea from the supplied sources, revise it for clarity, and mark claims that need review", output: "A complete newsletter draft, subject lines, source notes, and approval questions" },
    ],
    humanDecisions: ["Select the topic", "Approve factual and reputational claims", "Approve and send the final email"],
    firstTest: "Create one 500-word draft from three supplied sources and compare it with an existing newsletter sample.",
    kickoffMessage: "Use the approved topic and source list to draft this week's newsletter for the named audience. Provide three subject lines and mark every claim that needs my review.",
  },
  {
    slug: "social-media-content-set",
    title: "Social media content set",
    audience: "Small organizations and professionals who need several posts from one approved idea",
    outcome: "Draft posts that carry one approved message across selected platforms, with source links and review notes.",
    botSlugs: ["writer"],
    optionalBotSlugs: ["story", "editor"],
    setupNote: "One Writer can turn one approved idea into several posts. Add Story only when the central message is still unresolved, or Editor for independent review.",
    inputs: ["The approved idea or announcement", "Audience and platforms", "Confirmed facts, source material, and voice examples"],
    steps: [
      { bot: "Writer", action: "Find the central message in the approved facts, adapt it for each platform, remove repetition, and mark claims that need review", output: "A revised set of draft posts with source notes and approval questions" },
    ],
    humanDecisions: ["Approve the central message and proof points", "Approve names, quotations, and public claims", "Schedule or publish each post"],
    firstTest: "Create three posts from one approved announcement and review them beside recent posts from the same account.",
    kickoffMessage: "Create three social media drafts from this approved announcement. Establish one central message from the confirmed facts, adapt it to each platform, and list every claim or wording choice that needs approval.",
  },
  {
    slug: "client-meeting-follow-up",
    title: "Client meeting follow-up",
    audience: "Consultants and project teams that need clear notes and next steps after meetings",
    outcome: "A follow-up draft with decisions, action items, owners, and unresolved questions.",
    botSlugs: ["client"],
    optionalBotSlugs: ["editor", "planner"],
    setupNote: "Client Deliverables can handle an ordinary follow-up alone. Add Planner only for a complicated action plan or Editor for a separate review.",
    inputs: ["Meeting notes or transcript", "Participant names and roles", "Approved commitments and dates"],
    steps: [
      { bot: "Client Deliverables", action: "Clean the notes, separate decisions from discussion, extract action items, and prepare the client follow-up", output: "A formatted follow-up draft with decisions, owners, dates, and open questions" },
    ],
    humanDecisions: ["Confirm decisions and assignments", "Approve dates and commitments", "Send the follow-up"],
    firstTest: "Use a short internal meeting transcript and compare every action item with the original notes.",
    kickoffMessage: "Turn these meeting notes into a follow-up draft. Separate decisions, action items, owners, dates, and open questions. Mark every assignment or commitment that needs confirmation.",
  },
  {
    slug: "client-proposal",
    title: "Client proposal",
    audience: "Consultants, agencies, and small firms preparing a proposal from discovery notes",
    outcome: "A structured proposal draft with the problem, approach, work plan, assumptions, and approval points.",
    botSlugs: ["client"],
    optionalBotSlugs: ["researcher", "planner"],
    setupNote: "Client Deliverables can draft from complete discovery notes. Add Researcher only when outside facts must be checked, or Planner for a complicated delivery plan.",
    inputs: ["Discovery notes", "Approved services and prices", "Client requirements and proposal format"],
    steps: [
      { bot: "Client Deliverables", action: "Organize the stated needs, build the proposed work plan, and draft the proposal in the approved format", output: "A client-facing proposal draft with assumptions, prices, promises, and open questions marked" },
    ],
    humanDecisions: ["Approve scope and exclusions", "Approve prices, dates, and promises", "Deliver the proposal"],
    firstTest: "Draft a proposal from a fictional or closed project and verify every price and commitment against the source notes.",
    kickoffMessage: "Draft a proposal from these approved discovery notes. Use the supplied scope, prices, and format. Mark every promise, price, date, and assumption for my approval.",
  },
  {
    slug: "grant-opportunity-review",
    title: "Grant opportunity review",
    audience: "Nonprofits and public organizations deciding which funding opportunities deserve time",
    outcome: "A ranked opportunity list with eligibility checks, deadlines, fit, and next steps.",
    botSlugs: ["researcher"],
    optionalBotSlugs: ["scout", "planner"],
    setupNote: "One Researcher can review a short grant list. Add Scout only for a broad recurring search, or Planner after you decide to pursue a complicated application.",
    inputs: ["Organization profile and priorities", "Approved grant sources", "Capacity, geography, and deadline rules"],
    steps: [
      { bot: "Researcher", action: "Find or review the supplied opportunities, check eligibility and deadlines, compare fit, and outline the next decision", output: "A ranked opportunity list with source links, requirements, open questions, and a recommended next step" },
    ],
    humanDecisions: ["Confirm eligibility with the funder when necessary", "Choose which opportunities to pursue", "Approve the application plan and commitments"],
    firstTest: "Review three closed or low-priority opportunities and compare the results with the original funder pages.",
    kickoffMessage: "Review these grant opportunities against our approved profile. Report eligibility, deadline, required match, likely work, source link, and any question that needs confirmation.",
  },
  {
    slug: "website-content-update",
    title: "Website content update",
    audience: "Small teams updating an existing page from approved facts and design patterns",
    outcome: "Revised page copy and a website change with recorded check results that follows the existing design.",
    botSlugs: ["researcher", "writer", "coder"],
    setupNote: "This workflow uses separate roles because factual checking, public writing, and changing production code need different reviews before publication. For a minor edit from already approved copy, one Coder is enough.",
    inputs: ["The existing page and code project", "Approved facts and requested change", "Design reference and acceptance checks"],
    steps: [
      { bot: "Researcher", action: "Check the facts and source links", output: "A sourced fact sheet for human approval" },
      { bot: "Writer", action: "Draft clear page copy for the intended reader", output: "A page-copy draft for human review" },
      { bot: "Coder", action: "Update the page and run the project checks", output: "Changed files and verification results" },
    ],
    humanDecisions: ["Approve the facts and final copy", "Approve design changes", "Approve publication"],
    firstTest: "Update one low-risk page in a project copy and compare it with the approved design before publishing.",
    kickoffMessage: "Update this page using the approved fact sheet and copy. Follow the existing design system, run the available checks, and report every file changed.",
  },
  {
    slug: "project-launch-plan",
    title: "Project launch plan",
    audience: "Teams preparing a product, event, campaign, or internal initiative",
    outcome: "A launch plan with confirmed priorities, milestones, owners, dependencies, decision dates, and a message map.",
    botSlugs: ["chief-of-staff"],
    optionalBotSlugs: ["planner", "story"],
    setupNote: "One Chief of Staff can prepare a small launch plan. Add Planner for a large dependency-heavy schedule, or Story when several audiences need a separate message system.",
    inputs: ["Confirmed launch objective and target date", "Available people and budget", "Known requirements, risks, evidence, and audiences"],
    steps: [
      { bot: "Chief of Staff", action: "Organize the priorities, owners, constraints, schedule, dependencies, open decisions, and approved message", output: "A practical launch plan with milestones, owners, decision dates, risks, and a concise message brief" },
    ],
    humanDecisions: ["Confirm priorities, owners, and dates", "Resolve budget, capacity, and risk decisions", "Approve the message and every public claim"],
    firstTest: "Build a plan for a small internal launch and review every assignment with the named owner.",
    kickoffMessage: "Create a launch plan from this confirmed objective. Separate open ideas from approved work, list milestones, owners, dependencies, decision dates, and risks, then build a message map from the approved facts.",
  },
  {
    slug: "software-feature-build",
    title: "Software feature build",
    audience: "Small product teams and solo builders working in an existing codebase",
    outcome: "A defined feature, implemented as the smallest reversible change in a working branch or disposable project copy, with review notes and test results.",
    botSlugs: ["founding-engineer"],
    optionalBotSlugs: ["architect", "editor"],
    setupNote: "One Founding Engineer can plan, build, test, and explain a small feature. Add Architect for a consequential technical choice, or Editor for a separate user-facing review.",
    inputs: ["Approved feature request and user outcome", "Existing code, design, and technical constraints", "Acceptance checks, time limit, and project boundaries"],
    steps: [
      { bot: "Founding Engineer", action: "Compare the simplest viable approaches, build the approved feature as a small reversible change, run the checks, and explain the result", output: "A working change with decision notes, changed files, test results, release notes, and remaining risks" },
    ],
    humanDecisions: ["Approve the scope, technical approach, and any new dependency", "Approve security, data, and outside-service changes", "Approve merge and deployment"],
    firstTest: "Build one reversible feature in a project copy and confirm every acceptance check before merging.",
    kickoffMessage: "Build this approved feature inside the stated project boundary. Compare the simplest viable approaches, wait for approval on dependencies or data changes, build the smallest reversible version, run the relevant checks, and report every change and remaining risk.",
  },
  {
    slug: "operations-status-report",
    title: "Operations status report",
    audience: "People responsible for recurring automated work, websites, or internal systems",
    outcome: "A dated status report that shows successful checks, missed runs, failures, and requested next actions.",
    botSlugs: ["ops"],
    optionalBotSlugs: ["planner", "client"],
    setupNote: "Ops can make the routine report alone. Add Planner only when failures require a multi-step response plan, or Client Deliverables for a formal outside report.",
    inputs: ["Approved system and schedule list", "Read-only status sources", "Escalation rules and report audience"],
    steps: [
      { bot: "Ops", action: "Check the approved signals and schedules, organize problems by urgency, and write the update for the intended reader", output: "A clear status report with successful checks, failures, and actions that need approval" },
    ],
    humanDecisions: ["Approve repairs and configuration changes", "Approve external notifications", "Choose the schedule after manual tests"],
    firstTest: "Check two harmless read-only status sources and confirm that the Bots make no changes.",
    kickoffMessage: "Check the approved system list and prepare today's status report. Show successful checks, missed runs, failures, and the exact action that needs approval.",
  },
  {
    slug: "study-and-certification-plan",
    title: "Study and certification plan",
    audience: "Professionals learning a subject or preparing for a certification",
    outcome: "A realistic study plan with approved materials, practice questions, and weekly progress checks.",
    botSlugs: ["professor"],
    optionalBotSlugs: ["researcher", "planner"],
    setupNote: "Professor already plans lessons, explains material, and creates practice work. Add Researcher only for a broad source review or Planner for a demanding long-term schedule.",
    inputs: ["Learning goal and deadline", "Current knowledge and available time", "Official curriculum and approved materials"],
    steps: [
      { bot: "Professor", action: "Assess the starting point, organize the approved materials, explain key concepts, and build the weekly schedule and progress checks", output: "A practical study plan with explanations, practice questions, and progress checks" },
    ],
    humanDecisions: ["Choose authoritative materials", "Set the time commitment", "Register for any formal examination"],
    firstTest: "Plan one week of study and complete one short quiz before building the full schedule.",
    kickoffMessage: "Build a one-week study plan from the official curriculum and my available time. Include learning goals, readings, practice questions, and one progress check.",
  },
  {
    slug: "customer-request-response",
    title: "Customer request response",
    audience: "Small organizations that need consistent first drafts for routine customer questions",
    outcome: "A clear response draft based on approved policies, with exceptions sent to a person.",
    botSlugs: ["client"],
    optionalBotSlugs: ["researcher", "editor"],
    setupNote: "Client Deliverables can answer a routine request from approved policies. Add Researcher for a difficult policy search or Editor for sensitive wording.",
    inputs: ["The customer message", "Approved policies and knowledge base", "Escalation rules and response tone"],
    steps: [
      { bot: "Client Deliverables", action: "Identify the request, find the answer in the approved policy files, and prepare a clear reply", output: "A response draft with the supporting policy and any exception marked for approval" },
    ],
    humanDecisions: ["Approve exceptions, refunds, and promises", "Handle sensitive or upset customers", "Send the final response"],
    firstTest: "Use fictional requests that cover one routine case and one required escalation.",
    kickoffMessage: "Prepare a response draft to this customer request using only the approved policy files. Cite the policy internally and mark any exception, refund, promise, or escalation for a person.",
  },
  {
    slug: "new-venture-evaluation",
    title: "New venture evaluation",
    audience: "Founders and small teams deciding whether an idea deserves a real-world test",
    outcome: "An evidence-based venture brief and a small test with success, revise, and stop rules set in advance.",
    botSlugs: ["nova", "researcher", "pulse"],
    setupNote: "This workflow keeps the idea review, outside evidence check, and experiment design separate so enthusiasm for the idea does not also grade the evidence. For a quick early screen, Nova can work alone.",
    inputs: ["The idea and its current status", "The intended customer and problem", "Existing evidence, budget, time, and risk limits"],
    steps: [
      { bot: "Nova", action: "Separate known facts, assumptions, forecasts, and missing evidence", output: "A venture brief and assumption ledger" },
      { bot: "Researcher", action: "Check the highest-risk assumptions against approved public sources", output: "A source-based evidence brief with conflicts and gaps" },
      { bot: "Pulse", action: "Turn the most important open question into one measurable low-cost test", output: "A test plan with a primary metric and success, revise, and stop rules" },
    ],
    humanDecisions: ["Confirm the idea's status and risk limits", "Approve any spending, outreach, or public claim", "Decide whether to continue, revise, or stop after reviewing the results"],
    firstTest: "Use one idea and approved public sources to design a no-spend test. Approve the decision rules before running it.",
    kickoffMessage: "Evaluate this idea without treating it as a commitment. Separate evidence from assumptions, check the most important unknowns, and propose one low-cost test with decision rules for my approval.",
  },
  {
    slug: "growth-experiment",
    title: "Growth experiment",
    audience: "Small teams trying to improve one point in a customer journey",
    outcome: "A focused growth test with a verified baseline, one primary metric, and draft materials ready for review.",
    botSlugs: ["pulse"],
    optionalBotSlugs: ["researcher", "writer"],
    setupNote: "One Pulse can design a focused test and draft simple variants. Add Researcher for a difficult evidence question, or Writer when the test needs substantial campaign material.",
    inputs: ["The growth goal and selected customer stage", "Approved data and metric definitions", "Channels, budget, capacity, privacy rules, and voice examples"],
    steps: [
      { bot: "Pulse", action: "Review the approved evidence, verify the baseline, design one measurable experiment, and draft the smallest useful variants", output: "An experiment plan with one primary metric, decision rules, evidence gaps, and two draft variants" },
    ],
    humanDecisions: ["Approve the problem interpretation, metric, and decision rules", "Approve targeting, budget, outreach, and any tracking change", "Approve the variants and decide whether to launch, revise, or stop"],
    firstTest: "Use one approved historical data export to design a test and draft two variants without changing a live campaign.",
    kickoffMessage: "Design one growth experiment for this approved goal. Verify the baseline, use one primary metric, set success and stop rules before the test, and draft two variants without changing a live campaign.",
  },
  {
    slug: "leadership-weekly-review",
    title: "Leadership weekly review",
    audience: "Leaders and small teams that need a clear weekly view of priorities, capacity, and blocked decisions",
    outcome: "A current operating brief and a realistic proposed plan for the next week, with ideas kept separate from commitments.",
    botSlugs: ["chief-of-staff"],
    optionalBotSlugs: ["coach", "planner"],
    setupNote: "Chief of Staff can run an ordinary weekly review alone. Add Coach for a separate reflective session or Planner for a large cross-team schedule.",
    inputs: ["Confirmed priorities and commitments", "The week's notes, results, and decisions", "Next week's capacity, obligations, and deadlines"],
    steps: [
      { bot: "Chief of Staff", action: "Review what changed, compare it with confirmed priorities and capacity, and propose the next week's sequence without creating commitments", output: "A current priority brief, decision log, and proposed weekly plan" },
    ],
    humanDecisions: ["Decide what remains an idea and what becomes a priority", "Confirm assignments, deadlines, and capacity", "Approve any changes to calendars, task systems, or team messages"],
    firstTest: "Review one week from copied notes and compare every listed commitment with the source before changing any shared system.",
    kickoffMessage: "Run a weekly leadership review from these approved notes. Keep ideas separate from commitments, surface priority and capacity conflicts, and propose next week's plan without assigning work or changing shared records.",
  },
  {
    slug: "product-technology-direction",
    title: "Product and technology direction",
    audience: "Founders and small product teams choosing what to test and how to build it",
    outcome: "A product and technology decision record plus the smallest reversible prototype needed to resolve the next uncertainty.",
    botSlugs: ["nova", "architect", "founding-engineer"],
    setupNote: "This workflow separates the product question, the technical decision, and the prototype because each can expose a different reason not to build. For a narrow, already approved technical proof, one Founding Engineer is enough.",
    inputs: ["The product goal, intended user, and current evidence", "The current system and business constraints", "Budget, time limit, risk limits, and acceptance checks"],
    steps: [
      { bot: "Nova", action: "Identify the product assumptions and the evidence needed for the next decision", output: "A product hypothesis and evidence brief" },
      { bot: "Architect", action: "Compare practical technical directions for the approved product test", output: "An architecture decision record with costs, risks, and approval points" },
      { bot: "Founding Engineer", action: "Build the approved direction as the smallest reversible prototype", output: "A working prototype, acceptance-check results, and a decision log" },
    ],
    humanDecisions: ["Confirm the user problem and product promise", "Choose the technical direction and approve vendors, dependencies, budget, and risk", "Approve repository access, real data use, and any merge or release"],
    firstTest: "Use sample data in a disposable project copy to build one narrow proof and review its acceptance results before choosing a production direction.",
    kickoffMessage: "Help choose the next product and technology direction from the confirmed evidence and constraints. Compare practical options, mark every approval point, and build only the smallest prototype I approve in a disposable project copy.",
  },
  {
    slug: "narrative-message-system",
    title: "Narrative and message system",
    audience: "Leaders and teams that need one consistent story across their website, email, presentations, and social channels",
    outcome: "A central narrative, verified proof points, and a reusable message kit for the approved audiences and channels.",
    botSlugs: ["story"],
    optionalBotSlugs: ["researcher", "writer"],
    setupNote: "One Story can organize approved facts into a central narrative and sample messages. Add Researcher when proof points need substantial checking, or Writer for a large set of finished channel drafts.",
    inputs: ["Confirmed facts and approved source material", "Audiences, channels, and desired response", "Voice examples, protected language, and off-limit claims"],
    steps: [
      { bot: "Story", action: "Organize the approved facts, build the central narrative, adapt it by audience, and draft a small set of channel examples", output: "A source-aware narrative brief, audience message map, and sample website, email, and social copy" },
    ],
    humanDecisions: ["Decide the central meaning and positioning", "Approve proof points, quotations, testimonials, and public claims", "Approve final wording and any publication or distribution"],
    firstTest: "Use three approved source documents and one audience to create a one-page message map and three short channel drafts, then verify every claim.",
    kickoffMessage: "Build a reusable message system from these approved sources. Separate facts from interpretation and aspiration, surface contradictions, and draft channel examples only after I approve the central narrative and proof points.",
  },
];

export function getBotUseCase(slug: string) {
  return BOT_USE_CASES.find((useCase) => useCase.slug === slug);
}

export function getUseCaseStepPrompt(useCase: BotUseCase, stepIndex: number) {
  const step = useCase.steps[stepIndex];
  const botSlug = useCase.botSlugs[stepIndex];
  if (!step || !botSlug) return "";

  const previousStep = useCase.steps[stepIndex - 1];
  const previousContext = previousStep
    ? `Start with this result from ${previousStep.bot}: ${previousStep.output}. `
    : "Use the approved inputs I provide. ";

  return `${previousContext}${step.action}. Return this result: ${step.output}. Ask me about missing information before you continue.`;
}
