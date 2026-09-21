import { readFile } from "node:fs/promises";
import { gateEditorHandoff, gateWriterDraftForIndependentAudit } from "../src/lib/publishing-desk-handoff";
import type { EditorialSource } from "../src/lib/editorial-source-audit";

function modelOutput(value: unknown, label: string) {
  if (typeof value !== "string") throw new Error(`${label} must be a string containing the model's exact response`);
  return value;
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: node --import tsx scripts/check-publishing-handoff.ts envelope.json");
  const input: unknown = JSON.parse(await readFile(file, "utf8"));
  if (!input || typeof input !== "object" || !("stage" in input)) throw new Error("Expected a handoff envelope object");
  const envelope = input as Record<string, unknown>;

  if (envelope.stage === "writer") {
    const result = gateWriterDraftForIndependentAudit(modelOutput(envelope.rawOutput, "rawOutput"));
    console.log(JSON.stringify(result, null, 2));
    if (!result.acceptedForEditor) process.exitCode = 1;
    return;
  }
  if (envelope.stage !== "editor") throw new Error("stage must be writer or editor");
  if (!Array.isArray(envelope.sources)) throw new Error("Editor envelope requires sources");
  const sourcesValid = envelope.sources.every(source => source && typeof source === "object"
    && typeof (source as EditorialSource).id === "string"
    && typeof (source as EditorialSource).text === "string");
  if (!sourcesValid) throw new Error("Each source must contain string id and text fields");
  const writer = gateWriterDraftForIndependentAudit(modelOutput(envelope.writerRawOutput, "writerRawOutput"));
  const result = gateEditorHandoff(
    modelOutput(envelope.rawOutput, "rawOutput"),
    writer,
    envelope.sources as EditorialSource[],
  );
  console.log(JSON.stringify({ writerAccepted: writer.acceptedForEditor, ...result }, null, 2));
  if (!result.acceptedForHumanReview) process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
