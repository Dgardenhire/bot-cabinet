#!/usr/bin/env node

/**
 * Bot Cabinet — Hermes Bot Registry source preflight.
 *
 * The reviewer deliberately treats a submission as inert data. It talks only to
 * GitHub's API, reads a bounded set of blobs at one commit, and never clones,
 * installs, imports, evaluates, or executes submitted source.
 */

import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const REVIEW_VERSION = 1;

export const VERDICTS = Object.freeze({
  CANNOT_REVIEW: "cannot review",
  BLOCKED: "blocked from listing",
  SOURCE_PREVIEW: "source preview eligible",
  HUMAN_REVIEW: "human technical review required",
});

export const LIMITS = Object.freeze({
  eventBytes: 2 * 1024 * 1024,
  apiResponseBytes: 7 * 1024 * 1024,
  treeEntries: 5_000,
  sourceFiles: 120,
  sourceFileBytes: 160 * 1024,
  totalSourceBytes: 1_250 * 1024,
  requestMs: 10_000,
  reviewMs: 35_000,
});

// Stable Hermes v0.20.5 preserves legacy broad-copy behavior when an explicit
// distribution_owned allowlist is absent. These exact root names are excluded
// by USER_OWNED_EXCLUDE; other staged top-level entries can be copied.
const HERMES_0205_USER_OWNED_EXCLUDE = new Set([
  "auth.json",
  ".env",
  "state.db",
  "state.db-shm",
  "state.db-wal",
  "hermes_state.db",
  "response_store.db",
  "response_store.db-shm",
  "response_store.db-wal",
  "gateway.pid",
  "gateway_state.json",
  "processes.json",
  "auth.lock",
  "active_profile",
  ".update_check",
  "errors.log",
  ".hermes_history",
  "memories",
  "sessions",
  "logs",
  "plans",
  "workspace",
  "home",
  "image_cache",
  "audio_cache",
  "document_cache",
  "browser_screenshots",
  "checkpoints",
  "sandboxes",
  "backups",
  "cache",
  "hermes-agent",
  ".worktrees",
  "profiles",
  "bin",
  "node_modules",
  "local",
]);

const ARTIFACT_TYPES = Object.freeze({
  "installable profile distribution": "Installable profile distribution",
  "profile collection or starter kit": "Profile collection or starter kit",
  "use-case blueprint or guide": "Use-case blueprint or guide",
});

const REVIEW_LABELS = Object.freeze({
  [VERDICTS.CANNOT_REVIEW]: {
    name: "review:cannot-review",
    color: "6e7781",
    description: "Automated source review could not be completed",
  },
  [VERDICTS.BLOCKED]: {
    name: "review:blocked",
    color: "b60205",
    description: "Submission is blocked from a Bot Cabinet registry listing",
  },
  [VERDICTS.SOURCE_PREVIEW]: {
    name: "review:source-preview",
    color: "1d76db",
    description: "Submission may proceed to editorial source preview",
  },
  [VERDICTS.HUMAN_REVIEW]: {
    name: "review:human-required",
    color: "d93f0b",
    description: "Technical review required; no launch reviewer is available",
  },
});

const REPORT_MARKER = "<!-- hermes-registry-source-preflight -->";

class ReviewProblem extends Error {
  constructor(message, verdict = VERDICTS.CANNOT_REVIEW, code = "review_problem") {
    super(message);
    this.name = "ReviewProblem";
    this.verdict = verdict;
    this.code = code;
  }
}

function cleanSingleLine(value, max = 240) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function normalizeHeading(value) {
  return cleanSingleLine(value, 160)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function meaningfulValue(value) {
  const text = String(value ?? "").trim();
  if (!text || /^_?no response_?$/i.test(text)) return "";
  return text;
}

function findSection(sections, candidates) {
  for (const candidate of candidates) {
    const exact = sections.get(normalizeHeading(candidate));
    if (exact !== undefined) return meaningfulValue(exact);
  }
  return "";
}

/** Parse the Markdown GitHub creates from this repository's issue form. */
export function parseIssueForm(body) {
  if (typeof body !== "string") {
    throw new ReviewProblem("The issue body is missing.", VERDICTS.CANNOT_REVIEW, "missing_issue_body");
  }
  if (Buffer.byteLength(body, "utf8") > LIMITS.eventBytes) {
    throw new ReviewProblem("The issue body exceeds the review size limit.", VERDICTS.CANNOT_REVIEW, "issue_too_large");
  }

  const headings = [...body.matchAll(/^###\s+(.+?)\s*$/gm)];
  const sections = new Map();
  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index];
    const start = match.index + match[0].length;
    const end = headings[index + 1]?.index ?? body.length;
    sections.set(normalizeHeading(match[1]), body.slice(start, end).trim());
  }

  const repositoryUrl = findSection(sections, [
    "Public GitHub repository",
    "Repository URL",
    "GitHub repository",
  ]);
  const rawArtifactType = cleanSingleLine(
    findSection(sections, ["Artifact type", "What are you submitting?"]),
    120,
  ).toLowerCase();
  const artifactType = ARTIFACT_TYPES[rawArtifactType] ?? "";
  const expectedCapabilities = findSection(sections, [
    "Expected capabilities",
    "What should it do?",
  ]);
  const credentials = findSection(sections, [
    "Credentials and external services",
    "Credentials",
  ]);
  const permissionText = findSection(sections, [
    "Requested access and side effects",
    "File and command access",
    "Permissions",
  ]);
  const scheduledBehavior = findSection(sections, [
    "Scheduled behavior",
    "Cron or scheduled behavior",
  ]);
  const installSteps = findSection(sections, [
    "Dependencies and installation steps",
    "Installation and dependency steps",
  ]);
  const attestationsText = findSection(sections, [
    "Required attestations",
    "Maintainer and privacy attestations",
    "Attestations",
  ]);
  const checked = [...attestationsText.matchAll(/^\s*-\s*\[[xX]\]\s+(.+)$/gm)].map((match) =>
    cleanSingleLine(match[1], 300).toLowerCase(),
  );

  return {
    repositoryUrl,
    artifactType,
    expectedCapabilities,
    credentials,
    permissionText,
    scheduledBehavior,
    installSteps,
    attestations: {
      authority: checked.some((line) => /maintain.*repository|maintainer.*permission/.test(line)),
      privacy: checked.some((line) => /removed.*(secret|credential|personal|private)|contains no.*(secret|personal|private)/.test(line)),
      consent: checked.some((line) => /consent.*(fetch|review|report|public)/.test(line)),
      currentCommit: checked.some((line) => /current commit|edit.*issue.*change|resubmit.*change/.test(line)),
    },
  };
}

/** Accept only an unambiguous, public GitHub HTTPS repository URL. */
export function parseRepositoryUrl(rawValue) {
  const value = String(rawValue ?? "").trim();
  if (!value) throw new ReviewProblem("No repository URL was supplied.", VERDICTS.CANNOT_REVIEW, "missing_repository");
  if (value.length > 300 || /[\u0000-\u0020\u007f]/.test(value)) {
    throw new ReviewProblem("The repository URL is not a single canonical URL.", VERDICTS.CANNOT_REVIEW, "invalid_repository_url");
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ReviewProblem("The repository URL is malformed.", VERDICTS.CANNOT_REVIEW, "invalid_repository_url");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "github.com" ||
    url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname.includes("%")
  ) {
    throw new ReviewProblem(
      "The submission must use a public https://github.com/OWNER/REPOSITORY URL with no query, fragment, credentials, or encoded path.",
      VERDICTS.CANNOT_REVIEW,
      "invalid_repository_url",
    );
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length !== 2) {
    throw new ReviewProblem("The URL must point to a repository root, not a file, branch, or subdirectory.", VERDICTS.CANNOT_REVIEW, "invalid_repository_url");
  }

  const owner = pathParts[0];
  const rawRepo = pathParts[1];
  const repo = rawRepo.toLowerCase().endsWith(".git") ? rawRepo.slice(0, -4) : rawRepo;
  if (
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner) ||
    !/^[A-Za-z0-9_.-]{1,100}$/.test(repo) ||
    repo === "." ||
    repo === ".."
  ) {
    throw new ReviewProblem("The GitHub owner or repository name is invalid.", VERDICTS.CANNOT_REVIEW, "invalid_repository_url");
  }

  const normalizedUrl = `https://github.com/${owner}/${repo}`;
  return {
    owner,
    repo,
    normalizedUrl,
    submittedCanonicalFormat: value === normalizedUrl,
  };
}

