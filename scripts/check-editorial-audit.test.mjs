import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

function run(file) {
  return spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-audit.ts", file], {
    encoding: "utf8",
    timeout: 10000,
  });
}

test("editorial audit CLI rejects unsupported and incomplete handoffs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "botcabinet-editorial-audit-"));
  try {
    const file = path.join(root, "audit.json");
    const source = { id: "S1", text: "Registration opens October 1. Registration link has NOT been supplied." };
    await writeFile(file, JSON.stringify({
      draft: "Registration opens October 1. The link will arrive tomorrow.",
      sources: [source],
      entries: [{
        exactDraftQuote: "Registration opens October 1.", status: "supported", sourceId: "S1",
        originalSourcePassage: "Registration opens October 1.", explanation: "Exact logistics claim.",
      }],
    }));
    const incomplete = run(file);
    assert.equal(incomplete.status, 1, incomplete.stderr);
    assert.equal(JSON.parse(incomplete.stdout).sentenceCount, 2);

    await writeFile(file, JSON.stringify({
      draft: "Registration opens October 1.",
      sources: [source],
      entries: [{
        exactDraftQuote: "Registration opens October 1.", status: "supported", sourceId: "S1",
        originalSourcePassage: "Registration opens October 1.", explanation: "Exact logistics claim.",
      }],
    }));
    const complete = run(file);
    assert.equal(complete.status, 0, complete.stderr);
    assert.equal(JSON.parse(complete.stdout).noUnsupportedAssertions, true);
    assert.equal(JSON.parse(complete.stdout).factualAccuracyVerified, false);

    await writeFile(file, JSON.stringify({ draft: "Claim.", sources: [], entries: [{ status: "supported" }] }));
    const malformed = run(file);
    assert.equal(malformed.status, 1);
    assert.match(malformed.stderr, /required schema/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
