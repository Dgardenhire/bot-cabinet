import { mkdir, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { build } from "esbuild";

const projectRoot = process.cwd();
const stagingRoot = path.join(projectRoot, "tmp");
await mkdir(stagingRoot, { recursive: true });
const stagingDirectory = await mkdtemp(path.join(stagingRoot, "grok-operator-pdf-"));
const bundledEntry = path.join(stagingDirectory, "build.mjs");

try {
  await build({
    entryPoints: [path.join(projectRoot, "scripts/build-grok-bot-operator-guide-pdf.tsx")],
    outfile: bundledEntry,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node22",
    external: ["@react-pdf/renderer", "react", "react/jsx-runtime"],
    logLevel: "warning",
  });
  await import(pathToFileURL(bundledEntry).href);
} finally {
  await rm(stagingDirectory, { recursive: true, force: true });
}
