import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

function run(file) {
  return spawnSync(process.execPath, ["--import", "tsx", "scripts/check-publishing-handoff.ts", file], {
    cwd: projectRoot,
    encoding: "utf8",
  });
}

test("Publishing Desk CLI fails closed before Editor on a contradictory Writer handoff", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "publishing-handoff-"));
  try {
    const rawOutput = JSON.stringify({
      newsletter: Array.from({ length: 360 }, (_, index) => `fact${index}`).join(" "),
      social: "A bounded social draft.",
      lengthException: { reason: "source-shortfall", explanation: "Contradicts the measured range." },
      reviewNotes: ["Human approval pending."],
    });
    const file = path.join(root, "writer-envelope.json");
    await writeFile(file, JSON.stringify({ stage: "writer", rawOutput }));
    const result = run(file);
    assert.equal(result.status, 1);
    const output = JSON.parse(result.stdout);
    assert.equal(output.acceptedForEditor, false);
    assert.match(output.issues.join("\n"), /deterministic length\/shortfall contract/);
    assert.equal(output.humanApproved, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
