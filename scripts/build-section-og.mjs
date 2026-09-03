import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

import { buildTransparentWordmark } from "./lib/transparent-wordmark.mjs";

const root = process.cwd();
const wordmark = path.join(root, "public", "brand", "bot-cabinet-wordmark-dark-v1.png");

const cards = [
  {
    output: "bot-fit-test-1200x630.jpg",
    source: path.join(root, "public", "atelier", "orrery.jpg"),
    sourcePosition: "right",
    eyebrow: "BOT FIT TEST / CHOOSE BEFORE YOU BUILD",
    title: ["Should this work be", "a Bot?"],
    description: "Choose an Assignment, Skill, Routine, Bot, or Crew",
    url: "botcabinet.com/fit",
  },
  {
    output: "bot-portrait-studio-1200x630.jpg",
    source: path.join(root, "public", "downloads", "bot-portraits", "hermes", "navigator-1024.png"),
    sourcePosition: "right",
    eyebrow: "BOT PORTRAIT STUDIO",
    title: ["Give your Bot a face", "Choose one or design your own"],
    description: "Hermes-ready portraits and a guided custom image recipe",
    url: "botcabinet.com/portraits",
  },
  {
    output: "first-bot-1200x630.jpg",
    source: path.join(root, "public", "atelier", "scout.jpg"),
    crop: { left: 300, top: 190, width: 900, height: 473 },
    flop: true,
    sourcePosition: "centre",
    eyebrow: "START HERE / YOUR FIRST BOT",
    title: ["Put Scout to work", "in about 10 minutes"],
    description: "Install, import, run a real job and check the result",
    url: "botcabinet.com/start",
  },
  {
    output: "grok-bot-templates-1200x630.jpg",
    source: path.join(root, "public", "atelier", "manta.jpg"),
    sourcePosition: "right",
    eyebrow: "PORTABLE BOT RECIPES",
    title: ["Adapt a Bot Cabinet role", "for Grok Bot"],
    description: "Role, inputs, first test and Bot Passport included",
    url: "botcabinet.com/platforms/grok-bot",
  },
  {
    output: "proof-room-1200x630.jpg",
    source: path.join(root, "public", "atelier", "scout.jpg"),
    crop: { left: 240, top: 170, width: 930, height: 488 },
    flop: true,
    sourcePosition: "centre",
    eyebrow: "PROOF ROOM / BOT AT WORK",
    title: ["See how the evidence builds", "from request toward result"],
    description: "Inspect inputs, exact prompts, records, gaps and human decisions",
    url: "botcabinet.com/proof",
  },
];

const outputDirectory = path.join(root, "public", "brand", "social");
await mkdir(outputDirectory, { recursive: true });

const wordmarkBuffer = await buildTransparentWordmark(wordmark, 310);

async function renderCard(card) {
  let source = sharp(card.source);
  if (card.crop) source = source.extract(card.crop);
  if (card.flop) source = source.flop();

  const background = await source
    .resize(1200, 630, { fit: "cover", position: card.sourcePosition })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const overlay = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#070b0b" stop-opacity="0.99"/>
          <stop offset="0.54" stop-color="#070b0b" stop-opacity="0.94"/>
          <stop offset="0.72" stop-color="#070b0b" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#070b0b" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <rect width="1200" height="9" fill="#c99a43"/>
      <text x="66" y="169" fill="#d4a64e" font-family="Courier New, monospace" font-size="18" font-weight="700" letter-spacing="4">${card.eyebrow}</text>
      <text x="66" y="267" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="61">${card.title[0]}</text>
      <text x="66" y="338" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="61">${card.title[1]}</text>
      <line x1="66" y1="390" x2="132" y2="390" stroke="#d4a64e" stroke-width="4"/>
      <text x="66" y="449" fill="#d9e0db" font-family="Arial, Helvetica, sans-serif" font-size="24">${card.description}</text>
      <line x1="66" y1="559" x2="1134" y2="559" stroke="#d7b267" stroke-opacity="0.34"/>
      <text x="66" y="596" fill="#b8b5ad" font-family="Courier New, monospace" font-size="16" letter-spacing="2">${card.url}</text>
      <text x="1134" y="596" text-anchor="end" fill="#d9e0db" font-family="Courier New, monospace" font-size="13" letter-spacing="2">A LINCHPIN PROJECT</text>
    </svg>
  `);

  const output = path.join(outputDirectory, card.output);
  await sharp(background)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: wordmarkBuffer, top: 55, left: 66 },
    ])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toFile(output);

  return output;
}

const outputs = await Promise.all(cards.map(renderCard));
for (const output of outputs) process.stdout.write(`${output}\n`);
