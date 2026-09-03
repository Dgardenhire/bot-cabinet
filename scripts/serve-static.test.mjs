import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { contentTypeFor, createStaticServer } from "./serve-static.mjs";

test("serves RSS XML with the RSS content type", async (t) => {
  assert.equal(contentTypeFor("feed.xml"), "application/rss+xml; charset=utf-8");
  assert.equal(contentTypeFor("sitemap.xml"), "application/xml; charset=utf-8");
  assert.equal(contentTypeFor("unknown.bin"), "application/octet-stream");

  const outputDirectory = await mkdtemp(path.join(tmpdir(), "bot-cabinet-static-"));
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "feed.xml"), "<rss />\n", "utf8");

  const server = createStaticServer(outputDirectory);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

  const address = server.address();
  assert.notEqual(address, null);
  assert.equal(typeof address, "object");
  const response = await fetch(`http://127.0.0.1:${address.port}/feed.xml`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/rss+xml; charset=utf-8");
  assert.equal(await response.text(), "<rss />\n");
});
