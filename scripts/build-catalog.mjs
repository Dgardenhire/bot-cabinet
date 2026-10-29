#!/usr/bin/env node
// Builds public/catalog.json, the file Cabinet (the Bot Cabinet Hermes plugin) fetches from
// https://botcabinet.com/catalog.json. Schema version 2, as described in the plugin's
// docs/site-catalog-contract.md.
//
//   node scripts/build-catalog.mjs                    # write public/catalog.json
//   node scripts/build-catalog.mjs --check <file>     # check a file the way Cabinet does, change nothing
//   node scripts/build-catalog.mjs --site <dir> --out <file>
//
// It reads this site's WORKING TREE (not git), the same files the plugin's tools/make_site_data.py and
// tools/make_catalog.py read with `git show`:
//   public/api/v2/bots.json, public/downloads/portable-bot-packs/v2/<slug>.json,
//   public/downloads/crew-kits/bundles/*.json and public/downloads/crew-kits/<slug>.md,
//   src/data/starter-bots.ts (worksWith, inspiredBy), src/data/bot-release-evidence.ts (test status),
//   src/data/use-cases.ts (job guides).
// Run it after the steps that generate those files.
//
// Every field is checked against the same rules Cabinet applies (a port of the plugin's catalog_schema.py).
// If anything fails, nothing is written and the script exits non-zero with a plain list of problems.
// If the bots, crews and jobs are unchanged from the existing file, the file is left as it is, so
// generatedAt only moves when the content does. generatedAt never goes back past FLOOR_DATE, the date of
// the snapshot bundled in the plugin, because Cabinet refuses a file older than the copy it holds.
// No dependencies beyond Node itself.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ORIGIN = "https://botcabinet.com";
export const SOURCE = "botcabinet.com site repository (Damon Gardenhire, MIT)";
export const FLOOR_DATE = "2026-10-02"; // the plugin's bundled snapshot (data/catalog.json)
const MAX_SKILL_STEPS = 12;

// Outside work a Bot's skill adapts (mirrors EXTRA_CREDITS in the plugin's tools/make_site_data.py).
const EXTRA_CREDITS = {
  ops: [{
    line: "Its Diagnose a bad AI result Skill is based on Diagnose My Agent's Mistake, listed on Muse at Work",
    href: "https://museatwork.app/#w=1d0661a5-1cf7-4013-9aff-9cf605bcbe8c",
  }],
};

// ---------------------------------------------------------------------------------------------------
// Reading the site

const stripPeriod = (s) => (typeof s === "string" && s.endsWith(".") && !s.endsWith("..") ? s.slice(0, -1) : s);

function readText(root, rel) {
  const file = path.join(root, rel);
  if (!existsSync(file)) throw new CatalogError([`${rel}: missing (run the content generators first)`]);
  return readFileSync(file, "utf8");
}

function readJson(root, rel) {
  const text = readText(root, rel);
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new CatalogError([`${rel}: not valid JSON (${err.message})`]);
  }
}

/** Each starter Bot's source block in starter-bots.ts, keyed by slug (TS and JSON-style entries). */
export function starterBlocks(text) {
  const marks = [...text.matchAll(/^\s*"?slug"?:\s*"([a-z0-9-]+)"/gm)].map((m) => [m.index, m[1]]);
  const blocks = {};
  marks.forEach(([start, slug], i) => {
    const end = i + 1 < marks.length ? marks[i + 1][0] : text.length;
    if (!(slug in blocks)) blocks[slug] = text.slice(start, end);
  });
  return blocks;
}

function unescapeTs(raw) {
  return JSON.parse(`"${raw}"`);
}

