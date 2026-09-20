import { getReproducedBotEvidence } from "../data/bot-release-evidence";
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
    ? `This archive passed an isolated import and bundled-Skill presence check in Hermes Agent ${importEvidence.hermesVersion} on ${formatDate(importEvidence.testedDate)}.`
    : "New prepared profile: Hermes import testing is pending.";
  const roleStatus = getReproducedBotEvidence(pack.identity.slug)
    ? "Two published first-mission role runs passed their disclosed checks. Human technical review remains pending."
    : "Human technical and role-specific output tests remain pending.";

  return `${importStatus} ${roleStatus} The Grok Bot build brief remains untested.`;
}
