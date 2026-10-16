import { describe, expect, it } from "vitest";
import { AGENT_RESOURCE_ENTRIES } from "./agent-resources";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

describe("complete agent discovery index", () => {
  it("includes starters, newer specialists, kits and manual crew plans without duplicates", () => {
    expect(AGENT_RESOURCE_ENTRIES).toHaveLength(59);
    expect(new Set(AGENT_RESOURCE_ENTRIES.map(entry => entry.id)).size).toBe(59);
    for (const [kind, count] of Object.entries({ "starter-bot": 20, "manual-specialist": 18, "crew-kit": 11, "manual-crew-plan": 10 })) {
      expect(AGENT_RESOURCE_ENTRIES.filter(entry => entry.kind === kind)).toHaveLength(count);
    }
  });
  it("keeps manual instructions distinct from importable archives and does not upgrade test claims", () => {
    for (const entry of AGENT_RESOURCE_ENTRIES.filter(item => item.kind === "manual-specialist")) {
      expect(entry.setup).toBe("manual-role-instructions");
      expect(entry.testStatus.level).toContain("not-native-app-tested");
      expect(entry.files[0].url).toMatch(/\.md$/);
    }
    expect(AGENT_RESOURCE_ENTRIES.find(entry => entry.id === "crew-kit:publishing-desk")?.testStatus.level).toBe("latest-independent-repeat-failed");
  });
  it("resolves every crew member to a published resource", () => {
    const ids = new Set(AGENT_RESOURCE_ENTRIES.map(entry => entry.id));
    for (const entry of AGENT_RESOURCE_ENTRIES) {
      if ("members" in entry) for (const member of entry.members) expect(ids.has(member), member).toBe(true);
    }
  });
  it("publishes matching hashes and byte sizes for every downloadable resource", () => {
    const published = JSON.parse(readFileSync("public/api/v1/resources.json", "utf8"));
    expect(published.count).toBe(AGENT_RESOURCE_ENTRIES.length);
    for (const entry of published.entries) for (const file of entry.files) {
      const bytes = readFileSync(`public${new URL(file.url).pathname}`);
      expect(file.sha256).toBe(createHash("sha256").update(bytes).digest("hex"));
      expect(file.bytes).toBe(bytes.length);
    }
  });
});
