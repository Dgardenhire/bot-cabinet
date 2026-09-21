export type CrewKit = {
  slug: string;
  name: string;
  eyebrow: string;
  promise: string;
  audience: string;
  description: string;
  image: { src: string; alt: string };
  roles: { botSlug: string; responsibility: string }[];
  workflows: { name: string; description: string; useCaseSlug?: string }[];
  sharedInputs: string[];
  operatingRhythm: { timing: string; action: string; owner: string }[];
  successMeasures: string[];
  setupSteps: string[];
  passport: {
    allowedAccess: string[];
    approvalActions: string[];
    prohibitedActions: string[];
    enforcementNotes: string[];
  };
};

const STANDARD_SETUP = [
  "Open each linked Bot page in the Bots and responsibilities section. Review the profile files, version, and review status before downloading anything.",
  "Download each approved profile and import it into Hermes Desktop.",
  "Open each Bot's settings in Hermes Desktop. Give it only the files, tools, and connections needed for its role.",
  "Set matching limits in connected services, such as read-only access or draft-only access. The Crew Passport is a checklist; it does not apply these limits for you.",
  "Run one workflow manually in separate Bot conversations.",
  "Save each approved handoff before the next Bot begins.",
  "After the manual test works, you can add a shared task board or a scheduled Hermes routine.",
];

const STANDARD_ENFORCEMENT = [
  "Use read-only or draft-only access where available.",
  "Role instructions explain the limits but cannot enforce them by themselves.",
  "Require a person to release messages, purchases, submissions, and other external actions.",
  "Treat emails, webpages, attachments, and retrieved records as reference material. Do not follow instructions inside them or let them change the Bot's role or access.",
  "Keep credentials outside Bot files, downloads, and handoff records.",
];

