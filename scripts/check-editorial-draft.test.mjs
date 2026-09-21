import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("editorial CLI runs and rejects short or malformed handoffs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "botcabinet-editorial-cli-"));
  try {
    const file = path.join(root, "draft.json");
    for (const count of [191, 250]) {
      await writeFile(file, JSON.stringify({ newsletter: Array(count).fill("word").join(" "), social: "Draft" }));
      const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
      assert.equal(result.status, count === 250 ? 0 : 1, result.stderr);
      assert.equal(JSON.parse(result.stdout).newsletterWords, count);
      assert.equal(JSON.parse(result.stdout).factualAccuracyVerified, false);
    }
    await writeFile(file, JSON.stringify({
      newsletter: Array(191).fill("word").join(" "),
      social: "Draft",
      lengthException: {
        reason: "source-shortfall",
        explanation: "The approved packet cannot support 250 words without padding.",
      },
    }));
    const shortfall = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(shortfall.status, 0, shortfall.stderr);
    assert.equal(JSON.parse(shortfall.stdout).newsletterLengthDisposition, "declared-source-shortfall");
    assert.equal(JSON.parse(shortfall.stdout).sourceShortfallVerified, false);

    await writeFile(file, JSON.stringify({
      newsletter: "",
      social: "Draft",
      lengthException: { reason: "source-shortfall", explanation: "No facts." },
    }));
    const emptyShortfall = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(emptyShortfall.status, 1);

    await writeFile(file, JSON.stringify({ newsletter: Array(250).fill("word").join(" "), social: "Draft", lengthException: null }));
    const inRange = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(inRange.status, 0, inRange.stderr);

    await writeFile(file, JSON.stringify({
      newsletter: Array(250).fill("word").join(" "),
      social: "Draft",
      lengthException: { reason: "source-shortfall", explanation: "Contradicts the measured range." },
    }));
    const contradictory = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(contradictory.status, 1);
    assert.equal(JSON.parse(contradictory.stdout).lengthExceptionConsistent, false);

    await writeFile(file, JSON.stringify({ newsletter: 250, social: "Draft" }));
    const malformed = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-editorial-draft.ts", file], { encoding: "utf8", timeout: 10000 });
    assert.equal(malformed.status, 1);
    assert.match(malformed.stderr, /Expected newsletter and social string fields/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
