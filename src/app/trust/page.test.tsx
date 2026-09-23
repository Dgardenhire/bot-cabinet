import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrustPage from "./page";

describe("Trust page", () => {
  it("distinguishes running Keeper checks from unfinished work and controlled tests", () => {
    const html = renderToStaticMarkup(<TrustPage />);

    expect(html).toContain("Release checks are running");
    expect(html).toContain("293 application tests");
    expect(html).toContain("4,424 internal-link checks");
    expect(html).toContain("Keeper’s basic checks are running");
    expect(html).toContain("Every 15 minutes");
    expect(html).toContain("Every 30 minutes");
    expect(html).toContain("Not connected yet");
    expect(html).toContain("Bot tests are controlled trials");
    expect(html).toContain("What runs now—and what does not");
    expect(html).toContain("A person still decides");
    expect(html).not.toContain("continuous monitoring is running");
  });
});
