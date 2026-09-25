import { mkdir } from "node:fs/promises";
import path from "node:path";

import { renderToFile } from "@react-pdf/renderer";

import {
  RELIABLE_BOTS_PDF_OUTPUT_PATH,
  ReliableBotsGuidePdf,
} from "../src/components/reliable-bots-guide-pdf";

async function main() {
  // This is a staging output. Publish it only after a visual review of the
  // rendered pages confirms that the text and layout are correct.
  const outputPath = path.resolve(process.cwd(), RELIABLE_BOTS_PDF_OUTPUT_PATH);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await renderToFile(<ReliableBotsGuidePdf />, outputPath);
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