/** A list of string literals for `key: [ ... ]` in a TS or JSON-style block. */
export function tsList(block, key) {
  const m = block.match(new RegExp(`"?\\b${key}"?:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => unescapeTs(x[1])) : [];
}

/** The first `key: "..."` string literal in a block, unescaped. */
export function tsString(block, key) {
  const m = block.match(new RegExp(`"?\\b${key}"?:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? unescapeTs(m[1]) : "";
}

function inspiredBy(block) {
  const m = block.match(/"?inspiredBy"?:\s*\{([^}]*)\}/);
  if (!m) return null;
  return { creator: tsString(m[1], "creator"), work: tsString(m[1], "work"), href: tsString(m[1], "href") };
}

/** Slugs in an exported `NAME ... = { ... };` record, at the record's top level (two-space indent). */
export function recordKeys(text, name) {
  const at = text.indexOf(name);
  if (at < 0) throw new CatalogError([`src/data/bot-release-evidence.ts: ${name} not found`]);
  const open = text.indexOf("= {", at);
  const close = text.indexOf("\n};", open);
  if (open < 0 || close < 0) throw new CatalogError([`src/data/bot-release-evidence.ts: could not read ${name}`]);
  const body = text.slice(open + 3, close);
  return new Set([...body.matchAll(/^ {2}"?([a-z0-9-]+)"?:\s*\{/gm)].map((m) => m[1]));
}

/** The site's own test status for one Bot (src/lib/bot-status-copy.ts, as make_site_data.py reads it). */
function botTest(slug, pack, reproduced, runtime) {
  const imported = Boolean(pack?.platforms?.hermes?.importEvidence);
  if (runtime.has(slug)) return { status: "tested", line: "One recorded task run is available" };
  if (reproduced.has(slug)) return { status: "tested", line: "Two recorded task runs passed" };
  return {
    status: "not-tested",
    line: imported ? "Hermes archive import checked; a full task run is still pending" : "Prepared, but not yet task-tested",
  };
}

export function readJobs(text) {
  const at = text.indexOf("export const BOT_USE_CASES");
  if (at < 0) throw new CatalogError(["src/data/use-cases.ts: BOT_USE_CASES not found"]);
  const chunks = text.slice(at).split(/\n {2}\{\n(?= {4}slug:)/).slice(1);
  return chunks
    .map((chunk) => ({
      slug: tsString(chunk, "slug"),
      title: tsString(chunk, "title"),
      outcome: tsString(chunk, "outcome"),
      botSlugs: tsList(chunk, "botSlugs"),
      optionalBotSlugs: tsList(chunk, "optionalBotSlugs"),
      firstTest: tsString(chunk, "firstTest"),
    }))
    .filter((j) => j.slug);
}

/** The catalog body (bots, crews, jobs) from a site working tree. Throws CatalogError on missing input. */
export function readSite(root) {
  const api = readJson(root, "public/api/v2/bots.json");
  if (!Array.isArray(api.bots)) throw new CatalogError(["public/api/v2/bots.json: no bots list"]);
  const starters = starterBlocks(readText(root, "src/data/starter-bots.ts"));
  const evidence = readText(root, "src/data/bot-release-evidence.ts");
  const reproduced = recordKeys(evidence, "REPRODUCED_BOT_EVIDENCE");
  const runtime = recordKeys(evidence, "BOT_RUNTIME_EVIDENCE");

  const bots = [];
  const names = {};
  for (const entry of api.bots) {
    const slug = entry.slug;
    const pack = readJson(root, `public/downloads/portable-bot-packs/v2/${slug}.json`);
    const block = starters[slug] ?? "";
    const credits = [];
    const credit = inspiredBy(block);
    if (credit) credits.push({ line: `Inspired by ${credit.creator}'s ${credit.work}`, href: credit.href });
    credits.push(...(EXTRA_CREDITS[slug] ?? []));
    const routine = (pack.routines ?? [])[0];
    bots.push({
      slug,
      name: entry.name,
      title: entry.title,
      category: entry.category,
      summary: entry.summary,
      audience: stripPeriod(pack.identity?.audience ?? ""),
      outcome: stripPeriod(pack.job?.outcome),
      inputs: pack.job?.inputs,
      outputs: pack.job?.outputs,
      examples: pack.job?.exampleRequests ?? [],
      firstMission: pack.job?.firstMission,
      approvals: pack.controls?.requiresApproval,
      offLimits: pack.controls?.prohibited,
      worksWith: tsList(block, "worksWith"),
      role: pack.instructions?.durableRoleAndBoundaries,
      riskLevel: pack.controls?.riskLevel ?? "",
      href: `${ORIGIN}/bots/${slug}/`,
      skills: (pack.skills ?? []).map((s) => ({
        name: s.name,
        whenToUse: s.whenToUse ?? "",
        steps: (s.steps ?? []).slice(0, MAX_SKILL_STEPS),
      })),
      routine: routine ? { trigger: routine.trigger, activation: routine.activationStatus ?? "manual-test-required" } : null,
      credits,
      test: botTest(slug, pack, reproduced, runtime),
    });
    names[slug] = entry.name;
  }

  const bundleDir = "public/downloads/crew-kits/bundles";
  if (!existsSync(path.join(root, bundleDir))) throw new CatalogError([`${bundleDir}: missing (run generate:crew-bundles first)`]);
  const crews = readdirSync(path.join(root, bundleDir))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const kit = readJson(root, `${bundleDir}/${file}`);
      const md = readText(root, `public/downloads/crew-kits/${kit.slug}.md`).split(/\r?\n/);
      const summary = md.slice(1).find((line) => line.trim())?.trim() ?? "";
      return {
        slug: kit.slug,
        name: kit.name,
        summary: stripPeriod(summary),
        members: (kit.members ?? []).map((m) => ({
          slug: m.slug,
          name: names[m.slug] ?? m.name,
          responsibility: stripPeriod(m.responsibility),
        })),
        handoffOrder: (kit.handoffOrder ?? []).map((h) => ({ timing: h.timing, action: stripPeriod(h.action), owner: h.owner })),
        approvalActions: kit.approvalActions,
        prohibitedActions: kit.prohibitedActions,
        testStatus: kit.runtimeStatus ?? "not-tested",
        href: `${ORIGIN}/crew-kits/${kit.slug}/`,
      };
    });

  return { bots, crews, jobs: readJobs(readText(root, "src/data/use-cases.ts")) };
}

/** "<short hash> <commit date>", with "+local" when the tree has changes; "unknown" without git. */
export function siteCommit(root, ignore = []) {
  const git = (...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    const [hash, date] = git("log", "-1", "--format=%h %cs").split(" ");
    if (!hash) return "unknown";
    const excludes = ignore.map((p) => `:(exclude)${p}`);
    const dirty = git("status", "--porcelain", "--", ".", ...excludes) !== "";
    return `${hash}${dirty ? "+local" : ""} ${date}`;
  } catch {
    return "unknown";
  }
}

// ---------------------------------------------------------------------------------------------------
// Checking (a port of the plugin's catalog_schema.py; keep the two in step)

export class CatalogError extends Error {
  constructor(problems) {
    super(problems.slice(0, 6).join("; ") + (problems.length > 6 ? `; and ${problems.length - 6} more` : ""));
    this.problems = problems;
  }
}

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;
const TOKEN = /^[a-z][a-z0-9-]{1,40}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const BAD = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/;
const chars = (s) => [...s].length;
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

class Check {
  problems = [];
  bad(where, why) { this.problems.push(`${where}: ${why}`); }

  keys(obj, where, required, optional) {
    if (!isObj(obj)) { this.bad(where, "must be an object"); return false; }
    for (const k of required) if (!(k in obj)) this.bad(where, `missing '${k}'`);
    for (const k of Object.keys(obj)) if (!required.includes(k) && !optional.includes(k)) this.bad(where, `unknown key '${k}'`);
    return required.every((k) => k in obj);
  }

  text(value, where, maxLen, { multiline = false, required = true } = {}) {
    if (typeof value !== "string") { this.bad(where, "must be text"); return ""; }
    if (BAD.test(multiline ? value.replace(/[\n\t]/g, "") : value)) { this.bad(where, "contains control or hidden characters"); return ""; }
    if (!multiline && /[\n\t]/.test(value)) { this.bad(where, "must be one line"); return ""; }
    const out = value.trim();
    if (required && !out) this.bad(where, "must not be empty");
    if (chars(out) > maxLen) { this.bad(where, `is ${chars(out)} characters; the limit is ${maxLen}`); return [...out].slice(0, maxLen).join(""); }
    return out;
  }

  pattern(value, where, rx, what) {
    if (typeof value !== "string" || !rx.test(value)) { this.bad(where, `must be ${what}`); return ""; }
    return value;
  }

  lines(value, where, maxItems, maxLen) {
    if (!Array.isArray(value)) { this.bad(where, "must be a list"); return []; }
    if (value.length > maxItems) this.bad(where, `has ${value.length} items; the limit is ${maxItems}`);
    return value.slice(0, maxItems).map((v, i) => this.text(v, `${where}[${i}]`, maxLen));
  }

  url(value, where, { host } = {}) {
    if (typeof value !== "string" || value.length > 300 || BAD.test(value) || value.includes(" ")) {
      this.bad(where, "must be a web address of at most 300 characters"); return "";
    }
    let u;
    try { u = new URL(value); } catch { u = null; }
    if (!u || u.protocol !== "https:" || !u.hostname || u.username || u.password) {
      this.bad(where, "must be an https address with no login in it"); return "";
    }
    if (host && u.hostname.toLowerCase() !== host) { this.bad(where, `must be on ${host}`); return ""; }
    return value;
  }

  date(value, where) {
    if (typeof value !== "string" || !DATE.test(value)) { this.bad(where, "must be a date like 2026-10-04"); return ""; }
    const d = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) { this.bad(where, "is not a real date"); return ""; }
    return value;
  }
}

