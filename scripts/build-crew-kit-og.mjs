import path from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const root = process.cwd();
const output = path.join(root, "public", "brand", "crew-kits-og-1200x630.jpg");
const source = path.join(root, "public", "use-cases", "client-meeting-follow-up.webp");
const wordmark = path.join(root, "public", "brand", "bot-cabinet-wordmark-dark-v1.png");

await mkdir(path.dirname(output), { recursive: true });

const background = await sharp(source)
  .flop()
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toBuffer();

const wordmarkBuffer = await sharp(wordmark)
  .resize({ width: 255 })
  .png()
  .toBuffer();

const overlay = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#09110f" stop-opacity="0.98"/>
        <stop offset="0.52" stop-color="#09110f" stop-opacity="0.94"/>
        <stop offset="0.70" stop-color="#09110f" stop-opacity="0.28"/>
        <stop offset="1" stop-color="#09110f" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <line x1="66" y1="185" x2="177" y2="185" stroke="#d7b267" stroke-width="4"/>
    <text x="66" y="158" fill="#a8d9e7" font-family="Courier New, monospace" font-size="18" letter-spacing="4">CREW KITS / STANDING BOT TEAMS</text>
    <text x="66" y="275" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="64">Build a standing team</text>
    <text x="66" y="344" fill="#f6f0e3" font-family="Georgia, Times New Roman, serif" font-size="64">of AI specialists</text>
    <text x="66" y="405" fill="#d9e0db" font-family="Arial, Helvetica, sans-serif" font-size="24">Roles, workflows, operating rhythm, approval rules</text>
    <text x="66" y="440" fill="#d9e0db" font-family="Arial, Helvetica, sans-serif" font-size="24">and a complete implementation plan.</text>
    <rect x="66" y="493" width="436" height="72" fill="#12201b" fill-opacity="0.78" stroke="#b9842e"/>
    <text x="88" y="523" fill="#d7b267" font-family="Courier New, monospace" font-size="15" font-weight="700" letter-spacing="2">11 COMPLETE CREW KITS</text>
    <text x="88" y="549" fill="#f6f0e3" font-family="Arial, Helvetica, sans-serif" font-size="18">botcabinet.com/crew-kits</text>
    <line x1="66" y1="590" x2="1134" y2="590" stroke="#d7b267" stroke-opacity="0.34"/>
    <text x="1134" y="614" text-anchor="end" fill="#d9e0db" font-family="Courier New, monospace" font-size="13" letter-spacing="2">A LINCHPIN PROJECT</text>
  </svg>
`);

await sharp(background)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: wordmarkBuffer, top: 55, left: 66 },
  ])
  .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
  .toFile(output);

await copyFile(output, path.join(root, "public", "brand", "crew-kits-og-v2-1200x630.jpg"));

process.stdout.write(`${output}\n`);
