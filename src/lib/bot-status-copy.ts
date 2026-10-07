import { getBotRuntimeEvidence, getReproducedBotEvidence } from "../data/bot-release-evidence";
import type { PortableBotPackV2 } from "./portable-bot-pack-v2";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function botImportAndRunStatus(pack: PortableBotPackV2) {
  const importEvidence = pack.platforms.hermes.importEvidence;
  const importStatus = importEvidence
    ? `This archive imported successfully and its Skill was present in an isolated Hermes Agent ${importEvidence.hermesVersion} installation on ${formatDate(importEvidence.testedDate)}.`
    : "This profile has not yet been tested for Hermes import.";
  const runtimeEvidence = getBotRuntimeEvidence(pack.identity.slug);
  const roleStatus = runtimeEvidence
    ? `${runtimeEvidence.summary} This record covers one run, not general reliability. Review and approve any schedule separately.`
    : getReproducedBotEvidence(pack.identity.slug)
    ? "Two published first-task runs passed the listed checks. A person has not yet completed the technical review."
    : "Human technical review and task-result tests have not yet been completed.";

  return `${importStatus} ${roleStatus} The Grok Bot build brief remains untested.`;
}
