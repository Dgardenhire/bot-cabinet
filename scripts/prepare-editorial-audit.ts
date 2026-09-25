import { readFile } from "node:fs/promises";

import { prepareEditorialEvidenceOptions, segmentEditorialAssertions } from "../src/lib/editorial-source-audit";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: node --import tsx scripts/prepare-editorial-audit.ts draft.json");
  const input: unknown = JSON.parse(await readFile(file, "utf8"));
  if (!input || typeof input !== "object" || !("newsletter" in input) || !("social" in input)
    || typeof input.newsletter !== "string" || typeof input.social !== "string") {
    throw new Error("Expected newsletter and social string fields");
  }
  const sources = "sources" in input && Array.isArray(input.sources) ? input.sources : [];
  if (!sources.every(source => source && typeof source === "object"
    && "id" in source && typeof source.id === "string"
    && "text" in source && typeof source.text === "string")) {
    throw new Error("sources must contain string id and text fields");
  }
  console.log(JSON.stringify({
    newsletterAssertions: segmentEditorialAssertions(input.newsletter),
    socialAssertions: segmentEditorialAssertions(input.social),
    ...(sources.length ? { evidenceOptions: prepareEditorialEvidenceOptions(sources) } : {}),
  }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
