import type { BotUseCase } from "./use-cases";

export type UseCaseOperations = {
  whenToUse: string;
  cadence: string;
  estimatedTime: string;
  leadBotSlug: string;
  access: string[];
  handoffs: string[];
  successCheckpoint: string;
  recovery: string;
};

export function cadenceFor(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("morning")) return "Each workday, after a person starts or approves the run";
  if (lower.includes("weekly") || lower.includes("newsletter")) return "Once each week, with a person approving the source material first";
  if (lower.includes("status")) return "On the reporting schedule you choose, after manual testing";
  if (lower.includes("customer")) return "When a new request arrives and a person assigns it";
  return "When a person supplies the approved brief and starts the workflow";
}

export function getUseCaseOperations(useCase: BotUseCase): UseCaseOperations {
  return {
    whenToUse: `Use this workflow when you need ${useCase.outcome.charAt(0).toLowerCase()}${useCase.outcome.slice(1)}`,
    cadence: cadenceFor(useCase.title),
    estimatedTime: useCase.steps.length > 3 ? "45–90 minutes for a first manual run" : "30–60 minutes for a first manual run",
    leadBotSlug: useCase.botSlugs[0],
    access: [
      "The approved inputs listed on this page",
      "Only the files, sources, and services required for this run",
      "No sending, publishing, spending, or live-system changes without approval",
    ],
    handoffs: useCase.steps.slice(1).map((step, index) =>
      `${useCase.steps[index].bot} hands the approved output—${useCase.steps[index].output.toLowerCase()}—to ${step.bot}.`,
    ),
    successCheckpoint: `The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. ${useCase.firstTest}`,
    recovery: "If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.",
  };
}
