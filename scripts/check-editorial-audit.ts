import { readFile } from "node:fs/promises";
import { checkEditorialAudit, type EditorialAuditEntry, type EditorialSource } from "../src/lib/editorial-source-audit";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npx tsx scripts/check-editorial-audit.ts audit.json");
  const input: unknown = JSON.parse(await readFile(file, "utf8"));
  if (!input || typeof input !== "object") throw new Error("Expected an audit object");
  const value = input as { draft?: unknown; sources?: unknown; entries?: unknown };
  if (typeof value.draft !== "string" || !Array.isArray(value.sources) || !Array.isArray(value.entries)) {
    throw new Error("Expected draft string, sources array and entries array");
  }
  const sourcesValid = value.sources.every(source => source && typeof source === "object"
    && typeof (source as EditorialSource).id === "string"
    && typeof (source as EditorialSource).text === "string");
  const entriesValid = value.entries.every(entry => entry && typeof entry === "object"
    && typeof (entry as EditorialAuditEntry).exactDraftQuote === "string"
    && ["supported", "unsupported", "ambiguous"].includes((entry as EditorialAuditEntry).status)
    && (typeof (entry as EditorialAuditEntry).sourceId === "string" || (entry as EditorialAuditEntry).sourceId === null)
    && (typeof (entry as EditorialAuditEntry).originalSourcePassage === "string" || (entry as EditorialAuditEntry).originalSourcePassage === null)
    && ((entry as EditorialAuditEntry).evidence === undefined || (Array.isArray((entry as EditorialAuditEntry).evidence)
      && (entry as EditorialAuditEntry).evidence!.every(item => item && typeof item.sourceId === "string"
        && typeof item.originalSourcePassage === "string")))
    && typeof (entry as EditorialAuditEntry).explanation === "string");
  if (!sourcesValid || !entriesValid) throw new Error("Audit sources or entries do not match the required schema");
  const result = checkEditorialAudit(
    value.entries as EditorialAuditEntry[],
    value.draft,
    value.sources as EditorialSource[],
  );
  console.log(JSON.stringify(result, null, 2));
  if (!result.noUnsupportedAssertions) process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