const HOST = new URL(ORIGIN).hostname;
const BOT_REQUIRED = ["slug", "name", "title", "category", "summary", "outcome"];
const BOT_OPTIONAL = ["audience", "inputs", "outputs", "examples", "firstMission", "approvals", "offLimits", "worksWith",
  "role", "skills", "routine", "riskLevel", "credits", "href", "test"];
const CREW_REQUIRED = ["slug", "name", "summary", "members", "handoffOrder", "approvalActions", "prohibitedActions", "testStatus"];
const JOB_REQUIRED = ["slug", "title", "outcome", "botSlugs", "optionalBotSlugs", "firstTest"];

function checkBot(c, raw, i) {
  const w = `bots[${i}]`;
  if (!c.keys(raw, w, BOT_REQUIRED, BOT_OPTIONAL)) return {};
  const slug = c.pattern(raw.slug, `${w}.slug`, SLUG, "lowercase letters, numbers and dashes");
  const ww = raw.worksWith ?? [];
  if (!Array.isArray(ww)) c.bad(`${w}.worksWith`, "must be a list");
  const out = {
    slug,
    name: c.text(raw.name, `${w}.name`, 60),
    title: c.text(raw.title, `${w}.title`, 120),
    category: c.pattern(raw.category, `${w}.category`, TOKEN, "a short lowercase word"),
    summary: c.text(raw.summary, `${w}.summary`, 400),
    audience: c.text(raw.audience ?? "", `${w}.audience`, 400, { required: false }),
    outcome: c.text(raw.outcome, `${w}.outcome`, 500),
    inputs: c.lines(raw.inputs ?? [], `${w}.inputs`, 12, 300),
    outputs: c.lines(raw.outputs ?? [], `${w}.outputs`, 12, 300),
    examples: c.lines(raw.examples ?? [], `${w}.examples`, 8, 300),
    firstMission: c.text(raw.firstMission ?? "", `${w}.firstMission`, 500, { required: false }),
    approvals: c.lines(raw.approvals ?? [], `${w}.approvals`, 20, 300),
    offLimits: c.lines(raw.offLimits ?? [], `${w}.offLimits`, 20, 300),
    worksWith: (Array.isArray(ww) ? ww.slice(0, 20) : []).map((s, j) => c.pattern(s, `${w}.worksWith[${j}]`, SLUG, "a Bot slug")),
    role: c.text(raw.role ?? "", `${w}.role`, 4000, { multiline: true, required: false }),
    riskLevel: c.text(raw.riskLevel ?? "", `${w}.riskLevel`, 30, { required: false }),
    href: c.url(raw.href ?? `${ORIGIN}/bots/${slug}/`, `${w}.href`, { host: HOST }),
    skills: [],
    routine: null,
    credits: [],
    test: null,
  };
  const skills = raw.skills ?? [];
  if (!Array.isArray(skills) || skills.length > 8) c.bad(`${w}.skills`, "must be a list of at most 8");
  else skills.forEach((s, j) => {
    const sw = `${w}.skills[${j}]`;
    if (c.keys(s, sw, ["name"], ["whenToUse", "steps"])) {
      out.skills.push({
        name: c.text(s.name, `${sw}.name`, 80),
        whenToUse: c.text(s.whenToUse ?? "", `${sw}.whenToUse`, 400, { required: false }),
        steps: c.lines(s.steps ?? [], `${sw}.steps`, 12, 700),
      });
    }
  });
  const routine = raw.routine ?? null;
  if (routine !== null && c.keys(routine, `${w}.routine`, ["trigger"], ["activation"])) {
    out.routine = {
      trigger: c.text(routine.trigger, `${w}.routine.trigger`, 400),
      activation: c.pattern(routine.activation ?? "manual-test-required", `${w}.routine.activation`, TOKEN, "a short lowercase word"),
    };
  }
  const credits = raw.credits ?? [];
  if (!Array.isArray(credits) || credits.length > 4) c.bad(`${w}.credits`, "must be a list of at most 4");
  else credits.forEach((cr, j) => {
    const cw = `${w}.credits[${j}]`;
    if (c.keys(cr, cw, ["line", "href"], [])) out.credits.push({ line: c.text(cr.line, `${cw}.line`, 240), href: c.url(cr.href, `${cw}.href`) });
  });
  const test = raw.test ?? null;
  if (test !== null && c.keys(test, `${w}.test`, ["status"], ["line"])) {
    out.test = {
      status: c.pattern(test.status, `${w}.test.status`, TOKEN, "a short lowercase word"),
      line: c.text(test.line ?? "", `${w}.test.line`, 300, { required: false }),
    };
  }
  return out;
}