function validateSubmission(submission) {
  const problems = [];
  if (!submission.artifactType) problems.push("Choose one of the supported artifact types.");
  if (!meaningfulValue(submission.expectedCapabilities)) problems.push("Describe the expected capabilities.");
  if (!meaningfulValue(submission.credentials)) problems.push("Declare required credentials or write “None.”");
  if (!meaningfulValue(submission.permissionText)) problems.push("Declare requested access and side effects or write “None.”");
  if (!meaningfulValue(submission.scheduledBehavior)) problems.push("Declare scheduled behavior or write “None.”");
  if (!meaningfulValue(submission.installSteps)) problems.push("Declare dependencies and installation steps or write “None.”");
  if (!submission.attestations?.authority) problems.push("The maintainer-authority attestation is not checked.");
  if (!submission.attestations?.privacy) problems.push("The privacy attestation is not checked.");
  if (!submission.attestations?.consent) problems.push("The public source-review consent is not checked.");
  if (!submission.attestations?.currentCommit) problems.push("The current-commit attestation is not checked.");
  return problems;
}

async function readBodyLimited(response, maxBytes) {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength && declaredLength > maxBytes) {
    await response.body?.cancel();
    throw new ReviewProblem("A GitHub API response exceeded the review size limit.", VERDICTS.CANNOT_REVIEW, "api_response_too_large");
  }
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new ReviewProblem("A GitHub API response exceeded the review size limit.", VERDICTS.CANNOT_REVIEW, "api_response_too_large");
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

function makeGithubClient({ token = "", fetchImpl = globalThis.fetch, deadline = Date.now() + LIMITS.reviewMs } = {}) {
  if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required.");

  return async function githubRequest(apiPath, options = {}) {
    if (typeof apiPath !== "string" || !apiPath.startsWith("/")) throw new Error("GitHub API paths must be absolute.");
    const url = new URL(apiPath, "https://api.github.com");
    if (url.origin !== "https://api.github.com") throw new Error("Only api.github.com requests are allowed.");

    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new ReviewProblem("The source review reached its time limit.", VERDICTS.CANNOT_REVIEW, "review_timeout");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(LIMITS.requestMs, remaining));
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "hermes-bot-registry-source-preflight",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    };

    let response;
    try {
      response = await fetchImpl(url, {
        method: options.method ?? "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        redirect: "error",
        signal: controller.signal,
      });
    } catch (error) {
      const detail = error?.name === "AbortError" ? "timed out" : "failed";
      throw new ReviewProblem(`A GitHub API request ${detail}.`, VERDICTS.CANNOT_REVIEW, "github_request_failed");
    } finally {
      clearTimeout(timer);
    }

    const allowedStatuses = new Set(options.allowedStatuses ?? []);
    const bytes = await readBodyLimited(response, options.maxBytes ?? LIMITS.apiResponseBytes);
    let payload = null;
    if (bytes.length) {
      try {
        payload = JSON.parse(bytes.toString("utf8"));
      } catch {
        throw new ReviewProblem("GitHub returned an unreadable response.", VERDICTS.CANNOT_REVIEW, "github_response_invalid");
      }
    }

    if (!response.ok && !allowedStatuses.has(response.status)) {
      throw new ReviewProblem(
        `GitHub returned HTTP ${response.status}; the repository could not be reviewed.`,
        VERDICTS.CANNOT_REVIEW,
        `github_http_${response.status}`,
      );
    }
    return { status: response.status, payload, headers: response.headers };
  };
}

function encodedSegment(value) {
  return encodeURIComponent(value);
}

function isTextCandidate(path) {
  const lower = path.toLowerCase();
  const basename = lower.split("/").at(-1) ?? lower;
  if (/(^|\/)(scripts?|bin|hooks?|cron)\/[^/]+$/i.test(lower)) return true;
  if (
    [
      "distribution.yaml",
      "distribution.yml",
      "soul.md",
      "skill.md",
      "agents.md",
      "claude.md",
      "readme",
      "license",
      "copying",
      ".gitignore",
      "dockerfile",
      "makefile",
      "procfile",
      "package.json",
      "pyproject.toml",
      "requirements.txt",
      "setup.py",
      "setup.cfg",
      "mcp.json",
      "config.yaml",
      "config.yml",
    ].includes(basename)
  ) return true;
  if (/^(readme|license|copying)(\.|$)/i.test(basename)) return true;
  if (/^(requirements[^/]*\.txt|environment\.ya?ml|install[^/]*\.(sh|ps1|bat|cmd))$/i.test(basename)) return true;
  return /\.(md|mdx|txt|ya?ml|json|jsonc|toml|ini|cfg|conf|env|sh|bash|zsh|fish|ps1|bat|cmd|py|js|mjs|cjs|jsx|ts|tsx|rb|go|rs|java|kt|kts|php|pl|lua|sql|dockerfile)$/i.test(lower);
}

function sourcePriority(path) {
  const lower = path.toLowerCase();
  if (path === "distribution.yaml") return 0;
  if (lower === ".gitignore" || /^(license|copying)(\.|$)/.test(lower)) return 1;
  if (["soul.md", "config.yaml", "config.yml", "mcp.json", "package.json", "pyproject.toml", "requirements.txt"].includes(lower)) return 2;
  if (lower.startsWith("cron/") || lower.startsWith("scripts/") || lower.startsWith(".github/workflows/")) return 3;
  if (lower.endsWith("/skill.md") || lower.startsWith("skills/")) return 4;
  return 5;
}

