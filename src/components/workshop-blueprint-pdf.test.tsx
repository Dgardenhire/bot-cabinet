import { renderToBuffer } from "@react-pdf/renderer";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { WorkshopBlueprintPdf } from "./workshop-blueprint-pdf";
import { buildBotBlueprint, type WorkshopDraft } from "../lib/workshop";

const completeDraft: WorkshopDraft = {
  botName: "Morning Briefing",
  jobOutcome:
    "Turn approved source material into a concise morning briefing with links and open questions.",
  inputsContext: "Approved news sources\nInternal notes\nYesterday's briefing",
  outputsDeliverables: "Five-item briefing\nSource list\nOpen questions",
  cadenceTrigger: "Weekdays after a person supplies the approved material.",
  toolsIntegrations: "Web research\nRead-only document access",
  approvalBoundaries: "Ask before contacting anyone\nAsk before publishing",
  firstRunTest:
    "Use three supplied articles and produce a draft briefing with linked sources.",
  audienceSuccess:
    "The owner reads it before the morning meeting. It should be accurate and easy to scan in five minutes.",
  accessSensitive:
    "Read-only access to the approved research folder. Client material stays outside the test.",
  prohibitedUncertainty:
    "Never publish or send messages. Identify missing information and ask what to do.",
  continuityMemory:
    "Remember the preferred format and previously rejected topics. Add a routine only after testing.",
  reviewCriteria:
    "The owner checks every source link and confirms that all requested sections are present.",
};

const hasPdfText = spawnSync("pdftotext", ["-v"], {
  stdio: "ignore",
}).status === 0;

function boundedAnswer(
  beginning: string,
  word: string,
  ending: string,
  maximum: number,
): string {
  let value = `${beginning} `;
  while (value.length + word.length + ending.length + 2 <= maximum) {
    value += `${word} `;
  }
  return `${value}${ending}`;
}

describe("WorkshopBlueprintPdf", () => {
  it("renders a complete, selectable PDF document", async () => {
    const buffer = await renderToBuffer(
      <WorkshopBlueprintPdf
        blueprint={buildBotBlueprint(completeDraft)}
        generatedAt="2026-08-25T12:00:00.000Z"
      />,
    );

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(buffer.byteLength).toBeGreaterThan(20_000);
  });

  it("wraps long answers without throwing", async () => {
    const longDraft: WorkshopDraft = {
      ...completeDraft,
      jobOutcome: "Long planning answer ".repeat(350),
      roleInstructions: "Return a structured draft for review. ".repeat(300),
    };

    const buffer = await renderToBuffer(
      <WorkshopBlueprintPdf
        blueprint={buildBotBlueprint(longDraft)}
        generatedAt="2026-08-25T12:00:00.000Z"
      />,
    );

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(buffer.byteLength).toBeGreaterThan(20_000);
  });

  it.skipIf(!hasPdfText)(
    "keeps the end of maximum-length tools and profile descriptions",
    async () => {
      const tools = boundedAnswer("TOOLSBEGIN", "toolword", "TOOLSEND", 3_000);
      const description = boundedAnswer(
        "DESCBEGIN",
        "descword",
        "DESCEND",
        6_000,
      );
      const boundaryDraft: WorkshopDraft = {
        ...completeDraft,
        toolsIntegrations: tools,
        profileDescription: description,
      };
      const buffer = await renderToBuffer(
        <WorkshopBlueprintPdf
          blueprint={buildBotBlueprint(boundaryDraft)}
          generatedAt="2026-08-25T12:00:00.000Z"
        />,
      );
      const temporaryDirectory = await mkdtemp(
        join(tmpdir(), "bot-cabinet-pdf-test-"),
      );
      const pdfPath = join(temporaryDirectory, "blueprint.pdf");
      const textPath = join(temporaryDirectory, "blueprint.txt");

      try {
        await writeFile(pdfPath, buffer);
        execFileSync("pdftotext", [pdfPath, textPath]);
        const extractedText = await readFile(textPath, "utf8");

        expect(extractedText).toContain("TOOLSBEGIN");
        expect(extractedText).toContain("TOOLSEND");
        expect(extractedText).toContain("DESCBEGIN");
        expect(extractedText).toContain("DESCEND");
        expect(extractedText.match(/toolword/g)).toHaveLength(
          tools.match(/toolword/g)?.length ?? 0,
        );
        expect(extractedText.match(/descword/g)).toHaveLength(
          description.match(/descword/g)?.length ?? 0,
        );
      } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
    },
  );
});
