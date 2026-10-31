import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PrivacyPage from "@/app/privacy/page";
import SponsorPage from "@/app/sponsor/page";
import {
  CURRENT_STAGE,
  SETUP_GUIDES,
  SPONSORS,
  SPONSOR_LADDER,
  SPONSOR_LINE_MAX,
  SPONSOR_PAGES,
  SPONSOR_PROGRAM,
  SPONSOR_SLOTS,
  currentCardPrice,
  isExcludedSponsorUrl,
  openSlots,
  setupSponsorFor,
  type Sponsor,
} from "@/data/sponsors";
import { SponsorStrip } from "./sponsor-strip";
import { SponsorTop } from "./sponsor-top";

const CARD: Sponsor = {
  slug: "sample-card",
  tier: "card",
  name: "Sample Card",
  line: "Inboxes your agents can send and receive from.",
  url: "https://card.example.com/?ref=botcabinet",
  category: "email for agents",
  logo: "/sponsors/sample-card.svg",
  startedOn: "2026-11-01",
};
const FEATURE: Sponsor = {
  slug: "sample-feature",
  tier: "feature",
  name: "Sample Feature",
  line: "A shared memory your Grok, Claude and Hermes bots can all read, with a log of every change.",
  url: "https://feature.example.com/",
  category: "memory",
  startedOn: "2026-11-02",
};
const LINE: Sponsor = {
  slug: "sample-line",
  tier: "line",
  name: "Sample Directory",
  line: "5,000 Grok bots, sorted by job.",
  url: "https://directory.example.com/",
  category: "bot directory",
  startedOn: "2026-11-03",
};
const SETUP: Sponsor = {
  slug: "sample-host",
  tier: "setup",
  name: "Sample Host",
  line: "Hermes servers that stay on when your laptop sleeps.",
  url: "https://host.example.com/",
  category: "hosting",
  logo: "/sponsors/sample-host.svg",
  setupPage: "start/hermes",
  startedOn: "2026-11-04",
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

/** Width and height of a PNG (from its header) or an SVG (from its viewBox). */
function imageSize(file: string): [number, number] {
  const data = readFileSync(file);
  if (file.endsWith(".png")) return [data.readUInt32BE(16), data.readUInt32BE(20)];
  const box = data.toString("utf8").match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);
  if (!box) throw new Error(`${file} has no viewBox`);
  return [Number(box[1]), Number(box[2])];
}

const appDir = path.join(process.cwd(), "src/app");

