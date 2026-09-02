#!/usr/bin/env node

/**
 * Read-only link audit for the statically exported registry.
 *
 * Usage:
 *   node scripts/audit-links.mjs out
 *   node scripts/audit-links.mjs out --summary
 *   node scripts/audit-links.mjs out --check-external
 *
 * The script prints JSON to stdout and never writes to the site. External
 * checking issues HEAD/GET requests only; it does not clone or execute linked
 * repositories.
 */

import { promises as fs } from "node:fs";
import { isIP } from "node:net";
import path from "node:path";
import process from "node:process";

const SITE_ORIGIN = "https://registry.invalid";
const EXTERNAL_CONCURRENCY = 6;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 8;

function usage(message) {
  if (message) console.error(message);
  console.error("Usage: node scripts/audit-links.mjs [export-directory] [--summary] [--check-external]");
  process.exitCode = 2;
}

function parseArguments(argv) {
  let exportDirectory = "out";
  let sawDirectory = false;
  let checkExternal = false;
  let summaryOnly = false;

  for (const argument of argv) {
    if (argument === "--check-external") {
      checkExternal = true;
    } else if (argument === "--summary") {
      summaryOnly = true;
    } else if (argument === "--help" || argument === "-h") {
      return { help: true };
    } else if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (!sawDirectory) {
      exportDirectory = argument;
      sawDirectory = true;
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return { exportDirectory: path.resolve(exportDirectory), checkExternal, summaryOnly, help: false };
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile()) files.push(absolute);
  }

  return files;
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)));
}

function extractLinks(html) {
  const links = [];
  const tagPattern = /<(a|link)\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))[^>]*>/gi;
  let match;

  while ((match = tagPattern.exec(html))) {
    links.push({
      element: match[1].toLowerCase(),
      href: decodeHtml(match[2] ?? match[3] ?? match[4] ?? ""),
    });
  }

  return links;
}

function routeForHtml(exportDirectory, filename) {
  const relative = path.relative(exportDirectory, filename).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function routeCandidates(exportDirectory, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  if (!decoded.startsWith("/") || decoded.includes("\0")) return [];
  const relative = decoded.replace(/^\/+/, "");
  const normalized = path.normalize(relative);
  if (normalized === ".." || normalized.startsWith(`..${path.sep}`)) return [];

  if (decoded === "/") return [path.join(exportDirectory, "index.html")];

  const base = path.join(exportDirectory, normalized);
  const candidates = [base];
  if (path.extname(normalized)) candidates.push(`${base}.html`);
  else candidates.push(`${base}.html`, path.join(base, "index.html"));
  return [...new Set(candidates)];
}

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) return candidate;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  return null;
}

function anchorExists(html, fragment) {
  if (!fragment) return true;
  let decoded;
  try {
    decoded = decodeURIComponent(fragment);
  } catch {
    return false;
  }

  const attributePattern = /\b(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = attributePattern.exec(html))) {
    if (decodeHtml(match[1] ?? match[2] ?? "") === decoded) return true;
  }
  return false;
}

function occurrenceKey(item) {
  return `${item.source}\u0000${item.element}\u0000${item.href}`;
}

function uniqueOccurrences(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = occurrenceKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isObviouslyPrivateHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return true;

  if (isIP(host) === 6) {
    if (host === "::" || host === "::1") return true;
    if (/^(?:fc|fd|fe8|fe9|fea|feb)/.test(host)) return true;
    if (host.startsWith("::ffff:")) return isObviouslyPrivateHost(host.slice("::ffff:".length));
    return false;
  }

  const octets = host.split(".").map(Number);
  if (isIP(host) !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function externalCategory(status) {
  if (status >= 200 && status < 400) return "reachable";
  if ([401, 403, 405, 408, 425, 429, 451].includes(status)) return "access-restricted";
  if ([404, 410].includes(status)) return "not-found";
  if (status >= 500) return "server-error";
  return "unexpected-status";
}

async function requestOnce(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "User-Agent": "Hermes-Bot-Registry-Link-Audit/1.0",
        ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
      },
    });
    try {
      await response.body?.cancel();
    } catch {
      // The response body may already be closed (especially for HEAD).
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function requestFollowingPublicRedirects(startUrl, method) {
  let current = new URL(startUrl);
  const visited = new Set();

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    if (!["http:", "https:"].includes(current.protocol)) throw new Error(`unsupported redirect protocol ${current.protocol}`);
    if (current.username || current.password) throw new Error("URL credentials are not allowed");
    if (isObviouslyPrivateHost(current.hostname)) throw new Error("local/private destinations are not checked");
    if (visited.has(current.href)) throw new Error("redirect loop");
    visited.add(current.href);

    const response = await requestOnce(current.href, method);
    if (response.status < 300 || response.status >= 400) {
      return { response, finalUrl: current.href, redirectCount };
    }

    const location = response.headers.get("location");
    if (!location) return { response, finalUrl: current.href, redirectCount };
    current = new URL(location, current);
  }

  throw new Error(`more than ${MAX_REDIRECTS} redirects`);
}

