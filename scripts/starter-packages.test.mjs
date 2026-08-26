import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFile = promisify(execFileCallback);
const root = path.join(process.cwd(), "public/downloads/starter-bots");
const expectedFiles = ["LICENSE", "README.md", "SOUL.md", "distribution.yaml"];
const expectedStarterCount = 16;

test("starter ZIPs contain only the reviewed source files and match the loose copies", async () => {
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

    const manifest = await readFile(path.join(root, slug, "distribution.yaml"), "utf8");
    assert.match(manifest, new RegExp(`^name: ${slug}$`, "m"));
    assert.match(manifest, /distribution_owned:\n  - SOUL\.md\n  - README\.md\n  - LICENSE/);
    assert.doesNotMatch(manifest, /\.\.\/|\/Users\/|~\//);

    const readme = await readFile(path.join(root, slug, "README.md"), "utf8");
    assert.match(
      readme,
      /This LINCHPIN starter package contains role instructions, setup documentation, a package manifest, and a license\./,
    );
    assert.match(readme, /## Who this helps/);
    assert.match(readme, /## Intended output/);
    assert.match(
      readme,
      /On August 25, 2026, the Hermes Bot Registry in Bot Cabinet ran a file-structure test that confirmed this ZIP contains the expected four files and matches the readable copies\./,
    );
    assert.match(readme, /Hermes Desktop does not import it directly/);
    assert.match(readme, /## Set it up in Hermes Desktop/);
    assert.match(readme, /## Tools and connections to review in Hermes Desktop/);
    assert.doesNotMatch(readme, /saniti[sz](?:e|ed|ation)/i);
    assert.doesNotMatch(readme, /not an export|memories, sessions|private work|private client information/i);
    assert.doesNotMatch(readme, /## Expected output/);
  }
});
