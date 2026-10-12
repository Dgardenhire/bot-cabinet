import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const checker = fileURLToPath(new URL("./check-source-privacy.mjs", import.meta.url));

function runFixture(t, files, afterStage = () => {}) {
  const root = mkdtempSync(path.join(tmpdir(), "source-privacy-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q"], { cwd: root });
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), content);
  }
  execFileSync("git", ["add", "."], { cwd: root });
  afterStage(root);
  return spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
}

test("approved source and public workflow examples remain allowed", (t) => {
  const result = runFixture(t, {
    "docs/PUBLIC-CATALOG.md": "# Public catalog\nA fictional sales workflow.\n",
    "src/app/page.tsx": 'export const title = "Newsletter signup";\n',
    ".env.example": "PUBLIC_ENDPOINT=https://example.com\n",
  });
  assert.equal(result.status, 0, result.stderr);
});

test("unreviewed documentation is blocked without printing its contents", (t) => {
  const result = runFixture(t, { "docs/planning-record.md": "DO_NOT_PRINT_THIS_FIXTURE" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /documentation requires owner review/);
  assert.doesNotMatch(result.stderr, /DO_NOT_PRINT_THIS_FIXTURE/);
  assert.doesNotMatch(result.stderr, /planning-record\.md/);
});

test("private directories and environment files are blocked even when force-added", (t) => {
  const result = runFixture(t, {
    "private/report.json": "{}",
    "notes/internal/report.md": "# Sample",
    ".env.production": "FIXTURE_ONLY=value",
    ".envrc": "export FIXTURE_ONLY=value",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /private working material/);
  assert.match(result.stderr, /environment configuration/);
});

test("staged private content cannot be hidden by an unstaged clean replacement", (t) => {
  const result = runFixture(t, {
    "notes.md": "Classification: confidential\nSample fixture.\n",
  }, (root) => writeFileSync(path.join(root, "notes.md"), "# Public example\n"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /non-public classification/);
});

test("Markdown heading and emphasis classification labels are blocked", (t) => {
  const result = runFixture(t, {
    "notes.md": "# Internal-only\nSample fixture.\n",
    "report.md": "**Classification: confidential**\nSample fixture.\n",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /non-public classification/);
});

test("force-added shell environment configuration is blocked", (t) => {
  const result = runFixture(t, { ".envrc": "export FIXTURE_ONLY=value" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /environment configuration/);
});

test("internal classification is blocked even after a file is renamed", (t) => {
  const result = runFixture(t, {
    "docs/PUBLIC-CATALOG.md": "# Sample\nThis is an internal evidence record.\n",
    "notes.md": "Classification: confidential\nSample fixture.\n",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /non-public classification/);
});

test("the check fails closed outside a Git checkout", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "source-privacy-no-git-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unable to inspect tracked source/);
});

test("privacy validation is part of both verification commands and CI", () => {
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  for (const name of ["verify:ci", "verify:release"]) {
    assert.match(pkg.scripts[name], /npm run check:source-privacy/);
  }
  const workflow = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.ok(workflow.indexOf("node scripts/release/check-source-privacy.mjs") < workflow.indexOf("npm ci"));
  assert.match(workflow, /node scripts\/release\/check-source-privacy\.mjs/);
});
