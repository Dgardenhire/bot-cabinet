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
const starterModule = await loadTsModule(path.join(projectRoot, "src/data/starter-bots.ts"));
const useCases = useCaseModule.BOT_USE_CASES;

await mkdir(outputRoot, { recursive: true });

for (const useCase of useCases) {
  const operations = operationsModule.getUseCaseOperations(useCase);
  const isSingleBot = useCase.botSlugs.length === 1;
  const hasStarterArchive = !!starterModule.getStarterBot(useCase.botSlugs[0]);
  const lines = [
    `# ${useCase.title}`,
    "",
    `Designed for: ${useCase.audience}`,
    "",
    `Result: ${useCase.outcome}`,
    "",
    ...(useCase.sample ? [
      "## Try a sample first",
      "",
      "Illustrative example, not a recorded Bot run. This adaptation has not been runtime-tested.",
      "",
      "### Complete first request",
      "",
      useCase.kickoffMessage,
      "",
      useCase.sample.input,
      "",
      "### Example result",
      "",
      useCase.sample.output,
      "",
      "### Check the answer",
      "",
      ...useCase.sample.checks.map(item => `- ${item}`),
      "",
      ...(useCase.inspiredBy ? [
        `Inspired by ${useCase.inspiredBy.collection ? "" : "a community use shared by "}${useCase.inspiredBy.creator}: ${useCase.inspiredBy.href}`,
        useCase.inspiredBy.collection
          ? `Found through ${useCase.inspiredBy.collection.name} (${useCase.inspiredBy.collection.href}). This fictional sample was written by Bot Cabinet.`
          : "Found through Bot Usecases (https://botusecases.netlify.app/), curated by KP. This fictional sample was written by Bot Cabinet.",
        "",
      ] : []),
    ] : []),
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
    `## ${isSingleBot ? "Recommended starting Bot" : "Bots"}`,
    "",
    ...useCase.botSlugs.map((slug, index) => `${index + 1}. ${useCase.steps[index]?.bot ?? slug}`),
    ...(useCase.setupNote ? ["", useCase.setupNote] : []),
    ...(useCase.optionalBotSlugs?.length ? ["", `Optional specialists: ${useCase.optionalBotSlugs.join(", ")}.`] : []),
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
    ...(!isSingleBot ? [
      "## Handoff rules",
      "",
      ...operations.handoffs.map((handoff, index) => `${index + 1}. ${handoff}`),
      "",
    ] : []),
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
    ...(useCase.adaptations?.length ? [
      "## Ways to do this job with another AI service",
      "",
      "These options may not work the same way. Read what has and has not been tested.",
      "",
      ...useCase.adaptations.flatMap((adaptation) => [
        `### ${adaptation.platform} — ${adaptation.statusLabel}`,
        "",
        `- **How it could work:** ${adaptation.approach}`,
        `- **Start here:** ${adaptation.setup}`,
        `- **What we have not tested:** ${adaptation.limitations}`,
        ...(adaptation.source ? [`- **Source:** [${adaptation.source.label}](${adaptation.source.href})`] : []),
        ...(adaptation.cabinetGuide ? [`- **Setup guide:** https://botcabinet.com${adaptation.cabinetGuide}/`] : []),
        "",
      ]),
    ] : []),
    "## Hermes Desktop setup",
    "",
    ...(isSingleBot && !hasStarterArchive ? [
      `1. Open https://botcabinet.com/bots/${useCase.botSlugs[0]}/. Copy its role instructions into a new Bot and review its limits. This specialist has no Hermes profile archive.`,
      "2. Keep outside accounts and schedules disconnected for the first test.",
      "3. Run the complete sample task in its chat and check the answer against the supplied records.",
      "4. Approve any additional access or outside action separately.",
    ] : isSingleBot ? [
      "1. Open the linked Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.",
      "2. Review the profile's SOUL.md, Bot Passport, and requested access.",
      "3. Run the complete request in that Bot's chat with low-risk material and review the result.",
      "4. Add a schedule, outside connection, or optional specialist only after the manual version works.",
    ] : [
      "1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.",
      "2. Review each imported profile's SOUL.md, Bot Passport, and requested access.",
      "3. Run each step in that Bot's own chat and review the result.",
      "4. Pass the approved result to the next Bot with the message provided for that step.",
      "5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.",
    ]),
  ];
  await writeFile(path.join(outputRoot, `${useCase.slug}.md`), `${lines.join("\n")}\n`, "utf8");
}

process.stdout.write(`${useCases.length} use-case plans built in ${outputRoot}\n`);
