import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BotsPage from "./page";

describe("The Cabinet listing page", () => {
  it("puts Bot discovery before the longer test explanation", () => {
    const html = renderToStaticMarkup(<BotsPage />);

    expect(html).toContain("Search by what you need done.");
    expect(html).toContain('placeholder="Search by job or result"');
    expect(html).toContain("What has been tested?");
    expect(html.indexOf('placeholder="Search by job or result"')).toBeLessThan(
      html.indexOf("What has been tested?"),
    );
    expect(html).toContain("Import success does not prove work quality");
  });
});
