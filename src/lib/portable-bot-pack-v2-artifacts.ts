import {
  parsePortableBotPackV2,
  portableBotPackV2ArtifactPaths,
  PORTABLE_BOT_PACK_V2_PACK_VERSION,
  PORTABLE_BOT_PACK_V2_SCHEMA_VERSION,
  type PortableBotPackV2,
} from "./portable-bot-pack-v2";
import { BOT_CABINET_ORIGIN } from "./site-constants";

const PUBLIC_ORIGIN = BOT_CABINET_ORIGIN;

const MIT_LICENSE = `MIT License

Copyright (c) 2026 Damon Gardenhire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const NON_EMPTY_STRING_SCHEMA = {
  type: "string",
  minLength: 1,
  pattern: "\\S",
} as const;

const TEXT_LIST_SCHEMA = {
  type: "array",
  minItems: 1,
  uniqueItems: true,
  items: NON_EMPTY_STRING_SCHEMA,
} as const;

const OPTIONAL_TEXT_LIST_SCHEMA = {
  type: "array",
  uniqueItems: true,
  items: NON_EMPTY_STRING_SCHEMA,
} as const;

export const PORTABLE_BOT_PACK_V2_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${PUBLIC_ORIGIN}/api/v2/portable-bot-pack.schema.json`,
  title: "Bot Cabinet Portable Bot Pack V2",
  description:
    "A strict, platform-neutral Bot recipe with explicit controls, prepared Skills, and inactive Routine plans.",
  type: "object",
  additionalProperties: false,
  required: [
    "schemaVersion",
    "packVersion",
    "artifactId",
    "preparationStatus",
    "identity",
    "job",
    "instructions",
    "controls",
    "skills",
    "routines",
    "platforms",
    "provenance",
  ],
  properties: {
    schemaVersion: { const: PORTABLE_BOT_PACK_V2_SCHEMA_VERSION },
    packVersion: {
      type: "string",
      pattern: "^2\\.[0-9]+\\.[0-9]+$",
    },
    artifactId: NON_EMPTY_STRING_SCHEMA,
    preparationStatus: { const: "prepared" },
    identity: {
      type: "object",
      additionalProperties: false,
      required: [
        "artifactId",
        "slug",
        "name",
        "title",
        "category",
        "summary",
        "audience",
        "portrait",
      ],
      properties: {
        artifactId: NON_EMPTY_STRING_SCHEMA,
        slug: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        },
        name: NON_EMPTY_STRING_SCHEMA,
        title: NON_EMPTY_STRING_SCHEMA,
        category: {
          enum: ["writing", "research", "planning", "technical", "learning"],
        },
        summary: NON_EMPTY_STRING_SCHEMA,
        audience: NON_EMPTY_STRING_SCHEMA,
        portrait: {
          type: "object",
          additionalProperties: false,
          required: ["artifactId", "url"],
          properties: {
            artifactId: NON_EMPTY_STRING_SCHEMA,
            url: NON_EMPTY_STRING_SCHEMA,
          },
        },
      },
    },
    job: {
      type: "object",
      additionalProperties: false,
      required: [
        "outcome",
        "exampleRequests",
        "inputs",
        "outputs",
        "cadence",
        "firstMission",
        "checkpoint",
      ],
      properties: {
        outcome: NON_EMPTY_STRING_SCHEMA,
        exampleRequests: TEXT_LIST_SCHEMA,
        inputs: TEXT_LIST_SCHEMA,
        outputs: TEXT_LIST_SCHEMA,
        cadence: NON_EMPTY_STRING_SCHEMA,
        firstMission: NON_EMPTY_STRING_SCHEMA,
        checkpoint: NON_EMPTY_STRING_SCHEMA,
      },
    },
    instructions: {
      type: "object",
      additionalProperties: false,
      required: ["durableRoleAndBoundaries"],
      properties: {
        durableRoleAndBoundaries: NON_EMPTY_STRING_SCHEMA,
      },
    },
    controls: {
      type: "object",
      additionalProperties: false,
      required: [
        "riskLevel",
        "requestedCapabilities",
        "allowedWithoutApproval",
        "requiresApproval",
        "operatingLimits",
        "prohibited",
        "shutdown",
      ],
      properties: {
        riskLevel: { enum: ["Low", "Moderate", "Elevated"] },
        requestedCapabilities: TEXT_LIST_SCHEMA,
        allowedWithoutApproval: TEXT_LIST_SCHEMA,
        requiresApproval: TEXT_LIST_SCHEMA,
        operatingLimits: OPTIONAL_TEXT_LIST_SCHEMA,
        prohibited: TEXT_LIST_SCHEMA,
        shutdown: NON_EMPTY_STRING_SCHEMA,
      },
    },
    skills: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "artifactId",
          "name",
          "preparationStatus",
          "testStatus",
          "whenToUse",
          "inputs",
          "steps",
          "outputs",
          "requiresApproval",
          "prohibited",
        ],
        properties: {
          artifactId: NON_EMPTY_STRING_SCHEMA,
          name: NON_EMPTY_STRING_SCHEMA,
          preparationStatus: { const: "prepared" },
          testStatus: { const: "not-tested" },
          whenToUse: NON_EMPTY_STRING_SCHEMA,
          inputs: TEXT_LIST_SCHEMA,
          steps: TEXT_LIST_SCHEMA,
          outputs: TEXT_LIST_SCHEMA,
          requiresApproval: TEXT_LIST_SCHEMA,
          prohibited: TEXT_LIST_SCHEMA,
        },
      },
    },
    routines: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "artifactId",
          "name",
          "preparationStatus",
          "testStatus",
          "activationStatus",
          "owner",
          "trigger",
          "expectedResults",
          "requiresApproval",
          "missingInputBehavior",
          "failureHandling",
        ],
        properties: {
          artifactId: NON_EMPTY_STRING_SCHEMA,
          name: NON_EMPTY_STRING_SCHEMA,
          preparationStatus: { const: "prepared" },
          testStatus: { const: "not-tested" },
          activationStatus: { const: "manual-test-required" },
          owner: NON_EMPTY_STRING_SCHEMA,
          trigger: NON_EMPTY_STRING_SCHEMA,
          expectedResults: TEXT_LIST_SCHEMA,
          requiresApproval: TEXT_LIST_SCHEMA,
          missingInputBehavior: NON_EMPTY_STRING_SCHEMA,
          failureHandling: NON_EMPTY_STRING_SCHEMA,
        },
      },
    },
    platforms: {
      type: "object",
      additionalProperties: false,
      required: ["hermes", "grokBot"],
      properties: {
        hermes: {
          type: "object",
          additionalProperties: false,
          required: [
            "platformId",
            "artifactId",
            "artifactKind",
            "mediaType",
            "importable",
            "minimumVersion",
            "archiveUrl",
            "readableFilesUrl",
            "packageStatus",
            "importStatus",
            "importEvidence",
          ],
          properties: {
            platformId: { const: "hermes-agent" },
            artifactId: NON_EMPTY_STRING_SCHEMA,
            artifactKind: { const: "profile-archive" },
            mediaType: { const: "application/gzip" },
            importable: { const: true },
            minimumVersion: { const: ">=0.21.0" },
            archiveUrl: {
              type: "string",
              pattern:
                "^/downloads/starter-bots/v2/[a-z0-9]+(?:-[a-z0-9]+)*\\.tar\\.gz$",
            },
            readableFilesUrl: {
              type: "string",
              pattern:
                "^/downloads/starter-bots/v2/[a-z0-9]+(?:-[a-z0-9]+)*\\.zip$",
            },
            packageStatus: { const: "files-and-archive-checked" },
            importStatus: { const: "import-test-passed" },
            importEvidence: {
              type: "object",
              additionalProperties: false,
              required: ["hermesVersion", "testedDate", "scope"],
              properties: {
                hermesVersion: NON_EMPTY_STRING_SCHEMA,
                testedDate: {
                  type: "string",
                  pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
                },
                scope: {
                  const: "archive-import-and-bundled-skill-presence",
                },
              },
            },
          },
        },
        grokBot: {
          type: "object",
          additionalProperties: false,
          required: [
            "platformId",
            "artifactId",
            "artifactKind",
            "mediaType",
            "importable",
            "briefUrl",
            "preparationStatus",
            "testStatus",
          ],
          properties: {
            platformId: { const: "grok-bot" },
            artifactId: NON_EMPTY_STRING_SCHEMA,
            artifactKind: { const: "manual-build-brief" },
            mediaType: { const: "text/markdown" },
            importable: { const: false },
            briefUrl: {
              type: "string",
              pattern:
                "^/downloads/grok-bot-templates/v2/[a-z0-9]+(?:-[a-z0-9]+)*\\.md$",
            },
            preparationStatus: { const: "prepared" },
            testStatus: { const: "adaptation-prepared-not-tested" },
          },
        },
      },
    },
    provenance: {
      type: "object",
      additionalProperties: false,
      required: ["source", "sourceUrl", "publishedDate", "license"],
      properties: {
        source: NON_EMPTY_STRING_SCHEMA,
        sourceUrl: {
          type: "string",
          pattern: "^https://",
        },
        publishedDate: {
          type: "string",
          pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
        },
        license: NON_EMPTY_STRING_SCHEMA,
      },
    },
  },
} as const;

