import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "public/downloads/grok-bot-templates");

async function loadTsModule(filePath) {
  const source = await readFile(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}

const { STARTER_BOTS: bots } = await loadTsModule(
  path.join(projectRoot, "src/data/starter-bots.ts"),
);
const { starterBotToPassport, botPassportToMarkdown } = await loadTsModule(
  path.join(projectRoot, "src/lib/bot-passport.ts"),
);

await mkdir(outputRoot, { recursive: true });

for (const bot of bots) {
  const passport = starterBotToPassport(bot);
  const guide = [
    `# ${bot.name} — Grok Bot adaptation brief`,
    "",
    bot.summary,
    "",
    "This is a portable build brief, not a one-click Grok Bot installer. Use it to create your own Bot, review the proposed access, run a limited test, and then decide whether to publish it as a Grok Bot template.",
    "",
    "## Job",
    "",
    bot.workshopDraft.jobOutcome,
    "",
    "## Standing role instructions",
    "",
    bot.soul,
    "",
    "## Information to provide",
    "",
    ...bot.setup.map((item) => `- ${item}`),
    "",
    "## Intended output",
    "",
    ...bot.produces.map((item) => `- ${item}`),
    "",
    "## Build it in Grok Bot",
    "",
    "1. Create a new Bot and use the job and standing role instructions above.",
    "2. Add only the first-party skills, plugins, routines, or connections required for this job.",
    "3. Keep credentials, private memories, custom code, and personal information outside the template.",
    `4. Run this first test: ${bot.workshopDraft.firstRunTest}`,
    "5. Review the Bot Passport below and correct the Bot's instructions or access before publishing a template.",
    "6. Preview the template contents in Grok Bot, then publish only when the package matches the intended role.",
    "",
    botPassportToMarkdown(passport),
    "Created by Bot Cabinet: https://botcabinet.com/",
    "",
  ].join("\n");
  await writeFile(path.join(outputRoot, `${bot.slug}.md`), guide, "utf8");
}

process.stdout.write(`${bots.length} Grok Bot adaptation guides built in ${outputRoot}\n`);
