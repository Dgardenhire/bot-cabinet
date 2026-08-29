import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const root = process.cwd();
const routes = [
  ["start", "/brand/social/first-bot-1200x630.jpg"],
  ["bots", "/brand/social/the-cabinet-1200x630.jpg"],
  ["workshop", "/brand/social/bot-lab-1200x630.jpg"],
  ["use-cases", "/brand/social/bot-crews-1200x630.jpg"],
  ["crew-kits", "/brand/crew-kits-og-v2-1200x630.jpg"],
  ["community", "/brand/social/community-registry-1200x630.jpg"],
  ["guides", "/brand/social/field-manual-1200x630.jpg"],
  ["trust", "/brand/social/inspection-desk-1200x630.jpg"],
  ["contribute", "/brand/social/submission-desk-1200x630.jpg"],
  ["about", "/brand/social/about-bot-cabinet-1200x630.jpg"],
  ["platforms/grok-bot", "/brand/social/grok-bot-templates-1200x630.jpg"],
];

const errors = [];

for (const [route, imagePath] of routes) {
  const htmlPath = path.join(root, "out", route, "index.html");
  const html = await readFile(htmlPath, "utf8");
  const absoluteImage = `https://botcabinet.com${imagePath}`;
  const canonical = `https://botcabinet.com/${route}/`;

  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    errors.push(`${route}: canonical is missing or incorrect`);
  }
  if (!html.includes(`<meta property="og:image" content="${absoluteImage}"`)) {
    errors.push(`${route}: dedicated Open Graph image is missing`);
  }
  if (!html.includes(`<meta name="twitter:image" content="${absoluteImage}"`)) {
    errors.push(`${route}: dedicated X/Twitter image is missing`);
  }

  const metadata = await sharp(path.join(root, "public", imagePath)).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630) {
    errors.push(`${route}: social image is ${metadata.width}x${metadata.height}, expected 1200x630`);
  }
}

if (errors.length) {
  throw new Error(`Social metadata audit failed:\n- ${errors.join("\n- ")}`);
}

process.stdout.write(`${routes.length} section social cards verified\n`);
