import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrustPage from "./page";

describe("Trust page", () => {
  it("distinguishes running checks from disconnected Keeper work and controlled tests", () => {
    const html = renderToStaticMarkup(<TrustPage />);

    expect(html).toContain("Release checks are running");
    expect(html).toContain("Keeper’s recurring jobs are not connected");
    expect(html).toContain("Bot tests are controlled trials");
    expect(html).toContain("What Keeper can check automatically");
    expect(html).toContain("A person still decides");
    expect(html).not.toContain("continuous monitoring is running");
  });
});
