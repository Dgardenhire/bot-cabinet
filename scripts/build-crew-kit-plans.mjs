import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "public/downloads/crew-kits");

async function loadTsData(relativePath) {
  const source = await readFile(path.join(projectRoot, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}

const { CREW_KITS: kits } = await loadTsData("src/data/crew-kits.ts");
const { STARTER_BOTS: starterBots } = await loadTsData("src/data/starter-bots.ts");
const botNames = new Map(starterBots.map((bot) => [bot.slug, bot.name]));

await mkdir(outputRoot, { recursive: true });

for (const kit of kits) {
  const lines = [
    `# ${kit.name} — Crew Kit`,
    "",
    kit.promise,
    "",
    `Designed for: ${kit.audience}`,
    "",
    "## Standing assignment",
    "",
    kit.description,
    "",
    "## Bots and responsibilities",
    "",
    ...kit.roles.map((role, index) => `${index + 1}. **[${botNames.get(role.botSlug) ?? role.botSlug}](https://botcabinet.com/bots/${role.botSlug}/)** — ${role.responsibility}`),
    "",
    "## Included workflows",
    "",
    ...kit.workflows.map((workflow) => `- **${workflow.useCaseSlug ? `[${workflow.name}](https://botcabinet.com/use-cases/${workflow.useCaseSlug}/)` : workflow.name}:** ${workflow.description}`),
    "",
    "## Shared inputs",
    "",
    ...kit.sharedInputs.map((item) => `- ${item}`),
    "",
    "## Operating rhythm",
    "",
    ...kit.operatingRhythm.map((item, index) => `${index + 1}. **${item.timing} — ${item.owner}:** ${item.action}`),
    "",
    "## Success measures",
    "",
    ...kit.successMeasures.map((item) => `- [ ] ${item}`),
    "",
    "## Crew Passport",
    "",
    "### Allowed access",
    "",
    ...kit.passport.allowedAccess.map((item) => `- ${item}`),
    "",
    "### A person must perform or release",
    "",
    ...kit.passport.approvalActions.map((item) => `- ${item}`),
    "",
    "### Bots must never",
    "",
    ...kit.passport.prohibitedActions.map((item) => `- ${item}`),
    "",
    "### How controls are enforced",
    "",
    ...kit.passport.enforcementNotes.map((item) => `- ${item}`),
    "",
    "## Setup",
    "",
    ...kit.setupSteps.map((item, index) => `${index + 1}. ${item}`),
    "",
    `View this Crew Kit: https://botcabinet.com/crew-kits/${kit.slug}/`,
    "",
    "Browse all Crew Kits: https://botcabinet.com/crew-kits/",
    "",
  ];
  await writeFile(path.join(outputRoot, `${kit.slug}.md`), lines.join("\n"), "utf8");
}

process.stdout.write(`${kits.length} crew-kit plans built in ${outputRoot}\n`);
