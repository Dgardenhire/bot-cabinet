import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  CURRENT_STAGE,
  SETUP_GUIDES,
  SPONSORS,
  SPONSOR_LADDER,
  SPONSOR_LINE_MAX,
  SPONSOR_PROGRAM,
  SPONSOR_SLOTS,
  currentCardPrice,
  openSlots,
  setupSponsorFor,
  type SetupGuide,
} from "@/data/sponsors";
import { buildPageMetadata } from "@/lib/metadata";

const stage = SPONSOR_LADDER[CURRENT_STAGE];

export const metadata: Metadata = buildPageMetadata({
  title: "Sponsor Bot Cabinet",
  description: `Put your tool where people pick, set up and test AI bots. Founding Cards from $${stage.card} a month, smaller slots from $${stage.line}, and sponsored issues of the Open Source newsletter.`,
  path: "/sponsor/",
  image: "/brand/social/about-bot-cabinet-1200x630.jpg",
  imageAlt: "Sponsor Bot Cabinet",
});

function formatDate(isoDate: string, withYear = true) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function buyLink(link: string | null, subject: string) {
  return link ?? `mailto:${SPONSOR_PROGRAM.contact}?subject=${encodeURIComponent(subject)}`;
}

function slotsLeft(open: number, total: number) {
  return open > 0 ? `${open} of ${total} open.` : "All taken right now.";
}