function checkCrew(c, raw, i, botSlugs) {
  const w = `crews[${i}]`;
  if (!c.keys(raw, w, CREW_REQUIRED, ["href"])) return {};
  const slug = c.pattern(raw.slug, `${w}.slug`, SLUG, "lowercase letters, numbers and dashes");
  let members = raw.members;
  if (!Array.isArray(members) || members.length < 1 || members.length > 12) { c.bad(`${w}.members`, "must be a list of 1 to 12"); members = []; }
  const outMembers = [];
  members.forEach((m, j) => {
    const mw = `${w}.members[${j}]`;
    if (c.keys(m, mw, ["slug", "name", "responsibility"], [])) {
      const ms = c.pattern(m.slug, `${mw}.slug`, SLUG, "a Bot slug");
      if (ms && !botSlugs.has(ms)) c.bad(`${mw}.slug`, `'${ms}' is not a Bot in this catalog`);
      outMembers.push({ slug: ms, name: c.text(m.name, `${mw}.name`, 60), responsibility: c.text(m.responsibility, `${mw}.responsibility`, 400) });
    }
  });
  let steps = raw.handoffOrder;
  if (!Array.isArray(steps) || steps.length < 1 || steps.length > 20) { c.bad(`${w}.handoffOrder`, "must be a list of 1 to 20"); steps = []; }
  const outSteps = [];
  steps.forEach((s, j) => {
    const sw = `${w}.handoffOrder[${j}]`;
    if (c.keys(s, sw, ["timing", "action", "owner"], [])) {
      outSteps.push({ timing: c.text(s.timing, `${sw}.timing`, 80), action: c.text(s.action, `${sw}.action`, 400), owner: c.text(s.owner, `${sw}.owner`, 120) });
    }
  });
  return {
    slug,
    name: c.text(raw.name, `${w}.name`, 80),
    summary: c.text(raw.summary, `${w}.summary`, 400),
    members: outMembers,
    handoffOrder: outSteps,
    approvalActions: c.lines(raw.approvalActions, `${w}.approvalActions`, 20, 300),
    prohibitedActions: c.lines(raw.prohibitedActions, `${w}.prohibitedActions`, 20, 300),
    testStatus: c.pattern(raw.testStatus, `${w}.testStatus`, TOKEN, "a short lowercase word"),
    href: c.url(raw.href ?? `${ORIGIN}/crew-kits/${slug}/`, `${w}.href`, { host: HOST }),
  };
}