async function checkExternalUrl(url) {
  const started = Date.now();
  try {
    let result = await requestFollowingPublicRedirects(url, "HEAD");
    let method = "HEAD";

    if (result.response.status >= 400 && result.response.status !== 429) {
      result = await requestFollowingPublicRedirects(url, "GET");
      method = "GET";
    }

    return {
      url,
      status: result.response.status,
      category: externalCategory(result.response.status),
      method,
      finalUrl: result.finalUrl,
      redirects: result.redirectCount,
      elapsedMs: Date.now() - started,
    };
  } catch (error) {
    return {
      url,
      status: null,
      category: error?.name === "AbortError" ? "timeout" : "network-error",
      error: String(error?.message ?? error),
      elapsedMs: Date.now() - started,
    };
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function audit(exportDirectory, checkExternal) {
  const allFiles = await walk(exportDirectory);
  const htmlFiles = allFiles.filter((filename) => filename.endsWith(".html")).sort();
  const htmlByFile = new Map();
  const rawOccurrences = [];

  for (const filename of htmlFiles) {
    const html = await fs.readFile(filename, "utf8");
    htmlByFile.set(filename, html);
    const source = routeForHtml(exportDirectory, filename);
    for (const link of extractLinks(html)) rawOccurrences.push({ source, ...link });
  }

  const occurrences = uniqueOccurrences(rawOccurrences);
  const internal = [];
  const externalOccurrences = [];
  const ignored = [];

  for (const occurrence of occurrences) {
    if (!occurrence.href) {
      internal.push({ ...occurrence, status: "broken", reason: "empty href" });
      continue;
    }

    let resolved;
    try {
      resolved = new URL(occurrence.href, new URL(occurrence.source, SITE_ORIGIN));
    } catch {
      internal.push({ ...occurrence, status: "broken", reason: "invalid URL syntax" });
      continue;
    }

    if (resolved.protocol === "http:" || resolved.protocol === "https:") {
      if (resolved.origin !== SITE_ORIGIN) {
        externalOccurrences.push({ ...occurrence, url: resolved.href });
        continue;
      }

      const targetFile = await firstExisting(routeCandidates(exportDirectory, resolved.pathname));
      if (!targetFile) {
        internal.push({ ...occurrence, target: `${resolved.pathname}${resolved.search}${resolved.hash}`, status: "broken", reason: "no exported route or asset" });
        continue;
      }

      if (resolved.hash && !anchorExists(htmlByFile.get(targetFile) ?? (await fs.readFile(targetFile, "utf8")), resolved.hash.slice(1))) {
        internal.push({ ...occurrence, target: `${resolved.pathname}${resolved.search}${resolved.hash}`, status: "broken", reason: "fragment target not found" });
        continue;
      }

      internal.push({
        ...occurrence,
        target: `${resolved.pathname}${resolved.search}${resolved.hash}`,
        status: "resolved",
        file: path.relative(exportDirectory, targetFile).split(path.sep).join("/"),
      });
      continue;
    }

    ignored.push({ ...occurrence, protocol: resolved.protocol });
  }

  const externalUrls = [...new Set(externalOccurrences.map(({ url }) => url))].sort();
  const externalChecks = checkExternal
    ? await mapWithConcurrency(externalUrls, EXTERNAL_CONCURRENCY, checkExternalUrl)
    : [];

  const externalByUrl = new Map(externalChecks.map((check) => [check.url, check]));
  const brokenInternal = internal.filter(({ status }) => status === "broken");
  const externalSummary = Object.fromEntries(
    [...new Set(externalChecks.map(({ category }) => category))]
      .sort()
      .map((category) => [category, externalChecks.filter((check) => check.category === category).length]),
  );

  return {
    generatedAt: new Date().toISOString(),
    exportDirectory,
    externalNetworkCheckPerformed: checkExternal,
    summary: {
      htmlFiles: htmlFiles.length,
      uniqueHrefOccurrences: occurrences.length,
      internalOccurrences: internal.length,
      internalResolved: internal.length - brokenInternal.length,
      internalBroken: brokenInternal.length,
      uniqueExternalUrls: externalUrls.length,
      external: externalSummary,
      ignoredOccurrences: ignored.length,
    },
    brokenInternal,
    internal,
    external: externalUrls.map((url) => ({
      ...(externalByUrl.get(url) ?? { url, category: "not-checked", status: null }),
      occurrences: externalOccurrences.filter((item) => item.url === url).map(({ source, href, element }) => ({ source, href, element })),
    })),
    ignored,
  };
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    usage(String(error?.message ?? error));
    return;
  }

  if (options.help) {
    usage();
    process.exitCode = 0;
    return;
  }

  try {
    const result = await audit(options.exportDirectory, options.checkExternal);
    const output = options.summaryOnly
      ? { generatedAt: result.generatedAt, ...result.summary, brokenInternal: result.brokenInternal }
      : result;
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    if (result.summary.internalBroken > 0) process.exitCode = 1;
  } catch (error) {
    console.error(`Link audit failed: ${String(error?.message ?? error)}`);
    process.exitCode = 2;
  }
}

await main();
