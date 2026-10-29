import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrustPage from "./page";

describe("Trust page", () => {
  it("leads with approved Keeper evidence and keeps task tests and human decisions separate", () => {
    const html = renderToStaticMarkup(<TrustPage />);

    expect(html).toContain("Latest reviewed checks");
    expect(html).toContain("No recent reviewed site checks to show.");
    expect(html).toContain('<a href="/proof">Proof Room</a>');
    expect(html).not.toContain("re-run");
    expect(html).toContain("Release checks");
    expect(html).toContain("latest public run");
    expect(html).toContain("Bot test results");
    expect(html).toContain("Human decisions");
    expect(html).toContain("No public record");
    expect(html).not.toContain("keeper-trust-status-row");
    expect(html).toContain("A missing or overdue public record means the current result is unknown");
    expect(html).not.toContain("Built, but not running in the cloud");
    expect(html).not.toContain("Keeper’s records are not public yet");
    expect(html).not.toContain("293 application tests");
    expect(html).not.toContain("4,424 internal-link checks");
    expect(html).not.toContain("continuous monitoring is running");
  });
});
