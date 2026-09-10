import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CREW_KITS } from "../../src/data/crew-kits";
import { buildCrewBundle } from "../../src/lib/crew-bundle";
import { createDeterministicZip } from "./deterministic-archives";

async function main() {
  const output = path.join(
    process.cwd(),
    "public/downloads/crew-kits/bundles",
  );
  await mkdir(output, { recursive: true });
  for (const kit of CREW_KITS) {
    const { files } = buildCrewBundle(kit);
    await Promise.all([
      writeFile(
        path.join(output, `${kit.slug}.zip`),
        createDeterministicZip(files),
      ),
      writeFile(
        path.join(output, `${kit.slug}.json`),
        files["crew-manifest.json"],
      ),
      writeFile(
        path.join(output, `${kit.slug}-setup.md`),
        files["SETUP.md"],
      ),
    ]);
  }
  console.log(
    `Built ${CREW_KITS.length} complete crew bundles (no active schedules)`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
