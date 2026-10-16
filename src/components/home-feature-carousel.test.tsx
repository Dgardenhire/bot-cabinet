import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { HomeFeatureCarousel, HOME_FEATURES, nextFeature, shouldAutoAdvance, pauseForFocus } from "./home-feature-carousel";

describe("homepage feature carousel", () => {
  it("offers distinct existing art and working site destinations for every feature", () => {
    expect(HOME_FEATURES.length).toBe(6);
    expect(new Set(HOME_FEATURES.map(feature => feature.image)).size).toBe(HOME_FEATURES.length);
    for (const feature of HOME_FEATURES) expect(existsSync(`public${feature.image}`)).toBe(true);
    expect(HOME_FEATURES.map(feature => feature.href)).toEqual(expect.arrayContaining(["/start", "/watch", "/crew-kits", "/workshop", "/starter-pack", "https://ai-seminar.linchpin.studio/open-source"]));
    expect(HOME_FEATURES.find(feature => feature.href === "/starter-pack")?.description).toContain("subscribe");
  });
  it("provides explicit slide selection and a rotation control, with only one active slide", () => {
    const html = renderToStaticMarkup(<HomeFeatureCarousel />);
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('aria-label="Next feature"');
    expect(html).toContain('aria-label="Previous feature"');
    expect(html).toContain('aria-label="Start automatic rotation"');
    expect(html).toContain('aria-current="true"');
    expect(html.match(/class="hero-title"/g)).toHaveLength(1);
  });
  it("wraps in either direction", () => {
    expect(nextFeature(HOME_FEATURES.length - 1, 1)).toBe(0);
    expect(nextFeature(0, -1)).toBe(HOME_FEATURES.length - 1);
  });
  it("advances by default but pauses for controls, hidden tabs or an explicit stop", () => {
    expect(shouldAutoAdvance(true, false, true)).toBe(true);
    expect(shouldAutoAdvance(true, true, true)).toBe(false);
    expect(shouldAutoAdvance(true, false, false)).toBe(false);
    expect(shouldAutoAdvance(false, false, true)).toBe(false);
  });
  it("does not let focus cancel the rotation button before its toggle runs", () => {
    expect(pauseForFocus(true)).toBe(false);
    expect(pauseForFocus(false)).toBe(true);
  });
});