export default function SponsorPage() {
  const { checkout, newsletter, bundles, contact, setupPrice, audienceNumbersOn } = SPONSOR_PROGRAM;
  const cardPrice = currentCardPrice();
  const openCards = openSlots("card");
  const openSetup = (Object.keys(SETUP_GUIDES) as SetupGuide[]).filter((guide) => !setupSponsorFor(guide)).length;
  const audienceDay = formatDate(audienceNumbersOn, false);
  const reserve = (link: string | null, subject: string, primary = false) => (
    <a className={`button ${primary ? "button-primary" : "button-secondary"}`} href={buyLink(link, subject)} rel={link ? "noopener" : undefined}>
      Reserve
    </a>
  );

  return (
    <main id="main-content" className="page-main sponsor-page">
      <section className="sp-hero">
        <div className="shell sp-hero-grid">
          <div>
            <h1 className="sp-title">Put your tool where bots get built</h1>
            <p className="sp-deck">
              Bot Cabinet is where people pick an AI bot, set it up and test it. Put your tool on the pages they use most, or
              in the newsletter they read on Mondays.
            </p>
            <p className="sp-price">
              ${cardPrice} <span>a month for a Founding Card</span>
            </p>
            <div className="sp-slots" aria-label={`${openCards} of ${SPONSOR_SLOTS.card} founding slots open`}>
              {Array.from({ length: SPONSOR_SLOTS.card }, (_, i) => (
                <span key={i} className={i < SPONSOR_SLOTS.card - openCards ? "sp-slot taken" : "sp-slot"} aria-hidden="true" />
              ))}
              <p>{openCards > 0 ? `${openCards} of ${SPONSOR_SLOTS.card} founding slots open` : "Founding slots are full"}</p>
            </div>
            <a className="button button-primary" href={buyLink(checkout.card, "Founding Card")} rel={checkout.card ? "noopener" : undefined}>
              Reserve a Founding Card
            </a>
            <p className="sp-hold">Smaller slots from ${stage.line}. Month to month.</p>
          </div>
          <div className="sp-art">
            <Image src="/atelier/fleet.jpg" alt="A row of five robots in a workshop" width={1800} height={1200} priority />
          </div>
        </div>
      </section>

      <section className="sp-section" id="rates">
        <div className="shell">
          <h2 className="sp-h2">Four ways onto the site</h2>
          <p className="sp-lede">
            Cards, Features and Lines run on nine pages: the home page, The Cabinet, Start Here, the Field Manual, Bot
            Workflows, Crew Kits and the setup guides for Hermes, Grok Bot and ChatGPT Dots.
          </p>
          <div className="sp-rates">
            <div className="sp-rate">
              <div>
                <h3>Founding Card</h3>
                <p className="sp-rate-price">${cardPrice} a month</p>
              </div>
              <div>
                <p>
                  Your logo, name and one line near the top of every sponsored page, plus a line at the foot. Damon announces
                  you on X the week you start. One card per kind of product, so you never sit next to a direct rival.
                </p>
                <p className="sp-rate-left">
                  {slotsLeft(openCards, SPONSOR_SLOTS.card)}
                  {openCards > 0 && stage.cardAfterFounding > stage.card ? ` $${stage.cardAfterFounding} a month once they fill.` : ""}
                </p>
              </div>
              {reserve(checkout.card, "Founding Card", true)}
            </div>
            <div className="sp-rate">
              <div>
                <h3>Feature</h3>
                <p className="sp-rate-price">${stage.feature} a month</p>
              </div>
              <div>
                <p>
                  Your name and two lines, up to {SPONSOR_LINE_MAX.feature} characters, at the top of the strip at the foot of
                  every sponsored page.
                </p>
                <p className="sp-rate-left">{slotsLeft(openSlots("feature"), SPONSOR_SLOTS.feature)}</p>
              </div>
              {reserve(checkout.feature, "Feature")}
            </div>
            <div className="sp-rate">
              <div>
                <h3>Line</h3>
                <p className="sp-rate-price">${stage.line} a month</p>
              </div>
              <div>
                <p>
                  Your name and one line, up to {SPONSOR_LINE_MAX.line} characters, in the same strip. Bot directories buy this
                  one, and your Agent Watch listing stays exactly as it is either way.
                </p>
                <p className="sp-rate-left">{slotsLeft(openSlots("line"), SPONSOR_SLOTS.line)}</p>
              </div>
              {reserve(checkout.line, "Line")}
            </div>
            <div className="sp-rate">
              <div>
                <h3>Setup page</h3>
                <p className="sp-rate-price">${setupPrice} a month</p>
              </div>
              <div>
                <p>
                  Your card alone, right under the opening of one setup guide: Hermes, Grok Bot or ChatGPT Dots. A note under it
                  says Bot Cabinet doesn&apos;t recommend one provider.
                </p>
                <p className="sp-rate-left">
                  {openSetup > 0 ? `${openSetup} of 3 guides open, one sponsor each.` : "All three guides are taken right now."}
                </p>
              </div>
              {reserve(checkout.setup, "Setup page sponsor")}
            </div>
          </div>
        </div>
      </section>

      {/* Real screenshots of the sponsor placements with sample sponsors. Retake them whenever their look changes. */}
      <section className="sp-section">
        <div className="shell">
          <div className="sp-shot">
            <h3>The Founding Card, near the top</h3>
            <p>Shown on the home page with two sample sponsors.</p>
            <Image
              src="/sponsor/preview-card.png"
              alt="Two sample Founding Cards labeled Advertisement under the Bot Cabinet home page opening"
              width={1300}
              height={560}
            />
          </div>
          <div className="sp-shot">
            <h3>Features and Lines, at the foot</h3>
            <p>Features sit above Lines. Founding Card sponsors get a line here too.</p>
            <Image
              src="/sponsor/preview-strip.png"
              alt="Sample Feature and Line sponsors in the strip at the foot of a page"
              width={1300}
              height={360}
            />
          </div>
          <div className="sp-shot">
            <h3>A setup page of your own</h3>
            <p>Shown on the Hermes guide with a sample host.</p>
            <Image
              src="/sponsor/preview-setup.png"
              alt="A sample sponsor card on the Hermes setup guide, with a note that Bot Cabinet doesn't recommend a host"
              width={1300}
              height={230}
            />
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-nl">
          <div>
            <h2 className="sp-h2">Open Source, on Mondays</h2>
            <p className="sp-rate-price">
              ${newsletter.issuePrice} an issue, or four for ${newsletter.fourIssuePrice}
            </p>
            <p>
              Open Source is Damon Gardenhire&apos;s weekly AI newsletter. The {formatDate(newsletter.recipientsAsOf, false)} issue
              went to {newsletter.recipients} people. Each week {newsletter.weeklyClickers} of them click a link, a click rate of{" "}
              {newsletter.clickRate}.
            </p>
            <p>Damon writes your mention himself, about 80 words with one link, and it&apos;s labeled Sponsored.</p>
          </div>
          <a
            className="button button-secondary"
            href={buyLink(checkout.newsletterIssue, "Open Source sponsor")}
            rel={checkout.newsletterIssue ? "noopener" : undefined}
          >
            Reserve an issue
          </a>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-bundles">
          <h2 className="sp-h2">Both, for less</h2>
          <p>
            <strong>Founding Card and Open Source, ${bundles.cardAndNewsletter} a month.</strong> The card, plus one newsletter
            mention a month.
          </p>
          <p>
            <strong>Feature and Open Source, ${bundles.featureAndNewsletter} a month.</strong> The two-line feature, plus one
            mention a month.
          </p>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-facts">
          <div className="sp-fact">
            <strong>No rotation</strong>
            <p>Every sponsor shows on every page load. Nobody shares a slot or waits a turn.</p>
          </div>
          <div className="sp-fact">
            <strong>Public clicks</strong>
            <p>Each month we post your click count on this page, with the date, and email you the count for each page.</p>
          </div>
          <div className="sp-fact">
            <strong>Pay ahead</strong>
            <p>Pay for three months and get 10% off. Pay for a year and get two months free.</p>
          </div>
        </div>
      </section>

      {SPONSORS.length > 0 && (
        <section className="sp-section" aria-labelledby="sponsor-results-heading">
          <div className="shell sp-rules">
            <h2 className="sp-h2" id="sponsor-results-heading">Current sponsors</h2>
            <ul className="sponsor-results">
              {SPONSORS.map((sponsor) => (
                <li key={sponsor.slug}>
                  <strong>{sponsor.name}</strong>, since {formatDate(sponsor.startedOn)}.{" "}
                  {sponsor.clicks
                    ? `${sponsor.clicks.count.toLocaleString("en-US")} clicks as of ${formatDate(sponsor.clicks.asOf)}.`
                    : "First click count after one full month."}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sp-section">
        <div className="shell">
          <h2 className="sp-h2">Prices rise as Bot Cabinet grows</h2>
          <p className="sp-lede">
            We count real visitors to the sponsored pages each month, leave our own visits out, and post the number here. New
            sponsors pay the price for the current stage. You keep the price you join at.
          </p>
          <table className="sp-ladder">
            <thead>
              <tr>
                <th>People a month on sponsored pages</th>
                <th>Founding Card</th>
                <th>Feature</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {SPONSOR_LADDER.map((row, i) => (
                <tr key={row.label} className={i === CURRENT_STAGE ? "now" : undefined}>
                  <td>
                    {row.label}
                    {i === CURRENT_STAGE ? " (today)" : ""}
                  </td>
                  <td>{row.cardAfterFounding > row.card ? `$${row.card}, then $${row.cardAfterFounding}` : `$${row.card}`}</td>
                  <td>${row.feature}</td>
                  <td>${row.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-rules">
          <h2 className="sp-h2">Audience numbers on {audienceDay}</h2>
          <p>
            Bot Cabinet is young. On {audienceDay} we publish 30 days of traffic with our own visits taken out. Founding sponsors
            get the low price because they bought before anyone saw that number.
          </p>
          <h2 className="sp-h2 sp-h2-next">The rules</h2>
          <p>
            Every ad carries the word Advertisement, and its link tells Google it was paid for. We read each one before it goes
            up and refund anyone we turn down. Ads stay off test records, Bot pages, Agent Watch, comparisons and downloads, and
            no one can pay to move up the Bot catalog. The AI companies Bot Cabinet compares can&apos;t buy a slot: OpenAI,
            Anthropic, Google, xAI, Meta and Nous Research.
          </p>
          <p>
            Questions go to <a href={`mailto:${contact}`}>{contact}</a>. Payment runs through Stripe for Linchpin Resources LLC,
            and Bot Cabinet never sees your card. <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
