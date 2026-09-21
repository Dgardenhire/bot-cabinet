import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StartPage from "./page";


describe("first Bot desktop handoff", () => {
  it("gives phone visitors a public link without claiming progress transfers", () => {
    const html = renderToStaticMarkup(<StartPage />);

    expect(html).toContain("Continue setup on your computer");
    expect(html).toContain("Copy desktop setup link");
    expect(html).toContain("Email the setup link");
    expect(html).toContain("https%3A%2F%2Fbotcabinet.com%2Fstart%2F");
    expect(html).toContain("browser-local progress stays with that device");
    expect(html).toContain('data-funnel-event="first_run_desktop_link_copy"');
    expect(html).toContain('data-funnel-event="first_run_desktop_link_email"');
    expect(html).not.toContain("recipient=");
  });
});
