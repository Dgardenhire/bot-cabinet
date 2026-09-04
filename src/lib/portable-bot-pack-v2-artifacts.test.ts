import Ajv2020 from "ajv/dist/2020";
import { describe, expect, it } from "vitest";

import {
  createDeterministicTarGzip,
  createDeterministicZip,
} from "../../scripts/content/deterministic-archives";
import { STARTER_BOTS } from "../data/starter-bots";
import {
  compilePortableBotPackV2HermesFiles,
  compilePortableBotPackV2TextArtifacts,
  PORTABLE_BOT_PACK_V2_SCHEMA,
  portableBotPackV2ApiIndex,
  portableBotPackV2Catalog,
  portableBotPackV2ToGrokMarkdown,
  portableBotPackV2ToMarkdown,
} from "./portable-bot-pack-v2-artifacts";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";

describe("Portable Bot Pack V2 artifact compilers", () => {
  const packs = STARTER_BOTS.map(starterBotToPortablePackV2);

  it("publishes a strict Draft 2020-12 schema that accepts every V2 pack", () => {
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(
      PORTABLE_BOT_PACK_V2_SCHEMA,
    );

    for (const pack of packs) {
      expect(validate(pack), JSON.stringify(validate.errors)).toBe(true);
    }

    const overstatedGrok = structuredClone(packs[0]) as unknown as {
      platforms: { grokBot: { importable: boolean } };
    };
    overstatedGrok.platforms.grokBot.importable = true;
    expect(validate(overstatedGrok)).toBe(false);

    const laterV2 = structuredClone(packs[0]) as unknown as {
      packVersion: string;
      provenance: { publishedDate: string; source: string; sourceUrl: string; license: string };
    };
    laterV2.packVersion = "2.4.1";
    laterV2.provenance = {
      publishedDate: "2027-01-09",
      source: "A third-party catalog",
      sourceUrl: "https://example.com/bots/scout/",
      license: "Apache-2.0",
    };
    expect(validate(laterV2), JSON.stringify(validate.errors)).toBe(true);
  });

  it("compiles only versioned portable and Grok text paths", () => {
    const pack = packs.find((candidate) => candidate.identity.slug === "scout")!;
    const artifacts = compilePortableBotPackV2TextArtifacts(pack);

    expect(artifacts.map((artifact) => artifact.relativePath)).toEqual([
      "downloads/portable-bot-packs/v2/scout.json",
      "downloads/portable-bot-packs/v2/scout.md",
      "downloads/grok-bot-templates/v2/scout.md",
    ]);
    expect(JSON.parse(artifacts[0].content)).toEqual(pack);
    expect(artifacts.every((artifact) => artifact.relativePath.includes("/v2/"))).toBe(
      true,
    );
  });

  it("builds byte-identical archives regardless of object insertion order", () => {
    const forward = {
      "README.md": "Read this first.\n",
      "skills/example/SKILL.md": "---\nname: example\ndescription: Example\n---\n",
    };
    const reversed = {
      "skills/example/SKILL.md": forward["skills/example/SKILL.md"],
      "README.md": forward["README.md"],
    };

    expect(createDeterministicTarGzip("example", forward)).toEqual(
      createDeterministicTarGzip("example", reversed),
    );
    expect(createDeterministicZip(forward)).toEqual(
      createDeterministicZip(reversed),
    );
  });

  it("carries normalized controls into portable, Hermes, and Grok outputs", () => {
    for (const pack of packs) {
      const portable = portableBotPackV2ToMarkdown(pack);
      const grok = portableBotPackV2ToGrokMarkdown(pack);
      const hermes = compilePortableBotPackV2HermesFiles(pack);
      const hermesControlText = [
        hermes["SOUL.md"],
        hermes["BOT-PASSPORT.md"],
        hermes[`skills/${pack.identity.slug}-core/SKILL.md`],
      ].join("\n");

      for (const rule of [
        ...pack.controls.requiresApproval,
        ...pack.controls.operatingLimits,
        ...pack.controls.prohibited,
      ]) {
        expect(portable).toContain(rule);
        expect(grok).toContain(rule);
        expect(hermesControlText).toContain(rule);
      }
    }
  });

  it("compiles a reviewable Hermes profile without activating a Routine", () => {
    const pack = packs[0];
    const files = compilePortableBotPackV2HermesFiles(pack);
    const fileNames = Object.keys(files).sort();
    const skillPath = `skills/${pack.identity.slug}-core/SKILL.md`;

    expect(fileNames).toEqual(
      [
        "BOT-PASSPORT.md",
        "LICENSE",
        "README.md",
        "SOUL.md",
        "distribution.yaml",
        "profile.yaml",
        skillPath,
      ].sort(),
    );
    expect(files["distribution.yaml"]).toContain(`  - ${skillPath}`);
    expect(files[skillPath]).toMatch(
      /^---\nname: [a-z0-9-]+\ndescription: ".+"\n---\n/,
    );
    expect(files["README.md"]).toContain(
      "No schedule or active Routine is included",
    );
    expect(fileNames.some((name) => /cron|schedule|routine/i.test(name))).toBe(
      false,
    );
  });

  it("keeps Grok output manual, untested, and explicitly non-importable", () => {
    const pack = packs[0];
    const brief = portableBotPackV2ToGrokMarkdown(pack);

    expect(pack.platforms.grokBot.importable).toBe(false);
    expect(brief).toContain("not tested in Grok Bot");
    expect(brief).toContain("not an import package");
    expect(brief).toContain("no claim of direct Grok Bot import support");
    expect(brief).toContain("Do not activate this Routine");
    expect(brief).not.toMatch(/one-click|native package|automatically import/i);
  });

  it("builds a V2 API catalog and discovery index without V1 URLs", () => {
    const catalog = portableBotPackV2Catalog(packs);
    const index = portableBotPackV2ApiIndex(packs.length);

    expect(catalog.count).toBe(STARTER_BOTS.length);
    expect(catalog.portablePackSchemaUrl).toBe(
      "/api/v2/portable-bot-pack.schema.json",
    );
    expect(catalog.bots.map((bot) => bot.slug)).toEqual(
      STARTER_BOTS.map((bot) => bot.slug),
    );
    expect(
      catalog.bots.every(
        (bot) =>
          bot.portablePack.jsonUrl.includes("/v2/") &&
          bot.hermes.archiveUrl.includes("/v2/") &&
          bot.grokBot.briefUrl.includes("/v2/"),
      ),
    ).toBe(true);
    expect(index.grokImportSupport).toBe(false);
    expect(index.routineActivation).toBe("manual-test-required");
    expect(index.resources).not.toHaveProperty("portableBotPacks");
    expect(index.resources.portableBotPackPathPrefix).toBe(
      "/downloads/portable-bot-packs/v2/",
    );
  });
});
