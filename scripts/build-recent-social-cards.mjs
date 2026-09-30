import path from "node:path";
import sharp from "sharp";
import { buildTransparentWordmark } from "./lib/transparent-wordmark.mjs";

const root = process.cwd();
const destination = path.join(root, "public/brand/social");
const wordmark = await buildTransparentWordmark(path.join(root, "public/brand/bot-cabinet-wordmark-dark-v1.png"), 310);
const ivory = "#f6f0e3";
const gold = "#d4a64e";

const cards = [
  {
    file: "chatgpt-dots-first-job-v1-1200x630.jpg",
    eyebrow: "CHATGPT DOTS / FIRST JOB",
    title: ["Try a first job", "with Dots"],
    deck: "Early results, real limits, one task to try",
    url: "botcabinet.com/start/dots",
    background: "public/brand/social/sources/dots-first-task-friendly-v1.png",
    illustration: "",
  },
  {
    file: "compare-personal-agents-v1-1200x630.jpg",
    eyebrow: "BOT CABINET / AGENT COMPARISON",
    title: ["Which agent fits", "your job?"],
    deck: "Eight approaches, compared in plain English",
    url: "botcabinet.com/compare",
    background: "public/brand/social/sources/compare-agents-four-bots-v1.png",
  },
  {
    file: "agent-watch-live-listings-v1-1200x630.jpg",
    eyebrow: "AGENT WATCH / NEW AND NOTEWORTHY",
    title: ["Find a new Bot", "worth a look"],
    deck: "Fresh listings, original sources, honest test labels",
    url: "botcabinet.com/watch",
    background: "public/brand/social/sources/agent-watch-curator-v1.png",
  },
  {
    file: "chatgpt-workspace-agent-v1-1200x630.jpg",
    eyebrow: "CHATGPT WORKSPACE AGENTS / GUIDED SETUP",
    title: ["Bring a Bot job", "into ChatGPT"],
    deck: "Set the role, its limits, and a first test",
    url: "botcabinet.com",
    background: "public/brand/social/sources/chatgpt-workspace-steward-v1.png",
  },
  {
    file: "my-workbench-three-runs-v1-1200x630.jpg",
    eyebrow: "MY WORKBENCH / THREE REAL RUNS",
    title: ["Did your Bot", "actually help?"],
    deck: "Save progress and compare the first three results",
    url: "botcabinet.com/workbench",
    background: "public/brand/social/sources/workbench-navigator-v1.png",
  },
];

const safe = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const card of cards) {
  const background = card.background
    ? await sharp(path.join(root, card.background)).resize(1200, 630, { fit: "cover", position: "centre" }).toBuffer()
    : await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#090e0d" } }).png().toBuffer();
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="shade"><stop stop-color="#080d0c" stop-opacity="1"/><stop offset=".52" stop-color="#080d0c" stop-opacity=".96"/><stop offset=".73" stop-color="#080d0c" stop-opacity="${card.background ? ".2" : "1"}"/><stop offset="1" stop-color="#080d0c" stop-opacity="${card.background ? "0" : "1"}"/></linearGradient></defs>
    <style>.small{font: bold 17px 'Courier New';letter-spacing:2px;fill:${gold}}.item{font: 25px Arial;fill:${ivory}}.sub{font: 20px Arial;fill:#d5ded5}.tiny{font: bold 13px 'Courier New';letter-spacing:1px;fill:#c6bda9}.arrow{font: 27px Arial;fill:${gold}}</style>
    <rect width="1200" height="630" fill="url(#shade)"/><rect width="1200" height="9" fill="#c99a43"/>
    <text x="66" y="170" fill="${gold}" font-family="Courier New" font-size="18" font-weight="bold" letter-spacing="3">${safe(card.eyebrow)}</text>
    <text x="66" y="266" fill="${ivory}" font-family="Georgia" font-size="58">${safe(card.title[0])}</text>
    <text x="66" y="337" fill="${ivory}" font-family="Georgia" font-size="58">${safe(card.title[1])}</text>
    <line x1="66" y1="385" x2="132" y2="385" stroke="${gold}" stroke-width="4"/>
    <text x="66" y="441" fill="#d9e0db" font-family="Arial" font-size="23">${safe(card.deck)}</text>
    <line x1="66" y1="560" x2="1134" y2="560" stroke="#d7b267" stroke-opacity=".45"/>
    <text x="66" y="595" fill="#c6bda9" font-family="Courier New" font-size="15" letter-spacing="1">${safe(card.url)}</text>
  </svg>`);
  const output = path.join(destination, card.file);
  await sharp(background).composite([{ input: overlay }, { input: wordmark, top: 55, left: 66 }]).jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toFile(output);
  const meta = await sharp(output).metadata();
  if (meta.width !== 1200 || meta.height !== 630) throw new Error(`Unexpected card size: ${output}`);
  process.stdout.write(`${output}\n`);
}
