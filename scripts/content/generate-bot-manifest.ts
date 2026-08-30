import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { PUBLIC_BOT_CATALOG } from "../../src/content/public-manifest";

async function main() {
  const projectRoot = process.cwd();
  const outputDirectory = path.join(projectRoot, "public/api/v1");
  const outputPath = path.join(outputDirectory, "bots.json");

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(PUBLIC_BOT_CATALOG, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    `${PUBLIC_BOT_CATALOG.count} Bot definitions written to ${outputPath}\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Unable to generate the Bot catalog manifest: ${String(error)}\n`,
  );
  process.exitCode = 1;
});
