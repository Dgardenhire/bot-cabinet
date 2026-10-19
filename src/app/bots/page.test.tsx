import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BotsPage from "./page";

describe("The Cabinet listing page", () => {
  it("puts Bot discovery before the longer test explanation", () => {
    const html = renderToStaticMarkup(<BotsPage />);

    expect(html).toContain("Choose a useful kind of help");
    expect(html).toContain("What kind of help do you need?");
    expect(html).toContain('value="researcher"');
    expect(html).toContain("Workflow examples have their own status");
    expect(html).not.toContain("these Bots have not been tested in Hermes or Grok");
    expect(html).toContain('placeholder="Search by job or result"');
    expect(html).toContain("What has been tested?");
    expect(html.indexOf('placeholder="Search by job or result"')).toBeLessThan(
      html.indexOf("What has been tested?"),
    );
    expect(html).toContain("This does not prove Desktop installation");
  });
});
