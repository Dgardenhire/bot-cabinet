import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { STARTER_BOTS } from "../data/starter-bots";
import { BOT_DEFINITIONS } from "./bot-definitions";
import {
  buildPublicBotCatalog,
  PUBLIC_BOT_CATALOG,
} from "./public-manifest";

describe("public Bot catalog manifest", () => {
  it("publishes every public definition without inventing evidence claims", () => {
    expect(PUBLIC_BOT_CATALOG.schemaVersion).toBe(1);
    expect(PUBLIC_BOT_CATALOG.count).toBe(STARTER_BOTS.length);
    expect(PUBLIC_BOT_CATALOG.bots.every((bot) => bot.lifecycle === "public")).toBe(
      true,
    );
    expect(JSON.stringify(PUBLIC_BOT_CATALOG)).not.toMatch(
      /"(?:tested|verified|reproduced)":/,
    );
  });

  it("counts only records that are ready for the public catalog", () => {
    const preview = { ...BOT_DEFINITIONS[0], lifecycle: "preview" as const };
    const catalog = buildPublicBotCatalog([preview, BOT_DEFINITIONS[1]]);

    expect(catalog.count).toBe(1);
    expect(catalog.bots.map((bot) => bot.slug)).toEqual([
      BOT_DEFINITIONS[1].slug,
    ]);
  });

  it("matches the committed machine-readable JSON catalog", async () => {
    const generated = JSON.parse(
      await readFile(
        path.join(process.cwd(), "public/api/v1/bots.json"),
        "utf8",
      ),
    );

    expect(generated).toEqual(PUBLIC_BOT_CATALOG);
  });
});
