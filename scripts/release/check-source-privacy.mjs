import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";

// New documentation must receive an explicit publication review before this
// list is extended. Private working records belong outside the checkout.
const approvedDocs = new Set([
  "docs/BOT-PORTRAIT-PROVENANCE.md",
  "docs/BOT-PORTRAIT-USAGE.txt",
  "docs/FIRST-USER-WALKTHROUGH-2026-09-23.md",
  "docs/PUBLIC-CATALOG.md",
  "docs/REVIEW-POLICY.md",
]);

const privateDirectory = /(?:^|\/)(?:\.private|private|internal|local-only)(?:\/|$)/i;
const environmentFile = /(?:^|\/)\.env(?:rc$|\.|$)/i;
const textFile = /\.(?:md|mdx|txt|json|ya?ml|[cm]?js|jsx|ts|tsx|csv|html)$/i;
const privateClassification = [
  /^\s*(?:this is an? |this )?internal(?:[- ]only)? (?:evidence )?(?:record|document)\b/im,
  /^\s*(?:classification:\s*)(?:private|confidential|internal)\b/im,
  /^\s*(?:private|confidential|internal)[ -]only\b/im,
];

try {
  const entries = execFileSync("git", ["ls-files", "--stage", "-z"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).split("\0").filter(Boolean).map((entry) => {
    const match = /^(\d+) ([a-f0-9]+) 0\t([\s\S]+)$/.exec(entry);
    if (!match) throw new Error("Unresolved index entry");
    return { mode: match[1], sha: match[2], file: match[3] };
  });
  const textEntries = entries.filter(({ file }) => textFile.test(file));
  const blobs = textEntries.length ? execFileSync("git", ["cat-file", "--batch"], {
    input: textEntries.map(({ sha }) => sha).join("\n") + "\n",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
  }) : Buffer.alloc(0);
  const indexedContent = new Map();
  let offset = 0;
  for (const { file, sha } of textEntries) {
    const end = blobs.indexOf(10, offset);
    const header = /^([a-f0-9]+) blob (\d+)$/.exec(blobs.subarray(offset, end).toString("utf8"));
    if (end < 0 || !header || header[1] !== sha) throw new Error("Unreadable index blob");
    const start = end + 1;
    offset = start + Number(header[2]);
    if (blobs[offset] !== 10) throw new Error("Incomplete index blob");
    indexedContent.set(file, blobs.subarray(start, offset).toString("utf8"));
    offset += 1;
  }
  const issues = [];
  for (const { file, mode } of entries) {
    if (privateDirectory.test(file)) {
      issues.push([file, "private working material"]);
    }
    if (environmentFile.test(file) && file !== ".env.example") {
      issues.push([file, "environment configuration"]);
    }
    if (file.toLowerCase().startsWith("docs/") && !approvedDocs.has(file)) {
      issues.push([file, "documentation requires owner review"]);
    }
    if (!textFile.test(file)) continue;
    if (mode === "120000" || lstatSync(file).isSymbolicLink()) {
      issues.push([file, "linked text requires owner review"]);
      continue;
    }
    const contents = [indexedContent.get(file), readFileSync(file, "utf8")];
    const classified = contents.some((content) => {
      const prose = content.split("\n").map((line) => line.replace(/^[\s#>*_`]+/, "")).join("\n");
      return privateClassification.some((pattern) => pattern.test(prose));
    });
    if (classified) {
      issues.push([file, "non-public classification"]);
    }
  }
  if (issues.length) {
    console.error("Source privacy check failed. Keep non-public material outside the repository.");
    for (const reason of new Set(issues.map((issue) => issue[1]))) {
      // Never echo matched paths or content into CI logs.
      console.error(`Blocked: ${reason}.`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Source privacy check passed for ${entries.length} tracked files.`);
  }
} catch {
  console.error("Unable to inspect tracked source. Run this check from the repository root with all tracked files present.");
  process.exitCode = 1;
}
