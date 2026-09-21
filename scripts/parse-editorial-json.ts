import { readFile } from "node:fs/promises";

import { parseEditorialJson } from "../src/lib/editorial-json";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: node --import tsx scripts/parse-editorial-json.ts handoff.txt");
  console.log(JSON.stringify(parseEditorialJson(await readFile(file, "utf8")), null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
