import { execFile as execFileCallback } from "node:child_process";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);

const GENERATED_PATHS = [
  "public/api/v1",
  "public/feed.xml",
  "public/llms.txt",
  "public/downloads/starter-bots",
  "public/downloads/use-cases",
  "public/downloads/crew-kits",
  "public/downloads/grok-bot-templates",
  "public/brand",
];

export async function listGeneratedChanges(projectRoot = process.cwd()) {
  const { stdout } = await execFile(
    "git",
    [
      "status",
      "--short",
      "--untracked-files=all",
      "--",
      ...GENERATED_PATHS,
    ],
    { cwd: projectRoot },
  );

  return stdout
    .split("\n")
    .map((line) => line.trimStart())
    .filter(Boolean);
}

async function main() {
  const changes = await listGeneratedChanges();
  if (!changes.length) {
    process.stdout.write("Generated Bot Cabinet artifacts match the committed source.\n");
    return;
  }

  process.stderr.write(
    [
      "Generated artifacts changed after generation.",
      "Run npm run generate:content and commit the reviewed results:",
      ...changes.map((change) => `  ${change}`),
      "",
    ].join("\n"),
  );
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`Unable to check generated artifacts: ${String(error)}\n`);
    process.exitCode = 1;
  });
}
