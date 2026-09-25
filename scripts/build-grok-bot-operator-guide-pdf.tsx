import { mkdir } from "node:fs/promises";
import path from "node:path";

import { renderToFile } from "@react-pdf/renderer";

import {
  GROK_OPERATOR_PDF_OUTPUT_PATH,
  GrokBotOperatorGuidePdf,
} from "../src/components/grok-bot-operator-guide-pdf";

async function main() {
  const outputPath = path.resolve(process.cwd(), GROK_OPERATOR_PDF_OUTPUT_PATH);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await renderToFile(<GrokBotOperatorGuidePdf />, outputPath);
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
