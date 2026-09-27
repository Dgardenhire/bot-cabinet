import type { PortableBotPackV2 } from "./portable-bot-pack-v2";

/** Builder text, not an import file or evidence of a successful ChatGPT run. */
export function workspaceAgentBuilderText(pack: PortableBotPackV2): string {
  return [
    `Create a private Workspace Agent named ${pack.identity.name}.`,
    "",
    `Its job: ${pack.job.outcome}`,
    "",
    "Standing instructions:",
    pack.instructions.durableRoleAndBoundaries,
    "",
    "Ask for these inputs when they are missing:",
    ...pack.job.inputs.map((input) => `- ${input}`),
    "",
    "Return:",
    ...pack.job.outputs.map((output) => `- ${output}`),
    "",
    "Approval rules:",
    ...pack.controls.requiresApproval.map((rule) => `- ${rule}`),
    ...pack.controls.prohibited.map((rule) => `- ${rule}`),
    "",
    "Start without connected apps, shared files, a schedule, or write actions. Ask before using outside services or changing access. Do not share or schedule this agent until I review a private test result.",
  ].join("\n");
}

export function workspaceAgentFirstTest(pack: PortableBotPackV2): string {
  if (pack.identity.slug === "chief-of-staff") {
    return "Use only these fictional updates. Project A: Maya owns the draft due Friday; the team has not approved the release date. Project B: Luis owns the budget review; the cost estimate is missing. Our confirmed priority is to finish Project A's draft before starting new work. Make a one-page priority brief and decision log. Separate confirmed facts from missing decisions. Do not assign work, promise a date, or contact anyone.";
  }
  return `Run a private test with sample, non-sensitive information. The intended first assignment is: ${pack.job.firstMission} Ask me for missing inputs. Show the result for review; do not take outside actions.`;
}