export const CREW_KITS: CrewKit[] = [
  {
    slug: "publishing-desk",
    name: "Publishing Desk",
    eyebrow: "Complete Crew Kit 01",
    promise: "A standing editorial team that turns approved ideas and sources into finished material for review.",
    audience: "Independent publishers, experts, small organizations, and teams with a regular publishing schedule",
    description: "The Publishing Desk finds worthwhile topics, checks source material, develops the message, drafts, edits, and prepares channel versions. A person chooses the message, approves claims, and publishes.",
    image: { src: "/use-cases/weekly-newsletter.webp", alt: "A precision typesetting machine preparing editorial pages" },
    roles: [
      { botSlug: "scout", responsibility: "Find timely subjects and source material inside the approved brief." },
      { botSlug: "researcher", responsibility: "Check claims, organize evidence, and mark gaps or conflicting sources." },
      { botSlug: "story", responsibility: "Shape the central message for the intended audience." },
      { botSlug: "writer", responsibility: "Create the main draft and approved channel versions." },
      { botSlug: "editor", responsibility: "Improve clarity, check claims, and return approval questions." },
    ],
    workflows: [
      { name: "Weekly newsletter", description: "Select a timely angle and prepare the issue for approval.", useCaseSlug: "weekly-newsletter" },
      { name: "Social content set", description: "Turn one approved message into platform-ready drafts.", useCaseSlug: "social-media-content-set" },
      { name: "Narrative system", description: "Build reusable proof points and channel language.", useCaseSlug: "narrative-message-system" },
    ],
    sharedInputs: ["Audience, purpose, and publishing schedule", "Approved sources, facts, and proof points", "Voice examples, style rules, and off-limit claims"],
    operatingRhythm: [
      { timing: "Start of cycle", action: "Select the topic and approve sources.", owner: "Person + Scout" },
      { timing: "Research", action: "Build the evidence brief and mark gaps.", owner: "Researcher" },
      { timing: "Draft", action: "Create the main piece and channel versions.", owner: "Story + Writer" },
      { timing: "Review", action: "Check the package and decide whether to publish.", owner: "Editor + person" },
    ],
    successMeasures: ["Every public claim traces to an approved source", "The main draft reaches review on schedule", "A person approves all sending and publishing"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Approved research and editorial files", "The approved publishing calendar or task board"],
      approvalActions: ["Send or publish material", "Contact a source or contributor", "Change a public claim, price, or promise"],
      prohibitedActions: ["Use unapproved private material", "Publish from a draft conversation", "Represent assumptions as confirmed facts"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "sales-meeting-desk",
    name: "Sales Meeting Desk",
    eyebrow: "Complete Crew Kit 02",
    promise: "Prepare for important sales conversations and produce useful follow-up without losing commitments or context.",
    audience: "Consultants, founders, account leads, and small sales teams",
    description: "The Sales Meeting Desk researches an approved prospect, prepares the meeting brief and questions, records decisions, and drafts follow-up for a person to approve.",
    image: { src: "/use-cases/client-meeting-follow-up.webp", alt: "A carefully arranged desk prepared for a client meeting" },
    roles: [
      { botSlug: "scout", responsibility: "Act as Account Scout and gather current public information about the prospect." },
      { botSlug: "researcher", responsibility: "Verify account facts and separate evidence from assumptions." },
      { botSlug: "planner", responsibility: "Build the meeting objective, question sequence, and decision points." },
      { botSlug: "client", responsibility: "Turn approved notes into a recap and follow-up draft." },
      { botSlug: "editor", responsibility: "Check accuracy and flag unsupported promises." },
    ],
    workflows: [
      { name: "Meeting preparation", description: "Create an account brief, objective, and question list." },
      { name: "Meeting follow-up", description: "Turn notes into decisions, owners, and an approved message.", useCaseSlug: "client-meeting-follow-up" },
      { name: "Client proposal", description: "Develop an approved opportunity into a proposal draft.", useCaseSlug: "client-proposal" },
    ],
    sharedInputs: ["Approved prospect and meeting purpose", "Relationship history and current offer", "Pricing boundaries, proof points, and meeting notes"],
    operatingRhythm: [
      { timing: "Before the meeting", action: "Research the account and approve the objective.", owner: "Scout + Researcher + person" },
      { timing: "Meeting plan", action: "Prepare questions, priorities, and boundaries.", owner: "Planner" },
      { timing: "After the meeting", action: "Extract decisions, commitments, and open questions.", owner: "Client Deliverables" },
      { timing: "Follow-up", action: "Review and send the approved recap or proposal.", owner: "Editor + person" },
    ],
    successMeasures: ["The brief separates facts from assumptions", "Every commitment has an owner and date", "A person approves pricing, promises, and outbound messages"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Approved public account information", "Supplied CRM exports, notes, and meeting records"],
      approvalActions: ["Contact a prospect or customer", "Change pricing, scope, terms, or opportunity stage", "Promise a delivery date or result"],
      prohibitedActions: ["Send messages without review", "Invent account facts", "Access unrelated customer records"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "customer-support-desk",
    name: "Customer Support Desk",
    eyebrow: "Complete Crew Kit 03",
    promise: "Sort routine customer requests, find the right policy, and prepare clear responses while escalating exceptions.",
    audience: "Small businesses, service organizations, membership programs, and support teams",
    description: "The Customer Support Desk classifies incoming requests, checks approved policies and records, drafts a response, and routes refunds, disputes, safety issues, and unusual cases to a person.",
    image: { src: "/use-cases/customer-request-response.webp", alt: "An orderly communications desk receiving and sorting customer messages" },
    roles: [
      { botSlug: "chief-of-staff", responsibility: "Act as Intake, classify the request, and route it to the right path." },
      { botSlug: "researcher", responsibility: "Find the approved policy or customer record needed for the case." },
      { botSlug: "writer", responsibility: "Draft a concise response using confirmed information." },
      { botSlug: "editor", responsibility: "Act as Support Reviewer and check tone, accuracy, and escalation." },
    ],
    workflows: [
      { name: "Customer request response", description: "Classify, research, draft, and review one request." },
      { name: "Exception escalation", description: "Prepare a case record for refunds, disputes, legal, safety, or policy exceptions." },
      { name: "Support pattern review", description: "Summarize recurring questions and policy gaps." },
    ],
    sharedInputs: ["Approved policies and response examples", "Allowed customer and order records", "Escalation categories and responsible people"],
    operatingRhythm: [
      { timing: "Intake", action: "Classify urgency, topic, customer, and required records.", owner: "Chief of Staff" },
      { timing: "Policy check", action: "Find the approved answer and mark missing information.", owner: "Researcher" },
      { timing: "Draft", action: "Prepare the reply or escalation record.", owner: "Writer" },
      { timing: "Review", action: "Approve, revise, or route the response.", owner: "Editor + person" },
    ],
    successMeasures: ["Every response uses confirmed policy or records", "Exceptions reach a person", "No customer message is sent without configured approval"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["The designated support inbox or copied messages", "Approved policies and only the records required for the case"],
      approvalActions: ["Send a customer reply", "Issue a refund, credit, replacement, or account change", "Handle a legal, safety, or privacy issue"],
      prohibitedActions: ["Expose another customer’s information", "Delete requests or records", "Promise an outcome before approval"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "product-delivery-crew",
    name: "Product Delivery Crew",
    eyebrow: "Complete Crew Kit 04",
    promise: "Move an approved feature from a clear requirement through technical direction, implementation, checks, and review.",
    audience: "Founders, product leads, and small software teams using AI-assisted development",
    description: "The Product Delivery Crew turns an approved feature into requirements, a technical approach, working code, verification evidence, and a release recommendation. A person controls scope, credentials, merges, and deployment.",
    image: { src: "/use-cases/software-feature-build.webp", alt: "A precise mechanical assembly representing a software feature under construction" },
    roles: [
      { botSlug: "planner", responsibility: "Define the user outcome, acceptance conditions, scope, and dependencies." },
      { botSlug: "architect", responsibility: "Choose the technical approach and identify material risks." },
      { botSlug: "founding-engineer", responsibility: "Implement the approved approach and document actual changes." },
      { botSlug: "coder", responsibility: "Act as Tester by running checks and reporting failures." },
      { botSlug: "editor", responsibility: "Prepare review notes, release copy, and unresolved questions." },
    ],
    workflows: [
      { name: "Software feature build", description: "Take one approved feature through implementation and checks.", useCaseSlug: "software-feature-build" },
      { name: "Technology direction", description: "Compare choices and produce a decision record." },
      { name: "Release review", description: "Summarize changes, test evidence, residual risks, and rollback steps." },
    ],
    sharedInputs: ["Product goal and intended user", "Repository, documentation, and acceptance conditions", "Test commands and deployment process"],
    operatingRhythm: [
      { timing: "Definition", action: "Agree on the outcome and boundaries.", owner: "Planner + person" },
      { timing: "Direction", action: "Choose the approach and record risks.", owner: "Architect" },
      { timing: "Build and check", action: "Implement the change and run checks.", owner: "Founding Engineer + Coder" },
      { timing: "Release decision", action: "Review evidence before release.", owner: "Editor + person" },
    ],
    successMeasures: ["Behavior matches the acceptance conditions", "Tests pass or failures are plainly reported", "A person approves merge and deployment"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["The named repository and documentation", "Local tools and fictional, sanitized, or approved test data"],
      approvalActions: ["Change authentication, billing, or production data", "Install an unfamiliar dependency", "Merge, deploy, or publish a release"],
      prohibitedActions: ["Expose secrets", "Force-push or overwrite another project", "Disable security checks to make a build pass"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "grant-pursuit-desk",
    name: "Grant Pursuit Desk",
    eyebrow: "Complete Crew Kit 05",
    promise: "Find promising funding opportunities, check eligibility, and turn the strongest option into a proposal work plan.",
    audience: "Nonprofits, public agencies, schools, researchers, and small organizations seeking grants",
    description: "The Grant Pursuit Desk discovers opportunities, verifies eligibility, gathers evidence, prepares a proposal structure, and checks compliance. A person approves every organizational representation, budget, commitment, and submission.",
    image: { src: "/use-cases/grant-opportunity-review.webp", alt: "A research table organized around a funding opportunity and supporting documents" },
    roles: [
      { botSlug: "scout", responsibility: "Find current opportunities matching the approved mission, geography, and funding range." },
      { botSlug: "researcher", responsibility: "Verify eligibility, deadlines, requirements, and official language." },
      { botSlug: "planner", responsibility: "Build the work plan, evidence checklist, assignments, and schedule." },
      { botSlug: "writer", responsibility: "Draft sections from approved facts and evidence." },
      { botSlug: "editor", responsibility: "Check completeness, consistency, claims, and compliance questions." },
    ],
    workflows: [
      { name: "Grant opportunity review", description: "Check eligibility, fit, burden, timing, and decision points.", useCaseSlug: "grant-opportunity-review" },
      { name: "Proposal work plan", description: "Create a requirement map and drafting schedule." },
      { name: "Submission readiness", description: "Check attachments, representations, approvals, and open risks." },
    ],
    sharedInputs: ["Mission, programs, geography, and applicant type", "Approved organization facts and prior materials", "Official notice, funding range, and deadline constraints"],
    operatingRhythm: [
      { timing: "Discovery", action: "Find opportunities and preserve official source links.", owner: "Scout" },
      { timing: "Eligibility", action: "Check threshold requirements and prepare a decision brief.", owner: "Researcher + person" },
      { timing: "Development", action: "Build the evidence plan and draft approved sections.", owner: "Planner + Writer" },
      { timing: "Compliance", action: "Review the package and route open questions.", owner: "Editor + person" },
    ],
    successMeasures: ["Eligibility conclusions point to official language", "The proposal uses approved facts", "A person approves the application and submission"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Public funder sites and official notices", "Approved organizational documents and the grant workspace"],
      approvalActions: ["Represent organizational eligibility or performance", "Set a budget, target, or commitment", "Contact a funder or submit an application"],
      prohibitedActions: ["Invent performance data, partners, or budgets", "Reuse restricted material", "Submit through a portal"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "event-operations-desk",
    name: "Event Operations Desk",
    eyebrow: "Complete Crew Kit 06",
    promise: "Turn an approved event brief into a schedule, run of show, responsibility map, and exception list.",
    audience: "Small organizations, conveners, associations, and teams producing meetings or events",
    description: "The Event Operations Desk develops the plan, tracks decisions and dependencies, prepares participant and vendor material, monitors readiness, and keeps last-minute exceptions visible.",
    image: { src: "/use-cases/project-launch-plan.webp", alt: "An organized operations table with schedules and timing controls" },
    roles: [
      { botSlug: "planner", responsibility: "Build the event plan, milestones, dependencies, and run of show." },
      { botSlug: "chief-of-staff", responsibility: "Act as Coordinator and maintain owners, decisions, and deadlines." },
      { botSlug: "client", responsibility: "Prepare guest, speaker, vendor, and internal communication drafts." },
      { botSlug: "ops", responsibility: "Track readiness, logistics, unresolved risks, and day-of notes." },
    ],
    workflows: [
      { name: "Event launch plan", description: "Turn the brief into milestones, owners, and approvals." },
      { name: "Run of show", description: "Build a timed plan with owners and fallback actions." },
      { name: "Event status report", description: "Summarize readiness, decisions, and exceptions.", useCaseSlug: "operations-status-report" },
    ],
    sharedInputs: ["Approved purpose, audience, date, and budget range", "Venue, vendor, speaker, guest, and travel information", "Communication calendar and approval owners"],
    operatingRhythm: [
      { timing: "Planning", action: "Build milestones, dependencies, and decision dates.", owner: "Planner" },
      { timing: "Coordination", action: "Maintain the tracker and communication drafts.", owner: "Chief of Staff + Client Deliverables" },
      { timing: "Readiness", action: "Review logistics, risks, and fallback plans.", owner: "Ops + person" },
      { timing: "Closeout", action: "Record exceptions and follow-up.", owner: "Ops + person" },
    ],
    successMeasures: ["Every critical task has an owner and decision date", "The run of show includes fallback actions", "A person controls spending, contracts, and announcements"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["The event workspace and approved calendar", "Supplied vendor, venue, speaker, and guest records"],
      approvalActions: ["Contact a guest, speaker, vendor, or venue", "Make a purchase, booking, or cancellation", "Change the event date, program, or public announcement"],
      prohibitedActions: ["Sign contracts or accept terms", "Spend money or make reservations", "Expose guest information"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "weekly-business-review",
    name: "Weekly Business Review",
    eyebrow: "Complete Crew Kit 07",
    promise: "Bring current metrics, open work, capacity conflicts, and decisions into one weekly operating brief.",
    audience: "Founders, independent operators, executives, and small leadership teams",
    description: "The Weekly Business Review gathers approved operating information, explains material changes, identifies conflicts, prepares decision questions, and converts approved priorities into next actions.",
    image: { src: "/use-cases/leadership-weekly-review.jpg", alt: "A measured weekly operating review arranged across a professional desk" },
    roles: [
      { botSlug: "ops", responsibility: "Gather approved metrics, project status, deadlines, and exceptions." },
      { botSlug: "researcher", responsibility: "Act as Analyst and explain changes, gaps, and possible causes." },
      { botSlug: "chief-of-staff", responsibility: "Prepare the decision brief and surface capacity conflicts." },
      { botSlug: "planner", responsibility: "Turn approved decisions into owners, actions, and dates." },
    ],
    workflows: [
      { name: "Operations status", description: "Consolidate work, risks, owners, and exceptions." },
      { name: "Leadership review", description: "Prepare priorities and decisions for the coming week." },
      { name: "Capacity check", description: "Compare active work with available time and deadlines." },
    ],
    sharedInputs: ["Approved metrics and definitions", "Current project, client, and operations status", "Deadlines, capacity, and previous decisions"],
    operatingRhythm: [
      { timing: "Gather", action: "Collect metrics, work status, and exceptions.", owner: "Ops" },
      { timing: "Interpret", action: "Explain movement and mark unreliable data.", owner: "Researcher" },
      { timing: "Decide", action: "Present conflicts and questions.", owner: "Chief of Staff + person" },
      { timing: "Commit", action: "Record approved priorities, owners, and dates.", owner: "Planner" },
    ],
    successMeasures: ["Every metric uses an agreed definition and source", "Conflicts and weak evidence are visible", "Every approved action has an owner and date"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Approved dashboards and status exports", "The weekly review workspace and decision log"],
      approvalActions: ["Change a priority, assignment, deadline, or metric", "Message a client or team member", "Make a financial or personnel decision"],
      prohibitedActions: ["Invent missing metrics", "Change records to improve performance", "Expose confidential information"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "hiring-support-desk",
    name: "Hiring Support Desk",
    eyebrow: "Complete Crew Kit 08",
    promise: "Prepare a role brief, interview materials, candidate research, and structured notes for a human hiring process.",
    audience: "Small employers, founders, nonprofit leaders, and hiring managers",
    description: "The Hiring Support Desk defines the role, prepares consistent questions, organizes job-relevant information, and formats notes. People make every screening, ranking, rejection, compensation, and selection decision.",
    image: { src: "/use-cases/client-proposal.webp", alt: "A formal review desk with a role brief and interview materials" },
    roles: [
      { botSlug: "writer", responsibility: "Create the approved role brief and candidate-facing drafts." },
      { botSlug: "researcher", responsibility: "Organize supplied job-relevant information without scoring people." },
      { botSlug: "planner", responsibility: "Build the interview plan, question set, and schedule." },
      { botSlug: "editor", responsibility: "Check clarity, consistency, and missing criteria." },
    ],
    workflows: [
      { name: "Role and interview brief", description: "Define responsibilities, evidence, and the interview plan." },
      { name: "Candidate preparation", description: "Prepare job-relevant questions from approved material." },
      { name: "Structured notes", description: "Format observations without ranking or selecting candidates." },
    ],
    sharedInputs: ["Approved responsibilities and essential requirements", "Interview stages, participants, and schedule", "Job-relevant candidate material and hiring guidance"],
    operatingRhythm: [
      { timing: "Role definition", action: "Approve responsibilities, evidence, and process.", owner: "Writer + Planner + person" },
      { timing: "Preparation", action: "Organize material and prepare consistent questions.", owner: "Researcher + Planner" },
      { timing: "Interview record", action: "Format factual notes and open questions.", owner: "Editor" },
      { timing: "Decision", action: "People make every employment decision.", owner: "Hiring manager" },
    ],
    successMeasures: ["Interviewers use approved job-relevant criteria", "Notes separate observations from conclusions", "No Bot ranks, rejects, or selects candidates"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["The approved role and interview plan", "Job-relevant material in a limited hiring workspace"],
      approvalActions: ["Contact, advance, rank, reject, or select a candidate", "Discuss compensation or background checks", "Use sensitive personal information"],
      prohibitedActions: ["Make an employment decision", "Infer protected traits", "Search private or unapproved sources"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "learning-certification-crew",
    name: "Learning and Certification Crew",
    eyebrow: "Complete Crew Kit 09",
    promise: "Turn official material into a realistic study plan, clear explanations, practice questions, and progress reviews.",
    audience: "Professionals, students, and independent learners preparing for a course or certification",
    description: "The Learning and Certification Crew organizes authoritative material, builds a study sequence, explains difficult concepts, creates practice work, and adjusts the plan from observed progress.",
    image: { src: "/use-cases/study-and-certification-plan.webp", alt: "An antiquarian study table with a learning plan and reference books" },
    roles: [
      { botSlug: "researcher", responsibility: "Collect and organize approved official materials." },
      { botSlug: "professor", responsibility: "Explain concepts and create practice questions." },
      { botSlug: "coach", responsibility: "Act as Quiz Coach and help the learner review errors." },
      { botSlug: "planner", responsibility: "Build and adjust the study schedule." },
    ],
    workflows: [
      { name: "Study plan", description: "Build a realistic sequence from official material.", useCaseSlug: "study-and-certification-plan" },
      { name: "Concept practice", description: "Explain one topic, test understanding, and record gaps." },
      { name: "Progress review", description: "Compare planned and completed work, then adjust." },
    ],
    sharedInputs: ["Official syllabus, guide, or course material", "Target date and available study time", "Current knowledge, weak areas, and practice results"],
    operatingRhythm: [
      { timing: "Plan", action: "Map official material to a realistic sequence.", owner: "Researcher + Planner" },
      { timing: "Learn", action: "Explain the current topic and examples.", owner: "Professor" },
      { timing: "Practice", action: "Run a quiz and record errors.", owner: "Coach" },
      { timing: "Review", action: "Adjust the next cycle from progress.", owner: "Planner + learner" },
    ],
    successMeasures: ["The plan covers official objectives", "Practice traces to approved materials", "Weak areas change the next cycle"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Approved official learning materials", "Study notes, practice results, and a dedicated calendar"],
      approvalActions: ["Register or purchase material", "Change the target or schedule", "Add outside material as an authority"],
      prohibitedActions: ["Claim unofficial material is authoritative", "Complete graded work dishonestly", "Guarantee an exam result"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "personal-planning-desk",
    name: "Personal Planning Desk",
    eyebrow: "Complete Crew Kit 10",
    promise: "Turn a trip, set of errands, or personal project into a researched plan with constraints, choices, and approval points.",
    audience: "Individuals and families organizing travel, errands, moves, purchases, or personal projects",
    description: "The Personal Planning Desk researches approved options, organizes constraints, builds a practical sequence, checks tradeoffs, and prepares decisions. A person controls purchases, bookings, messages, accounts, and calendars.",
    image: { src: "/use-cases/new-venture-evaluation.jpg", alt: "A welcoming planning table with maps, notes, and compared options" },
    roles: [
      { botSlug: "researcher", responsibility: "Research approved options, current facts, costs, and constraints." },
      { botSlug: "planner", responsibility: "Build the sequence, schedule, decisions, and fallback plan." },
      { botSlug: "coach", responsibility: "Act as Constraint Checker and test fit with stated priorities." },
    ],
    workflows: [
      { name: "Personal project plan", description: "Turn a goal into steps, decisions, and checkpoints." },
      { name: "Option comparison", description: "Compare choices by cost, time, fit, and tradeoffs." },
      { name: "Personal weekly review", description: "Review commitments and choose next actions." },
    ],
    sharedInputs: ["Goal, deadline, and people involved", "Budget, location, accessibility, and schedule constraints", "Approved options, preferences, and non-negotiables"],
    operatingRhythm: [
      { timing: "Define", action: "Confirm the goal, constraints, and research questions.", owner: "Planner + person" },
      { timing: "Research", action: "Collect options, costs, and tradeoffs.", owner: "Researcher" },
      { timing: "Check", action: "Test fit and fallback needs.", owner: "Coach" },
      { timing: "Decide", action: "Approve choices and carry out actions personally.", owner: "Person" },
    ],
    successMeasures: ["Options use current information", "The plan reflects budget and schedule limits", "A person completes purchases, bookings, and account changes"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Approved public sources", "Supplied non-sensitive planning files and a copied calendar view"],
      approvalActions: ["Make a purchase, booking, cancellation, or return", "Send a message or change a calendar", "Access medical, legal, or financial information"],
      prohibitedActions: ["Spend money or accept terms", "Make medical, legal, or financial decisions", "Expose personal information"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
  {
    slug: "small-business-admin-desk",
    name: "Small-Business Admin Desk",
    eyebrow: "Complete Crew Kit 11",
    promise: "Keep routine inbox work, customer drafts, weekly status, and follow-up organized without uncontrolled authority.",
    audience: "Independent professionals, small firms, local businesses, and lean administrative teams",
    description: "The Small-Business Admin Desk sorts approved incoming work, finds the relevant context, drafts routine replies, tracks follow-up, and prepares a weekly operating view. A person controls sending, payments, contracts, account changes, and deletions.",
    image: { src: "/use-cases/operations-status-report.webp", alt: "A compact administrative desk organizing correspondence and weekly status" },
    roles: [
      { botSlug: "chief-of-staff", responsibility: "Act as Intake and route messages, tasks, and decisions." },
      { botSlug: "researcher", responsibility: "Find the approved customer, project, policy, or service context." },
      { botSlug: "client", responsibility: "Prepare customer and partner communication drafts." },
      { botSlug: "ops", responsibility: "Maintain open work, deadlines, exceptions, and status." },
      { botSlug: "planner", responsibility: "Convert priorities into follow-up steps, owners, and dates." },
    ],
    workflows: [
      { name: "Customer response", description: "Research and prepare a routine response." },
      { name: "Operations status", description: "Summarize work, deadlines, exceptions, and decisions.", useCaseSlug: "operations-status-report" },
      { name: "Weekly owner review", description: "Choose priorities and record decisions." },
      { name: "Meeting follow-up", description: "Turn a meeting into approved actions." },
    ],
    sharedInputs: ["Approved inboxes or copied messages", "Customer, service, project, policy, and pricing records", "Open task list and approval owners"],
    operatingRhythm: [
      { timing: "Daily intake", action: "Classify work and identify needed context.", owner: "Chief of Staff" },
      { timing: "Prepare", action: "Research and draft the work product.", owner: "Researcher + Client Deliverables" },
      { timing: "Track", action: "Update tasks, deadlines, and exceptions.", owner: "Ops + Planner" },
      { timing: "Weekly review", action: "Approve priorities and consequential actions.", owner: "Person" },
    ],
    successMeasures: ["Incoming work reaches a clear workflow or owner", "Drafts use approved records and policies", "A person approves sending, spending, contracts, and deletions"],
    setupSteps: STANDARD_SETUP,
    passport: {
      allowedAccess: ["Only approved inboxes, folders, and records", "The task board, calendar, policies, prices, and templates"],
      approvalActions: ["Send a message or statement", "Make a payment, refund, purchase, or contract change", "Delete a record or change an account"],
      prohibitedActions: ["Access unrestricted banking", "Share confidential information", "Delete messages or change its own access rules"],
      enforcementNotes: STANDARD_ENFORCEMENT,
    },
  },
];

export function getCrewKit(slug: string) {
  return CREW_KITS.find((kit) => kit.slug === slug);
}
