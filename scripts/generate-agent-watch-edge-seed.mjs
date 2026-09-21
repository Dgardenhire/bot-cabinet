import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const source = await readFile(path.join(root, "src/data/agent-watch.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const compiledModule = { exports: {} };
new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
const items = compiledModule.exports.AGENT_WATCH_ITEMS;
const output = [
  "// Generated from src/data/agent-watch.ts. Do not edit by hand.",
  'import type { AgentWatchItem } from "./core.ts";',
  "",
  `export const AGENT_WATCH_SEED: AgentWatchItem[] = ${JSON.stringify(items, null, 2)};`,
  "",
].join("\n");
await writeFile(path.join(root, "supabase/functions/agent-watch/seed.ts"), output, "utf8");
process.stdout.write(`Generated Agent Watch Edge seed with ${items.length} items.\n`);
