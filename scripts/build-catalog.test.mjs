import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { assemble, CatalogError, FLOOR_DATE, readSite, render, validateCatalog } from "./build-catalog.mjs";

const SCRIPT = fileURLToPath(new URL("./build-catalog.mjs", import.meta.url));
const REPO = path.resolve(path.dirname(SCRIPT), "..");

function pack(slug, { audience = "People who need it.", importEvidence = true } = {}) {
  return {
    identity: { slug, audience },
    job: { outcome: `Do the ${slug} job.`, inputs: ["An input"], outputs: ["An output"], exampleRequests: ["Try this."], firstMission: "A small first test." },
    instructions: { durableRoleAndBoundaries: `You are ${slug}.\nAsk before acting.` },
    controls: { riskLevel: "Moderate", requiresApproval: ["Ask before sending"], prohibited: ["Do not publish"] },
    skills: [{ name: `${slug} core Skill`, whenToUse: "When asked.", steps: Array.from({ length: 14 }, (_, i) => `Step ${i + 1}.`) }],
    routines: [{ trigger: "Run when I ask.", activationStatus: "manual-test-required" }],
    platforms: { hermes: importEvidence ? { importEvidence: { hermesVersion: "0.21.0", testedDate: "2026-09-04" } } : {} },
  };
}

/** A tiny site working tree with the files the script reads. */
function fixtureSite({ crewMember = "scout" } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "catalog-site-"));
  const put = (rel, data) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), typeof data === "string" ? data : JSON.stringify(data, null, 2));
  };
  put("public/api/v2/bots.json", { bots: [
    { slug: "scout", name: "Scout", title: "Topic finder", category: "research", summary: "Finds topics." },
    { slug: "ops", name: "Ops", title: "Operations helper", category: "technical", summary: "Checks systems." },
    { slug: "daily-newspaper", name: "Daily Newspaper", title: "Morning edition", category: "writing", summary: "Makes a page." },
  ] });
  put("public/downloads/portable-bot-packs/v2/scout.json", pack("scout"));
  put("public/downloads/portable-bot-packs/v2/ops.json", pack("ops", { importEvidence: false }));
  put("public/downloads/portable-bot-packs/v2/daily-newspaper.json", pack("daily-newspaper"));
  put("src/data/starter-bots.ts", `export type StarterBot = {\n  slug: string;\n};\nexport const STARTER_BOTS = [\n  {\n    slug: "scout",\n    worksWith: ["ops", "daily-newspaper"],\n  },\n  {\n    slug: "ops",\n    worksWith: ["scout"],\n  },\n];\nconst extra = {\n  "slug": "daily-newspaper",\n  "inspiredBy": { "creator": "Karen X. Cheng", "work": "The Morning Newspaper", "href": "https://x.ai/bot/marketplace/bots/the-morning-newspaper" },\n  "worksWith": [],\n};\n`);
  put("src/data/bot-release-evidence.ts", `export const REPRODUCED_BOT_EVIDENCE: Record<string, {\n  proofSlug: string;\n}> = {\n  scout: { hermesVersion: "0.21.1", testedDate: "2026-09-09", proofSlug: "scout-run" },\n};\n\nexport const BOT_RUNTIME_EVIDENCE: Record<string, {\n  summary: string;\n}> = {\n  "daily-newspaper": {\n    testedDate: "2026-09-20",\n    summary: "One run passed.",\n  },\n};\n`);
  put("src/data/use-cases.ts", `export const BOT_USE_CASES: BotUseCase[] = [\n  {\n    slug: "morning-paper",\n    title: "Morning paper",\n    outcome: "A one-page \\"edition\\" each morning.",\n    botSlugs: ["daily-newspaper"],\n    optionalBotSlugs: ["scout"],\n    firstTest: "Make one page from fictional notes.",\n  },\n];\n`);
  put("public/downloads/crew-kits/bundles/news-desk.json", {
    slug: "news-desk", name: "News Desk", runtimeStatus: "not-tested",
    members: [{ slug: crewMember, name: "Scout", responsibility: "Find the topic." }],
    handoffOrder: [{ timing: "Find", action: "Pick a topic.", owner: "Scout" }, { timing: "Approve", action: "Say yes or no.", owner: "Person" }],
    approvalActions: ["Send the issue"], prohibitedActions: ["Publish without approval"],
  });
  put("public/downloads/crew-kits/news-desk.md", "# News Desk — Crew Kit\n\nFind a topic and stop for approval.\n\nMore text.\n");
  return root;
}

const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });

