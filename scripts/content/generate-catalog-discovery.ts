import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  PUBLIC_CATALOG_RSS,
  PUBLIC_CATALOG_UPDATES,
  PUBLIC_LLMS_TEXT,
} from "../../src/content/catalog-discovery";

async function main() {
  const projectRoot = process.cwd();
  const apiDirectory = path.join(projectRoot, "public/api/v1");

  await mkdir(apiDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(apiDirectory, "updates.json"),
      `${JSON.stringify(PUBLIC_CATALOG_UPDATES, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      path.join(projectRoot, "public/feed.xml"),
      PUBLIC_CATALOG_RSS,
      "utf8",
    ),
    writeFile(
      path.join(projectRoot, "public/llms.txt"),
      PUBLIC_LLMS_TEXT,
      "utf8",
    ),
  ]);

  process.stdout.write(
    `${PUBLIC_CATALOG_UPDATES.count} Bot entries written to the public updates, RSS, and llms.txt files\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Unable to generate the catalog discovery files: ${String(error)}\n`,
  );
  process.exitCode = 1;
});
