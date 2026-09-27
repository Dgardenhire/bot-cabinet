import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LiveBotListingLinks } from "./live-bot-listings";

describe("current listing source links", () => {
  it("does not describe a marketplace listing as open-source software", () => {
    const html = renderToStaticMarkup(<LiveBotListingLinks item={{
      sourceUrl: "https://example.com/listing",
      originalUrl: "https://example.com/original",
    }} />);

    expect(html).toContain("View listing");
    expect(html).toContain("Original link");
    expect(html).not.toContain("Open source");
  });
});
