import type { StarterBot } from "../data/starter-bots";

export function starterBotReviewCheckpoint(bot: StarterBot) {
  const deliverables = bot.produces
    .map((value) => value.trim().replace(/[.;]+$/, ""))
    .join("; ");

  return `Pause for a person to review these deliverables: ${deliverables}. Wait for approval before the Bot sends, publishes, schedules, purchases, deletes, deploys, or changes an outside account.`;
}

export function starterBotSkillSteps(bot: StarterBot) {
  return [
    `Confirm that the request fits this job: ${bot.workshopDraft.jobOutcome}`,
    "Gather the approved inputs and ask for anything required that is missing.",
    `Create the intended result: ${bot.produces.join("; ")}.`,
    "Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.",
    "Give the work to a person for review at the stated checkpoint.",
  ];
}
