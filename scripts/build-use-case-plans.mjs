import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/use-cases.ts");
const operationsSourcePath = path.join(projectRoot, "src/data/use-case-operations.ts");
const outputRoot = path.join(projectRoot, "public/downloads/use-cases");

async function loadTsModule(filePath) {
  const source = await readFile(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}

const useCaseModule = await loadTsModule(sourcePath);
const operationsModule = await loadTsModule(operationsSourcePath);
const useCases = useCaseModule.BOT_USE_CASES;

await mkdir(outputRoot, { recursive: true });

for (const useCase of useCases) {
  const operations = operationsModule.getUseCaseOperations(useCase);
  const lines = [
    `# ${useCase.title}`,
    "",
    `Designed for: ${useCase.audience}`,
    "",
    `Result: ${useCase.outcome}`,
    "",
    "## Operating guide",
    "",
    `- **When to use it:** ${operations.whenToUse}`,
    `- **Lead Bot:** ${useCase.steps[0]?.bot ?? useCase.botSlugs[0]}`,
    `- **Cadence:** ${operations.cadence}`,
    `- **Typical first run:** ${operations.estimatedTime}`,
    "",
    "### Access for the first run",
    "",
    ...operations.access.map((item) => `- ${item}`),
    "",
    "## Bots",
    "",
    ...useCase.botSlugs.map((slug, index) => `${index + 1}. ${useCase.steps[index]?.bot ?? slug}`),
    "",
    "## Information to gather",
    "",
    ...useCase.inputs.map((item) => `- ${item}`),
    "",
    "## Workflow",
    "",
    ...useCase.steps.flatMap((step, index) => [
      `### ${index + 1}. ${step.bot}`,
      "",
      step.action,
      "",
      `Output: ${step.output}`,
      "",
      "Message to send:",
      "",
      useCaseModule.getUseCaseStepPrompt(useCase, index),
      "",
    ]),
    "## Handoff rules",
    "",
    ...operations.handoffs.map((handoff, index) => `${index + 1}. ${handoff}`),
    "",
    "## Overall request",
    "",
    useCase.kickoffMessage,
    "",
    "## Decisions for a person",
    "",
    ...useCase.humanDecisions.map((item) => `- ${item}`),
    "",
    "## First test",
    "",
    useCase.firstTest,
    "",
    "## Success checkpoint",
    "",
    operations.successCheckpoint,
    "",
    "## If the workflow stalls",
    "",
    operations.recovery,
    "",
    "## Hermes Desktop setup",
    "",
    "1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.",
    "2. Review each imported profile's SOUL.md, Bot Passport, and requested access.",
    "3. Run each step in that Bot's own chat and review the result.",
    "4. Pass the approved result to the next Bot with the message provided for that step.",
    "5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.",
  ];
  await writeFile(path.join(outputRoot, `${useCase.slug}.md`), `${lines.join("\n")}\n`, "utf8");
}

process.stdout.write(`${useCases.length} use-case plans built in ${outputRoot}\n`);
