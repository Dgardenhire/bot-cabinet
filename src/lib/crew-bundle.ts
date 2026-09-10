import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createDeterministicTarGzip } from "../../scripts/content/deterministic-archives";
import type { CrewKit } from "../data/crew-kits";
import { getStarterBot } from "../data/starter-bots";
import { starterBotToPortablePackV2, validatePortableBotPackV2 } from "./portable-bot-pack-v2";
import { compilePortableBotPackV2HermesFiles } from "./portable-bot-pack-v2-artifacts";

export const CREW_BUNDLE_VERSION = "1.0.0";
export const CREW_PERMISSIONS_NOTICE = "Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.";
export const CREW_MEMBER_STEPS = [
  "Review SOUL.md and bundled files",
  "Import profile into Hermes Desktop without replacing an existing Bot",
  "Select only the tools this role needs",
  "Confirm read-only or draft-only permissions in connected services",
  "Run the first test with sample material and review the result",
] as const;

export function buildCrewBundle(kit: CrewKit) {
  const files: Record<string, string | Buffer> = {};
  const seen = new Set<string>();
  const members = kit.roles.map((role, index) => {
    const bot = getStarterBot(role.botSlug);
    if (!bot || seen.has(role.botSlug)) throw new Error(`Invalid crew member: ${role.botSlug}`);
    seen.add(role.botSlug);
    const pack = starterBotToPortablePackV2(bot);
    const issues = validatePortableBotPackV2(pack);
    if (issues.length) throw new Error(issues.join("; "));
    const hermesFiles = compilePortableBotPackV2HermesFiles(pack);
    const archivePath = `members/${bot.slug}.tar.gz`;
    const archive = createDeterministicTarGzip(bot.slug, hermesFiles);
    files[archivePath] = archive;
    // Readable copies let people inspect before importing the archive.
    for (const [name, content] of Object.entries(hermesFiles)) files[`members/${bot.slug}/${name}`] = content;
    return {
      slug: bot.slug, name: bot.name, responsibility: role.responsibility,
      setupOrder: index + 1, packVersion: pack.packVersion, archivePath,
      archiveUrl: pack.platforms.hermes.archiveUrl,
      sha256: createHash("sha256").update(archive).digest("hex"),
      minimumSupported: pack.platforms.hermes.minimumVersion,
      testedWith: pack.platforms.hermes.importEvidence?.hermesVersion ?? null,
      importTest: pack.platforms.hermes.importStatus,
      skillTest: "not-tested" as const,
      routine: "inactive; manual-test-required" as const,
      humanTechnicalReview: "not-recorded" as const,
      requestedCapabilities: pack.controls.requestedCapabilities,
      approvalActions: pack.controls.requiresApproval,
      firstTest: bot.workshopDraft.firstRunTest,
    };
  });
  if (!members.length) throw new Error("A crew needs members");
  const manifest = {
    schemaVersion: 1, bundleVersion: CREW_BUNDLE_VERSION, slug: kit.slug, name: kit.name,
    runtimeStatus: "not-tested" as const, schedulesActive: false,
    permissionsNotice: CREW_PERMISSIONS_NOTICE, members,
    handoffOrder: kit.operatingRhythm,
    approvalActions: kit.passport.approvalActions,
    prohibitedActions: kit.passport.prohibitedActions,
  };
  files["crew-manifest.json"] = JSON.stringify(manifest, null, 2) + "\n";
  files["SETUP.md"] = [
    `# ${kit.name} — guided setup`, "", `Bundle ${CREW_BUNDLE_VERSION}`, "", kit.promise, "",
    CREW_PERMISSIONS_NOTICE, "",
    "This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated. Crew coordination has not been runtime-tested.", "",
    "Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.", "",
    "Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.", "",
    ...members.flatMap(member => [
      `## ${member.setupOrder}. ${member.name}`, "", member.responsibility, "",
      `Archive: ${member.archivePath}`, `SHA-256: ${member.sha256}`,
      `Pack: ${member.packVersion}; minimum Hermes: ${member.minimumSupported}; import tested with: ${member.testedWith ?? "not tested"}`,
      `Import: ${member.importTest}; skill: ${member.skillTest}; routine: ${member.routine}`, "",
      ...CREW_MEMBER_STEPS.map(step => `- [ ] ${step}`), "",
      `First test: ${member.firstTest}`, "",
      "Requested capabilities (configure manually):", ...member.requestedCapabilities.map(item => `- ${item}`), "",
    ]),
    "## Run one manual handoff cycle", "",
    ...kit.operatingRhythm.map((step, i) => `${i + 1}. **${step.owner} / ${step.timing}:** ${step.action}`), "",
    "- [ ] A person reviewed and approved each handoff before the next Bot used it",
    "- [ ] Schedules remain inactive; any future activation needs explicit approval",
    "- [ ] A person reviewed the final deliverable against the success measures", "",
    "## Human release required", ...kit.passport.approvalActions.map(item => `- ${item}`), "",
    "## Success measures", ...kit.successMeasures.map(item => `- [ ] ${item}`), "",
    `Reference: https://botcabinet.com/crew-kits/${kit.slug}/`, "",
  ].join("\n");
  return { manifest, files };
}

export type CrewBundleManifest = ReturnType<typeof buildCrewBundle>["manifest"];

export function readGeneratedCrewManifest(slug: string): CrewBundleManifest {
  return JSON.parse(readFileSync(path.join(
    process.cwd(),
    "public/downloads/crew-kits/bundles",
    `${slug}.json`,
  ), "utf8")) as CrewBundleManifest;
}
