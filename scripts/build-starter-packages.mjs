import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readFile, rm, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import ts from "typescript";

const execFile = promisify(execFileCallback);

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/starter-bots.ts");
const passportSourcePath = path.join(projectRoot, "src/lib/bot-passport.ts");
const outputRoot = path.join(projectRoot, "public/downloads/starter-bots");

async function loadTsModule(filePath) {
  const source = await readFile(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}

const { STARTER_BOTS: starters } = await loadTsModule(sourcePath);
const { starterBotToPassport, botPassportToMarkdown } = await loadTsModule(passportSourcePath);

if (!Array.isArray(starters) || starters.length === 0) {
  throw new Error("No starter bots were found");
}

const license = `MIT License

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

for (const bot of starters) {
  const botDir = path.join(outputRoot, bot.slug);
  await mkdir(botDir, { recursive: true });
  const botPassport = starterBotToPassport(bot);

  const manifest = [
    `name: ${bot.slug}`,
    'version: "1.0.0"',
    `description: "${bot.summary.replaceAll('"', '\\"')}"`,
    'hermes_requires: ">=0.20.0"',
    'author: "Bot Cabinet"',
    'license: "MIT"',
    "distribution_owned:",
    "  - profile.yaml",
    "  - SOUL.md",
    "  - README.md",
    "  - BOT-PASSPORT.md",
    "  - LICENSE",
    "",
  ].join("\n");
  const profileMetadata = [
    `display_name: ${JSON.stringify(bot.name)}`,
    `description: ${JSON.stringify(bot.summary)}`,
    "description_auto: false",
    "",
  ].join("\n");
  const safetyInstructions = [
    "## Approval and decision rules",
    ...botPassport.mustAsk.map((item) => `- ${item}`),
    ...(bot.workshopDraft.accessSensitive
      ? ["", "## Access and sensitive-information limits", bot.workshopDraft.accessSensitive]
      : []),
    "",
    "## Prohibited actions and uncertainty handling",
    ...botPassport.prohibited.map((item) => `- ${item}`),
  ].join("\n");
  const soul = `${bot.soul.trim()}\n\n${safetyInstructions}\n`;
  const importReview = bot.slug === "scout"
    ? "Bot Cabinet also imported this archive with Hermes Agent 0.20.5."
    : "Bot Cabinet has not individually imported this archive into Hermes Desktop."

  const readme = [
    `# ${bot.name} — ${bot.title}`,
    "",
    bot.summary,
    "",
    "This LINCHPIN starter package contains profile metadata, role instructions, a Bot Passport, setup documentation, a package manifest, and a license.",
    "",
    "## What this download is",
    "",
    "The .tar.gz download is a Hermes profile archive. Import it from the Profiles screen in Hermes Desktop, or use the terminal command shown on this Bot's page. The ZIP contains the same readable source files for inspection.",
    "",
    "## Who this helps",
    "",
    bot.whoItHelps,
    "",
    "## Good first requests",
    "",
    ...bot.asks.map((item) => `- ${item}`),
    "",
    "## Intended output",
    "",
    ...bot.produces.map((item) => `- ${item}`),
    "",
    "## Setup information to provide",
    "",
    ...bot.setup.map((item) => `- ${item}`),
    "",
    "## Tools and connections to review in Hermes Desktop",
    "",
    ...bot.workshopDraft.toolsIntegrations.split("\n").filter(Boolean).map((item) => `- ${item}`),
    "",
    "Select these tools and connections only when the job requires them. Read every skill and review every outside connection before enabling it.",
    "",
    "## Human approval points",
    "",
    ...bot.boundaries.map((item) => `- ${item}`),
    "",
    "## Set it up in Hermes Desktop",
    "",
    "1. Import the .tar.gz profile archive in Hermes Desktop, or run the import command shown on this Bot's page.",
    "2. Open the imported profile and review its name, description, and SOUL.md role instructions.",
    "3. Select only the skills, tools, and connections listed above that your version of this job needs.",
    `4. Begin with this test: ${bot.workshopDraft.firstRunTest}`,
    "",
    "## Review status",
    "",
    `On August 28, 2026, Bot Cabinet confirmed that the ZIP and Hermes profile archive contain the six listed files and match the readable copies. ${importReview} No human technical reviewer has reviewed this template, and its role-specific output has not been tested.`,
    "",
  ].join("\n");

  await writeFile(path.join(botDir, "distribution.yaml"), manifest, "utf8");
  await writeFile(path.join(botDir, "profile.yaml"), profileMetadata, "utf8");
  await writeFile(path.join(botDir, "SOUL.md"), soul, "utf8");
  await writeFile(path.join(botDir, "README.md"), readme, "utf8");
  await writeFile(path.join(botDir, "BOT-PASSPORT.md"), botPassportToMarkdown(botPassport), "utf8");
  await writeFile(path.join(botDir, "LICENSE"), license, "utf8");

  const files = ["distribution.yaml", "profile.yaml", "SOUL.md", "README.md", "BOT-PASSPORT.md", "LICENSE"];
  const fixedTime = new Date("2026-01-01T00:00:00.000Z");
  await Promise.all(files.map((file) => utimes(path.join(botDir, file), fixedTime, fixedTime)));
  await utimes(botDir, fixedTime, fixedTime);
  const zipPath = path.join(outputRoot, `${bot.slug}.zip`);
  await rm(zipPath, { force: true });
  await execFile("zip", ["-X", "-q", zipPath, ...files], { cwd: botDir });

  const profileArchivePath = path.join(outputRoot, `${bot.slug}.tar.gz`);
  const profileTarPath = path.join(outputRoot, `${bot.slug}.tar`);
  await rm(profileArchivePath, { force: true });
  await rm(profileTarPath, { force: true });
  await execFile("tar", ["-cf", profileTarPath, bot.slug], {
    cwd: outputRoot,
    env: { ...process.env, COPYFILE_DISABLE: "1" },
  });
  await execFile("gzip", ["-n", "-f", profileTarPath]);
}

process.stdout.write(`${starters.length} starter packages built in ${outputRoot}\n`);
