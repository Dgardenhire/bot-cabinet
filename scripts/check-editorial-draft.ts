import { readFile } from "node:fs/promises";
import { measureEditorialDraft } from "../src/lib/editorial-length";

async function main() {
const file = process.argv[2];
if (!file) throw new Error("Usage: npx tsx scripts/check-editorial-draft.ts draft.json (newsletter and social string fields)");
const draft: unknown = JSON.parse(await readFile(file, "utf8"));
if (!draft || typeof draft !== "object" || !("newsletter" in draft) || !("social" in draft)
  || typeof draft.newsletter !== "string" || typeof draft.social !== "string") {
  throw new Error("Expected newsletter and social string fields; exclude headings and review notes from newsletter.");
}
const rawException = "lengthException" in draft ? draft.lengthException : undefined;
if (rawException !== undefined && rawException !== null && (typeof rawException !== "object"
  || !("reason" in rawException) || rawException.reason !== "source-shortfall"
  || !("explanation" in rawException) || typeof rawException.explanation !== "string")) {
  throw new Error("lengthException must contain reason 'source-shortfall' and a non-empty explanation.");
}
const lengthException = rawException && typeof rawException === "object"
  && "reason" in rawException && rawException.reason === "source-shortfall"
  && "explanation" in rawException && typeof rawException.explanation === "string"
  ? { reason: "source-shortfall" as const, explanation: rawException.explanation }
  : rawException === null ? null : undefined;
const result = measureEditorialDraft({ newsletter: draft.newsletter, social: draft.social, lengthException });
console.log(JSON.stringify(result, null, 2));
if (!result.newsletterMechanicallyAccepted || !result.socialWithinCodePointLimit) process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
