import { describe, expect, it } from "vitest";
import { measureEditorialDraft } from "./editorial-length";
import { EDITORIAL_SOURCE_CHECKS, WRITER_HANDOFF_CONTRACT } from "./editorial-source-checks";
import { STARTER_BOTS } from "../data/starter-bots";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";

describe("editorial handoff checks", () => {
  it("preserves report-scoped absence instead of inventing a universal negative", () => {
    const rule = EDITORIAL_SOURCE_CHECKS.find(item => item.includes("The report identifies no sponsor"));
    expect(rule).toContain("does not establish that no sponsor exists");
    expect(rule).toContain("not reported");
    expect(rule).toContain("universal negative");
  });
  it("does not turn missing URLs or contacts into invented reader directions", () => {
    const rule = EDITORIAL_SOURCE_CHECKS.find(item => item.includes("source omits a URL"));
    expect(rule).toContain("Do not invent a placeholder");
    expect(rule).toContain("unspecified website or contact");
    expect(rule).toContain("missing information can be found");
  });

  it.each([0, 191, 249, 250, 350, 351])("measures %i body words without trusting a model count", count => {
    const result = measureEditorialDraft({ newsletter: Array(count).fill("word").join(" "), social: "Draft" });
    expect(result.newsletterWords).toBe(count);
    expect(result.newsletterWithinRange).toBe(count >= 250 && count <= 350);
    expect(result.newsletterMechanicallyAccepted).toBe(count >= 250 && count <= 350);
    expect(result.factualAccuracyVerified).toBe(false);
    expect(result.humanApproved).toBe(false);
  });
  it("accepts a nonempty under-length draft only as an unverified declared source shortfall", () => {
    const result = measureEditorialDraft({
      newsletter: Array(191).fill("word").join(" "),
      social: "Draft",
      lengthException: {
        reason: "source-shortfall",
        explanation: "The approved packet does not support enough distinct claims to reach 250 words without padding.",
      },
    });
    expect(result.newsletterWithinRange).toBe(false);
    expect(result.newsletterLengthDisposition).toBe("declared-source-shortfall");
    expect(result.newsletterMechanicallyAccepted).toBe(true);
    expect(result.sourceShortfallVerified).toBe(false);
    expect(measureEditorialDraft({
      newsletter: "",
      social: "Draft",
      lengthException: { reason: "source-shortfall", explanation: "No publishable claims." },
    }).newsletterMechanicallyAccepted).toBe(false);
  });
  it("requires no shortfall exception when the draft is within range", () => {
    const newsletter = Array(250).fill("word").join(" ");
    expect(measureEditorialDraft({ newsletter, social: "Draft", lengthException: null }).newsletterMechanicallyAccepted).toBe(true);
    const contradictory = measureEditorialDraft({
      newsletter,
      social: "Draft",
      lengthException: { reason: "source-shortfall", explanation: "Contradicts the measured range." },
    });
    expect(contradictory.newsletterWithinRange).toBe(true);
    expect(contradictory.lengthExceptionConsistent).toBe(false);
    expect(contradictory.newsletterMechanicallyAccepted).toBe(false);
  });
  it("handles Unicode, whitespace and standalone punctuation with an explicit counting rule", () => {
    expect(measureEditorialDraft({ newsletter: "  Café\n repair-club — 24\tneighbors. ", social: "🤖" }).newsletterWords).toBe(4);
    const result = measureEditorialDraft({ newsletter: "", social: "🤖".repeat(280) });
    expect(result.socialCodePoints).toBe(280);
    expect(result.socialWithinCodePointLimit).toBe(true);
    expect(result.xWeightedLengthVerified).toBe(false);
    expect(measureEditorialDraft({ newsletter: "", social: "a".repeat(281) }).socialWithinCodePointLimit).toBe(false);
    expect(measureEditorialDraft({ newsletter: "", social: "" }).socialWithinCodePointLimit).toBe(false);
  });
  it.each(["writer", "editor"])("exports source checks in both %s identity and skill", slug => {
    const bot = STARTER_BOTS.find(bot => bot.slug === slug)!;
    const pack = starterBotToPortablePackV2(bot);
    expect(pack.packVersion).toBe(slug === "writer" ? "2.0.5" : "2.0.3");
    expect(pack.platforms.hermes.importStatus).toBe("import-test-passed");
    expect(pack.platforms.hermes.importEvidence).toEqual({
      hermesVersion: "0.21.3",
      testedDate: "2026-09-20",
      scope: "archive-import-and-bundled-skill-presence",
    });
    for (const rule of EDITORIAL_SOURCE_CHECKS) {
      expect(pack.instructions.durableRoleAndBoundaries).toContain(rule);
      expect(pack.skills[0].steps).toContain(rule);
    }
    if (slug === "writer") {
      expect(pack.instructions.durableRoleAndBoundaries).toContain(WRITER_HANDOFF_CONTRACT);
      expect(pack.skills[0].steps).toContain(WRITER_HANDOFF_CONTRACT);
      expect(WRITER_HANDOFF_CONTRACT).toContain("Do not produce sentence-level sourceChecks");
      expect(WRITER_HANDOFF_CONTRACT).toContain("independent Editor performs the exhaustive source audit");
    }
  });
});