test("builds a valid catalog from the working tree, mirroring the plugin's tools", () => {
  const root = fixtureSite();
  try {
    const body = readSite(root);
    const { doc } = assemble(body, { today: "2026-10-07", commit: "abc1234 2026-10-07" });
    const [scout, ops, paper] = doc.bots;
    assert.equal(doc.origin, "https://botcabinet.com");
    assert.equal(scout.summary, "Finds topics.", "the one-line summary keeps its period, as published");
    assert.equal(scout.outcome, "Do the scout job", "outcome loses its trailing period");
    assert.equal(scout.audience, "People who need it");
    assert.deepEqual(scout.worksWith, ["ops", "daily-newspaper"]);
    assert.equal(scout.role, "You are scout.\nAsk before acting.");
    assert.equal(scout.skills[0].steps.length, 12, "skill steps are capped at 12");
    assert.deepEqual(scout.routine, { trigger: "Run when I ask.", activation: "manual-test-required" });
    assert.deepEqual(scout.test, { status: "tested", line: "Two recorded task runs passed" });
    assert.deepEqual(ops.test, { status: "not-tested", line: "Prepared, but not yet task-tested" });
    assert.equal(ops.credits.length, 1, "Ops carries the Muse at Work credit");
    assert.deepEqual(paper.test, { status: "tested", line: "One recorded task run is available" });
    assert.deepEqual(paper.credits, [{ line: "Inspired by Karen X. Cheng's The Morning Newspaper", href: "https://x.ai/bot/marketplace/bots/the-morning-newspaper" }]);
    assert.equal(doc.crews[0].summary, "Find a topic and stop for approval");
    assert.equal(doc.crews[0].handoffOrder[0].action, "Pick a topic");
    assert.equal(doc.crews[0].href, "https://botcabinet.com/crew-kits/news-desk/");
    assert.deepEqual(doc.jobs, [{ slug: "morning-paper", title: "Morning paper", outcome: "A one-page \"edition\" each morning.",
      firstTest: "Make one page from fictional notes.", botSlugs: ["daily-newspaper"], optionalBotSlugs: ["scout"] }]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI writes public/catalog.json and leaves it alone when nothing changed", () => {
  const root = fixtureSite();
  try {
    const out = path.join(root, "public/catalog.json");
    assert.equal(run("--site", root).status, 0);
    const first = readFileSync(out, "utf8");
    const doc = JSON.parse(first);
    assert.equal(doc.siteCommit, "unknown", "no git repository means siteCommit is unknown");
    assert.equal(run("--check", out).status, 0);
    // Pretend the file was made earlier: same content, older date. A rebuild must not touch it.
    writeFileSync(out, render({ ...doc, generatedAt: FLOOR_DATE }));
    const again = run("--site", root);
    assert.equal(again.status, 0);
    assert.match(again.stdout, /unchanged/);
    assert.equal(JSON.parse(readFileSync(out, "utf8")).generatedAt, FLOOR_DATE);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("refuses, writes nothing and exits non-zero when the result would be invalid", () => {
  const root = fixtureSite({ crewMember: "ghost" });
  try {
    const res = run("--site", root);
    assert.notEqual(res.status, 0);
    assert.match(res.stderr, /'ghost' is not a Bot in this catalog/);
    assert.equal(existsSync(path.join(root, "public/catalog.json")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("refuses when a source file is missing", () => {
  const root = fixtureSite();
  try {
    rmSync(path.join(root, "public/api/v2/bots.json"));
    const res = run("--site", root);
    assert.notEqual(res.status, 0);
    assert.match(res.stderr, /public\/api\/v2\/bots\.json: missing/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("generatedAt never goes back and never precedes the plugin's saved copy", () => {
  const body = readSiteOnce();
  const previous = { ...assemble(body, { today: "2026-12-01", commit: "x" }).doc, jobs: [] };
  const { doc, changed } = assemble(body, { today: "2026-11-01", commit: "y", previous });
  assert.equal(changed, true);
  assert.equal(assemble(body, { today: "2026-11-01", commit: "y", previous }).doc.generatedAt, "2026-12-01");
  assert.ok(doc.generatedAt >= FLOOR_DATE);
  assert.throws(() => assemble(body, { today: "2026-09-30", commit: "z" }), CatalogError);
});

test("the checker refuses hidden characters, unknown keys and off-site links", () => {
  const { doc } = assemble(readSiteOnce(), { today: "2026-10-07", commit: "x" });
  const bad = structuredClone(doc);
  bad.bots[0].name = "Sc‮out";
  bad.bots[1].extra = true;
  bad.bots[2].href = "https://example.com/bots/x/";
  const err = (() => { try { validateCatalog(bad); } catch (e) { return e; } })();
  assert.ok(err instanceof CatalogError);
  assert.equal(err.problems.length, 3, err.problems.join("\n"));
});

test("this site's own files build a catalog the plugin's checker accepts", { skip: !existsSync(path.join(REPO, "public/api/v2/bots.json")) }, () => {
  const { doc } = assemble(readSite(REPO), { today: new Date().toISOString().slice(0, 10), commit: "test" });
  assert.ok(doc.bots.length >= 1);
  const checker = path.join(process.env.HOME ?? "", "products/bot-cabinet-v2/tools/make_site_catalog.py");
  if (!existsSync(checker)) return; // the plugin is only on Damon's machine
  const dir = mkdtempSync(path.join(tmpdir(), "catalog-check-"));
  try {
    writeFileSync(path.join(dir, "catalog.json"), render(doc));
    execFileSync("/usr/bin/python3", [checker, "--check", path.join(dir, "catalog.json")], { encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

let cached;
function readSiteOnce() {
  if (!cached) {
    const root = fixtureSite();
    try { cached = readSite(root); } finally { rmSync(root, { recursive: true, force: true }); }
  }
  return cached;
}