export type PortableBotPackV2TextArtifact = {
  relativePath: string;
  mediaType: "application/json" | "text/markdown";
  content: string;
};

function markdownList(values: readonly string[]) {
  return values.length
    ? values.map((value) => `- ${value}`).join("\n")
    : "_None specified._";
}

function orderedMarkdownList(values: readonly string[]) {
  return values.map((value, index) => `${index + 1}. ${value}`).join("\n");
}

function inlineMarkdownList(values: readonly string[]) {
  return values.length
    ? values.map((value) => value.trim().replace(/[.;]+$/, "")).join("; ")
    : "None specified";
}

function yamlString(value: string) {
  return JSON.stringify(value);
}

function portableRecipeMarkdown(pack: PortableBotPackV2) {
  const skill = pack.skills[0];
  const routine = pack.routines[0];

  return [
    "## Job",
    "",
    pack.job.outcome,
    "",
    "## Durable role and boundaries",
    "",
    pack.instructions.durableRoleAndBoundaries,
    "",
    "## Inputs",
    "",
    markdownList(pack.job.inputs),
    "",
    "## Expected outputs",
    "",
    markdownList(pack.job.outputs),
    "",
    "## Requested capabilities",
    "",
    markdownList(pack.controls.requestedCapabilities),
    "",
    "## Approval gates",
    "",
    markdownList(pack.controls.requiresApproval),
    "",
    "## Operating limits",
    "",
    markdownList(pack.controls.operatingLimits),
    "",
    "## Prohibited actions",
    "",
    markdownList(pack.controls.prohibited),
    "",
    "## First mission",
    "",
    pack.job.firstMission,
    "",
    "## Human checkpoint",
    "",
    pack.job.checkpoint,
    "",
    "## Prepared Skill",
    "",
    `- **Artifact ID:** ${skill.artifactId}`,
    `- **Preparation status:** ${skill.preparationStatus}`,
    `- **Test status:** ${skill.testStatus}`,
    `- **Use it when:** ${skill.whenToUse}`,
    "",
    "### Skill steps",
    "",
    orderedMarkdownList(skill.steps),
    "",
    "## Routine plan",
    "",
    "This is an inactive plan. Run the job successfully by hand before activating any schedule or trigger.",
    "",
    `- **Artifact ID:** ${routine.artifactId}`,
    `- **Owner:** ${routine.owner}`,
    `- **Trigger:** ${routine.trigger}`,
    `- **Preparation status:** ${routine.preparationStatus}`,
    `- **Test status:** ${routine.testStatus}`,
    `- **Activation status:** ${routine.activationStatus}`,
    `- **Missing input:** ${routine.missingInputBehavior}`,
    `- **Failure:** ${routine.failureHandling}`,
    "",
  ];
}