async function fetchRepositorySnapshot({ repository, token, fetchImpl }) {
  const deadline = Date.now() + LIMITS.reviewMs;
  const request = makeGithubClient({ token, fetchImpl, deadline });
  const ownerPath = encodedSegment(repository.owner);
  const repoPath = encodedSegment(repository.repo);
  const metadataResponse = await request(`/repos/${ownerPath}/${repoPath}`, { maxBytes: 1024 * 1024 });
  const metadata = metadataResponse.payload;
  if (!metadata || typeof metadata !== "object") {
    throw new ReviewProblem("GitHub did not return repository metadata.", VERDICTS.CANNOT_REVIEW, "metadata_missing");
  }
  if (metadata.private === true || metadata.visibility === "private") {
    throw new ReviewProblem("The submitted repository is not public.", VERDICTS.BLOCKED, "repository_not_public");
  }
  if (metadata.disabled === true) {
    throw new ReviewProblem("The submitted repository is disabled on GitHub.", VERDICTS.CANNOT_REVIEW, "repository_disabled");
  }
  if (!metadata.default_branch || !metadata.html_url) {
    throw new ReviewProblem("GitHub metadata is missing a default branch or canonical URL.", VERDICTS.CANNOT_REVIEW, "metadata_incomplete");
  }

  const canonical = parseRepositoryUrl(metadata.html_url);
  const commitResponse = await request(
    `/repos/${ownerPath}/${repoPath}/commits/${encodedSegment(metadata.default_branch)}`,
    { maxBytes: 2 * 1024 * 1024 },
  );
  const commit = commitResponse.payload;
  const commitSha = commit?.sha;
  const treeSha = commit?.commit?.tree?.sha;
  if (!/^[a-f0-9]{40}$/i.test(commitSha ?? "") || !/^[a-f0-9]{40}$/i.test(treeSha ?? "")) {
    throw new ReviewProblem("GitHub did not return an exact commit and tree SHA.", VERDICTS.CANNOT_REVIEW, "commit_missing");
  }

  const treeResponse = await request(
    `/repos/${ownerPath}/${repoPath}/git/trees/${treeSha}?recursive=1`,
    { maxBytes: LIMITS.apiResponseBytes },
  );
  const tree = treeResponse.payload;
  if (!tree || !Array.isArray(tree.tree)) {
    throw new ReviewProblem("GitHub did not return a repository tree.", VERDICTS.CANNOT_REVIEW, "tree_missing");
  }
  if (tree.truncated) {
    throw new ReviewProblem("GitHub truncated the repository tree, so the source set is incomplete.", VERDICTS.CANNOT_REVIEW, "tree_truncated");
  }
  if (tree.tree.length > LIMITS.treeEntries) {
    throw new ReviewProblem(`The repository has more than ${LIMITS.treeEntries} tree entries.`, VERDICTS.CANNOT_REVIEW, "tree_limit");
  }

  const sourceEntries = tree.tree
    .filter((entry) => typeof entry?.path === "string" && /^[a-f0-9]{40}$/i.test(entry.sha ?? ""))
    .map((entry) => ({
      path: entry.path,
      sha: entry.sha,
      size: Number(entry.size ?? 0),
      type: cleanSingleLine(entry.type, 20),
      mode: cleanSingleLine(entry.mode, 20),
    }));
  const blobEntries = sourceEntries.filter((entry) => entry.type === "blob");
  const candidates = blobEntries
    .filter((entry) => isTextCandidate(entry.path))
    .sort((a, b) => sourcePriority(a.path) - sourcePriority(b.path) || a.path.localeCompare(b.path));

  if (candidates.length > LIMITS.sourceFiles) {
    throw new ReviewProblem(`The repository has more than ${LIMITS.sourceFiles} review-relevant text files.`, VERDICTS.CANNOT_REVIEW, "source_file_limit");
  }
  const oversized = candidates.filter((entry) => entry.size > LIMITS.sourceFileBytes);
  if (oversized.length) {
    throw new ReviewProblem("At least one review-relevant text file exceeds the per-file limit.", VERDICTS.CANNOT_REVIEW, "source_file_too_large");
  }
  const declaredTotal = candidates.reduce((sum, entry) => sum + Math.max(0, entry.size), 0);
  if (declaredTotal > LIMITS.totalSourceBytes) {
    throw new ReviewProblem("The review-relevant source exceeds the total text limit.", VERDICTS.CANNOT_REVIEW, "source_total_too_large");
  }

  const files = Object.create(null);
  let fetchedBytes = 0;
  for (const entry of candidates) {
    const blobResponse = await request(
      `/repos/${ownerPath}/${repoPath}/git/blobs/${encodedSegment(entry.sha)}`,
      { maxBytes: Math.ceil(LIMITS.sourceFileBytes * 1.5) + 64 * 1024 },
    );
    const blob = blobResponse.payload;
    if (blob?.encoding !== "base64" || typeof blob.content !== "string") {
      throw new ReviewProblem("A source blob was not returned as bounded base64 text.", VERDICTS.CANNOT_REVIEW, "blob_invalid");
    }
    const bytes = Buffer.from(blob.content.replace(/\s/g, ""), "base64");
    if (bytes.length > LIMITS.sourceFileBytes) {
      throw new ReviewProblem("A review-relevant text file exceeds the decoded size limit.", VERDICTS.CANNOT_REVIEW, "source_file_too_large");
    }
    fetchedBytes += bytes.length;
    if (fetchedBytes > LIMITS.totalSourceBytes) {
      throw new ReviewProblem("The decoded source exceeds the total text limit.", VERDICTS.CANNOT_REVIEW, "source_total_too_large");
    }
    if (bytes.includes(0)) {
      throw new ReviewProblem("A review-relevant path contains binary data.", VERDICTS.CANNOT_REVIEW, "binary_source_path");
    }
    files[entry.path] = bytes.toString("utf8");
  }

  return {
    files,
    treeEntries: sourceEntries,
    fetchedBytes,
    repository: {
      owner: canonical.owner,
      name: canonical.repo,
      submittedUrl: repository.normalizedUrl,
      canonicalUrl: canonical.normalizedUrl,
      submittedCanonicalFormat: repository.submittedCanonicalFormat,
      canonicalMatchesSubmission:
        canonical.normalizedUrl.toLowerCase() === repository.normalizedUrl.toLowerCase(),
      commitSha: commitSha.toLowerCase(),
      treeSha: treeSha.toLowerCase(),
      defaultBranch: cleanSingleLine(metadata.default_branch, 120),
      archived: metadata.archived === true,
      fork: metadata.fork === true,
      public: true,
    },
  };
}

function collectMatches(files, rules, { executableOnly = false, maxFiles = 12 } = {}) {
  const matches = [];
  const executablePath = /(^|\/)(scripts?|bin|hooks?|cron)\/|(^|\/)(soul|skill|agents|claude)\.md$|\.(sh|bash|zsh|fish|ps1|bat|cmd|py|js|mjs|cjs|ts|rb|go|rs|php|pl|lua)$/i;
  for (const [path, content] of Object.entries(files)) {
    if (executableOnly && !executablePath.test(path)) continue;
    const lines = String(content).split(/\r?\n/);
    let foundLine = null;
    for (let index = 0; index < lines.length; index += 1) {
      if (rules.some((rule) => rule.test(lines[index]))) {
        foundLine = index + 1;
        break;
      }
    }
    if (foundLine !== null) matches.push({ path, line: foundLine });
    if (matches.length >= maxFiles) break;
  }
  return matches;
}

