import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { SPONSORS, SPONSOR_LINE_MAX, SPONSOR_PROGRAM, openFoundingSlots } from "@/data/sponsors";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sponsor Bot Cabinet",
  description: `One labeled line on six Bot Cabinet pages, read by people who set up AI bots and agents. Founding slots are $${SPONSOR_PROGRAM.foundingPrice} a month.`,
  path: "/sponsor/",
  image: "/brand/social/about-bot-cabinet-1200x630.jpg",
  imageAlt: "Sponsor Bot Cabinet",
});

const PLACEMENTS = ["the home page", "The Cabinet", "Start Here", "the Field Manual", "Bot Workflows", "Crew Kits"];

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function SponsorPage() {
  const { foundingPrice, laterPrice, foundingSlots, checkoutUrl, contact, audienceNumbersOn } = SPONSOR_PROGRAM;
  const open = openFoundingSlots();

  return (
    <main id="main-content" className="page-main sponsor-page">
      <section className="inner-hero">
        <div className="shell">
          <h1 className="inner-title">Sponsor Bot Cabinet</h1>
          <p className="inner-deck">
            Put one line in front of people who set up AI bots and agents for ChatGPT, Claude, Gemini, Grok Bot
            and Hermes Agent.
          </p>
          <div className="sponsor-offer">
            <p className="sponsor-price">
              ${foundingPrice} a month
            </p>
            <p>
              {open > 0
                ? `${open} of ${foundingSlots} founding slots open. Founding sponsors keep this price for as long as they stay. After they fill, new slots are $${laterPrice} a month.`
                : `All ${foundingSlots} founding slots are taken. New slots are $${laterPrice} a month.`}
            </p>
            {checkoutUrl ? (
              <a className="button button-primary" href={checkoutUrl} rel="noopener">
                Become a founding sponsor <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <a className="button button-primary" href={`mailto:${contact}?subject=Founding%20sponsor%20slot`}>
                Reserve a founding slot
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">What you get</h2>
        <p>
          Your company name, one line of up to {SPONSOR_LINE_MAX} characters and a link, on {PLACEMENTS.length} pages:{" "}
          {PLACEMENTS.slice(0, -1).join(", ")} and {PLACEMENTS[PLACEMENTS.length - 1]}.
        </p>
        <p>
          Each month this page shows how many people clicked your line, with the date the count was taken. Clicks
          are counted without cookies, and Bot Cabinet&apos;s own visits are left out.
        </p>
        <p>Billing is month to month. Cancel anytime.</p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">Who reads Bot Cabinet</h2>
        <p>
          People choosing, setting up and testing AI bots for real work. About three in four are in the United
          States. We publish audience numbers on {formatDate(audienceNumbersOn)}, counted over 30 days with our own
          visits removed.
        </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">The rules</h2>
        <p>Every sponsor line is labeled Advertisement, and every sponsor link is marked as paid for search engines.</p>
        <p>We read every line before it goes up and can turn any down, with a full refund.</p>
        <p>
          A sponsor never changes a test record, a ranking or a recommendation. Sponsors never appear on test
          records, single Bot pages, compare pages, Hermes pages, downloads or the Bot catalog.
        </p>
        <p>
          The AI companies Bot Cabinet compares can&apos;t sponsor it: OpenAI, Anthropic, Google, xAI, Meta and Nous
          Research. Tools built on their platforms can.
        </p>
        </div>
      </section>

      {SPONSORS.length > 0 && (
        <section className="content-section shell" aria-labelledby="sponsor-results-heading">
        <div className="prose-column">
          <h2 className="section-heading" id="sponsor-results-heading">Current sponsors</h2>
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

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">Questions</h2>
        <p>
          Email <a href={`mailto:${contact}`}>{contact}</a>. Payment runs through Stripe for Linchpin Resources LLC;
          Bot Cabinet never sees your card. Read the <Link href="/privacy">privacy page</Link>.
        </p>
        </div>
      </section>
    </main>
  );
}
