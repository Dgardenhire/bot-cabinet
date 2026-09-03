import { readFile } from "node:fs/promises";

import { buildBotFitAgentResult } from "../src/lib/bot-fit-contract";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const inputPath = process.argv[2];
  const source = inputPath ? await readFile(inputPath, "utf8") : await readStdin();
  if (!source.trim()) {
    throw new Error(
      "Provide a JSON file path or pipe JSON into npm run fit:bot.",
    );
  }

  const result = buildBotFitAgentResult(JSON.parse(source));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Bot Fit Test failed: ${String(error)}\n`);
  process.exitCode = 1;
});
