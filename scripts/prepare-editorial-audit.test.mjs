import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("prepares the exact deterministic assertions an Editor must audit", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "botcabinet-editorial-segments-"));
  try {
    const file = path.join(root, "draft.json");
    await writeFile(file, JSON.stringify({
      newsletter: "Registration opens October 1. The link is missing.",
      social: "Free admission. 24 capacity. Bring one item.",
    }));
    const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/prepare-editorial-audit.ts", file], {
      encoding: "utf8",
      timeout: 10000,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), {
      newsletterAssertions: ["Registration opens October 1.", "The link is missing."],
      socialAssertions: ["Free admission. 24 capacity.", "Bring one item."],
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("prepares exact evidence options when original sources are supplied", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "botcabinet-editorial-evidence-"));
  try {
    const file = path.join(root, "draft.json");
    await writeFile(file, JSON.stringify({
      newsletter: "Reservations open October 27.",
      social: "Reservations open Oct 27.",
      sources: [{ id: "S1", text: "Reservations open October 27 through an online catalog, but the URL is missing." }],
    }));
    const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/prepare-editorial-audit.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).evidenceOptions, [{
      evidenceId: "S1-1",
      sourceId: "S1",
      originalSourcePassage: "Reservations open October 27 through an online catalog, but the URL is missing.",
    }]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
