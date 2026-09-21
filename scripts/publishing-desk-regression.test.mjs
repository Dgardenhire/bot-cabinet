import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const auditPath = "public/proof-room/publishing-desk/failed-writer-audit.json";
const resultPath = "public/proof-room/publishing-desk/audit-gate-result.json";

test("the preserved Publishing Desk failure is blocked by the current audit gate", async () => {
  const audit = JSON.parse(await readFile(auditPath, "utf8"));
  const expected = JSON.parse(await readFile(resultPath, "utf8"));
  const sourcePacket = await readFile("public/proof-room/publishing-desk/source-packet.md", "utf8");
  const failedDraft = await readFile("public/proof-room/publishing-desk/failed-writer-newsletter.md", "utf8");

  assert.ok(failedDraft.includes(audit.draft), "published failed draft must match the audited body");
  for (const source of audit.sources) {
    assert.ok(sourcePacket.includes(source.text), `published packet must contain ${source.id}`);
  }

  const run = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-audit.ts", auditPath], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(run.status, 1, "unsupported baseline must remain blocked");
  assert.equal(run.stderr, "");
  assert.deepEqual(JSON.parse(run.stdout), expected);
  assert.equal(expected.quotationsVerified, true);
  assert.equal(expected.noUnsupportedAssertions, false);
  assert.equal(expected.semanticSupportVerified, false);
  assert.equal(expected.factualAccuracyVerified, false);
  assert.equal(expected.humanApproved, false);
});
