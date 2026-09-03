import { readFile } from "node:fs/promises";
import path from "node:path";

import Ajv2020 from "ajv/dist/2020";
import { describe, expect, it } from "vitest";

import {
  BOT_FIT_INPUT_SCHEMA,
  BOT_FIT_OUTPUT_SCHEMA,
  BOT_FIT_PUBLIC_CONTRACT,
  buildBotFitAgentResult,
  parseBotFitAnswers,
} from "./bot-fit-contract";

describe("Bot Fit agent contract", () => {
  it("normalizes a concise request and returns an agent-readable plan", () => {
    const result = buildBotFitAgentResult({
      result: "Turn each approved interview into a briefing.",
      frequency: "repeat",
      needsContinuingContext: true,
      overlapsExistingRole: "no",
    });

    expect(result.schemaVersion).toBe(1);
    expect(result.recommendation.kind).toBe("bot");
    expect(result.recommendation.workshopDraft?.jobOutcome).toBe(
      "Turn each approved interview into a briefing.",
    );
    expect(result.artifact.fileName).toBe("bot-blueprint-start.md");
    expect(result.artifact.markdown).toContain("# Bot Blueprint starting point");
  });

  it("keeps parser validation aligned with the published input schema", () => {
    const validateInput = new Ajv2020({ allErrors: true, strict: true }).compile(
      BOT_FIT_INPUT_SCHEMA,
    );

    expect(validateInput({ result: "  " })).toBe(false);
    expect(() => parseBotFitAnswers({ result: "  " })).toThrow(
      "result is required",
    );

    const maxResult = "😀".repeat(2000);
    expect(validateInput({ result: maxResult })).toBe(true);
    expect(() => parseBotFitAnswers({ result: maxResult })).not.toThrow();

    const overlongResult = "😀".repeat(2001);
    expect(validateInput({ result: overlongResult })).toBe(false);
    expect(() => parseBotFitAnswers({ result: overlongResult })).toThrow(
      "result must be 2000 characters or fewer",
    );

    expect(() =>
      parseBotFitAnswers({ result: "Draft a brief.", frequency: "weekly" }),
    ).toThrow("frequency must be one of");
    expect(() =>
      parseBotFitAnswers({ result: "Draft a brief.", extraAccess: "all" }),
    ).toThrow("Unknown Bot Fit field");
    expect(() =>
      parseBotFitAnswers({
        result: "Draft a brief.",
        needsContinuingContext: "yes",
      }),
    ).toThrow("needsContinuingContext must be true or false");
  });

  it("publishes valid, fragment-free Draft 2020-12 schemas", () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });

    expect(() => ajv.compile(BOT_FIT_INPUT_SCHEMA)).not.toThrow();
    expect(() => ajv.compile(BOT_FIT_OUTPUT_SCHEMA)).not.toThrow();
    expect(new URL(BOT_FIT_INPUT_SCHEMA.$id).hash).toBe("");
    expect(new URL(BOT_FIT_OUTPUT_SCHEMA.$id).hash).toBe("");
    expect(BOT_FIT_PUBLIC_CONTRACT.resultKinds).toEqual([
      "assignment",
      "skill",
      "routine",
      "bot",
      "crew",
    ]);
    expect(BOT_FIT_INPUT_SCHEMA.additionalProperties).toBe(false);
    expect(BOT_FIT_INPUT_SCHEMA.required).toContain("result");
    expect(BOT_FIT_INPUT_SCHEMA.properties.result.pattern).toBe("\\S");
    expect(BOT_FIT_OUTPUT_SCHEMA.required).toEqual([
      "schemaVersion",
      "input",
      "recommendation",
      "artifact",
    ]);
    expect(BOT_FIT_OUTPUT_SCHEMA.properties.artifact.required).toEqual([
      "fileName",
      "markdown",
    ]);
  });

  it("validates normalized output for every recommendation kind", () => {
    const validateOutput = new Ajv2020({ allErrors: true, strict: true }).compile(
      BOT_FIT_OUTPUT_SCHEMA,
    );
    const cases = [
      ["assignment", { result: "Draft one briefing." }],
      ["skill", { result: "Draft each briefing.", frequency: "repeat" }],
      [
        "routine",
        {
          result: "Send a status briefing.",
          frequency: "scheduled",
          workProvenManually: true,
          trigger: "Every Monday at 9 a.m.",
          failurePlan: "Alert the owner.",
          costLimit: "$5 per run.",
          shutdown: "Disable the schedule.",
        },
      ],
      [
        "bot",
        {
          result: "Turn each approved interview into a briefing.",
          frequency: "repeat",
          needsContinuingContext: true,
          overlapsExistingRole: "no",
        },
      ],
      [
        "crew",
        {
          result: "Research, draft, and review a report.",
          needsMultipleSpecialists: true,
        },
      ],
    ] as const;

    for (const [kind, input] of cases) {
      const output = buildBotFitAgentResult(input);
      expect(output.recommendation.kind).toBe(kind);
      expect(validateOutput(output), JSON.stringify(validateOutput.errors)).toBe(
        true,
      );
    }
  });

  it("rejects incomplete normalized output and invalid recommendation variants", () => {
    const validateOutput = new Ajv2020({ allErrors: true, strict: true }).compile(
      BOT_FIT_OUTPUT_SCHEMA,
    );
    const output = buildBotFitAgentResult({ result: "Draft one briefing." });

    expect(validateOutput({ ...output, input: { result: output.input.result } })).toBe(
      false,
    );
    expect(
      validateOutput({
        ...output,
        recommendation: {
          ...output.recommendation,
          graduation: ["This belongs only on a Skill."],
        },
      }),
    ).toBe(false);
  });

  it("matches the generated public contract", async () => {
    const source = await readFile(
      path.join(process.cwd(), "public/api/v1/bot-fit-test.json"),
      "utf8",
    );
    expect(JSON.parse(source)).toEqual(BOT_FIT_PUBLIC_CONTRACT);
  });
});
