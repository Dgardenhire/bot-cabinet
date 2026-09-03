import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import { listGeneratedChanges } from "./check-generated.mjs";

const execFile = promisify(execFileCallback);

test("generated drift check catches tracked and untracked output only", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "bot-cabinet-generated-check-"));
  const generated = path.join(root, "public/api/v1/bots.json");
  const feed = path.join(root, "public/feed.xml");
  const llms = path.join(root, "public/llms.txt");
  const unrelated = path.join(root, "notes.md");

  await mkdir(path.dirname(generated), { recursive: true });
  await writeFile(generated, "{}\n", "utf8");
  await writeFile(feed, "<rss />\n", "utf8");
  await writeFile(llms, "# Fixture\n", "utf8");
  await writeFile(unrelated, "initial\n", "utf8");
  await execFile("git", ["init", "-q"], { cwd: root });
  await execFile("git", ["config", "user.email", "test@example.com"], {
    cwd: root,
  });
  await execFile("git", ["config", "user.name", "Test"], { cwd: root });
  await execFile("git", ["add", "."], { cwd: root });
  await execFile("git", ["commit", "-qm", "fixture"], { cwd: root });

  assert.deepEqual(await listGeneratedChanges(root), []);

  await writeFile(unrelated, "changed\n", "utf8");
  assert.deepEqual(await listGeneratedChanges(root), []);

  await writeFile(generated, '{"changed":true}\n', "utf8");
  assert.deepEqual(await listGeneratedChanges(root), ["M public/api/v1/bots.json"]);

  await mkdir(path.join(root, "public/downloads/starter-bots"), {
    recursive: true,
  });
  await writeFile(
    path.join(root, "public/downloads/starter-bots/new.txt"),
    "new\n",
    "utf8",
  );
  assert.deepEqual(await listGeneratedChanges(root), [
    "M public/api/v1/bots.json",
    "?? public/downloads/starter-bots/new.txt",
  ]);

  await writeFile(feed, "<rss version=\"2.0\" />\n", "utf8");
  await writeFile(llms, "# Updated fixture\n", "utf8");
  assert.deepEqual(await listGeneratedChanges(root), [
    "M public/api/v1/bots.json",
    "M public/feed.xml",
    "M public/llms.txt",
    "?? public/downloads/starter-bots/new.txt",
  ]);
});
