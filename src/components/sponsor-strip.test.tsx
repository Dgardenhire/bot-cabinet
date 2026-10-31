import { existsSync, readdirSync, readFileSync } from "node:fs";
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
  openDirectorySlots,
  openFoundingSlots,
  orderedSponsors,
  type Sponsor,
} from "@/data/sponsors";
import { SponsorStrip } from "./sponsor-strip";

const SAMPLE: Sponsor = {
  slug: "sample-tool",
  tier: "founding",
  name: "Sample Tool",
  line: "Email inboxes for agents.",
  url: "https://example.com/?ref=botcabinet",
  startedOn: "2026-11-01",
};

const DIRECTORY: Sponsor = {
  slug: "sample-directory",
  tier: "directory",
  name: "Sample Directory",
  line: "5,000 Grok bots, sorted by job.",
  url: "https://directory.example.com/",
  startedOn: "2026-11-02",
};

/** Visible text: tags and React's text separators removed, whitespace collapsed. */
function text(html: string) {
  return html.replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/\s+/g, " ");
}

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

  it("lists founding sponsors before directories, both labeled and marked sponsored", () => {
    const html = renderToStaticMarkup(<SponsorStrip page="bots" sponsors={[DIRECTORY, SAMPLE]} />);
    expect(html.indexOf("Sample Tool")).toBeLessThan(html.indexOf("Sample Directory"));
    expect(html.match(/rel="sponsored noopener"/g)).toHaveLength(2);
    expect(html).toContain('class="sponsor-line-directory"');
    expect(html).toContain(">Advertisement<");
    // A directory sponsor doesn't use up a founding slot.
    expect(html).toContain("2 founding slots open");
  });

  it("never appears on Agent Watch", () => {
    const watch = readFileSync(path.join(process.cwd(), "src/app/watch/page.tsx"), "utf8");
    expect(watch).not.toContain("SponsorStrip");
    expect(watch).not.toContain("sponsor-strip");
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
      expect(sponsor.line.length, sponsor.slug).toBeLessThanOrEqual(SPONSOR_LINE_MAX[sponsor.tier]);
      expect(sponsor.url, sponsor.slug).toMatch(/^https:\/\//);
      expect(isExcludedSponsorUrl(sponsor.url), sponsor.slug).toBe(false);
      expect(sponsor.startedOn, sponsor.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (sponsor.clicks) expect(sponsor.clicks.asOf >= sponsor.startedOn, sponsor.slug).toBe(true);
    }
    expect(SPONSORS.filter((s) => s.tier === "directory").length).toBeLessThanOrEqual(SPONSOR_PROGRAM.directorySlots);
  });

  it("refuses the platforms Bot Cabinet covers, including their subdomains", () => {
    expect(isExcludedSponsorUrl("https://openai.com/")).toBe(true);
    expect(isExcludedSponsorUrl("https://platform.openai.com/x")).toBe(true);
    expect(isExcludedSponsorUrl("https://x.ai/grok")).toBe(true);
    expect(isExcludedSponsorUrl("https://www.anthropic.com/")).toBe(true);
    expect(isExcludedSponsorUrl("https://notopenai.com/")).toBe(false);
    expect(isExcludedSponsorUrl("https://museatwork.com/")).toBe(false);
  });

  it("counts founding and directory slots separately, never below zero", () => {
    expect(openFoundingSlots([])).toBe(SPONSOR_PROGRAM.foundingSlots);
    expect(openFoundingSlots(Array.from({ length: 5 }, (_, i) => ({ ...SAMPLE, slug: `s${i}` })))).toBe(0);
    expect(openFoundingSlots([DIRECTORY])).toBe(SPONSOR_PROGRAM.foundingSlots);
    expect(openDirectorySlots([DIRECTORY, SAMPLE])).toBe(SPONSOR_PROGRAM.directorySlots - 1);
    expect(openDirectorySlots(Array.from({ length: 9 }, (_, i) => ({ ...DIRECTORY, slug: `d${i}` })))).toBe(0);
    expect(orderedSponsors([DIRECTORY, SAMPLE]).map((s) => s.tier)).toEqual(["founding", "directory"]);
  });
});

describe("sponsor and privacy pages", () => {
  it("states both prices, the rules and a way to buy each slot", () => {
    const html = renderToStaticMarkup(<SponsorPage />);
    const page = text(html);
    expect(page).toContain(`$${SPONSOR_PROGRAM.foundingPrice} a month`);
    expect(page).toContain(`new slots cost $${SPONSOR_PROGRAM.laterPrice}`);
    expect(page).toContain(`Run a bot directory? $${SPONSOR_PROGRAM.directoryPrice} a month`);
    expect(page).toContain("carries the word Advertisement");
    expect(page).toContain("OpenAI, Anthropic, Google, xAI, Meta and Nous Research");
    expect(page).toContain("Audience numbers on December 1");
    expect(page).toContain("Your Agent Watch listing stays exactly as it is");
    if (SPONSOR_PROGRAM.checkoutUrl) expect(html).toContain(`href="${SPONSOR_PROGRAM.checkoutUrl}"`);
    else expect(html).toContain(`href="mailto:${SPONSOR_PROGRAM.contact}?subject=Founding%20sponsor%20slot"`);
    if (SPONSOR_PROGRAM.directoryCheckoutUrl) expect(html).toContain(`href="${SPONSOR_PROGRAM.directoryCheckoutUrl}"`);
    else expect(html).toContain(`href="mailto:${SPONSOR_PROGRAM.contact}?subject=Directory%20slot"`);
    expect(html).toContain('href="/privacy"');
  });

  it("shows one square per founding slot, filled for each slot sold", () => {
    const html = renderToStaticMarkup(<SponsorPage />);
    const sold = SPONSOR_PROGRAM.foundingSlots - openFoundingSlots();
    expect(html.match(/class="sp-slot( taken)?"/g)).toHaveLength(SPONSOR_PROGRAM.foundingSlots);
    expect(html.match(/class="sp-slot taken"/g) ?? []).toHaveLength(sold);
  });

  it("shows the strip preview, which exists on disk and has alt text", () => {
    const html = renderToStaticMarkup(<SponsorPage />);
    expect(html).toContain("strip-preview.png");
    expect(html).toContain('alt="The Bot Cabinet home page with two sample sponsor lines labeled Advertisement"');
    expect(existsSync(path.join(process.cwd(), "public/sponsor/strip-preview.png"))).toBe(true);
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
