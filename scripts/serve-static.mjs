import { access, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const outputDirectory = resolve(process.cwd(), "out");
const host = process.env.HOST?.trim() || "127.0.0.1";
const parsedPort = Number(process.env.PORT || 3000);
const port =
  Number.isInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65_535
    ? parsedPort
    : 3000;

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function safeOutputPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;

  const candidate = resolve(outputDirectory, decoded.replace(/^\/+/, ""));
  if (
    candidate !== outputDirectory &&
    !candidate.startsWith(outputDirectory + sep)
  ) {
    return null;
  }
  return candidate;
}

async function findFile(pathname) {
  const candidate = safeOutputPath(pathname);
  if (!candidate) return null;

  const choices = pathname.endsWith("/")
    ? [resolve(candidate, "index.html")]
    : [candidate, resolve(candidate, "index.html")];

  for (const choice of choices) {
    try {
      if ((await stat(choice)).isFile()) return choice;
    } catch {
      // Try the next static-export path.
    }
  }
  return null;
}

async function sendFile(response, filePath, method, status = 200) {
  const body = await readFile(filePath);
  response.writeHead(status, {
    "Cache-Control": "no-cache",
    "Content-Length": body.byteLength,
    "Content-Type":
      contentTypes.get(extname(filePath).toLowerCase()) ??
      "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(method === "HEAD" ? undefined : body);
}

await access(outputDirectory).catch(() => {
  throw new Error(
    "Static export not found at " + outputDirectory +
      ". Run npm run build first.",
  );
});

const server = createServer(async (request, response) => {
  const method = request.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, {
      Allow: "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Method not allowed.");
    return;
  }

  try {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const filePath = await findFile(pathname);
    if (filePath) {
      await sendFile(response, filePath, method);
      return;
    }

    const notFoundPath = resolve(outputDirectory, "404.html");
    try {
      await sendFile(response, notFoundPath, method, 404);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(method === "HEAD" ? undefined : "Not found.");
    }
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(method === "HEAD" ? undefined : "Preview server error.");
  }
});

server.listen(port, host, () => {
  console.log("Bot Cabinet static preview: http://" + host + ":" + port);
});
