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
}

export const BOT_USE_CASES: BotUseCase[] = [
  {
    slug: "morning-industry-briefing",
    title: "Morning industry briefing",
    audience: "Leaders and small teams who need a short update on a defined subject",
    outcome: "A concise morning brief with source links, important changes, and questions that need attention.",
    botSlugs: ["scout", "researcher", "editor"],
    inputs: ["A list of topics", "Approved news and industry sources", "Desired length and delivery time"],
    steps: [
      { bot: "Scout", action: "Find the most relevant new items", output: "A ranked list with source links" },
      { bot: "Researcher", action: "Check the leading items and add context", output: "A source-based briefing draft" },
      { bot: "Editor", action: "Shorten the brief and mark uncertain claims", output: "A clear final draft for human review" },
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
    botSlugs: ["scout", "writer", "editor"],
    inputs: ["Audience and newsletter purpose", "Approved topics and source links", "Examples of the author's voice"],
    steps: [
      { bot: "Scout", action: "Propose timely topics and angles", output: "Three ranked newsletter ideas" },
      { bot: "Writer", action: "Draft the selected idea from approved material", output: "A complete newsletter draft and subject lines" },
      { bot: "Editor", action: "Improve clarity and check claims", output: "A revised draft and approval questions" },
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
    botSlugs: ["story", "writer", "editor"],
    inputs: ["The approved idea or announcement", "Audience and platforms", "Confirmed facts, source material, and voice examples"],
    steps: [
      { bot: "STORY", action: "Build a central message from the confirmed facts", output: "A message brief with proof points and unsupported claims marked" },
      { bot: "Writer", action: "Adapt the approved message for each platform", output: "A set of draft posts with source notes" },
      { bot: "Editor", action: "Remove repetition and check tone", output: "A revised content set with questions" },
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
    botSlugs: ["editor", "planner", "client"],
    inputs: ["Meeting notes or transcript", "Participant names and roles", "Approved commitments and dates"],
    steps: [
      { bot: "Editor", action: "Clean the notes and separate decisions from discussion", output: "Structured meeting notes" },
      { bot: "Planner", action: "Extract action items, owners, dependencies, and questions", output: "A proposed action list" },
      { bot: "Client Deliverables", action: "Format the material for the client", output: "A formatted follow-up draft with decisions, owners, dates, and open questions" },
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
    botSlugs: ["researcher", "planner", "client"],
    inputs: ["Discovery notes", "Approved services and prices", "Client requirements and proposal format"],
    steps: [
      { bot: "Researcher", action: "Organize the client's stated needs and relevant background", output: "A concise situation brief" },
      { bot: "Planner", action: "Build the proposed work plan and dependencies", output: "A scope and delivery sequence" },
      { bot: "Client Deliverables", action: "Draft the proposal in the approved format", output: "A client-facing proposal draft" },
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
    botSlugs: ["scout", "researcher", "planner"],
    inputs: ["Organization profile and priorities", "Approved grant sources", "Capacity, geography, and deadline rules"],
    steps: [
      { bot: "Scout", action: "Find opportunities that match the search rules", output: "A short candidate list" },
      { bot: "Researcher", action: "Check eligibility, deadline, and stated requirements", output: "An opportunity comparison" },
      { bot: "Planner", action: "Estimate the work and map the decision timeline", output: "A recommended pursuit plan" },
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
    botSlugs: ["chief-of-staff", "planner", "story"],
    inputs: ["Confirmed launch objective and target date", "Available people and budget", "Known requirements, risks, evidence, and audiences"],
    steps: [
      { bot: "Chief of Staff", action: "Organize confirmed priorities, owners, constraints, and unresolved decisions", output: "A launch operating brief" },
      { bot: "Planner", action: "Build the schedule, owners, and dependencies", output: "A sequenced launch plan" },
      { bot: "STORY", action: "Build the launch narrative from approved facts", output: "A message map with proof points, audience needs, and unsupported claims" },
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
    botSlugs: ["architect", "founding-engineer", "editor"],
    inputs: ["Approved feature request and user outcome", "Existing code, design, and technical constraints", "Acceptance checks, time limit, and project boundaries"],
    steps: [
      { bot: "ARCHITECT", action: "Compare the simplest viable technical approaches and identify risks", output: "An implementation decision record with approval points" },
      { bot: "Founding Engineer", action: "Build the approved feature as a small reversible change and run the available checks", output: "Changed files, test results, shortcuts, and remaining risks" },
      { bot: "Editor", action: "Review user-facing copy and the handoff summary", output: "Copy-review notes and a release-note draft" },
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
    botSlugs: ["ops", "planner", "client"],
    inputs: ["Approved system and schedule list", "Read-only status sources", "Escalation rules and report audience"],
    steps: [
      { bot: "Ops", action: "Check the approved signals and schedules", output: "A raw status report" },
      { bot: "Planner", action: "Organize problems by urgency and dependency", output: "A proposed response plan" },
      { bot: "Client Deliverables", action: "Format the update for the intended reader", output: "A clear operations update" },
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
    botSlugs: ["professor", "researcher", "planner"],
    inputs: ["Learning goal and deadline", "Current knowledge and available time", "Official curriculum and approved materials"],
    steps: [
      { bot: "Professor", action: "Assess the starting point and explain key concepts", output: "A learning-needs summary" },
      { bot: "Researcher", action: "Organize authoritative materials", output: "A source and curriculum map" },
      { bot: "Planner", action: "Build the weekly schedule and progress checks", output: "A practical study plan" },
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
    botSlugs: ["client", "researcher", "editor"],
    inputs: ["The customer message", "Approved policies and knowledge base", "Escalation rules and response tone"],
    steps: [
      { bot: "Client Deliverables", action: "Identify the request and gather the relevant customer context", output: "A request summary" },
      { bot: "Researcher", action: "Find the approved policy or answer", output: "A source-backed response outline" },
      { bot: "Editor", action: "Create a clear and courteous reply", output: "A response draft for approval" },
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
    inputs: ["The idea and its current status", "The intended customer and problem", "Existing evidence, budget, time, and risk limits"],
    steps: [
      { bot: "NOVA", action: "Separate known facts, assumptions, forecasts, and missing evidence", output: "A venture brief and assumption ledger" },
      { bot: "Researcher", action: "Check the highest-risk assumptions against approved public sources", output: "A source-based evidence brief with conflicts and gaps" },
      { bot: "PULSE", action: "Turn the most important open question into one measurable low-cost test", output: "A test plan with a primary metric and success, revise, and stop rules" },
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
    botSlugs: ["researcher", "pulse", "writer"],
    inputs: ["The growth goal and selected customer stage", "Approved data and metric definitions", "Channels, budget, capacity, privacy rules, and voice examples"],
    steps: [
      { bot: "Researcher", action: "Check customer evidence and possible causes of the selected problem", output: "A concise evidence brief with gaps marked" },
      { bot: "PULSE", action: "Define the baseline and design one measurable experiment", output: "An experiment plan with one primary metric and success and stop rules" },
      { bot: "Writer", action: "Draft the approved test materials for the selected channel", output: "Two clear variants with claims and approval questions marked" },
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
    botSlugs: ["coach", "chief-of-staff", "planner"],
    inputs: ["Confirmed priorities and commitments", "The week's notes, results, and decisions", "Next week's capacity, obligations, and deadlines"],
    steps: [
      { bot: "COACH", action: "Guide a review of what changed, what remains open, and what may need to stop", output: "A decision frame separating ideas, plans, and commitments" },
      { bot: "Chief of Staff", action: "Compare the review with confirmed priorities, owners, dependencies, and capacity", output: "A priority and decision log with conflicts and missing owners marked" },
      { bot: "Planner", action: "Turn only the approved priorities into a proposed sequence for the next week", output: "A weekly plan with owners, dependencies, and checkpoints" },
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
    inputs: ["The product goal, intended user, and current evidence", "The current system and business constraints", "Budget, time limit, risk limits, and acceptance checks"],
    steps: [
      { bot: "NOVA", action: "Identify the product assumptions and the evidence needed for the next decision", output: "A product hypothesis and evidence brief" },
      { bot: "ARCHITECT", action: "Compare practical technical directions for the approved product test", output: "An architecture decision record with costs, risks, and approval points" },
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
    botSlugs: ["researcher", "story", "writer"],
    inputs: ["Confirmed facts and approved source material", "Audiences, channels, and desired response", "Voice examples, protected language, and off-limit claims"],
    steps: [
      { bot: "Researcher", action: "Organize the confirmed facts, sources, contradictions, and evidence gaps", output: "A source and proof-point brief" },
      { bot: "STORY", action: "Build the central narrative and adapt its message structure by audience", output: "A narrative brief and audience message map" },
      { bot: "Writer", action: "Turn the approved message map into reusable channel drafts", output: "A message kit with sample website, email, and social copy" },
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