function hasPlausibleSecret(content) {
  const highConfidence = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
    /\bsk_live_[A-Za-z0-9]{16,}\b/,
    /\bAIza[0-9A-Za-z_-]{30,}\b/,
  ];
  if (highConfidence.some((rule) => rule.test(content))) return true;

  const assignment = /(?:api[_-]?key|client[_-]?secret|access[_-]?token|auth[_-]?token|password)\s*[:=]\s*["']?([^\s"'#]{20,})/gi;
  for (const match of content.matchAll(assignment)) {
    const candidate = match[1];
    if (!/(example|sample|placeholder|replace|your[_-]|xxxxx|dummy|test[_-]?key|\$\{|<)/i.test(candidate)) return true;
  }
  return false;
}

function sensitivePathSignals(treeEntries) {
  const secret = [];
  const localState = [];
  for (const entry of treeEntries) {
    const path = entry.path;
    const lower = path.toLowerCase();
    const basename = lower.split("/").at(-1) ?? lower;
    const exampleEnv = /^\.env\.(example|sample|template)$/.test(basename);
    if (
      (!exampleEnv && (/^\.env($|\.)/.test(basename) || basename === "auth.json")) ||
      basename === "auth.lock" ||
      /(^|\/)(id_rsa|id_ed25519|credentials|secrets?|service[-_]?account)(\.|$)/i.test(lower) ||
      /\.(pem|p12|pfx|key|keystore)$/i.test(lower)
    ) secret.push({ path });

    if (
      /(^|\/)(memories|sessions|logs|workspace|plans|home|local|checkpoints|sandboxes|backups)(\/|$)/i.test(lower) ||
      /(^|\/)(state\.db(?:-(?:shm|wal))?|hermes_state\.db|response_store\.db(?:-(?:shm|wal))?|gateway\.pid|gateway_state\.json|processes\.json|active_profile|\.update_check|errors\.log|\.hermes_history|memory\.md|user\.md)$/i.test(lower) ||
      /(^|\/)[^/]*_cache(\/|$)/i.test(lower)
    ) localState.push({ path });
  }
  return { secret: secret.slice(0, 12), localState: localState.slice(0, 12) };
}

function piiSignals(files) {
  const rules = [
    /\/(?:Users|home)\/[A-Za-z0-9._-]+\//,
    /[A-Za-z]:\\Users\\[A-Za-z0-9._ -]+\\/i,
    /\b(?:\+?1[-.\s]?)?\(?[2-9][0-9]{2}\)?[-.\s][0-9]{3}[-.\s][0-9]{4}\b/,
    /\b[A-Z0-9._%+-]+@(?!example\.com\b|users\.noreply\.github\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  ];
  return collectMatches(files, rules, { maxFiles: 12 });
}

function promptInjectionSignals(files) {
  const rules = [
    /\b(ignore|disregard|forget)\b.{0,35}\b(previous|prior|system|developer)\b.{0,25}\b(instruction|message|rule)/i,
    /\b(do not|never)\b.{0,25}\b(tell|inform|show|reveal)\b.{0,25}\b(user|operator|maintainer)/i,
    /\b(override|bypass|disable)\b.{0,30}\b(safety|policy|guardrail|permission|approval)/i,
    /\b(hidden|secret)\s+(instruction|prompt|directive)/i,
    /\b(reveal|send|upload|exfiltrate|steal)\b.{0,35}\b(secret|credential|token|password|api key|private data)/i,
    /\byou must obey\b|\bjailbreak\b|\bdeveloper message\b/i,
  ];
  return collectMatches(files, rules, { maxFiles: 12 });
}

function commandSignals(files) {
  const destructive = collectMatches(
    files,
    [
      /\brm\s+-[^\n]*(?:r[^\n]*f|f[^\n]*r)\b/i,
      /\bgit\s+(?:clean\s+-fdx|reset\s+--hard)\b/i,
      /\b(?:mkfs(?:\.[a-z0-9]+)?|diskutil\s+erase|format\s+[a-z]:)\b/i,
      /\bdd\s+[^\n]*\bof=\/dev\//i,
      /\bRemove-Item\b[^\n]*(?:-Recurse[^\n]*-Force|-Force[^\n]*-Recurse)/i,
      /\b(?:shutil\.rmtree|DROP\s+(?:DATABASE|SCHEMA))\b/i,
    ],
    { maxFiles: 12 },
  );
  const persistence = collectMatches(
    files,
    [
      /\bcrontab\b/i,
      /\bsystemctl\s+(?:enable|daemon-reload)\b/i,
      /\blaunchctl\s+(?:load|bootstrap|enable)\b/i,
      /Library\/LaunchAgents|Library\/LaunchDaemons/i,
      /\bschtasks\b[^\n]*\/create/i,
      /CurrentVersion\\Run\b/i,
      /\bnohup\b[^\n]*&/i,
    ],
    { maxFiles: 12 },
  );
  const exfiltration = collectMatches(
    files,
    [
      /\b(?:curl|wget)\b[^\n]*(?:\$(?:[A-Z_]*(?:KEY|TOKEN|SECRET|PASSWORD))|\.env|auth\.json|state\.db)/i,
      /\b(?:requests\.post|axios\.post|fetch)\b[^\n]*(?:process\.env|os\.environ|credential|secret|token|password)/i,
      /\b(?:nc|netcat)\b[^\n]*(?:-e|-c)\b/i,
      /\b(?:scp|rsync)\b[^\n]*(?:\.env|auth\.json|state\.db|memories|sessions)/i,
      /(?:discord(?:app)?\.com\/api\/webhooks|hooks\.slack\.com\/services)/i,
    ],
    { maxFiles: 12 },
  );
  const network = collectMatches(
    files,
    [
      /\b(?:curl|wget)\b\s+(?:-[A-Za-z]+\s+)*https?:\/\//i,
      /\b(?:requests\.(?:get|post|put|delete)|urllib\.request|axios\.|fetch\s*\(|httpx\.|aiohttp\.|socket\.)/i,
      /\b(?:npm|pnpm|yarn|pip|uv)\s+(?:install|add)\b/i,
    ],
    { executableOnly: true, maxFiles: 12 },
  );
  const shell = collectMatches(
    files,
    [
      /\b(?:child_process\.)?(?:execSync|execFileSync|spawnSync|exec|spawn)\s*\(/,
      /\bsubprocess\.(?:run|Popen|call|check_output)\s*\(/,
      /\bos\.system\s*\(|\bshell\s*=\s*True\b/i,
      /\b(?:bash|sh|zsh|powershell|pwsh)\s+-c\b/i,
      /\beval\s*\(\s*(?:atob|Buffer\.from)/i,
      /\bbase64\s+(?:--decode|-d)\b/i,
    ],
    { maxFiles: 12 },
  );
  return { destructive, persistence, exfiltration, network, shell };
}

function parseSimpleYamlScalar(text, key) {
  const match = String(text).match(new RegExp(`^${key}\\s*:\\s*["']?([^\\n#"']+)["']?\\s*(?:#.*)?$`, "mi"));
  return cleanSingleLine(match?.[1] ?? "", 160);
}

function parseSimpleYamlList(text, key) {
  const lines = String(text).split(/\r?\n/);
  const declaration = new RegExp(`^${key}\\s*:\\s*(.*?)\\s*(?:#.*)?$`, "i");
  const start = lines.findIndex((line) => declaration.test(line));
  if (start < 0) return { present: false, values: [], unparsed: false };
  const inline = lines[start].match(declaration)?.[1]?.trim() ?? "";
  if (inline) {
    const bracketed = inline.match(/^\[([^\]]*)\]$/);
    if (!bracketed) return { present: true, values: [], unparsed: true };
    const values = bracketed[1]
      .split(",")
      .map((value) => cleanSingleLine(value.replace(/^["']|["']$/g, ""), 240))
      .filter(Boolean);
    return { present: true, values, unparsed: false };
  }
  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_-]+\s*:/.test(line)) break;
    const item = line.match(/^\s+-\s*["']?([^#"'\n]+?)["']?\s*(?:#.*)?$/);
    if (item) values.push(cleanSingleLine(item[1], 240));
  }
  return { present: true, values, unparsed: false };
}

function parseEnvRequirements(text) {
  const lines = String(text).split(/\r?\n/);
  const start = lines.findIndex((line) => /^env_requires\s*:/i.test(line));
  if (start < 0) return [];
  const names = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_-]+\s*:/.test(line)) break;
    const match = line.match(/^\s+-?\s*name\s*:\s*["']?([A-Z][A-Z0-9_]{1,79})["']?/);
    if (match) names.push(match[1]);
  }
  return [...new Set(names)].slice(0, 30);
}

function detectPermissionCategories(submission, files, envRequirements) {
  const text = [
    submission.expectedCapabilities,
    submission.credentials,
    submission.permissionText,
    submission.scheduledBehavior,
    submission.installSteps,
  ].join("\n");
  const noAccess = /^\s*(?:none|n\/a|not applicable|no)\.?\s*$/i;
  const positiveText = text
    .split(/(?:\r?\n|(?<=[.!?])\s+)/)
    .filter((sentence) => !/\b(?:does not|do not|doesn't|don't|never|without|no access|none|not applicable)\b/i.test(sentence))
    .join("\n");
  const categories = new Set();
  if (/\b(read|search|inspect|scan)\b.{0,25}\b(file|folder|filesystem|workspace|document)/i.test(positiveText)) categories.add("filesystem read");
  if (/\b(write|edit|modify|delete|move|rename|create)\b.{0,25}\b(file|folder|filesystem|workspace|document)/i.test(positiveText)) categories.add("filesystem write");
  if (/\b(shell|terminal|command|subprocess|script|execute|run code)\b/i.test(positiveText)) categories.add("shell or code execution");
  if (/\b(web|network|internet|http|api|browse|download|upload)\b/i.test(positiveText)) categories.add("network access");
  if (/\b(browser|playwright|chrom(?:e|ium))\b/i.test(positiveText)) categories.add("browser control");
  if (/\b(email|message|slack|discord|telegram|post|publish|send)\b/i.test(positiveText)) categories.add("external communications");
  if (/\b(cron|schedule|recurring|background|daemon|startup)\b/i.test(positiveText)) categories.add("scheduled or persistent operation");
  if (envRequirements.length || !noAccess.test(submission.credentials ?? "")) categories.add("credentials or environment variables");
  if (Object.keys(files).some((path) => path.toLowerCase() === "mcp.json")) categories.add("MCP connections");
  return [...categories].sort();
}

function dependencySignals(files, treeEntries) {
  const paths = treeEntries.map((entry) => entry.path);
  const manifests = paths.filter((path) =>
    /(^|\/)(package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|pyproject\.toml|requirements[^/]*\.txt|poetry\.lock|uv\.lock|pipfile(?:\.lock)?|setup\.py|cargo\.toml|cargo\.lock|go\.mod|go\.sum|gemfile(?:\.lock)?|composer\.json|dockerfile|makefile)$/i.test(path),
  );
  const installFiles = paths.filter((path) => /(^|\/)(install|setup|bootstrap)[^/]*\.(sh|bash|zsh|ps1|bat|cmd|py)$/i.test(path));
  const lifecycleScripts = [];
  for (const [path, content] of Object.entries(files)) {
    if (!/(^|\/)package\.json$/i.test(path)) continue;
    try {
      const parsed = JSON.parse(content);
      for (const key of ["preinstall", "install", "postinstall", "prepare", "prepublish", "prepack"]) {
        if (typeof parsed?.scripts?.[key] === "string" && parsed.scripts[key].trim()) lifecycleScripts.push({ path, key });
      }
    } catch {
      lifecycleScripts.push({ path, key: "unreadable package.json" });
    }
  }
  return {
    manifests: manifests.slice(0, 20),
    installFiles: installFiles.slice(0, 20),
    lifecycleScripts: lifecycleScripts.slice(0, 20),
  };
}

function cronSignals(files, treeEntries) {
  const cronPaths = treeEntries.map((entry) => entry.path).filter((path) => /(^|\/)cron\//i.test(path));
  const enabledHints = collectMatches(files, [/^[\s"']*enabled["']?\s*:\s*true\b/i, /"enabled"\s*:\s*true\b/i], { maxFiles: 12 });
  return { cronPaths: cronPaths.slice(0, 20), enabledHints };
}

function opaqueSourceSignals(treeEntries) {
  const submodules = treeEntries
    .filter((entry) => entry.type === "commit" || entry.mode === "160000")
    .map((entry) => entry.path)
    .slice(0, 20);
  const symlinks = treeEntries
    .filter((entry) => entry.mode === "120000")
    .map((entry) => entry.path)
    .slice(0, 20);
  const opaqueExecutables = treeEntries
    .filter((entry) => {
      const lower = entry.path.toLowerCase();
      return (
        /\.(exe|dll|dylib|so(?:\.[0-9.]+)?|wasm|class|jar|appimage|msi|dmg|pkg|deb|rpm|apk|bin|zip|tar|tgz|gz|bz2|xz|7z|rar)$/i.test(lower) ||
        (entry.mode === "100755" && !isTextCandidate(entry.path))
      );
    })
    .map((entry) => entry.path)
    .slice(0, 20);
  return { submodules, symlinks, opaqueExecutables };
}

function codePathList(matches) {
  return matches.map((match) => match.path).slice(0, 12);
}

function addCheck(checks, id, status, severity, summary, detail, files = []) {
  checks.push({
    id,
    status,
    severity,
    summary,
    detail,
    files: [...new Set(files)].slice(0, 12),
  });
}

/** Analyze an already-fetched snapshot. Exported so tests never need network. */
export function reviewSnapshot({ submission, files, treeEntries, repository, fetchedBytes = 0 }) {
  const normalizedFiles = Object.fromEntries(
    Object.entries(files ?? {}).map(([path, content]) => [String(path), String(content)]),
  );
  const normalizedTree = treeEntries ?? Object.entries(normalizedFiles).map(([path, content]) => ({
    path,
    size: Buffer.byteLength(content, "utf8"),
    sha: "0".repeat(40),
  }));
  const checks = [];
  const submissionProblems = validateSubmission(submission);

  addCheck(
    checks,
    "canonical_repository",
    repository.canonicalMatchesSubmission && repository.submittedCanonicalFormat ? "pass" : "note",
    repository.canonicalMatchesSubmission ? "info" : "high",
    repository.canonicalMatchesSubmission ? "GitHub resolved the submitted repository." : "GitHub resolved a different canonical repository URL.",
    repository.submittedCanonicalFormat
      ? "The submitted URL uses the required repository-root form."
      : "Use the exact canonical repository-root URL shown in this report.",
  );
  addCheck(
    checks,
    "exact_commit",
    /^[a-f0-9]{40}$/i.test(repository.commitSha ?? "") ? "pass" : "found",
    /^[a-f0-9]{40}$/i.test(repository.commitSha ?? "") ? "info" : "critical",
    /^[a-f0-9]{40}$/i.test(repository.commitSha ?? "") ? "The review is tied to one exact commit SHA." : "An exact commit SHA is unavailable.",
    "Changes after this commit require a new review.",
  );
  if (submissionProblems.length) {
    addCheck(
      checks,
      "submission_attestations",
      "found",
      "critical",
      "The submission form is incomplete.",
      submissionProblems.join(" "),
    );
  } else {
    addCheck(checks, "submission_attestations", "pass", "info", "Required declarations and attestations are present.", "The report does not reproduce free-form issue text.");
  }

  const manifest = normalizedFiles["distribution.yaml"];
  const isDistribution = submission.artifactType === ARTIFACT_TYPES["installable profile distribution"];
  if (!manifest && isDistribution) {
    addCheck(checks, "root_manifest", "found", "critical", "The declared installable distribution has no root distribution.yaml.", "It cannot be described as a Hermes profile distribution until the root manifest exists.");
  } else if (!manifest) {
    addCheck(checks, "root_manifest", "note", "info", "No root distribution.yaml was found.", "That is consistent with a collection or blueprint, but it is not a one-command profile distribution.");
  } else {
    const manifestName = parseSimpleYamlScalar(manifest, "name");
    addCheck(
      checks,
      "root_manifest",
      manifestName ? "pass" : "found",
      manifestName ? "info" : "critical",
      manifestName ? "A root distribution.yaml with a name field was found." : "The root distribution.yaml has no readable name field.",
      manifestName ? "The review uses conservative field detection rather than a YAML runtime." : "Add a simple top-level name field.",
      ["distribution.yaml"],
    );
  }

  let envRequirements = [];
  if (manifest) {
    envRequirements = parseEnvRequirements(manifest);
    const ownedDeclaration = parseSimpleYamlList(manifest, "distribution_owned");
    if (!ownedDeclaration.present || (!ownedDeclaration.unparsed && ownedDeclaration.values.length === 0)) {
      const copiedTopLevel = [...new Set(normalizedTree.map((entry) => entry.path.split("/")[0]))]
        .filter((name) => name && !HERMES_0205_USER_OWNED_EXCLUDE.has(name))
        .sort();
      addCheck(
        checks,
        "copied_paths",
        "found",
        "high",
        "The manifest has no non-empty explicit distribution_owned allowlist.",
        `Stable Hermes v0.20.5 preserves broad legacy behavior in this case: every staged top-level entry outside its exact USER_OWNED_EXCLUDE set can be copied on install or update. Top-level entries in this commit that fall into that broad payload: ${copiedTopLevel.slice(0, 30).join(", ") || "none detected"}${copiedTopLevel.length > 30 ? `, plus ${copiedTopLevel.length - 30} more` : ""}. Add a narrow explicit allowlist.`,
        ["distribution.yaml"],
      );
    } else {
      const owned = ownedDeclaration.values;
      const broad = owned.filter((value) => /^(?:\.|\/|\*|\.\.)(?:\/|$)|^(?:home|workspace|memories|sessions|local|logs|plans)(?:\/|$)|^\.env$|^auth\.json$/i.test(value));
      addCheck(
        checks,
        "copied_paths",
        broad.length || ownedDeclaration.unparsed ? "found" : "pass",
        broad.length ? "critical" : ownedDeclaration.unparsed ? "high" : "info",
        broad.length
          ? "The custom distribution-owned list contains broad or user-state paths."
          : ownedDeclaration.unparsed
            ? "The custom distribution-owned list could not be conservatively parsed."
            : "A bounded custom distribution-owned list was found.",
        broad.length
          ? "Remove broad, parent, credential, and user-state paths from distribution_owned."
          : ownedDeclaration.unparsed
            ? "Use a simple YAML list so reviewers and installers can inspect every copied path."
            : `Declared paths: ${owned.join(", ") || "none"}.`,
        ["distribution.yaml"],
      );
    }
  } else {
    addCheck(checks, "copied_paths", "note", "info", "Distribution-owned paths do not apply to the declared artifact as submitted.", "A future installable distribution should declare a narrow, non-empty distribution_owned allowlist.");
  }

  const gitignore = normalizedFiles[".gitignore"];
  if (isDistribution && !gitignore) {
    addCheck(
      checks,
      "repository_hygiene",
      "found",
      "moderate",
      "The installable distribution has no root .gitignore.",
      "Add exclusions for credentials, Hermes local state, logs, workspaces, caches, and local-only material before inviting contributors to clone the repository.",
    );
  } else if (isDistribution) {
    const expectedIgnoreFamilies = [
      { label: ".env", rule: /^\s*\.env(?:\*|$|\.)/im },
      { label: "auth.json", rule: /(^|\n)\s*(?:\*\*\/)?auth\.json\s*$/im },
      { label: "memories/sessions", rule: /(^|\n)\s*(?:\*\*\/)?(?:memories|sessions)\//im },
      { label: "state.db", rule: /(^|\n)\s*(?:\*\*\/)?state\.db/i },
      { label: "logs/workspace", rule: /(^|\n)\s*(?:\*\*\/)?(?:logs|workspace)\//im },
    ];
    const missingIgnoreFamilies = expectedIgnoreFamilies.filter((entry) => !entry.rule.test(gitignore)).map((entry) => entry.label);
    addCheck(
      checks,
      "repository_hygiene",
      missingIgnoreFamilies.length ? "found" : "pass",
      missingIgnoreFamilies.length ? "moderate" : "info",
      missingIgnoreFamilies.length ? "The root .gitignore omits common Hermes privacy exclusions." : "The root .gitignore covers common Hermes privacy exclusions.",
      missingIgnoreFamilies.length ? `Review and add rules for: ${missingIgnoreFamilies.join(", ")}.` : "The installer also has hard exclusions, but public-source hygiene remains the author's responsibility.",
      [".gitignore"],
    );
  } else {
    addCheck(checks, "repository_hygiene", "note", "info", "Distribution-specific .gitignore guidance is not required for the declared artifact type.", "Authors should still exclude credentials and private work product.");
  }

  const pathSignals = sensitivePathSignals(normalizedTree);
  const opaque = opaqueSourceSignals(normalizedTree);
  if (opaque.submodules.length || opaque.symlinks.length || opaque.opaqueExecutables.length) {
    const rejectedInstallableSymlink = isDistribution && opaque.symlinks.length > 0;
    addCheck(
      checks,
      "opaque_or_linked_source",
      "found",
      rejectedInstallableSymlink ? "critical" : "high",
      rejectedInstallableSymlink ? "The declared installable distribution contains a symbolic link that Hermes v0.20.5 rejects." : "Linked or opaque executable source was found.",
      rejectedInstallableSymlink
        ? "Remove every symbolic link and submit a new commit. Hermes rejects distribution symlinks before installation."
        : "Submodules and binary executables are outside the text analyzer. This source remains unpublished at launch; a future technical review would be required.",
      [...opaque.submodules, ...opaque.symlinks, ...opaque.opaqueExecutables],
    );
  } else {
    addCheck(checks, "opaque_or_linked_source", "pass", "info", "No submodule, symbolic link, or common opaque executable was found.", "Binary media assets are not interpreted as executable source.");
  }
  const contentSecretFiles = Object.entries(normalizedFiles)
    .filter(([, content]) => hasPlausibleSecret(content))
    .map(([path]) => path)
    .slice(0, 12);
  if (pathSignals.secret.length || contentSecretFiles.length) {
    addCheck(
      checks,
      "secret_exposure",
      "found",
      "critical",
      "Credential-like material or secret-like filenames were found.",
      "Potential values are intentionally omitted from this report. Rotate any real credential, remove it from current source and history, then submit a new commit.",
      [...codePathList(pathSignals.secret), ...contentSecretFiles],
    );
  } else {
    addCheck(checks, "secret_exposure", "pass", "info", "No high-confidence credential pattern or secret-like filename was found in the bounded snapshot.", "This check does not scan git history.");
  }

  const pii = piiSignals(normalizedFiles);
  if (pathSignals.localState.length) {
    addCheck(
      checks,
      "local_state_privacy",
      "found",
      "critical",
      "Local profile state or personal-context paths were committed.",
      "Remove these paths from current source and git history. Hermes' installer exclusions do not remove public copies from GitHub.",
      codePathList(pathSignals.localState),
    );
  } else if (pii.length) {
    addCheck(
      checks,
      "local_state_privacy",
      "found",
      "high",
      "The source contains personal-data-like text or local machine paths.",
      "This source remains unpublished at launch. A future technical reviewer would have to decide whether each occurrence is intentional public information or private residue.",
      codePathList(pii),
    );
  } else {
    addCheck(checks, "local_state_privacy", "pass", "info", "No known Hermes local-state path or common personal-data pattern was found.", "The check is pattern-based and limited to the reviewed commit.");
  }

  const injection = promptInjectionSignals(normalizedFiles);
  if (injection.length) {
    addCheck(
      checks,
      "instruction_hijacking",
      "found",
      "high",
      "Instruction-hijacking or concealment wording was found.",
      "The wording may be documentation or a false positive. This source remains unpublished at launch; a future technical reviewer would have to inspect the surrounding source.",
      codePathList(injection),
    );
  } else {
    addCheck(checks, "instruction_hijacking", "pass", "info", "No common instruction-hijacking or social-engineering phrase was found.", "Natural-language instructions remain capable of behavior this pattern check cannot predict.");
  }

  const commands = commandSignals(normalizedFiles);
  if (commands.destructive.length) {
    addCheck(checks, "destructive_commands", "found", "critical", "A high-confidence destructive command pattern was found.", "The registry blocks this commit from listing. Remove the behavior or submit a narrowly justified, separately reviewed design.", codePathList(commands.destructive));
  } else {
    addCheck(checks, "destructive_commands", "pass", "info", "No high-confidence destructive command pattern was found.", "The reviewer never runs commands.");
  }
  if (commands.persistence.length || commands.exfiltration.length) {
    addCheck(
      checks,
      "persistence_exfiltration",
      "found",
      commands.exfiltration.length ? "critical" : "high",
      commands.exfiltration.length ? "A potential data-transfer pattern involving sensitive material was found." : "A persistence mechanism was found.",
      "This source remains unpublished at launch. Any later technical review would have to inspect intent, scope, consent, and failure behavior.",
      [...codePathList(commands.exfiltration), ...codePathList(commands.persistence)],
    );
  } else {
    addCheck(checks, "persistence_exfiltration", "pass", "info", "No common persistence or sensitive-data transfer pattern was found.", "Runtime downloads and indirect behavior remain outside this preflight.");
  }
  if (commands.shell.length || commands.network.length) {
    addCheck(
      checks,
      "shell_network",
      "found",
      "high",
      "Shell execution or active network code was found.",
      "The preflight did not execute it. This source remains unpublished because no human technical review is available at launch.",
      [...codePathList(commands.shell), ...codePathList(commands.network)],
    );
  } else {
    addCheck(checks, "shell_network", "pass", "info", "No common shell-execution or active-network code pattern was found.", "Links in prose are not treated as execution.");
  }

  const permissions = detectPermissionCategories(submission, normalizedFiles, envRequirements);
  const highPermission = permissions.some((value) =>
    ["filesystem write", "shell or code execution", "external communications", "scheduled or persistent operation"].includes(value),
  );
  const moderatePermission = permissions.length > 0;
  addCheck(
    checks,
    "permission_surface",
    moderatePermission ? "found" : "pass",
    highPermission ? "high" : moderatePermission ? "moderate" : "info",
    moderatePermission ? "The submission declares or contains an elevated permission surface." : "No elevated permission category was declared or inferred.",
    moderatePermission ? `Categories: ${permissions.join(", ")}.` : "The submitter entered “None” for credentials, side effects, scheduling, and install steps.",
  );

  const dependencies = dependencySignals(normalizedFiles, normalizedTree);
  if (dependencies.lifecycleScripts.length || dependencies.installFiles.length) {
    addCheck(
      checks,
      "dependencies_install",
      "found",
      "high",
      "An install script or package lifecycle hook was found.",
      "Nothing was installed or run. This source remains unpublished at launch; a future technical review would have to inspect each hook and its dependencies.",
      [...dependencies.installFiles, ...dependencies.lifecycleScripts.map((entry) => entry.path)],
    );
  } else if (dependencies.manifests.length) {
    addCheck(
      checks,
      "dependencies_install",
      "found",
      "moderate",
      "Dependency or build manifests were found.",
      "This source remains unpublished at launch; a future technical review would have to inspect dependency provenance and installation instructions.",
      dependencies.manifests,
    );
  } else {
    addCheck(checks, "dependencies_install", "pass", "info", "No dependency manifest or install hook was found.", "Bundled source can still call tools already present on an installer's machine.");
  }

  const cron = cronSignals(normalizedFiles, normalizedTree);
  if (cron.enabledHints.length) {
    addCheck(
      checks,
      "scheduled_behavior",
      "found",
      "high",
      "A cron definition contains an enabled-state hint.",
      "The source must be reviewed for cadence, side effects, consent, and stop conditions. This report does not infer the installer's runtime state.",
      codePathList(cron.enabledHints),
    );
  } else if (cron.cronPaths.length) {
    addCheck(
      checks,
      "scheduled_behavior",
      "found",
      "moderate",
      "Cron definitions are included in the distribution source.",
      "Without a non-empty distribution_owned allowlist, Hermes v0.20.5's broad copy behavior can include cron/. This source remains unpublished at launch.",
      cron.cronPaths,
    );
  } else {
    addCheck(checks, "scheduled_behavior", "pass", "info", "No cron directory or enabled-state hint was found.", "Other persistence mechanisms are checked separately.");
  }

  const treePaths = normalizedTree.map((entry) => entry.path);
  const licenseFiles = treePaths.filter((path) => /(^|\/)(license|copying)(\.[^/]*)?$/i.test(path));
  const manifestLicense = manifest ? parseSimpleYamlScalar(manifest, "license") : "";
  if (licenseFiles.length && (!isDistribution || manifestLicense)) {
    addCheck(checks, "license_evidence", "pass", "info", "License evidence was found.", manifestLicense ? `The manifest declares ${manifestLicense}, and a license file is present.` : "A license file is present.", licenseFiles);
  } else {
    addCheck(
      checks,
      "license_evidence",
      "found",
      "moderate",
      "License evidence is incomplete.",
      isDistribution ? "Add a license file and a matching top-level license field before community reuse." : "Add a license file that permits the intended community use.",
      licenseFiles,
    );
  }

  if (repository.archived) addCheck(checks, "repository_status", "found", "moderate", "The GitHub repository is archived.", "Confirm whether this source is still maintained.");
  if (repository.fork) addCheck(checks, "repository_origin", "note", "info", "The GitHub repository is a fork.", "Reviewers should check upstream attribution and license compatibility.");

  const found = checks.filter((check) => check.status === "found");
  const hasCritical = found.some((check) => check.severity === "critical");
  const hasHigh = found.some((check) => check.severity === "high");
  const hasModerate = found.some((check) => check.severity === "moderate");
  const verdict = hasCritical
    ? VERDICTS.BLOCKED
    : hasHigh || hasModerate
      ? VERDICTS.HUMAN_REVIEW
      : VERDICTS.SOURCE_PREVIEW;
  const riskClass = hasCritical ? "critical" : hasHigh ? "high" : hasModerate ? "moderate" : "low";

  return {
    reviewVersion: REVIEW_VERSION,
    reviewedAt: new Date().toISOString(),
    verdict,
    riskClass,
    publicationAction: "none",
    repository,
    artifactType: submission.artifactType || "Unrecognized",
    scope: {
      sourceOnly: true,
      commitSha: repository.commitSha,
      treeSha: repository.treeSha,
      treeFiles: normalizedTree.length,
      inspectedTextFiles: Object.keys(normalizedFiles).length,
      inspectedTextBytes: fetchedBytes || Object.values(normalizedFiles).reduce((sum, text) => sum + Buffer.byteLength(text, "utf8"), 0),
      limits: LIMITS,
    },
    declaredPermissionCategories: permissions,
    declaredEnvironmentVariables: envRequirements,
    checks,
  };
}

function problemResult(problem, submission, repositoryInput = null) {
  return {
    reviewVersion: REVIEW_VERSION,
    reviewedAt: new Date().toISOString(),
    verdict: problem.verdict ?? VERDICTS.CANNOT_REVIEW,
    riskClass: problem.verdict === VERDICTS.BLOCKED ? "critical" : "unavailable",
    publicationAction: "none",
    repository: repositoryInput
      ? {
          owner: repositoryInput.owner,
          name: repositoryInput.repo,
          submittedUrl: repositoryInput.normalizedUrl,
          canonicalUrl: null,
          commitSha: null,
          treeSha: null,
          defaultBranch: null,
          public: null,
        }
      : null,
    artifactType: submission?.artifactType || "Unrecognized",
    scope: {
      sourceOnly: true,
      commitSha: null,
      treeSha: null,
      treeFiles: 0,
      inspectedTextFiles: 0,
      inspectedTextBytes: 0,
      limits: LIMITS,
    },
    declaredPermissionCategories: [],
    declaredEnvironmentVariables: [],
    checks: [
      {
        id: problem.code ?? "review_problem",
        status: "found",
        severity: problem.verdict === VERDICTS.BLOCKED ? "critical" : "unavailable",
        summary: cleanSingleLine(problem.message, 500),
        detail: "No listing action was taken.",
        files: [],
      },
    ],
  };
}

export async function reviewSubmission({ submission, token = "", fetchImpl = globalThis.fetch }) {
  let repositoryInput = null;
  try {
    repositoryInput = parseRepositoryUrl(submission.repositoryUrl);
    const snapshot = await fetchRepositorySnapshot({ repository: repositoryInput, token, fetchImpl });
    return reviewSnapshot({ submission, ...snapshot });
  } catch (error) {
    const problem = error instanceof ReviewProblem
      ? error
      : new ReviewProblem("The review tool encountered an internal error.", VERDICTS.CANNOT_REVIEW, "internal_error");
    return problemResult(problem, submission, repositoryInput);
  }
}

function titleCase(value) {
  return String(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function markdownCode(value) {
  return `\`${cleanSingleLine(value, 300).replace(/`/g, "ˋ")}\``;
}

function checkIcon(check) {
  if (check.status === "pass") return "PASS";
  if (check.status === "note") return "NOTE";
  return check.severity === "critical" ? "BLOCK" : "REVIEW";
}

export function renderMarkdown(result) {
  const lines = [
    REPORT_MARKER,
    "## Bot Cabinet · Hermes Bot Registry source preflight",
    "",
    `**Automatic result:** ${titleCase(result.verdict)}`,
    `**Risk class:** ${titleCase(result.riskClass)}`,
    "",
    "This is bounded, source-only triage. It is not listing approval, and it performs no publication action.",
    "",
  ];

  if (result.repository?.canonicalUrl) lines.push(`**Repository:** [${result.repository.canonicalUrl}](${result.repository.canonicalUrl})`);
  else if (result.repository?.submittedUrl) lines.push(`**Submitted repository:** ${result.repository.submittedUrl}`);
  if (result.repository?.commitSha) lines.push(`**Reviewed commit:** ${markdownCode(result.repository.commitSha)}`);
  if (result.repository?.treeSha) lines.push(`**Reviewed tree:** ${markdownCode(result.repository.treeSha)}`);
  lines.push(
    `**Scope:** ${result.scope.inspectedTextFiles} text files (${result.scope.inspectedTextBytes.toLocaleString("en-US")} bytes) from ${result.scope.treeFiles} repository files`,
    `**Reviewed:** ${result.reviewedAt}`,
    "",
    "### Checks",
    "",
  );

  for (const check of result.checks) {
    lines.push(`- **${checkIcon(check)} — ${check.summary}** ${check.detail}`);
    if (check.files?.length) lines.push(`  Paths: ${check.files.map(markdownCode).join(", ")}`);
  }

  lines.push("", "### What happens next", "");
  if (result.verdict === VERDICTS.SOURCE_PREVIEW) {
    lines.push("A registry maintainer may now assess editorial fit and preview the source. Any source change requires a new preflight.");
  } else if (result.verdict === VERDICTS.HUMAN_REVIEW) {
    lines.push("The Registry has no human technical reviewer at launch. Keep this commit source-only and unpublished. A future named reviewer would have to inspect the flagged source and record a decision at this commit before any install listing.");
  } else if (result.verdict === VERDICTS.BLOCKED) {
    lines.push("Do not list this commit. Address the blocking findings, rotate exposed credentials if applicable, and submit a new commit for review.");
  } else {
    lines.push("The automated review is incomplete. Correct the repository or intake problem and rerun the preflight; do not list the current submission.");
  }
  lines.push(
    "",
    "The reviewer did not clone the submitted repository, run its code, install dependencies, follow source instructions, or send data to submitted endpoints.",
  );
  return `${lines.join("\n")}\n`;
}

function parseCliArgs(argv) {
  const options = {
    event: process.env.GITHUB_EVENT_PATH || "",
    repo: "",
    artifactType: "Installable profile distribution",
    markdown: "",
    json: "",
    postComment: false,
    addLabel: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--post-comment") options.postComment = true;
    else if (arg === "--add-label") options.addLabel = true;
    else if (["--event", "--repo", "--artifact-type", "--markdown", "--json"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value.`);
      index += 1;
      if (arg === "--event") options.event = value;
      if (arg === "--repo") options.repo = value;
      if (arg === "--artifact-type") options.artifactType = value;
      if (arg === "--markdown") options.markdown = value;
      if (arg === "--json") options.json = value;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function helpText() {
  return `Bot Cabinet — Hermes Bot Registry source preflight

Workflow use:
  node scripts/registry-review.mjs --event "$GITHUB_EVENT_PATH" \\
    --markdown registry-review.md --json registry-review.json \\
    --post-comment --add-label

Local use:
  GITHUB_TOKEN=... node scripts/registry-review.mjs \\
    --repo https://github.com/OWNER/REPOSITORY \\
    --artifact-type "Installable profile distribution" \\
    --markdown registry-review.md --json registry-review.json

The submitted repository is never cloned or executed.
`;
}

async function loadEvent(path) {
  const bytes = await readFile(path);
  if (bytes.length > LIMITS.eventBytes) throw new Error("GitHub event file exceeds the size limit.");
  return JSON.parse(bytes.toString("utf8"));
}

function localSubmission(options) {
  const artifactType = ARTIFACT_TYPES[cleanSingleLine(options.artifactType, 120).toLowerCase()] ?? options.artifactType;
  return {
    repositoryUrl: options.repo,
    artifactType,
    expectedCapabilities: "Not supplied in local mode.",
    credentials: "None.",
    permissionText: "None.",
    scheduledBehavior: "None.",
    installSteps: "None.",
    attestations: { authority: true, privacy: true, consent: true, currentCommit: true },
  };
}

function validateActionContext(event) {
  const fullName = event?.repository?.full_name;
  const issueNumber = event?.issue?.number;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fullName ?? "") || !Number.isSafeInteger(issueNumber) || issueNumber <= 0) {
    throw new Error("The GitHub issue event context is invalid.");
  }
  const [owner, repo] = fullName.split("/");
  return { owner, repo, issueNumber };
}

async function postOrUpdateComment(request, context, markdown) {
  const owner = encodedSegment(context.owner);
  const repo = encodedSegment(context.repo);
  const comments = await request(`/repos/${owner}/${repo}/issues/${context.issueNumber}/comments?per_page=100`, { maxBytes: 4 * 1024 * 1024 });
  const existing = Array.isArray(comments.payload)
    ? comments.payload.find((comment) => typeof comment?.body === "string" && comment.body.includes(REPORT_MARKER) && comment?.user?.type === "Bot")
    : null;
  if (existing?.id) {
    await request(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, { method: "PATCH", body: { body: markdown }, maxBytes: 1024 * 1024 });
  } else {
    await request(`/repos/${owner}/${repo}/issues/${context.issueNumber}/comments`, { method: "POST", body: { body: markdown }, maxBytes: 1024 * 1024 });
  }
}

async function applyReviewLabel(request, context, verdict) {
  const desired = REVIEW_LABELS[verdict];
  if (!desired) return;
  const owner = encodedSegment(context.owner);
  const repo = encodedSegment(context.repo);
  for (const label of Object.values(REVIEW_LABELS)) {
    if (label.name === desired.name) continue;
    await request(`/repos/${owner}/${repo}/issues/${context.issueNumber}/labels/${encodedSegment(label.name)}`, {
      method: "DELETE",
      allowedStatuses: [404],
      maxBytes: 256 * 1024,
    });
  }
  const create = await request(`/repos/${owner}/${repo}/labels`, {
    method: "POST",
    body: desired,
    allowedStatuses: [422],
    maxBytes: 512 * 1024,
  });
  if (![201, 422].includes(create.status)) return;
  await request(`/repos/${owner}/${repo}/issues/${context.issueNumber}/labels`, {
    method: "POST",
    body: { labels: [desired.name] },
    maxBytes: 512 * 1024,
  });
}

async function runCli() {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(helpText());
    return;
  }
  if (!options.event && !options.repo) throw new Error("Use --event or --repo.");
  if (options.event && options.repo) throw new Error("Use either --event or --repo, not both.");

  let event = null;
  let submission;
  if (options.event) {
    event = await loadEvent(options.event);
    submission = parseIssueForm(event?.issue?.body);
  } else {
    submission = localSubmission(options);
  }

  const token = process.env.GITHUB_TOKEN ?? "";
  const result = await reviewSubmission({ submission, token });
  const markdown = renderMarkdown(result);
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (options.markdown) await writeFile(options.markdown, markdown, { encoding: "utf8", mode: 0o600 });
  if (options.json) await writeFile(options.json, json, { encoding: "utf8", mode: 0o600 });
  process.stdout.write(markdown);

  if (options.postComment || options.addLabel) {
    if (!event) throw new Error("Posting comments or labels requires --event.");
    if (!token) throw new Error("GITHUB_TOKEN is required for comments or labels.");
    const context = validateActionContext(event);
    const request = makeGithubClient({ token, deadline: Date.now() + LIMITS.reviewMs });
    if (options.postComment) await postOrUpdateComment(request, context, markdown);
    if (options.addLabel) {
      try {
        await applyReviewLabel(request, context, result.verdict);
      } catch {
        process.stderr.write("registry-review: the report was posted, but a review label could not be applied.\n");
      }
    }
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedPath) {
  runCli().catch((error) => {
    process.stderr.write(`registry-review: ${cleanSingleLine(error?.message ?? error, 500)}\n`);
    process.exitCode = 1;
  });
}
