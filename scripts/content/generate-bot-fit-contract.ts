import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BOT_FIT_PUBLIC_CONTRACT } from "../../src/lib/bot-fit-contract";

async function main() {
  const target = path.join(
    process.cwd(),
    "public/api/v1/bot-fit-test.json",
  );
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(BOT_FIT_PUBLIC_CONTRACT, null, 2)}\n`);
  process.stdout.write("Bot Fit Test agent contract written to public/api/v1.\n");
}

main().catch((error) => {
  process.stderr.write(`Unable to generate Bot Fit Test contract: ${String(error)}\n`);
  process.exitCode = 1;
});
