import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { STARTER_BOTS } from "../../src/data/starter-bots";
import {
  portableBotPackFileName,
  portableBotPackToGrokMarkdown,
  portableBotPackToMarkdown,
  starterBotToPortablePack,
} from "../../src/lib/portable-bot-pack";

async function main() {
  const projectRoot = process.cwd();
  const portableDirectory = path.join(
    projectRoot,
    "public/downloads/portable-bot-packs",
  );
  const grokDirectory = path.join(
    projectRoot,
    "public/downloads/grok-bot-templates",
  );

  await Promise.all([
    mkdir(portableDirectory, { recursive: true }),
    mkdir(grokDirectory, { recursive: true }),
  ]);

  for (const bot of STARTER_BOTS) {
    const pack = starterBotToPortablePack(bot);
    await Promise.all([
      writeFile(
        path.join(portableDirectory, portableBotPackFileName(pack)),
        portableBotPackToMarkdown(pack),
        "utf8",
      ),
      writeFile(
        path.join(portableDirectory, `${bot.slug}.json`),
        `${JSON.stringify(pack, null, 2)}\n`,
        "utf8",
      ),
      writeFile(
        path.join(grokDirectory, `${bot.slug}.md`),
        portableBotPackToGrokMarkdown(pack),
        "utf8",
      ),
    ]);
  }

  process.stdout.write(
    `${STARTER_BOTS.length} portable Bot Packs and Grok Bot build briefs generated\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Unable to generate portable Bot Packs: ${String(error)}\n`,
  );
  process.exitCode = 1;
});
