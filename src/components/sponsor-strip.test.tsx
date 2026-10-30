import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PrivacyPage from "@/app/privacy/page";
import SponsorPage from "@/app/sponsor/page";
import {
  SPONSORS,
  SPONSOR_LINE_MAX,
  SPONSOR_PAGES,
  SPONSOR_PROGRAM,
  isExcludedSponsorUrl,
  openFoundingSlots,
  type Sponsor,
} from "@/data/sponsors";
import { SponsorStrip } from "./sponsor-strip";

const SAMPLE: Sponsor = {
  slug: "sample-tool",
  name: "Sample Tool",
  line: "Email inboxes for agents.",
  url: "https://example.com/?ref=botcabinet",
  startedOn: "2026-11-01",
};

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(full);
    return entry.name === "page.tsx" ? [full] : [];
  });
}

describe("sponsor strip", () => {
  it("shows only the open-slot link, with no Advertisement label, while there are no sponsors", () => {
    const html = renderToStaticMarkup(<SponsorStrip page="bots" sponsors={[]} />);
    expect(html).not.toContain(">Advertisement<");
    expect(html).toContain(`Sponsor Bot Cabinet: ${SPONSOR_PROGRAM.foundingSlots} founding slots open`);
    expect(html).toContain('href="/sponsor"');
  });

  it("labels paid lines Advertisement, marks them sponsored and counts their clicks", () => {
    const html = renderToStaticMarkup(<SponsorStrip page="" sponsors={[SAMPLE]} />);
    expect(html).toContain('<p class="sponsor-strip-label">Advertisement</p>');
    expect(html).toContain('aria-label="Advertisement"');
    expect(html).toContain('rel="sponsored noopener"');
    expect(html).toContain('data-funnel-event="sponsor_click"');
    expect(html).toContain('data-funnel-surface="home"');
    expect(html).toContain('data-funnel-destination="sample-tool"');
    expect(html).toContain("2 founding slots open");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
  });

  it("appears on exactly the allowed pages and nowhere else", () => {
    const appDir = path.join(process.cwd(), "src/app");
    const found = pageFiles(appDir)
      .filter((file) => readFileSync(file, "utf8").includes("<SponsorStrip"))
      .map((file) => path.relative(appDir, path.dirname(file)));
    expect(found.sort()).toEqual([...SPONSOR_PAGES].sort());

    for (const page of SPONSOR_PAGES) {
      const source = readFileSync(path.join(appDir, page, "page.tsx"), "utf8");
      expect(source, page || "home").toContain(`<SponsorStrip page="${page}" />`);
    }
  });
});

describe("sponsor list", () => {
  it("keeps every sponsor within the rules", () => {
    expect(new Set(SPONSORS.map((sponsor) => sponsor.slug)).size).toBe(SPONSORS.length);
    for (const sponsor of SPONSORS) {
      expect(sponsor.line.length, sponsor.slug).toBeLessThanOrEqual(SPONSOR_LINE_MAX);
      expect(sponsor.url, sponsor.slug).toMatch(/^https:\/\//);
      expect(isExcludedSponsorUrl(sponsor.url), sponsor.slug).toBe(false);
      expect(sponsor.startedOn, sponsor.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (sponsor.clicks) expect(sponsor.clicks.asOf >= sponsor.startedOn, sponsor.slug).toBe(true);
    }
  });

  it("refuses the platforms Bot Cabinet covers, including their subdomains", () => {
    expect(isExcludedSponsorUrl("https://openai.com/")).toBe(true);
    expect(isExcludedSponsorUrl("https://platform.openai.com/x")).toBe(true);
    expect(isExcludedSponsorUrl("https://x.ai/grok")).toBe(true);
    expect(isExcludedSponsorUrl("https://www.anthropic.com/")).toBe(true);
    expect(isExcludedSponsorUrl("https://notopenai.com/")).toBe(false);
    expect(isExcludedSponsorUrl("https://museatwork.com/")).toBe(false);
  });

  it("never reports fewer than zero open slots", () => {
    expect(openFoundingSlots([])).toBe(SPONSOR_PROGRAM.foundingSlots);
    expect(openFoundingSlots(Array.from({ length: 5 }, (_, i) => ({ ...SAMPLE, slug: `s${i}` })))).toBe(0);
  });
});

describe("sponsor and privacy pages", () => {
  it("states the price, the rules and a way to buy", () => {
    const html = renderToStaticMarkup(<SponsorPage />);
    expect(html).toContain(`$${SPONSOR_PROGRAM.foundingPrice} a month`);
    expect(html).toContain(`$${SPONSOR_PROGRAM.laterPrice} a month`);
    expect(html).toContain("labeled Advertisement");
    expect(html).toContain("OpenAI, Anthropic, Google, xAI, Meta and Nous");
    expect(html).toContain("December 1, 2026");
    if (SPONSOR_PROGRAM.checkoutUrl) expect(html).toContain(`href="${SPONSOR_PROGRAM.checkoutUrl}"`);
    else expect(html).toContain(`href="mailto:${SPONSOR_PROGRAM.contact}?subject=Founding%20sponsor%20slot"`);
    expect(html).toContain('href="/privacy"');
  });

  it("names everything the site collects or sends elsewhere", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    expect(html).toContain("sets no cookies");
    expect(html).toContain("Vercel Web Analytics");
    expect(html).toContain("to Anthropic");
    expect(html).toContain("Starter Pack");
    expect(html).toContain("Stripe");
  });
});