describe("sponsor top band", () => {
  it("renders nothing while no card or setup sponsor is sold", () => {
    expect(renderToStaticMarkup(<SponsorTop page="bots" sponsors={[FEATURE, LINE]} />)).toBe("");
  });

  it("labels cards Advertisement, marks them sponsored and tags their position", () => {
    const html = renderToStaticMarkup(<SponsorTop page="" sponsors={[CARD]} />);
    expect(html).toContain('<p class="sponsor-top-label">Advertisement</p>');
    expect(html).toContain('rel="sponsored noopener"');
    expect(html).toContain('data-funnel-event="sponsor_click"');
    expect(html).toContain('data-funnel-surface="home-top"');
    expect(html).toContain("sample-card.svg");
    expect(html).not.toContain("<script");
  });

  it("puts a setup sponsor alone in its own band, with its note, only on its guide", () => {
    const hermes = renderToStaticMarkup(<SponsorTop page="start/hermes" sponsors={[SETUP, CARD]} />);
    expect(text(hermes)).toContain(SETUP_GUIDES["start/hermes"].note);
    expect(hermes).toContain('data-funnel-surface="setup-start-hermes"');
    expect(hermes.indexOf("Sample Host")).toBeLessThan(hermes.indexOf("Sample Card"));
    expect(hermes.match(/<aside class="sponsor-top/g)).toHaveLength(2);
    expect(renderToStaticMarkup(<SponsorTop page="start/grok" sponsors={[SETUP]} />)).toBe("");
  });

  it("skips its own page-width wrapper on pages that already have one", () => {
    const html = renderToStaticMarkup(<SponsorTop page="start/dots" sponsors={[CARD]} contained />);
    expect(html).toContain('class="sponsor-top-inner"');
    expect(html).not.toContain("shell sponsor-top-inner");
  });
});

describe("sponsor foot strip", () => {
  it("shows only the open-slot link, with no Advertisement label, while nothing is sold", () => {
    const html = renderToStaticMarkup(<SponsorStrip page="bots" sponsors={[]} />);
    expect(html).not.toContain(">Advertisement<");
    expect(html).toContain(`Sponsor Bot Cabinet: ${SPONSOR_SLOTS.card} founding slots open`);
    expect(html).toContain('href="/sponsor"');
  });

  it("lists Features first, then card sponsors' lines, then Lines, all labeled and marked sponsored", () => {
    const html = renderToStaticMarkup(<SponsorStrip page="start/grok" sponsors={[LINE, CARD, FEATURE, SETUP]} />);
    expect(html).toContain(">Advertisement<");
    expect(html.indexOf("Sample Feature")).toBeLessThan(html.indexOf("Sample Card"));
    expect(html.indexOf("Sample Card")).toBeLessThan(html.indexOf("Sample Directory"));
    expect(html).not.toContain("Sample Host");
    expect(html.match(/rel="sponsored noopener"/g)).toHaveLength(3);
    expect(html).toContain('data-funnel-surface="start-grok-foot"');
    expect(html).toContain("2 founding slots open");
  });
});

describe("where sponsors appear", () => {
  it("puts the band and the strip on exactly the nine sponsored pages", () => {
    for (const component of ["<SponsorTop", "<SponsorStrip"]) {
      const found = pageFiles(appDir)
        .filter((file) => readFileSync(file, "utf8").includes(component))
        .map((file) => path.relative(appDir, path.dirname(file)));
      expect(found.sort(), component).toEqual([...SPONSOR_PAGES].sort());
    }
    for (const page of SPONSOR_PAGES) {
      const source = readFileSync(path.join(appDir, page, "page.tsx"), "utf8");
      expect(source, page || "home").toMatch(new RegExp(`<SponsorTop page="${page}"( contained)? />`));
      expect(source, page || "home").toContain(`<SponsorStrip page="${page}" />`);
    }
  });

  it("never appears on Agent Watch, test records, Bot pages, Hermes pages or the Starter Pack", () => {
    for (const dir of ["watch", "proof", "bots/[slug]", "hermes", "starter-pack", "compare", "trust"]) {
      const file = path.join(appDir, dir, "page.tsx");
      if (!existsSync(file)) continue;
      const source = readFileSync(file, "utf8");
      expect(source, dir).not.toContain("SponsorTop");
      expect(source, dir).not.toContain("SponsorStrip");
    }
  });
});

describe("sponsor list", () => {
  it("keeps every sponsor within the rules", () => {
    expect(new Set(SPONSORS.map((s) => s.slug)).size).toBe(SPONSORS.length);
    for (const sponsor of SPONSORS) {
      expect(sponsor.line.length, sponsor.slug).toBeLessThanOrEqual(SPONSOR_LINE_MAX[sponsor.tier]);
      expect(sponsor.url, sponsor.slug).toMatch(/^https:\/\//);
      expect(isExcludedSponsorUrl(sponsor.url), sponsor.slug).toBe(false);
      expect(sponsor.startedOn, sponsor.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (sponsor.clicks) expect(sponsor.clicks.asOf >= sponsor.startedOn, sponsor.slug).toBe(true);
      if (sponsor.tier === "setup") expect(sponsor.setupPage, sponsor.slug).toBeTruthy();
    }
    for (const tier of ["card", "feature", "line"] as const) {
      expect(SPONSORS.filter((s) => s.tier === tier).length, tier).toBeLessThanOrEqual(SPONSOR_SLOTS[tier]);
    }
    const cardCategories = SPONSORS.filter((s) => s.tier === "card").map((s) => s.category);
    expect(new Set(cardCategories).size).toBe(cardCategories.length);
    const setupPages = SPONSORS.filter((s) => s.tier === "setup").map((s) => s.setupPage);
    expect(new Set(setupPages).size).toBe(setupPages.length);
  });

  it("hosts every card and setup logo locally, square and under 50 KB", () => {
    for (const sponsor of SPONSORS.filter((s) => s.tier === "card" || s.tier === "setup")) {
      expect(sponsor.logo, sponsor.slug).toMatch(/^\/sponsors\/[\w-]+\.(png|svg)$/);
      const file = path.join(process.cwd(), "public", sponsor.logo!);
      expect(existsSync(file), sponsor.logo).toBe(true);
      expect(statSync(file).size, sponsor.logo).toBeLessThan(50 * 1024);
      const [w, h] = imageSize(file);
      expect(w, sponsor.logo).toBe(h);
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

  it("counts slots per tier, never below zero, and raises the card price once founding slots fill", () => {
    expect(openSlots("card", [])).toBe(SPONSOR_SLOTS.card);
    expect(openSlots("card", [FEATURE, LINE, SETUP])).toBe(SPONSOR_SLOTS.card);
    expect(openSlots("line", Array.from({ length: 9 }, (_, i) => ({ ...LINE, slug: `l${i}` })))).toBe(0);
    const stage = SPONSOR_LADDER[CURRENT_STAGE];
    expect(currentCardPrice([])).toBe(stage.card);
    expect(currentCardPrice(Array.from({ length: SPONSOR_SLOTS.card }, (_, i) => ({ ...CARD, slug: `c${i}` })))).toBe(
      stage.cardAfterFounding,
    );
    expect(setupSponsorFor("start/hermes", [SETUP])?.slug).toBe("sample-host");
    expect(setupSponsorFor("start/dots", [SETUP])).toBeUndefined();
  });
});

describe("sponsor page", () => {
  const html = renderToStaticMarkup(<SponsorPage />);
  const page = text(html);
  const stage = SPONSOR_LADDER[CURRENT_STAGE];

  it("states every tier, price and the open slots from the data", () => {
    expect(page).toContain(`$${currentCardPrice()} a month for a Founding Card`);
    expect(page).toContain(`Feature $${stage.feature} a month`);
    expect(page).toContain(`Line $${stage.line} a month`);
    expect(page).toContain(`Setup page $${SPONSOR_PROGRAM.setupPrice} a month`);
    expect(page).toContain(`${openSlots("feature")} of ${SPONSOR_SLOTS.feature} open`);
    expect(page).toContain(`${openSlots("line")} of ${SPONSOR_SLOTS.line} open`);
    expect(page).toContain("your Agent Watch listing stays exactly as it is");
  });

  it("prints the newsletter numbers next to its price, and both bundles", () => {
    const { newsletter, bundles } = SPONSOR_PROGRAM;
    expect(page).toContain(`$${newsletter.issuePrice} an issue, or four for $${newsletter.fourIssuePrice}`);
    expect(page).toContain(`went to ${newsletter.recipients} people`);
    expect(page).toContain(newsletter.weeklyClickers);
    expect(page).toContain(`Founding Card and Open Source, $${bundles.cardAndNewsletter} a month`);
    expect(page).toContain(`Feature and Open Source, $${bundles.featureAndNewsletter} a month`);
  });

  it("shows the ladder with today's stage marked, and the rules", () => {
    expect(html.match(/<tr class="now">/g)).toHaveLength(1);
    expect(page).toContain(`${SPONSOR_LADDER[CURRENT_STAGE].label} (today)`);
    for (const row of SPONSOR_LADDER) expect(page).toContain(`$${row.line}`);
    expect(page).toContain("carries the word Advertisement");
    expect(page).toContain("no one can pay to move up the Bot catalog");
    expect(page).toContain("OpenAI, Anthropic, Google, xAI, Meta and Nous Research");
    expect(page).toContain("Audience numbers on December 1");
  });

  it("falls back to email for each product shown without a Payment Link", () => {
    const shown: [keyof typeof SPONSOR_PROGRAM.checkout, string][] = [
      ["card", "Founding Card"],
      ["feature", "Feature"],
      ["line", "Line"],
      ["setup", "Setup page sponsor"],
      ["newsletterIssue", "Open Source sponsor"],
    ];
    for (const [key, subject] of shown) {
      const link = SPONSOR_PROGRAM.checkout[key];
      expect(html, key).toContain(link ? `href="${link}"` : `subject=${encodeURIComponent(subject)}`);
    }
  });

  it("shows one square per founding slot, filled for each slot sold", () => {
    const sold = SPONSOR_SLOTS.card - openSlots("card");
    expect(html.match(/class="sp-slot( taken)?"/g)).toHaveLength(SPONSOR_SLOTS.card);
    expect(html.match(/class="sp-slot taken"/g) ?? []).toHaveLength(sold);
  });

  it("shows the three placement screenshots, which exist on disk", () => {
    for (const name of ["preview-card.png", "preview-strip.png", "preview-setup.png"]) {
      expect(html).toContain(name);
      expect(existsSync(path.join(process.cwd(), "public/sponsor", name)), name).toBe(true);
    }
  });
});

describe("privacy page", () => {
  it("names everything the site collects or sends elsewhere", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    expect(html).toContain("sets no cookies");
    expect(html).toContain("Vercel Web Analytics");
    expect(html).toContain("to Anthropic");
    expect(html).toContain("Starter Pack");
    expect(html).toContain("Stripe");
  });
});
