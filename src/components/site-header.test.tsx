import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("site navigation", () => {
  it("exposes the core tools without an arbitrary More drawer", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    const desktop = html.split('aria-label="Primary navigation"')[1].split('</nav>')[0];
    expect(desktop).toContain('href="/crew-kits"');
    expect(desktop).toContain('href="/fit"');
    expect(desktop).toContain('href="/workshop"');
    expect(desktop).not.toContain('<summary>More</summary>');
    expect(desktop.match(/<a /g)).toHaveLength(6);
    expect(html).toContain('aria-label="Learn and check"');
  });
});