export function portableBotPackV2ToJson(pack: PortableBotPackV2) {
  parsePortableBotPackV2(pack);
  return `${JSON.stringify(pack, null, 2)}\n`;
}

export function portableBotPackV2ToMarkdown(pack: PortableBotPackV2) {
  parsePortableBotPackV2(pack);

  return [
    `# ${pack.identity.name} — Portable Bot Pack V2`,
    "",
    pack.identity.summary,
    "",
    `- **Artifact ID:** ${pack.artifactId}`,
    `- **Pack version:** ${pack.packVersion}`,
    `- **Preparation status:** ${pack.preparationStatus}`,
    `- **Audience:** ${pack.identity.audience}`,
    `- **Source:** ${pack.provenance.sourceUrl}`,
    "",
    ...portableRecipeMarkdown(pack),
    "## Bot Passport",
    "",
    `- **Planned risk:** ${pack.controls.riskLevel}`,
    `- **May work without approval:** ${inlineMarkdownList(pack.controls.allowedWithoutApproval)}`,
    `- **Must ask first:** ${inlineMarkdownList(pack.controls.requiresApproval)}`,
    `- **Operating limits:** ${inlineMarkdownList(pack.controls.operatingLimits)}`,
    `- **Prohibited:** ${inlineMarkdownList(pack.controls.prohibited)}`,
    `- **Stop and remove access:** ${pack.controls.shutdown}`,
    "",
    "## Hermes profile archive",
    "",
    `- **Artifact ID:** ${pack.platforms.hermes.artifactId}`,
    `- **Minimum version:** ${pack.platforms.hermes.minimumVersion}`,
    `- **Archive:** ${PUBLIC_ORIGIN}${pack.platforms.hermes.archiveUrl}`,
    `- **Readable files:** ${PUBLIC_ORIGIN}${pack.platforms.hermes.readableFilesUrl}`,
    `- **Package status:** ${pack.platforms.hermes.packageStatus}`,
    `- **Import status:** Passed with Hermes Agent ${pack.platforms.hermes.importEvidence.hermesVersion} on ${pack.platforms.hermes.importEvidence.testedDate}`,
    "- **Import test scope:** Archive import and bundled Skill presence only; output quality and live-service behavior still require human testing.",
    "",
    "## Grok Bot manual build brief",
    "",
    `- **Artifact ID:** ${pack.platforms.grokBot.artifactId}`,
    "- **Artifact type:** Manual construction brief, not an import package",
    `- **Preparation status:** ${pack.platforms.grokBot.preparationStatus}`,
    `- **Test status:** ${pack.platforms.grokBot.testStatus}`,
    `- **Brief:** ${PUBLIC_ORIGIN}${pack.platforms.grokBot.briefUrl}`,
    "",
    "## Status and provenance",
    "",
    `- **Published:** ${pack.provenance.publishedDate}`,
    `- **Source:** ${pack.provenance.source}`,
    `- **License:** ${pack.provenance.license}`,
    "",
  ].join("\n");
}

