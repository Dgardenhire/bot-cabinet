import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  BOT_FIT_INPUT_SCHEMA,
  BOT_FIT_OUTPUT_SCHEMA,
  BOT_FIT_PUBLIC_CONTRACT,
} from "../../src/lib/bot-fit-contract";

async function main() {
  const contractTarget = path.join(
    process.cwd(),
    "public/api/v1/bot-fit-test.json",
  );
  const schemaDirectory = path.join(process.cwd(), "public/schemas");
  const inputSchemaTarget = path.join(
    schemaDirectory,
    "bot-fit-test-input-v1.json",
  );
  const outputSchemaTarget = path.join(
    schemaDirectory,
    "bot-fit-test-output-v1.json",
  );

  await Promise.all([
    mkdir(path.dirname(contractTarget), { recursive: true }),
    mkdir(schemaDirectory, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      contractTarget,
      `${JSON.stringify(BOT_FIT_PUBLIC_CONTRACT, null, 2)}\n`,
    ),
    writeFile(
      inputSchemaTarget,
      `${JSON.stringify(BOT_FIT_INPUT_SCHEMA, null, 2)}\n`,
    ),
    writeFile(
      outputSchemaTarget,
      `${JSON.stringify(BOT_FIT_OUTPUT_SCHEMA, null, 2)}\n`,
    ),
  ]);
  process.stdout.write(
    "Bot Fit Test contract and standalone schemas written to public.\n",
  );
}

main().catch((error) => {
  process.stderr.write(`Unable to generate Bot Fit Test contract: ${String(error)}\n`);
  process.exitCode = 1;
});
