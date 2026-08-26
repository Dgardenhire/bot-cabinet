import { mkdir } from "node:fs/promises";
import path from "node:path";

import { renderToFile } from "@react-pdf/renderer";

import { WorkshopBlueprintPdf } from "../src/components/workshop-blueprint-pdf";
import { buildBotBlueprint, type WorkshopDraft } from "../src/lib/workshop";

const sampleDraft: WorkshopDraft = {
  botName: "Morning Briefing",
  jobOutcome:
    "Turn approved source material into a concise morning briefing with linked sources, implications, and open questions.",
  inputsContext:
    "Approved industry news sources\nInternal research notes\nYesterday's briefing\nCompany style guide",
  outputsDeliverables:
    "Five-item executive briefing\nLinked source list\nImplications for current work\nOpen questions",
  cadenceTrigger:
    "Weekdays after a person supplies or approves the source material for that morning.",
  toolsIntegrations:
    "Web research\nRead-only access to the approved research folder",
  approvalBoundaries:
    "Ask before contacting anyone\nAsk before publishing or sending the briefing\nAsk before changing a source file",
  firstRunTest:
    "Use three supplied articles to produce a draft briefing with linked sources. Make no outside changes.",
  audienceSuccess:
    "The owner reads it before the morning meeting. The briefing should be accurate, concise, and easy to scan in five minutes.",
  accessSensitive:
    "Use read-only access to the approved research folder. Client names, financial figures, and account credentials are sensitive and stay outside the first test.",
  prohibitedUncertainty:
    "Never publish, send messages, edit source files, or guess at an unsupported fact. Identify missing information and ask what to do.",
  continuityMemory:
    "Remember the preferred briefing structure and previously rejected topics. Add a weekday routine only after the first test passes. The Editor Bot may review the draft later.",
  reviewCriteria:
    "The owner checks every source link, confirms all requested sections are present, and verifies that the Bot stopped at each approval point.",
};

async function main() {
  const projectRoot = process.cwd();
  const outputDirectory = path.join(projectRoot, "output", "pdf");
  const outputPath = path.join(
    outputDirectory,
    "morning-briefing-bot-blueprint-sample.pdf",
  );

  await mkdir(outputDirectory, { recursive: true });
  await renderToFile(
    <WorkshopBlueprintPdf
      blueprint={buildBotBlueprint(sampleDraft)}
      generatedAt="2026-08-25T12:00:00.000Z"
      coverImageSrc={path.join(
        projectRoot,
        "public",
        "atelier",
        "bot-blueprint-cover-v1.png",
      )}
      wordmarkImageSrc={path.join(
        projectRoot,
        "public",
        "brand",
        "bot-cabinet-wordmark-dark-v1.png",
      )}
    />,
    outputPath,
  );

  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
