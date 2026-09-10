import { describe, expect, it } from "vitest";
import { CREW_KITS } from "../data/crew-kits";
import { getStarterBot } from "../data/starter-bots";
import { buildCrewBundle, readGeneratedCrewManifest } from "./crew-bundle";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  createDeterministicTarGzip,
  createDeterministicZip,
} from "../../scripts/content/deterministic-archives";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";
import { compilePortableBotPackV2HermesFiles } from "./portable-bot-pack-v2-artifacts";

describe("complete crew bundles", () => {
  it("includes every member archive with an exact hash and honest evidence", () => {
    for (const kit of CREW_KITS) {
      const { manifest, files } = buildCrewBundle(kit);
      expect(readGeneratedCrewManifest(kit.slug)).toEqual(manifest);
      expect(manifest.members.map(m => m.slug)).toEqual(kit.roles.map(r => r.botSlug));
      expect(manifest.runtimeStatus).toBe("not-tested");
      expect(manifest.schedulesActive).toBe(false);
      for (const member of manifest.members) {
        const bot = getStarterBot(member.slug)!;
        const hermesFiles = compilePortableBotPackV2HermesFiles(
          starterBotToPortablePackV2(bot),
        );
        expect(Buffer.isBuffer(files[member.archivePath])).toBe(true);
        expect(createHash("sha256").update(files[member.archivePath]).digest("hex")).toBe(member.sha256);
        expect(files[member.archivePath]).toEqual(
          createDeterministicTarGzip(member.slug, hermesFiles),
        );
        for (const [name, content] of Object.entries(hermesFiles)) {
          expect(files[`members/${member.slug}/${name}`]).toBe(content);
        }
        expect(member.skillTest).toBe("not-tested");
        expect(member.minimumSupported).toBe(">=0.21.0");
        expect(String(files["SETUP.md"])).toContain(member.name);
        expect(String(files["SETUP.md"])).toContain("[ ]");
      }
      expect(String(files["SETUP.md"])).toContain("Passports are checklists, not locks");
      const bundlePath = `public/downloads/crew-kits/bundles/${kit.slug}`;
      expect(readFileSync(`${bundlePath}.json`, "utf8")).toBe(
        String(files["crew-manifest.json"]),
      );
      expect(readFileSync(`${bundlePath}-setup.md`, "utf8")).toBe(
        String(files["SETUP.md"]),
      );
      expect(readFileSync(`${bundlePath}.zip`)).toEqual(
        createDeterministicZip(files),
      );
    }
  });
  it("fails closed for unknown or duplicate members", () => {
    const kit = CREW_KITS[0];
    expect(() => buildCrewBundle({ ...kit, roles: [{ botSlug: "missing", responsibility: "test" }] })).toThrow();
    expect(() => buildCrewBundle({ ...kit, roles: [kit.roles[0], kit.roles[0]] })).toThrow();
  });
  it("is byte reproducible", () => {
    expect(buildCrewBundle(CREW_KITS[0]).files).toEqual(buildCrewBundle(CREW_KITS[0]).files);
  });
  it("preserves binary archive bytes inside the downloadable ZIP", () => {
    const { files } = buildCrewBundle(CREW_KITS[0]);
    const zip = createDeterministicZip(files);
    let offset = 0;
    const unpacked: Record<string, Buffer> = {};
    while (zip.readUInt32LE(offset) === 0x04034b50) {
      const length = zip.readUInt32LE(offset + 18);
      const nameLength = zip.readUInt16LE(offset + 26);
      const extraLength = zip.readUInt16LE(offset + 28);
      const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString();
      const start = offset + 30 + nameLength + extraLength;
      unpacked[name] = zip.subarray(start, start + length);
      offset = start + length;
    }
    expect(Object.keys(unpacked).sort()).toEqual(Object.keys(files).sort());
    for (const [name, content] of Object.entries(files)) {
      expect(unpacked[name]).toEqual(Buffer.isBuffer(content) ? content : Buffer.from(content));
    }
  });
});
