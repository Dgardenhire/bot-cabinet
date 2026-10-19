// How each starter Bot's control rules read in its portable pack, SOUL.md, Bot Passport, the catalog
// and Cabinet. The source rules (workshopDraft.approvalBoundaries, boundaries, prohibitedUncertainty)
// stay written as instructions; the pack lists them under "Requires approval" and "Prohibited actions".
//
// OFF_LIMITS_COPY: every rule the pack classifies as prohibited, rewritten as a plain statement of what
// the Bot never does, so the list reads correctly under "Prohibited actions" and Cabinet's "Off limits".
// APPROVAL_COPY: approval rules that read as orders or repeat another line. null drops a line whose
// meaning is already covered by the Bot's other approval lines.
// A test checks that every prohibited rule of every starter Bot has an entry here.

export const OFF_LIMITS_COPY: Readonly<Record<string, string | null>> = {
  // Shared fallback for Bots with no specific prohibition.
  "Never bypass an approval gate, access control, or shutdown instruction.":
    "Bypassing an approval gate, access control, or shutdown instruction",

  // Unstick Me
  "Ask one short question at a time. Never answer with a long plan or a list of steps.":
    "Answering with a long plan or a list of steps instead of one short question at a time",
  "Never replace the conversation with a long plan": null,
  "Do not diagnose or give medical advice": "Diagnosing anything or giving medical advice",
  "Do not shame or pressure the person": "Shaming or pressuring the person",
  "Do not invent deadlines or consequences": "Inventing deadlines or consequences",

  // Scout
  "Do not publish": "Publishing",
  // Researcher
  "Do not make high-stakes decisions": "Making high-stakes decisions",
  "Do not contact sources or publish": "Contacting sources or publishing",
  // Writer, Editor, Story
  "Do not invent facts": "Inventing facts",
  "Do not publish or send": "Publishing or sending",
  "Do not change quoted language": "Changing quoted language",
  // Client
  "Do not send files or messages": "Sending files or messages",
  // Coder
  "Do not change files outside the approved project": "Changing files outside the approved project",
  // Professor
  "Do not claim formal certification or professional authority": "Claiming formal certification or professional authority",
  // Architect
  "Do not deploy or change production systems": "Deploying or changing production systems",
  "The Bot uses read-only access until a specific implementation task is approved and does not deploy or change production systems.":
    "Using more than read-only access before a specific implementation task is approved",
  // Chief of Staff
  "Do not assign people or commit dates or budgets": "Assigning people or committing dates or budgets",
  // Coach
  "Do not contact anyone or change a schedule": "Contacting anyone or changing a schedule",
  // Nova
  "Do not present forecasts or interest as proof of demand":
    "Presenting forecasts, interest, traffic, or generated analysis as proof of demand",
  "The Bot treats forecasts as hypotheses and never presents interest, traffic, or generated analysis as proof of demand.": null,
  // Pulse
  "Do not collect new personal data or publish claims": "Collecting new personal data or publishing claims",
  "The Bot does not change campaigns or tracking, collect new personal data, or treat a small sample as a reliable result.":
    "Changing campaigns or tracking, or treating a small sample as a reliable result",
  // Story
  "Do not invent facts, quotations, results, or motives": "Inventing facts, quotations, events, results, or motives",
  "The Bot does not invent quotations, events, results, or motives and does not publish or send material.": null,
  // Daily Newspaper
  "Use only material the user supplies or explicitly connects. Do not search private accounts or widen access on your own.":
    "Using material beyond what is supplied or explicitly connected, searching private accounts, or widening its own access",
  "Do not invent missing context, urgency, quotations, links, or conclusions":
    "Inventing missing context, urgency, quotations, links, or conclusions",
  "Do not place uncertain or conflicting details in the newspaper": "Placing uncertain or conflicting details in the newspaper",
  "Do not expose private source material beyond the approved edition": "Exposing private source material beyond the approved edition",
  // Curator
  "Low usage alone is not grounds for retirement. Do not treat unavailable records as proof that a Bot failed.":
    "Treating low usage alone as grounds for retirement, or unavailable records as proof that a Bot failed",
  "Never claim a revision improved performance without comparing actual results.":
    "Claiming a revision improved performance without comparing actual results",
  // Reentry
  "Do not call the newest file the approved version without evidence. Surface conflicting records.":
    "Calling the newest file the approved version without evidence, or hiding conflicting records",
  "Do not overwrite files, resume deployments, or convert old ideas into commitments.":
    "Overwriting files, resuming deployments, or turning old ideas into commitments",
  // Receipt
  "Do not invent eligibility, policies, deadlines, purchases, or company promises.":
    "Inventing eligibility, policies, deadlines, purchases, or company promises",
};

export const APPROVAL_COPY: Readonly<Record<string, string | null>> = {
  // Planner
  "Do not assign people or commit dates without approval": "Ask before assigning people or committing dates",
  "Do not change an external task system without approval": "Ask before changing an external task system",
  // Founding Engineer
  "Do not connect outside services or release the work without approval":
    "Ask before connecting outside services or releasing the work",
  // Chief of Staff: covered by "Ask before contacting anyone" and "Ask before changing a calendar, task, or shared record".
  "The Bot drafts agendas and follow-ups but does not contact people or change shared records without approval.": null,
  // Coach
  "The Bot is not a therapist, doctor, lawyer, or financial adviser and does not contact anyone or change a schedule without approval.":
    "It is not a therapist, doctor, lawyer, or financial adviser, and it asks before contacting anyone or changing a schedule",
  // Daily Newspaper: the three lines above it already cover each of these actions.
  "Ask before connecting an account, creating a schedule, sending, publishing, saving outside the approved folder, or printing.": null,
};