export function portableBotPackV2ToGrokMarkdown(pack: PortableBotPackV2) {
  parsePortableBotPackV2(pack);
  const skill = pack.skills[0];
  const routine = pack.routines[0];
  const paths = portableBotPackV2ArtifactPaths(pack.identity.slug);

  return [
    `# ${pack.identity.name} — Manual build brief for Grok Bot`,
    "",
    pack.identity.summary,
    "",
    "**Status: Prepared adaptation; not tested in Grok Bot.**",
    "",
    "This is a manual construction brief. It is not an import package and makes no claim of direct Grok Bot import support.",
    "",
    "## Profile fields to enter",
    "",
    `- **Name:** ${pack.identity.name}`,
    `- **Title:** ${pack.identity.title}`,
    `- **Job:** ${pack.job.outcome}`,
    "",
    "## Instructions to review and enter",
    "",
    pack.instructions.durableRoleAndBoundaries,
    "",
    "## Prepared Skill recipe",
    "",
    `- **Name:** ${skill.name}`,
    `- **Use it when:** ${skill.whenToUse}`,
    `- **Preparation status:** ${skill.preparationStatus}`,
    `- **Test status:** ${skill.testStatus}`,
    "",
    "### Inputs",
    "",
    markdownList(skill.inputs),
    "",
    "### Steps",
    "",
    orderedMarkdownList(skill.steps),
    "",
    "### Expected outputs",
    "",
    markdownList(skill.outputs),
    "",
    "## Inactive Routine plan",
    "",
    `- **Name:** ${routine.name}`,
    `- **Proposed trigger:** ${routine.trigger}`,
    `- **Activation status:** ${routine.activationStatus}`,
    `- **Test status:** ${routine.testStatus}`,
    `- **Missing input:** ${routine.missingInputBehavior}`,
    `- **Failure:** ${routine.failureHandling}`,
    "",
    "Do not activate this Routine until the first mission works by hand and a person approves the trigger, access, and expected result.",
    "",
    "## Controls to preserve",
    "",
    `- **Planned risk:** ${pack.controls.riskLevel}`,
    "",
    "### Requested capabilities",
    "",
    markdownList(pack.controls.requestedCapabilities),
    "",
    "### Requires approval",
    "",
    markdownList(pack.controls.requiresApproval),
    "",
    "### Operating limits",
    "",
    markdownList(pack.controls.operatingLimits),
    "",
    "### Prohibited",
    "",
    markdownList(pack.controls.prohibited),
    "",
    "## Manual test",
    "",
    "1. Build the profile from the reviewed fields above without adding access or authority.",
    `2. Run this first mission with sample material: ${pack.job.firstMission}`,
    "3. Inspect the result at the human checkpoint.",
    "4. Review every connected service and approval gate before using real material.",
    "5. Keep the Routine inactive unless the manual result is dependable and a person explicitly approves activation.",
    "",
    `Complete V2 pack: ${PUBLIC_ORIGIN}${paths.portableMarkdownUrl}`,
    `Bot Cabinet record: ${pack.provenance.sourceUrl}`,
    "",
  ].join("\n");
}

