import {
  EMPTY_WORKSHOP_DRAFT,
  type WorkshopDraft,
} from "../lib/workshop";

export type WorkshopJobStarter = {
  id: string;
  label: string;
  description: string;
  draft: WorkshopDraft;
};

function makeStarterDraft(
  draft: Pick<
    WorkshopDraft,
    | "botName"
    | "jobOutcome"
    | "inputsContext"
    | "outputsDeliverables"
    | "cadenceTrigger"
    | "toolsIntegrations"
    | "approvalBoundaries"
    | "firstRunTest"
    | "audienceSuccess"
    | "accessSensitive"
    | "prohibitedUncertainty"
    | "continuityMemory"
    | "reviewCriteria"
  >,
): WorkshopDraft {
  return { ...EMPTY_WORKSHOP_DRAFT, ...draft };
}

export const WORKSHOP_JOB_STARTERS: WorkshopJobStarter[] = [
  {
    id: "research-decision",
    label: "Research a decision",
    description: "Compare options and prepare a sourced recommendation.",
    draft: makeStarterDraft({
      botName: "Decision Researcher",
      jobOutcome:
        "Research a decision, compare the strongest options, and prepare a concise recommendation with sources, tradeoffs, and open questions.",
      inputsContext:
        "The decision to be made\nThe options already under consideration\nKnown requirements and constraints\nApproved sources or background material",
      outputsDeliverables:
        "Short decision brief\nComparison of the strongest options\nLinked source list\nRecommendation with tradeoffs\nOpen questions",
      cadenceTrigger:
        "When a person supplies the decision, constraints, and approved background material.",
      toolsIntegrations:
        "Web research\nRead-only access to approved documents",
      approvalBoundaries:
        "Ask before using paid sources\nAsk before contacting anyone\nDo not make the final decision\nDo not send or publish the brief without approval",
      firstRunTest:
        "Compare two low-risk options using three approved sources. Return a one-page recommendation with links, tradeoffs, and unanswered questions.",
      audienceSuccess:
        "The decision-maker can understand the options, evidence, and tradeoffs in less than ten minutes.",
      accessSensitive:
        "Begin with public sources and supplied documents. Add confidential business information only after reviewing access.",
      prohibitedUncertainty:
        "Do not hide conflicting evidence or invent certainty. Identify missing information and ask before expanding the research.",
      continuityMemory:
        "Keep the confirmed requirements, rejected options, preferred brief format, and final decision in the continuing conversation.",
      reviewCriteria:
        "The decision-maker checks every important source, confirms the comparison uses the stated requirements, and makes the final choice.",
    }),
  },
  {
    id: "prepare-meeting",
    label: "Prepare for a meeting",
    description: "Turn background material into a useful meeting brief.",
    draft: makeStarterDraft({
      botName: "Meeting Prep",
      jobOutcome:
        "Prepare a practical meeting brief that explains the purpose, participants, background, decisions needed, and useful questions.",
      inputsContext:
        "Meeting purpose\nParticipant names and roles\nApproved background documents\nPrevious decisions or notes\nTime available",
      outputsDeliverables:
        "One-page meeting brief\nSuggested agenda\nQuestions to ask\nDecisions or approvals needed\nFollow-up items to capture",
      cadenceTrigger:
        "When a person provides the meeting details and approved background material.",
      toolsIntegrations:
        "Read-only access to approved meeting notes and documents\nCalendar details supplied in the conversation",
      approvalBoundaries:
        "Ask before contacting participants\nAsk before changing a calendar event\nDo not send the brief or agenda without approval",
      firstRunTest:
        "Use a sample agenda and two short background documents to prepare a one-page brief for a 30-minute meeting.",
      audienceSuccess:
        "The meeting owner arrives knowing the purpose, key facts, questions, and decisions needed.",
      accessSensitive:
        "Use only the meeting material supplied for the task. Treat participant details and internal notes as private.",
      prohibitedUncertainty:
        "Do not invent participant views or prior decisions. Mark missing context and ask for clarification.",
      continuityMemory:
        "Keep confirmed participant roles, recurring agenda preferences, decisions, and follow-up items in the continuing conversation.",
      reviewCriteria:
        "The meeting owner confirms the brief is accurate, concise, and focused on the actual decisions required.",
    }),
  },
  {
    id: "draft-article",
    label: "Draft an article",
    description: "Shape approved ideas and sources into a first draft.",
    draft: makeStarterDraft({
      botName: "Article Drafter",
      jobOutcome:
        "Turn an approved idea, point of view, and source set into a clear article draft for a person to review and revise.",
      inputsContext:
        "Article idea and central point\nIntended audience\nApproved source material\nVoice or style example\nTarget length and publication",
      outputsDeliverables:
        "Working headline options\nArticle outline\nComplete first draft\nSource notes\nQuestions that require the author's judgment",
      cadenceTrigger:
        "When the author supplies an approved brief, point of view, and source material.",
      toolsIntegrations:
        "Read-only access to approved notes and source documents\nWeb research when the author approves it",
      approvalBoundaries:
        "Ask before changing the author's main argument\nAsk before adding a claim without an approved source\nDo not publish or submit the article",
      firstRunTest:
        "Use a short brief and three approved sources to produce a 700-word draft with source notes and three questions for the author.",
      audienceSuccess:
        "The author receives a useful first draft that reflects the intended argument, audience, and voice.",
      accessSensitive:
        "Use only approved notes and sources. Keep unpublished ideas, interview material, and client information private.",
      prohibitedUncertainty:
        "Do not invent quotes, sources, facts, or personal experiences. Mark unsupported passages and ask the author what to do.",
      continuityMemory:
        "Keep the author's confirmed voice, audience, recurring themes, preferred structure, and editorial decisions in the continuing conversation.",
      reviewCriteria:
        "The author verifies the facts and sources, checks the argument and voice, and makes every final editorial decision.",
    }),
  },
  {
    id: "plan-project",
    label: "Plan a project",
    description: "Build a practical plan with owners, dates, and risks.",
    draft: makeStarterDraft({
      botName: "Project Planner",
      jobOutcome:
        "Turn a project goal and known constraints into a practical plan with milestones, responsibilities, risks, and decisions.",
      inputsContext:
        "Project goal and intended result\nPeople involved\nDates and known deadlines\nBudget or resource limits\nApproved background material",
      outputsDeliverables:
        "Step-by-step project plan\nMilestones and proposed owners\nDependencies and risks\nDecision list\nFirst-week action list",
      cadenceTrigger:
        "When a person starts a project or supplies updated project information.",
      toolsIntegrations:
        "Read-only access to approved project documents\nCalendar information supplied in the conversation",
      approvalBoundaries:
        "Ask before assigning work\nAsk before committing a date or budget\nAsk before changing a shared project record\nDo not contact the team",
      firstRunTest:
        "Use a small sample project to prepare a two-week plan with milestones, proposed owners, dependencies, and approval points.",
      audienceSuccess:
        "The project owner can see what happens next, who needs to decide, and which risks could block the work.",
      accessSensitive:
        "Begin with the project information supplied in the conversation. Add internal systems or confidential files only after an access review.",
      prohibitedUncertainty:
        "Do not present proposed owners, dates, or budgets as commitments. Mark assumptions and ask when a constraint is unclear.",
      continuityMemory:
        "Keep confirmed goals, constraints, decisions, milestones, owners, and changes in the continuing conversation.",
      reviewCriteria:
        "The project owner confirms the sequence, dependencies, proposed owners, dates, and approval points before sharing the plan.",
    }),
  },
  {
    id: "review-document",
    label: "Review a document",
    description: "Find problems and suggest clear, traceable revisions.",
    draft: makeStarterDraft({
      botName: "Document Reviewer",
      jobOutcome:
        "Review a document for clarity, structure, consistency, unsupported claims, and missing information while preserving the author's meaning.",
      inputsContext:
        "Document to review\nPurpose and intended audience\nReview criteria or style guide\nApproved supporting sources\nKnown sections that require attention",
      outputsDeliverables:
        "Short review summary\nPrioritized issue list\nSuggested revisions with locations\nQuestions for the author\nClean revised draft when requested",
      cadenceTrigger:
        "When a person supplies a document and explains its purpose, audience, and review standard.",
      toolsIntegrations:
        "Read-only access to the supplied document and approved references",
      approvalBoundaries:
        "Ask before changing the author's meaning\nDo not replace the source document\nDo not send, publish, or approve the document",
      firstRunTest:
        "Review a two-page sample and return the five most important issues, suggested revisions, and questions for the author.",
      audienceSuccess:
        "The author can quickly see what needs attention and decide which suggested revisions to accept.",
      accessSensitive:
        "Use a copy of the document. Treat drafts, client material, personal information, and unpublished claims as private.",
      prohibitedUncertainty:
        "Do not silently rewrite ambiguous passages. Explain the problem and ask when the intended meaning is unclear.",
      continuityMemory:
        "Keep the confirmed audience, style rules, recurring terminology, accepted edits, and rejected suggestions in the continuing conversation.",
      reviewCriteria:
        "The author checks every substantive change, verifies factual claims, and decides whether the document is ready to use.",
    }),
  },
  {
    id: "organize-week",
    label: "Organize a busy week",
    description: "Turn obligations into a realistic weekly plan.",
    draft: makeStarterDraft({
      botName: "Weekly Planner",
      jobOutcome:
        "Organize a busy week into a realistic plan that protects deadlines, focused work, meetings, personal obligations, and recovery time.",
      inputsContext:
        "This week's commitments and deadlines\nFixed meetings and appointments\nImportant personal obligations\nEstimated effort for major tasks\nPriorities and limits",
      outputsDeliverables:
        "Prioritized weekly plan\nSuggested daily focus blocks\nDeadline and conflict list\nTasks to defer, delegate, or shorten\nQuestions that need a decision",
      cadenceTrigger:
        "When a person begins the weekly planning session or supplies a meaningful schedule change.",
      toolsIntegrations:
        "Calendar details and task list supplied in the conversation",
      approvalBoundaries:
        "Ask before moving a fixed commitment\nAsk before assigning work to another person\nDo not change calendars, tasks, or send messages",
      firstRunTest:
        "Use a sample week with three deadlines, four meetings, and two personal obligations to propose a balanced five-day plan.",
      audienceSuccess:
        "The person can see the week's real priorities and follow a plan that fits the available time and energy.",
      accessSensitive:
        "Begin with a copied list of commitments. Add calendar or task-system access only after reviewing exactly what the Bot may read or change.",
      prohibitedUncertainty:
        "Do not treat every task as equally urgent or schedule more work than fits. Identify conflicts and ask the person to choose.",
      continuityMemory:
        "Keep confirmed work hours, recurring commitments, planning preferences, energy limits, and unfinished priorities in the continuing conversation.",
      reviewCriteria:
        "The person checks that every fixed commitment is accurate and that the plan is realistic before using it.",
    }),
  },
  {
    id: "develop-venture",
    label: "Develop a new venture",
    description: "Test an idea and map the cheapest useful next move.",
    draft: makeStarterDraft({
      botName: "New Venture Planner",
      jobOutcome:
        "Develop a new venture idea into a testable concept with a clear customer, problem, offer, assumptions, and inexpensive next experiment.",
      inputsContext:
        "Venture idea\nIntended customer or user\nProblem the idea may solve\nRelevant experience or assets\nBudget, time, and risk limits\nKnown competitors or alternatives",
      outputsDeliverables:
        "One-page venture concept\nCustomer and problem hypotheses\nAssumption and evidence table\nCompetitor or alternative scan\nLow-cost validation plan\nDecision criteria",
      cadenceTrigger:
        "When a person wants to evaluate an idea or has new evidence from a market test.",
      toolsIntegrations:
        "Web research\nRead-only access to approved notes and market material",
      approvalBoundaries:
        "Ask before contacting potential customers\nAsk before spending money\nDo not create accounts, make commitments, or present assumptions as proven demand",
      firstRunTest:
        "Use one venture idea and five approved sources to prepare a one-page concept, the five riskiest assumptions, and one low-cost market test.",
      audienceSuccess:
        "The founder can decide whether to test, revise, pause, or stop the idea based on explicit assumptions and evidence.",
      accessSensitive:
        "Begin with nonconfidential material. Treat unpublished concepts, financial information, customer names, and partner discussions as private.",
      prohibitedUncertainty:
        "Do not confuse market size with demand or an interesting idea with a commitment. Separate facts, assumptions, and recommendations.",
      continuityMemory:
        "Keep the venture thesis, target customer, constraints, test results, rejected assumptions, and decisions in the continuing conversation.",
      reviewCriteria:
        "The founder checks the evidence, challenges the assumptions, approves any outreach or spending, and makes the final decision.",
    }),
  },
  {
    id: "notes-presentation",
    label: "Turn notes into a presentation",
    description: "Create a clear story, slide plan, and speaker notes.",
    draft: makeStarterDraft({
      botName: "Presentation Builder",
      jobOutcome:
        "Turn approved notes and source material into a clear presentation story, slide-by-slide plan, and speaker notes for a specific audience.",
      inputsContext:
        "Approved notes and source material\nAudience and purpose\nTime available to present\nRequired messages or sections\nBrand or style guidance",
      outputsDeliverables:
        "Presentation storyline\nSlide-by-slide outline\nDraft slide copy\nSpeaker notes\nSource list\nQuestions that require the presenter's judgment",
      cadenceTrigger:
        "When a person supplies the notes, audience, purpose, and presentation length.",
      toolsIntegrations:
        "Read-only access to approved notes, documents, and brand guidance",
      approvalBoundaries:
        "Ask before changing the main message\nAsk before adding an unsupported claim\nDo not publish, present, or send the deck",
      firstRunTest:
        "Use two pages of sample notes to prepare a five-slide storyline with draft copy, speaker notes, and source references.",
      audienceSuccess:
        "The presenter receives a coherent story that fits the audience, purpose, and available time.",
      accessSensitive:
        "Use only approved notes and brand material. Treat unpublished strategy, client information, and internal data as private.",
      prohibitedUncertainty:
        "Do not invent facts, quotes, data, or visual assets. Mark gaps and ask when the intended message is unclear.",
      continuityMemory:
        "Keep the presenter's confirmed audience, core message, visual preferences, recurring examples, and approved slide structure in the continuing conversation.",
      reviewCriteria:
        "The presenter verifies every claim and source, checks the timing and flow, and approves the final slide content.",
    }),
  },
];

export function getWorkshopJobStarter(
  id: string,
): WorkshopJobStarter | undefined {
  return WORKSHOP_JOB_STARTERS.find((starter) => starter.id === id);
}

export function hasWorkshopDraftContent(draft: WorkshopDraft): boolean {
  return Object.values(draft).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}
