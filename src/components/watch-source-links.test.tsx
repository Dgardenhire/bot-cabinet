import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WatchSourceLinks } from "./watch-source-links";

describe("featured Bot sources", () => {
  it("makes each Bot in a roundup directly openable without repeating its name for two bare links", () => {
    const html = renderToStaticMarkup(<WatchSourceLinks sources={[
      { label: "Proto Bot: instructions", href: "https://x.ai/bot/marketplace/bots/proto-bot" },
      { label: "Proto Bot: open import", href: "https://x.ai/bot/p4sSEZV7xqcBgdT7m2O8i" },
      { label: "Sell Bot: instructions", href: "https://x.ai/bot/marketplace/bots/sell-bot" },
    ]} />);
    expect(html).toContain('aria-label="Open Proto Bot in Grok Bot"');
    expect(html).toContain('href="https://x.ai/bot/p4sSEZV7xqcBgdT7m2O8i"');
    expect(html).toContain('aria-label="Open Sell Bot in Grok Bot"');
    expect(html).not.toContain('open import');
  });
  it("preserves ordinary source links", () => {
    expect(renderToStaticMarkup(<WatchSourceLinks sources={[{label: "Official documentation", href: "https://example.com/docs"}]} />)).toContain("Official documentation");
  });
});
