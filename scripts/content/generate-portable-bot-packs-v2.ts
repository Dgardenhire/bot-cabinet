import {
  mkdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { STARTER_BOTS } from "../../src/data/starter-bots";
import {
  compilePortableBotPackV2HermesFiles,
  compilePortableBotPackV2TextArtifacts,
  PORTABLE_BOT_PACK_V2_SCHEMA,
  portableBotPackV2ApiIndex,
  portableBotPackV2Catalog,
} from "../../src/lib/portable-bot-pack-v2-artifacts";
import {
  starterBotToPortablePackV2,
  validatePortableBotPackV2,
  type PortableBotPackV2,
} from "../../src/lib/portable-bot-pack-v2";
import {
  createDeterministicTarGzip,
  createDeterministicZip,
} from "./deterministic-archives";

async function writeOutputFile(filePath: string, content: string | Buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function buildHermesArchives(
  outputRoot: string,
  pack: PortableBotPackV2,
) {
  const slug = pack.identity.slug;
  const packageDirectory = path.join(outputRoot, slug);
  const files = compilePortableBotPackV2HermesFiles(pack);
  const relativeFilePaths = Object.keys(files).sort();

  await mkdir(packageDirectory, { recursive: true });
  await Promise.all(
    relativeFilePaths.map((relativePath) =>
      writeOutputFile(path.join(packageDirectory, relativePath), files[relativePath]),
    ),
  );

  const zipPath = path.join(outputRoot, `${slug}.zip`);
  const archivePath = path.join(outputRoot, `${slug}.tar.gz`);
  await Promise.all([
    writeOutputFile(zipPath, createDeterministicZip(files)),
    writeOutputFile(archivePath, createDeterministicTarGzip(slug, files)),
  ]);
}

async function main() {
  const projectRoot = process.cwd();
  const publicRoot = path.join(projectRoot, "public");
  const apiDirectory = path.join(publicRoot, "api/v2");
  const portableDirectory = path.join(
    publicRoot,
    "downloads/portable-bot-packs/v2",
  );
  const hermesDirectory = path.join(publicRoot, "downloads/starter-bots/v2");
  const grokDirectory = path.join(
    publicRoot,
    "downloads/grok-bot-templates/v2",
  );
  const generatedDirectories = [
    apiDirectory,
    portableDirectory,
    hermesDirectory,
    grokDirectory,
  ];

  await Promise.all(
    generatedDirectories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
  await Promise.all(
    generatedDirectories.map((directory) =>
      mkdir(directory, { recursive: true }),
    ),
  );

  const packs = STARTER_BOTS.map(starterBotToPortablePackV2);
  for (const pack of packs) {
    const issues = validatePortableBotPackV2(pack);
    if (issues.length) {
      throw new Error(
        `${pack.identity.slug} produced an invalid V2 pack:\n${issues.join("\n")}`,
      );
    }

    const textArtifacts = compilePortableBotPackV2TextArtifacts(pack);
    await Promise.all(
      textArtifacts.map((artifact) =>
        writeOutputFile(
          path.join(publicRoot, artifact.relativePath),
          artifact.content,
        ),
      ),
    );
    await buildHermesArchives(hermesDirectory, pack);
  }

  await Promise.all([
    writeOutputFile(
      path.join(apiDirectory, "index.json"),
      `${JSON.stringify(portableBotPackV2ApiIndex(packs.length), null, 2)}\n`,
    ),
    writeOutputFile(
      path.join(apiDirectory, "bots.json"),
      `${JSON.stringify(portableBotPackV2Catalog(packs), null, 2)}\n`,
    ),
    writeOutputFile(
      path.join(apiDirectory, "portable-bot-pack.schema.json"),
      `${JSON.stringify(PORTABLE_BOT_PACK_V2_SCHEMA, null, 2)}\n`,
    ),
  ]);

  process.stdout.write(
    `${packs.length} Portable Bot Pack V2 records, Hermes archives, and Grok manual build briefs generated\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Unable to generate Portable Bot Pack V2 artifacts: ${String(error)}\n`,
  );
  process.exitCode = 1;
});
