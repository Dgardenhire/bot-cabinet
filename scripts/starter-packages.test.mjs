import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFile = promisify(execFileCallback);
const root = path.join(process.cwd(), "public/downloads/starter-bots");
const grokRoot = path.join(process.cwd(), "public/downloads/grok-bot-templates");
const portableRoot = path.join(process.cwd(), "public/downloads/portable-bot-packs");
const expectedFiles = ["BOT-PASSPORT.md", "LICENSE", "README.md", "SOUL.md", "distribution.yaml", "profile.yaml"];
const expectedStarterCount = 16;

test("starter downloads contain only the reviewed source files and match the loose copies", async () => {
  const entries = await readdir(root, { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  assert.equal(slugs.length, expectedStarterCount);

  for (const slug of slugs) {
    const zipPath = path.join(root, `${slug}.zip`);
    const { stdout } = await execFile("unzip", ["-Z1", zipPath]);
    const zipEntries = stdout.trim().split("\n").sort();
    assert.deepEqual(zipEntries, expectedFiles, `${slug} contains unexpected ZIP entries`);

    for (const file of expectedFiles) {
      const loose = await readFile(path.join(root, slug, file));
      const { stdout: zipped } = await execFile("unzip", ["-p", zipPath, file], {
        encoding: "buffer",
        maxBuffer: 1024 * 1024,
      });
      assert.deepEqual(zipped, loose, `${slug}/${file} differs from its ZIP copy`);
    }

    const archivePath = path.join(root, `${slug}.tar.gz`);
    const { stdout: tarListing } = await execFile("tar", ["-tzf", archivePath]);
    const tarEntries = tarListing.trim().split("\n").filter((entry) => !entry.endsWith("/"));
    assert.deepEqual(
      tarEntries.sort(),
      expectedFiles.map((file) => `${slug}/${file}`).sort(),
      `${slug} contains unexpected Hermes profile archive entries`,
    );
    for (const file of expectedFiles) {
      const loose = await readFile(path.join(root, slug, file));
      const { stdout: archived } = await execFile("tar", ["-xOzf", archivePath, `${slug}/${file}`], {
        encoding: "buffer",
        maxBuffer: 1024 * 1024,
      });
      assert.deepEqual(archived, loose, `${slug}/${file} differs from its profile archive copy`);
    }

    const manifest = await readFile(path.join(root, slug, "distribution.yaml"), "utf8");
    assert.match(manifest, new RegExp(`^name: ${slug}$`, "m"));
    assert.match(manifest, /^hermes_requires: ">=0\.20\.0"$/m);
    assert.match(manifest, /distribution_owned:\n  - profile\.yaml\n  - SOUL\.md\n  - README\.md\n  - BOT-PASSPORT\.md\n  - LICENSE/);
    assert.doesNotMatch(manifest, /\.\.\/|\/Users\/|~\//);

    const readme = await readFile(path.join(root, slug, "README.md"), "utf8");
    assert.match(
      readme,
      /This LINCHPIN starter package contains profile metadata, role instructions, a Bot Passport, setup documentation, a package manifest, and a license\./,
    );
    assert.match(readme, /## Who this helps/);
    assert.match(readme, /## Intended output/);
    assert.match(
      readme,
      /On August 28, 2026, Bot Cabinet confirmed that the ZIP and Hermes profile archive contain the six listed files and match the readable copies\./,
    );
    assert.match(readme, /The \.tar\.gz download is a Hermes profile archive\./);
    assert.match(readme, /## Set it up in Hermes Desktop/);
    assert.match(readme, /## Tools and connections to review in Hermes Desktop/);
    assert.doesNotMatch(readme, /saniti[sz](?:e|ed|ation)/i);
    assert.doesNotMatch(readme, /not an export|memories, sessions|private work|private client information/i);
    assert.doesNotMatch(readme, /## Expected output/);

    const passport = await readFile(path.join(root, slug, "BOT-PASSPORT.md"), "utf8");
    assert.match(passport, /# .+ — Bot Passport/);
    assert.match(passport, /## What requires approval/);
    assert.match(passport, /technical sandbox/i);

    const soul = await readFile(path.join(root, slug, "SOUL.md"), "utf8");
    assert.match(soul, /## Approval and decision rules/);
    assert.match(soul, /\b(?:person|ask|approval|approve)\b/i);
    assert.match(soul, /## Prohibited actions and uncertainty handling/);

    const profile = await readFile(path.join(root, slug, "profile.yaml"), "utf8");
    assert.match(profile, /^display_name: /m);
    assert.match(profile, /^description: /m);
    assert.match(profile, /^description_auto: false$/m);
  }
});

test("every starter Bot has a portable Grok Bot adaptation brief", async () => {
  const entries = (await readdir(grokRoot)).filter((entry) => entry.endsWith(".md"));
  assert.equal(entries.length, expectedStarterCount);
  for (const entry of entries) {
    const guide = await readFile(path.join(grokRoot, entry), "utf8");
    assert.match(guide, /— Build brief for Grok Bot/);
    assert.match(guide, /Adaptation status: Prepared from the portable recipe; not tested in Grok Bot/);
    assert.match(guide, /## Build it in Grok Bot/);
    assert.match(guide, /## What Grok Bot sharing carries/);
    assert.doesNotMatch(guide, /one-click|install this Grok|import this Grok/i);
  }
});

test("every starter Bot has matching Markdown and JSON portable packs", async () => {
  const entries = await readdir(portableRoot);
  const markdownEntries = entries.filter((entry) => entry.endsWith(".md"));
  const jsonEntries = entries.filter((entry) => entry.endsWith(".json"));
  assert.equal(markdownEntries.length, expectedStarterCount);
  assert.equal(jsonEntries.length, expectedStarterCount);

  for (const entry of markdownEntries) {
    const slug = entry.replace(/\.md$/, "");
    const markdown = await readFile(path.join(portableRoot, entry), "utf8");
    const json = JSON.parse(
      await readFile(path.join(portableRoot, `${slug}.json`), "utf8"),
    );

    assert.match(markdown, /— Portable Bot Pack/);
    assert.match(markdown, /## Reusable Skill recipe/);
    assert.match(markdown, /## Routine recipe/);
    assert.match(markdown, /## Use in Hermes/);
    assert.match(markdown, /## Build in Grok Bot/);
    assert.equal(json.schemaVersion, 1);
    assert.equal(json.bot.slug, slug);
    assert.equal(json.platforms.grokBot.testStatus, "adaptation-prepared-not-tested");
  }
});
