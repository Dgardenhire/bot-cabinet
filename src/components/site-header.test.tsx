import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("site navigation", () => {
  it("keeps every major destination in both desktop and mobile navigation", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    const desktop = html.split('aria-label="Primary navigation"')[1].split('</nav>')[0];
    expect(desktop).toContain('href="/crew-kits"');
    expect(desktop).toContain('href="/fit"');
    expect(desktop).toContain('href="/workshop"');
    expect(desktop).not.toContain('<summary>More</summary>');
    const mobile = html.split('aria-label="Mobile navigation"')[1].split('</nav>')[0];
    const destinations = ["/start", "/bots", "/crew-kits", "/fit", "/workshop", "/watch", "/workbench", "/portraits", "/use-cases", "/guides", "/compare", "/proof", "/trust", "/community", "/about", "/contribute"];
    for (const href of destinations) {
      expect(desktop, `desktop ${href}`).toContain(`href="${href}"`);
      expect(mobile, `mobile ${href}`).toContain(`href="${href}"`);
    }
    for (const group of ["Bots &amp; Crews", "Tools", "Guides"]) expect(desktop).toContain(group);
    expect(desktop.match(/<summary/g)).toHaveLength(3);
  });
});