export function compilePortableBotPackV2HermesFiles(
  pack: PortableBotPackV2,
): Record<string, string> {
  parsePortableBotPackV2(pack);
  const skill = pack.skills[0];
  const routine = pack.routines[0];
  const paths = portableBotPackV2ArtifactPaths(pack.identity.slug);
  const skillSlug = `${pack.identity.slug}-core`;
  const skillPath = `skills/${skillSlug}/SKILL.md`;
  const ownedFiles = [
    "profile.yaml",
    "SOUL.md",
    "README.md",
    "BOT-PASSPORT.md",
    "LICENSE",
    skillPath,
  ];
  const manifest = [
    `name: ${pack.identity.slug}`,
    `version: ${yamlString(pack.packVersion)}`,
    `description: ${yamlString(pack.identity.summary)}`,
    `hermes_requires: ${yamlString(pack.platforms.hermes.minimumVersion)}`,
    'author: "Bot Cabinet"',
    'license: "MIT"',
    "distribution_owned:",
    ...ownedFiles.map((file) => `  - ${file}`),
    "",
  ].join("\n");
  const profile = [
    `display_name: ${yamlString(pack.identity.name)}`,
    `description: ${yamlString(pack.identity.summary)}`,
    "description_auto: false",
    "",
  ].join("\n");
  const soul = [
    pack.instructions.durableRoleAndBoundaries.trim(),
    "",
    "## Requested capabilities",
    "",
    markdownList(pack.controls.requestedCapabilities),
    "",
    "## May work without approval",
    "",
    markdownList(pack.controls.allowedWithoutApproval),
    "",
    "## Requires approval",
    "",
    markdownList(pack.controls.requiresApproval),
    "",
    "## Operating limits",
    "",
    markdownList(pack.controls.operatingLimits),
    "",
    "## Prohibited actions",
    "",
    markdownList(pack.controls.prohibited),
    "",
    "## Stop and remove access",
    "",
    pack.controls.shutdown,
    "",
  ].join("\n");
  const passport = [
    `# ${pack.identity.name} — Bot Passport V2`,
    "",
    `- **Artifact ID:** ${pack.artifactId}`,
    `- **Role:** ${pack.identity.title}`,
    `- **Planned risk:** ${pack.controls.riskLevel}`,
    `- **Pack version:** ${pack.packVersion}`,
    "",
    "## Requested capabilities",
    "",
    markdownList(pack.controls.requestedCapabilities),
    "",
    "## May work without approval",
    "",
    markdownList(pack.controls.allowedWithoutApproval),
    "",
    "## Requires approval",
    "",
    markdownList(pack.controls.requiresApproval),
    "",
    "## Operating limits",
    "",
    markdownList(pack.controls.operatingLimits),
    "",
    "## Prohibited actions",
    "",
    markdownList(pack.controls.prohibited),
    "",
    "## First mission",
    "",
    pack.job.firstMission,
    "",
    "## Human checkpoint",
    "",
    pack.job.checkpoint,
    "",
    "## Stop and remove access",
    "",
    pack.controls.shutdown,
    "",
  ].join("\n");
  const readme = [
    `# ${pack.identity.name} — ${pack.identity.title}`,
    "",
    pack.identity.summary,
    "",
    "This is a Bot Cabinet Portable Bot Pack V2 Hermes profile archive. Review every file before importing it or granting access.",
    "",
    "## Package status",
    "",
    "- The generated files and archive structure are checked at build time.",
    `- This V2 archive passed an isolated import with Hermes Agent ${pack.platforms.hermes.importEvidence.hermesVersion} on ${pack.platforms.hermes.importEvidence.testedDate}.`,
    "- That import test confirmed the archive and bundled Skill were present. It did not test output quality or live-service behavior.",
    `- The included Skill is ${skill.preparationStatus} and ${skill.testStatus}.`,
    `- The Routine is a plan only: ${routine.activationStatus} and ${routine.testStatus}.`,
    "- No schedule or active Routine is included in this package.",
    "",
    "## Set it up",
    "",
    "1. Review SOUL.md, BOT-PASSPORT.md, and the included Skill.",
    "2. Import the profile archive only after its role and controls match your intended job.",
    "3. Select only the tools and connections required for the job.",
    `4. Run this first mission with sample material: ${pack.job.firstMission}`,
    "5. Review the result at the human checkpoint before adding authority or activating a Routine.",
    "",
    `Portable source: ${PUBLIC_ORIGIN}${paths.portableMarkdownUrl}`,
    "",
  ].join("\n");
  const skillMarkdown = [
    "---",
    `name: ${skillSlug}`,
    `description: ${yamlString(`${skill.name}. ${skill.whenToUse}`)}`,
    "---",
    "",
    `# ${skill.name}`,
    "",
    `**Artifact ID:** ${skill.artifactId}`,
    "",
    `**Preparation status:** ${skill.preparationStatus}`,
    "",
    `**Test status:** ${skill.testStatus}`,
    "",
    "## Use this Skill when",
    "",
    skill.whenToUse,
    "",
    "## Inputs",
    "",
    markdownList(skill.inputs),
    "",
    "## Steps",
    "",
    orderedMarkdownList(skill.steps),
    "",
    "## Expected outputs",
    "",
    markdownList(skill.outputs),
    "",
    "## Requires approval",
    "",
    markdownList(skill.requiresApproval),
    "",
    "## Prohibited actions",
    "",
    markdownList(skill.prohibited),
    "",
  ].join("\n");

  return {
    "distribution.yaml": manifest,
    "profile.yaml": profile,
    "SOUL.md": soul,
    "README.md": readme,
    "BOT-PASSPORT.md": passport,
    LICENSE: MIT_LICENSE,
    [skillPath]: skillMarkdown,
  };
}

