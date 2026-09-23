import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrustPage from "./page";

describe("Trust page", () => {
  it("distinguishes public evidence, private Keeper records, unfinished work, and controlled tests", () => {
    const html = renderToStaticMarkup(<TrustPage />);

    expect(html).toContain("Every site release is checked");
    expect(html).toContain("latest public run");
    expect(html).toContain("Keeper’s records are not public yet");
    expect(html).toContain("every 15 minutes");
    expect(html).toContain("every 30 minutes");
    expect(html).toContain("Built, but not running in the cloud");
    expect(html).toContain("Only some Bots have been tried");
    expect(html).toContain("What Keeper can check");
    expect(html).toContain("What Keeper can prove today");
    expect(html).toContain("Not connected yet");
    expect(html.match(/No public record/g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).toContain("No public record, no green light");
    expect(html).toContain("A person still decides");
    expect(html).not.toContain("293 application tests");
    expect(html).not.toContain("4,424 internal-link checks");
    expect(html).not.toContain("continuous monitoring is running");
  });
});
