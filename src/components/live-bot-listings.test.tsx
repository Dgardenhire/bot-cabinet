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

  it("puts a native Grok template link first when a directory supplies one", () => {
    const html = renderToStaticMarkup(<LiveBotListingLinks item={{
      sourceUrl: "https://www.grokhub.io/use-cases/example",
      originalUrl: "https://x.ai/bot/EahHaI-kwO0hgWj6I45jC",
    }} />);

    expect(html).toContain("Open Grok Bot template");
    expect(html).toContain('data-funnel-event="native_template_open"');
    expect(html.indexOf("Open Grok Bot template")).toBeLessThan(html.indexOf("View listing"));
    expect(html).not.toContain("Original link");
  });

  it("uses the official marketplace detail page as the native template path", () => {
    const html = renderToStaticMarkup(<LiveBotListingLinks item={{
      sourceUrl: "https://x.ai/bot/marketplace/bots/the-morning-newspaper",
    }} />);

    expect(html).toContain("Open Grok Bot template");
    expect(html).not.toContain("View listing");
  });
});
