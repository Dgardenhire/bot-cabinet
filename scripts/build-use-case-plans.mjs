import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/use-cases.ts");
const outputRoot = path.join(projectRoot, "public/downloads/use-cases");

const source = await readFile(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const compiledModule = { exports: {} };
new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
const useCases = compiledModule.exports.BOT_USE_CASES;

function stepPrompt(useCase, index) {
  const step = useCase.steps[index];
  const previousStep = useCase.steps[index - 1];
  const previousContext = previousStep
    ? `Start with this result from ${previousStep.bot}: ${previousStep.output}. `
    : "Use the approved inputs I provide. ";
  return `${previousContext}${step.action}. Return this result: ${step.output}. Ask me about missing information before you continue.`;
}

await mkdir(outputRoot, { recursive: true });

for (const useCase of useCases) {
  const lines = [
    `# ${useCase.title}`,
    "",
    `Designed for: ${useCase.audience}`,
    "",
    `Result: ${useCase.outcome}`,
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
      stepPrompt(useCase, index),
      "",
    ]),
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
    "## Hermes Desktop setup",
    "",
    "1. Open each Bot's page in Bot Cabinet's Hermes Bots collection and follow its manual Hermes Desktop setup steps.",
    "2. Run each step in that Bot's own chat and review the result.",
    "3. Pass the approved result to the next Bot with the message provided for that step.",
    "4. After the sequence works, you may create a group with the same Bots.",
    "5. In a group, @mention the Bot you want. Membership order does not control who responds.",
  ];
  await writeFile(path.join(outputRoot, `${useCase.slug}.md`), `${lines.join("\n")}\n`, "utf8");
}

process.stdout.write(`${useCases.length} use-case plans built in ${outputRoot}\n`);
