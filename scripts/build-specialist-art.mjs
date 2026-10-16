import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { buildTransparentWordmark } from "./lib/transparent-wordmark.mjs";

const artifactRoot = process.argv[2];
if (!artifactRoot || !path.isAbsolute(artifactRoot)) throw new Error("Supply the absolute project art directory");
const bots = JSON.parse(await readFile("src/data/specialist-index.json", "utf8"));
const portraits = "public/bot-portraits/specialists";
const social = "public/brand/social/specialists";
await mkdir(portraits, { recursive: true });
await mkdir(social, { recursive: true });
const wordmark = await buildTransparentWordmark("public/brand/bot-cabinet-wordmark-dark-v1.png", 310);
const escape = value => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const manifest = [];
const thumbnails = [];
for (const bot of bots) {
  let source = path.join(artifactRoot, `${bot.slug}-background-v2.png`);
  try { await access(source); } catch { source = path.join(artifactRoot, `${bot.slug}-original.png`); }
  const original = await readFile(source);
  const preview = await sharp(original).resize(768, 768, { fit: "cover" }).webp({ quality: 84 }).toBuffer();
  await writeFile(`${portraits}/${bot.slug}.webp`, preview);
  const portrait = await sharp(original).resize(630, 630, { fit: "cover" }).toBuffer();
  const words = bot.name.split(" ");
  const title = words.length > 1 ? [words.slice(0, -1).join(" "), words.at(-1)] : [bot.name, ""];
  const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="s"><stop stop-color="#070b0b" stop-opacity="1"/><stop offset=".48" stop-color="#070b0b" stop-opacity=".97"/><stop offset=".72" stop-color="#070b0b" stop-opacity=".12"/><stop offset="1" stop-color="#070b0b" stop-opacity="0"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#s)"/><rect width="1200" height="8" fill="#c99a43"/>
    <text x="66" y="167" fill="#d4a64e" font-family="Courier New" font-size="17" letter-spacing="4">BOT CABINET SPECIALIST</text>
    <text x="66" y="272" fill="#f6f0e3" font-family="Georgia" font-size="60">${escape(title[0])}</text>
    <text x="66" y="343" fill="#f6f0e3" font-family="Georgia" font-size="60">${escape(title[1])}</text>
    <path d="M66 390h66" stroke="#d4a64e" stroke-width="4"/>
    <text x="66" y="449" fill="#d9e0db" font-family="Arial" font-size="23">Role instructions and a first task</text>
    <path d="M66 559h1068" stroke="#d7b267" stroke-opacity=".34"/>
    <text x="66" y="596" fill="#b8b5ad" font-family="Courier New" font-size="15">botcabinet.com/bots/${escape(bot.slug)}</text>
  </svg>`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#070b0b" } })
    .composite([{ input: portrait, left: 570, top: 0 }, { input: overlay }, { input: wordmark, left: 66, top: 55 }])
    .jpeg({ quality: 91 }).toFile(`${social}/${bot.slug}-1200x630.jpg`);
  const thumb = await sharp(preview).resize(220, 220).toBuffer();
  const index = manifest.length;
  thumbnails.push({ input: thumb, left: (index % 6) * 240 + 10, top: Math.floor(index / 6) * 255 + 5 });
  const label = Buffer.from(`<svg width="240" height="30"><text x="8" y="21" fill="#f6f0e3" font-family="Arial" font-size="14">${escape(bot.name)}</text></svg>`);
  thumbnails.push({ input: label, left: (index % 6) * 240, top: Math.floor(index / 6) * 255 + 225 });
  manifest.push({ slug: bot.slug, generator: "OpenAI built-in image generation", source: path.basename(source),
    sourceSha256: createHash("sha256").update(original).digest("hex"),
    image: `/bot-portraits/specialists/${bot.slug}.webp`, imageSha256: createHash("sha256").update(preview).digest("hex") });
}
await writeFile(`${portraits}/provenance.json`, JSON.stringify(manifest, null, 2) + "\n");
await sharp({ create: { width: 1440, height: 765, channels: 3, background: "#070b0b" } }).composite(thumbnails).jpeg({ quality: 88 }).toFile(path.join(artifactRoot, "review-board.jpg"));
console.log(JSON.stringify({ portraits: manifest.length, socialCards: manifest.length, reviewBoard: path.join(artifactRoot, "review-board.jpg") }));