function checkJob(c, raw, i, botSlugs) {
  const w = `jobs[${i}]`;
  if (!c.keys(raw, w, JOB_REQUIRED, [])) return {};
  const out = {
    slug: c.pattern(raw.slug, `${w}.slug`, SLUG, "lowercase letters, numbers and dashes"),
    title: c.text(raw.title, `${w}.title`, 120),
    outcome: c.text(raw.outcome, `${w}.outcome`, 500),
    firstTest: c.text(raw.firstTest, `${w}.firstTest`, 500),
  };
  for (const key of ["botSlugs", "optionalBotSlugs"]) {
    let value = raw[key];
    if (!Array.isArray(value) || value.length > 12) { c.bad(`${w}.${key}`, "must be a list of at most 12"); value = []; }
    out[key] = value.map((s, j) => c.pattern(s, `${w}.${key}[${j}]`, SLUG, "a Bot slug"));
    for (const s of out[key]) if (s && !botSlugs.has(s)) c.bad(`${w}.${key}`, `'${s}' is not a Bot in this catalog`);
  }
  return out;
}

function unique(c, items, where) {
  const seen = new Set();
  items.forEach((it, i) => {
    if (seen.has(it.slug)) c.bad(`${where}[${i}].slug`, `'${it.slug}' appears twice`);
    seen.add(it.slug);
  });
}

