import { describe, expect, it } from "vitest";

import { buildBotBlueprint, type WorkshopDraft } from "./workshop";
import {
  buildHermesProfileArchive,
  buildHermesProfileTar,
  hermesProfileArchiveFileName,
  hermesProfileFiles,
  hermesProfileSlug,
} from "./hermes-profile";

const draft: WorkshopDraft = {
  botName: "Morning Briefing / Scout",
  jobOutcome: "Prepare a concise morning briefing from approved sources.",
  inputsContext: "Approved source list",
  outputsDeliverables: "Briefing\nSource list",
  cadenceTrigger: "When requested",
  toolsIntegrations: "Web research",
  approvalBoundaries: "Ask before publishing",
  firstRunTest: "Prepare a three-source briefing.",
};

function tarNames(archive: Uint8Array) {
  const decoder = new TextDecoder();
  const names: string[] = [];
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.slice(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = decoder.decode(header.slice(0, 100)).replace(/\0.*$/, "");
    const sizeText = decoder.decode(header.slice(124, 136)).replace(/\0.*$/, "").trim();
    const size = Number.parseInt(sizeText || "0", 8);
    names.push(name);
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return names;
}

describe("Hermes profile archive", () => {
  const blueprint = buildBotBlueprint(draft);

  it("creates a safe profile name and filename", () => {
    expect(hermesProfileSlug(blueprint.profile.name)).toBe("morning-briefing-scout");
    expect(hermesProfileArchiveFileName(blueprint)).toBe("morning-briefing-scout-hermes-profile.tar.gz");
  });

  it.each(["hermes", "default", "test", "tmp", "root", "sudo"])(
    "avoids the reserved Hermes profile name %s",
    (name) => {
      expect(hermesProfileSlug(name)).toBe(`bot-${name}`);
    },
  );

  it("contains one profile root and only the intended public files", () => {
    expect(tarNames(buildHermesProfileTar(blueprint))).toEqual([
      "morning-briefing-scout/",
      "morning-briefing-scout/distribution.yaml",
      "morning-briefing-scout/profile.yaml",
      "morning-briefing-scout/SOUL.md",
      "morning-briefing-scout/README.md",
      "morning-briefing-scout/BOT-PASSPORT.md",
    ]);
  });

  it("creates a valid gzip wrapper for browser downloads", async () => {
    const blob = await buildHermesProfileArchive(blueprint);
    const decompressed = await new Response(
      blob.stream().pipeThrough(new DecompressionStream("gzip")),
    ).arrayBuffer();
    expect(new Uint8Array(decompressed)).toEqual(buildHermesProfileTar(blueprint));
  });

  it("does not add credentials, memories, sessions, or local paths", () => {
    const combined = Object.entries(hermesProfileFiles(blueprint)).flat().join("\n");
    expect(combined).not.toMatch(/\.env|auth\.json|sessions|\/Users\/|\.\.\//i);
    expect(combined).toContain("Ask before publishing");
    expect(combined).toContain("Bot Passport");
    expect(hermesProfileFiles(blueprint)["profile.yaml"]).toContain(
      'display_name: "Morning Briefing / Scout"',
    );
    expect(hermesProfileFiles(blueprint)["distribution.yaml"]).toContain(
      "  - profile.yaml",
    );
  });
});
