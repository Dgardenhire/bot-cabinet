import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), "utf8"));
}

test("generated V2 index resolves every versioned artifact", async () => {
  const index = await readJson("public/api/v2/index.json");
  const catalog = await readJson("public/api/v2/bots.json");
  const schema = await readJson(
    "public/api/v2/portable-bot-pack.schema.json",
  );

  assert.equal(index.apiVersion, 2);
  assert.equal(index.grokImportSupport, false);
  assert.equal(index.routineActivation, "manual-test-required");
  assert.equal(catalog.apiVersion, 2);
  assert.equal(catalog.count, 16);
  assert.equal(catalog.bots.length, catalog.count);
  assert.equal(new Set(catalog.bots.map((bot) => bot.slug)).size, catalog.count);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");

  for (const bot of catalog.bots) {
    const pack = await readJson(`public${bot.portablePack.jsonUrl}`);
    const portableMarkdown = await readFile(
      path.join(projectRoot, `public${bot.portablePack.markdownUrl}`),
      "utf8",
    );
    const grokBrief = await readFile(
      path.join(projectRoot, `public${bot.grokBot.briefUrl}`),
      "utf8",
    );

    assert.equal(pack.schemaVersion, 2);
    assert.equal(pack.packVersion, "2.0.0");
    assert.equal(pack.artifactId, bot.artifactId);
    assert.equal(pack.routines[0].activationStatus, "manual-test-required");
    assert.equal(pack.routines[0].testStatus, "not-tested");
    assert.equal(pack.platforms.hermes.importStatus, "import-test-passed");
    assert.equal(pack.platforms.hermes.importEvidence.hermesVersion, "0.21.0");
    assert.equal(pack.platforms.grokBot.importable, false);
    assert.match(portableMarkdown, /Portable Bot Pack V2/);
    assert.match(grokBrief, /not an import package/i);
    assert.match(grokBrief, /not tested in Grok Bot/i);
    assert.doesNotMatch(grokBrief, /one-click|native package|automatically import/i);

    const expectedHermesFiles = [
      "BOT-PASSPORT.md",
      "LICENSE",
      "README.md",
      "SOUL.md",
      "distribution.yaml",
      "profile.yaml",
      `skills/${bot.slug}-core/SKILL.md`,
    ].sort();
    const archivePath = path.join(
      projectRoot,
      `public${bot.hermes.archiveUrl}`,
    );
    const zipPath = path.join(
      projectRoot,
      `public${bot.hermes.readableFilesUrl}`,
    );
    const [{ stdout: tarOutput }, { stdout: zipOutput }] = await Promise.all([
      execFile("tar", ["-tzf", archivePath]),
      execFile("unzip", ["-Z1", zipPath]),
    ]);
    const tarFiles = tarOutput
      .trim()
      .split("\n")
      .filter((entry) => !entry.endsWith("/"))
      .map((entry) => entry.replace(`${bot.slug}/`, ""))
      .sort();
    const zipFiles = zipOutput.trim().split("\n").sort();

    assert.deepEqual(tarFiles, expectedHermesFiles);
    assert.deepEqual(zipFiles, expectedHermesFiles);
    assert.equal(
      tarFiles.some((file) => /cron|schedule|routine/i.test(file)),
      false,
    );

    const extractionRoot = await mkdtemp(path.join(os.tmpdir(), `bot-pack-${bot.slug}-`));
    const tarRoot = path.join(extractionRoot, "tar");
    const zipRoot = path.join(extractionRoot, "zip");
    await Promise.all([
      mkdir(tarRoot, { recursive: true }),
      mkdir(zipRoot, { recursive: true }),
    ]);
    try {
      await Promise.all([
        execFile("tar", ["-xzf", archivePath, "-C", tarRoot]),
        execFile("unzip", ["-qq", zipPath, "-d", zipRoot]),
      ]);
      for (const relativeFile of expectedHermesFiles) {
        const loose = await readFile(
          path.join(projectRoot, "public/downloads/starter-bots/v2", bot.slug, relativeFile),
        );
        const tarred = await readFile(path.join(tarRoot, bot.slug, relativeFile));
        const zipped = await readFile(path.join(zipRoot, relativeFile));
        assert.deepEqual(tarred, loose, `${bot.slug} tar content differs for ${relativeFile}`);
        assert.deepEqual(zipped, loose, `${bot.slug} zip content differs for ${relativeFile}`);
      }
    } finally {
      await rm(extractionRoot, { recursive: true, force: true });
    }
  }
});

test("generated V1 entry points remain present and version 1", async () => {
  const v1Catalog = await readJson("public/api/v1/bots.json");
  const v1Pack = await readJson(
    "public/downloads/portable-bot-packs/scout.json",
  );

  assert.equal(v1Catalog.schemaVersion, 1);
  assert.equal(v1Pack.schemaVersion, 1);
  assert.equal(v1Pack.packVersion, "1.0.0");
  assert.equal(
    v1Pack.platforms.hermes.profileUrl,
    "/downloads/starter-bots/scout.tar.gz",
  );
  assert.equal(
    v1Pack.platforms.grokBot.briefUrl,
    "/downloads/grok-bot-templates/scout.md",
  );
});
