import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrustPage from "./page";

describe("Trust page", () => {
  it("leads with approved Keeper evidence and keeps task tests and human decisions separate", () => {
    const html = renderToStaticMarkup(<TrustPage />);

    expect(html).toContain("Latest approved Keeper checks");
    expect(html).toContain("Release checks");
    expect(html).toContain("latest public run");
    expect(html).toContain("Bot test results");
    expect(html).toContain("Human decisions");
    expect(html).toContain("Not connected yet");
    expect(html.match(/No public record/g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).toContain("No public record, no green light");
    expect(html).not.toContain("Built, but not running in the cloud");
    expect(html).not.toContain("Keeper’s records are not public yet");
    expect(html).not.toContain("293 application tests");
    expect(html).not.toContain("4,424 internal-link checks");
    expect(html).not.toContain("continuous monitoring is running");
  });
});