/** A clean copy of doc in Cabinet's field order, or a CatalogError listing every problem. */
export function validateCatalog(doc) {
  const c = new Check();
  const top = ["schemaVersion", "generatedAt", "source", "siteCommit", "origin", "bots", "crews", "jobs"];
  if (!c.keys(doc, "catalog", top, [])) throw new CatalogError(c.problems);
  if (doc.schemaVersion !== 2) { c.bad("schemaVersion", `is ${JSON.stringify(doc.schemaVersion)}; this Cabinet reads version 2`); throw new CatalogError(c.problems); }
  if (doc.origin !== ORIGIN) c.bad("origin", `must be exactly ${ORIGIN}`);
  const lists = {};
  for (const [key, limit] of [["bots", 300], ["crews", 100], ["jobs", 300]]) {
    const v = doc[key];
    if (!Array.isArray(v) || v.length > limit || (key === "bots" && v.length === 0)) {
      c.bad(key, `must be a list of ${key === "bots" ? 1 : 0} to ${limit}`);
      lists[key] = [];
    } else lists[key] = v;
  }
  const bots = lists.bots.map((b, i) => checkBot(c, b, i));
  const slugs = new Set(bots.filter((b) => b.slug).map((b) => b.slug));
  const out = {
    schemaVersion: 2,
    generatedAt: c.date(doc.generatedAt, "generatedAt"),
    source: c.text(doc.source, "source", 200),
    siteCommit: c.text(doc.siteCommit, "siteCommit", 80),
    origin: ORIGIN,
    bots,
    crews: lists.crews.map((x, i) => checkCrew(c, x, i, slugs)),
    jobs: lists.jobs.map((x, i) => checkJob(c, x, i, slugs)),
  };
  unique(c, out.bots, "bots");
  unique(c, out.crews, "crews");
  unique(c, out.jobs, "jobs");
  if (c.problems.length) throw new CatalogError(c.problems);
  return out;
}