export function compilePortableBotPackV2TextArtifacts(
  pack: PortableBotPackV2,
): PortableBotPackV2TextArtifact[] {
  parsePortableBotPackV2(pack);
  const slug = pack.identity.slug;
  const paths = portableBotPackV2ArtifactPaths(slug);

  return [
    {
      relativePath: paths.portableJsonUrl.slice(1),
      mediaType: "application/json",
      content: portableBotPackV2ToJson(pack),
    },
    {
      relativePath: paths.portableMarkdownUrl.slice(1),
      mediaType: "text/markdown",
      content: portableBotPackV2ToMarkdown(pack),
    },
    {
      relativePath: paths.grokBriefUrl.slice(1),
      mediaType: "text/markdown",
      content: portableBotPackV2ToGrokMarkdown(pack),
    },
  ];
}

export function portableBotPackV2Catalog(packs: readonly PortableBotPackV2[]) {
  return {
    apiVersion: 2,
    schemaVersion: PORTABLE_BOT_PACK_V2_SCHEMA_VERSION,
    packVersion: PORTABLE_BOT_PACK_V2_PACK_VERSION,
    portablePackSchemaUrl: "/api/v2/portable-bot-pack.schema.json",
    count: packs.length,
    bots: packs.map((candidate) => {
      const pack = parsePortableBotPackV2(candidate);
      const paths = portableBotPackV2ArtifactPaths(pack.identity.slug);
      return {
        artifactId: pack.artifactId,
        slug: pack.identity.slug,
        name: pack.identity.name,
        title: pack.identity.title,
        category: pack.identity.category,
        summary: pack.identity.summary,
        portraitUrl: pack.identity.portrait.url,
        preparationStatus: pack.preparationStatus,
        portablePack: {
          jsonUrl: paths.portableJsonUrl,
          markdownUrl: paths.portableMarkdownUrl,
        },
        hermes: pack.platforms.hermes,
        grokBot: pack.platforms.grokBot,
      };
    }),
  };
}

export function portableBotPackV2ApiIndex(botCount: number) {
  return {
    apiVersion: 2,
    status: "prepared",
    botCount,
    resources: {
      bots: "/api/v2/bots.json",
      portableBotPackSchema: "/api/v2/portable-bot-pack.schema.json",
      portableBotPackPathPrefix: "/downloads/portable-bot-packs/v2/",
      hermesProfileArchivePathPrefix: "/downloads/starter-bots/v2/",
      grokManualBuildBriefPathPrefix: "/downloads/grok-bot-templates/v2/",
    },
    routineActivation: "manual-test-required",
    grokImportSupport: false,
  } as const;
}
