import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readFile, rm, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import ts from "typescript";

const execFile = promisify(execFileCallback);

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "src/data/starter-bots.ts");
const outputRoot = path.join(projectRoot, "public/downloads/starter-bots");

const source = await readFile(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const compiledModule = { exports: {} };
new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
const starters = compiledModule.exports.STARTER_BOTS;

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

  const manifest = [
    `name: ${bot.slug}`,
    'version: "1.0.0"',
    `description: "${bot.summary.replaceAll('"', '\\"')}"`,
    "distribution_owned:",
    "  - SOUL.md",
    "  - README.md",
    "  - LICENSE",
    "",
  ].join("\n");

  const readme = [
    `# ${bot.name} — ${bot.title}`,
    "",
    bot.summary,
    "",
    "This LINCHPIN starter package contains role instructions, setup documentation, a package manifest, and a license.",
    "",
    "## What this download is",
    "",
    "This ZIP contains readable source files. Hermes Desktop does not import it directly. Read the files, then create the Bot manually in Hermes Desktop. The package includes distribution.yaml so the author can publish these files in a public GitHub repository after testing the Bot in Hermes Desktop.",
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
    "1. Open the Bots tab and choose New Agent.",
    `2. Enter the name **${bot.name}**, the title **${bot.title}**, and the description at the top of this file.`,
    "3. Open Advanced and paste the contents of SOUL.md into Custom SOUL.md.",
    "4. Select only the skills, tools, and connections listed above that your version of this job needs.",
    `5. Create the Bot and begin with this test: ${bot.workshopDraft.firstRunTest}`,
    "",
    "## Review status",
    "",
    "On August 25, 2026, the Hermes Bot Registry in Bot Cabinet ran a file-structure test that confirmed this ZIP contains the expected four files and matches the readable copies. It did not run the Bot. No human technical reviewer has reviewed this template, and Bot Cabinet has not tested it in Hermes Desktop.",
    "",
  ].join("\n");

  await writeFile(path.join(botDir, "distribution.yaml"), manifest, "utf8");
  await writeFile(path.join(botDir, "SOUL.md"), `${bot.soul}\n`, "utf8");
  await writeFile(path.join(botDir, "README.md"), readme, "utf8");
  await writeFile(path.join(botDir, "LICENSE"), license, "utf8");

  const files = ["distribution.yaml", "SOUL.md", "README.md", "LICENSE"];
  const fixedTime = new Date("2026-01-01T00:00:00.000Z");
  await Promise.all(files.map((file) => utimes(path.join(botDir, file), fixedTime, fixedTime)));
  const zipPath = path.join(outputRoot, `${bot.slug}.zip`);
  await rm(zipPath, { force: true });
  await execFile("zip", ["-X", "-q", zipPath, ...files], { cwd: botDir });
}

process.stdout.write(`${starters.length} starter packages built in ${outputRoot}\n`);