export const render = (doc) => `${JSON.stringify(doc, null, 1)}\n`;

// ---------------------------------------------------------------------------------------------------
// Building

export const todayUtc = () => new Date().toISOString().slice(0, 10);

/**
 * The catalog to publish, given the site body and the file already there (or null).
 * Returns { doc, changed }: changed is false when bots, crews and jobs match the previous file,
 * in which case doc is the previous file untouched.
 */
export function assemble(body, { today, commit, previous = null }) {
  if (!DATE.test(today) || today < FLOOR_DATE) {
    throw new CatalogError([`today's date ${today} is before ${FLOOR_DATE}, the plugin's saved copy; check the clock`]);
  }
  const draft = validateCatalog({
    schemaVersion: 2, generatedAt: today, source: SOURCE, siteCommit: commit, origin: ORIGIN, ...body,
  });
  if (previous) {
    let prev = null;
    try { prev = validateCatalog(previous); } catch { prev = null; }
    if (prev && JSON.stringify([prev.bots, prev.crews, prev.jobs]) === JSON.stringify([draft.bots, draft.crews, draft.jobs])) {
      return { doc: prev, changed: false };
    }
    if (prev && prev.generatedAt > draft.generatedAt) draft.generatedAt = prev.generatedAt; // never step back
  }
  return { doc: draft, changed: true };
}

function main(argv) {
  const arg = (flag) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : undefined);
  const here = path.dirname(fileURLToPath(import.meta.url));
  if (argv.includes("--check")) {
    const file = arg("--check");
    try {
      const doc = validateCatalog(JSON.parse(readFileSync(file, "utf8")));
      console.log(`${file}: OK. ${doc.bots.length} Bots, ${doc.crews.length} Crew Kits, ${doc.jobs.length} job guides, generated ${doc.generatedAt}`);
      return 0;
    } catch (err) {
      console.error(`${file}: Cabinet would refuse this file:`);
      for (const p of err.problems ?? [err.message]) console.error(`  - ${p}`);
      return 1;
    }
  }
  const site = path.resolve(arg("--site") ?? path.join(here, ".."));
  const out = path.resolve(arg("--out") ?? path.join(site, "public", "catalog.json"));
  try {
    const previous = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null;
    const relOut = path.relative(site, out).split(path.sep).join("/");
    const commit = siteCommit(site, relOut.startsWith("..") ? [] : [relOut]);
    const { doc, changed } = assemble(readSite(site), { today: todayUtc(), commit, previous });
    if (changed) {
      mkdirSync(path.dirname(out), { recursive: true });
      const tmp = `${out}.tmp`;
      writeFileSync(tmp, render(doc), "utf8");
      renameSync(tmp, out);
    }
    const what = changed ? "wrote" : "unchanged,";
    console.log(`catalog.json: ${what} ${path.relative(process.cwd(), out) || out} (${doc.bots.length} Bots, ${doc.crews.length} Crew Kits, ${doc.jobs.length} job guides, generated ${doc.generatedAt}, ${doc.siteCommit})`);
    return 0;
  } catch (err) {
    console.error("catalog.json was NOT written. Cabinet would refuse it:");
    for (const p of err.problems ?? [err.message]) console.error(`  - ${p}`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
