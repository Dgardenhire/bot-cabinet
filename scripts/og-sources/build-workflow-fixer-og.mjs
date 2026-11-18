// Workflow Fixer share card. Same frame as the Bot showcase cards in
// scripts/build-section-og.mjs (portrait right, serif headline left), with
// the Mechanic portrait from /atelier. Run from the repo root:
//   node scripts/og-sources/build-workflow-fixer-og.mjs
import path from "node:path";
import sharp from "sharp";

import { buildTransparentWordmark } from "../lib/transparent-wordmark.mjs";

const root = process.cwd();
const output = path.join(root, "public", "brand", "social", "workflow-fixer-v2-1200x630.jpg");

// Head and chest of the Mechanic, square, so the face sits in the upper third.
const portrait = await sharp(path.join(root, "public", "atelier", "mechanic.jpg"))
  .extract({ left: 40, top: 40, width: 1120, height: 1120 })
  .resize(630, 630)
  .toBuffer();

const background = await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#070b0b" } })
  .composite([{ input: portrait, left: 570, top: 0 }])
  .jpeg({ quality: 95 })
  .toBuffer();

const overlay = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#070b0b" stop-opacity="0.99"/>
      <stop offset="0.5" stop-color="#070b0b" stop-opacity="0.95"/>
      <stop offset="0.66" stop-color="#070b0b" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#070b0b" stop-opacity="0.04"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="9" fill="#c99a43"/>
  <text x="66" y="236" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="66">Find the slow step</text>
  <text x="66" y="312" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="66">in your <tspan fill="#e0b45c" font-style="italic">work</tspan></text>
  <line x1="66" y1="364" x2="132" y2="364" stroke="#d4a64e" stroke-width="4"/>
  <text x="66" y="420" fill="#d9e0db" font-family="Georgia, Times New Roman, serif" font-size="27">Map how one job really runs, then leave</text>
  <text x="66" y="458" fill="#d9e0db" font-family="Georgia, Times New Roman, serif" font-size="27">with a prompt or Bot that fixes it.</text>
  <text x="66" y="580" fill="#e0b45c" font-family="Georgia, Times New Roman, serif" font-size="22">Workflow Fixer, free at botcabinet.com/workflow</text>
</svg>`);

const wordmark = await buildTransparentWordmark(
  path.join(root, "public", "brand", "bot-cabinet-wordmark-dark-v1.png"),
  310,
);

await sharp(background)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: wordmark, top: 55, left: 66 },
  ])
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(output);

process.stdout.write(`${output}\n`);
