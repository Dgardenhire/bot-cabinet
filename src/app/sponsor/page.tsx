import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { SPONSOR_PROGRAM, orderedSponsors, openDirectorySlots, openFoundingSlots } from "@/data/sponsors";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sponsor Bot Cabinet",
  description: `One labeled line on six Bot Cabinet pages, read by people who pick, set up and test AI bots. Founding slots are $${SPONSOR_PROGRAM.foundingPrice} a month; bot directories pay $${SPONSOR_PROGRAM.directoryPrice}.`,
  path: "/sponsor/",
  image: "/brand/social/about-bot-cabinet-1200x630.jpg",
  imageAlt: "Sponsor Bot Cabinet",
});

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function mailto(subject: string) {
  return `mailto:${SPONSOR_PROGRAM.contact}?subject=${encodeURIComponent(subject)}`;
}

export default function SponsorPage() {
  const { foundingPrice, laterPrice, foundingSlots, directoryPrice, checkoutUrl, directoryCheckoutUrl, contact, audienceNumbersOn } =
    SPONSOR_PROGRAM;
  const open = openFoundingSlots();
  const sponsors = orderedSponsors();
  const audienceDay = formatDate(audienceNumbersOn).replace(/, \d{4}$/, "");

  return (
    <main id="main-content" className="page-main sponsor-page">
      <section className="sp-hero">
        <div className="shell sp-hero-grid">
          <div>
            <h1 className="sp-title">Put your tool where bots get built</h1>
            <p className="sp-deck">
              Bot Cabinet is where people pick an AI bot, set it up and test it. One line from you sits on the six pages
              they use most.
            </p>
            <p className="sp-price">
              ${open > 0 ? foundingPrice : laterPrice} <span>a month</span>
            </p>
            <div className="sp-slots" aria-label={`${open} of ${foundingSlots} founding slots open`}>
              {Array.from({ length: foundingSlots }, (_, i) => (
                <span key={i} className={i < foundingSlots - open ? "sp-slot taken" : "sp-slot"} aria-hidden="true" />
              ))}
              <p>{open > 0 ? `${open} of ${foundingSlots} founding slots open` : "Founding slots are full"}</p>
            </div>
            {checkoutUrl ? (
              <a className="button button-primary" href={checkoutUrl} rel="noopener">
                {open > 0 ? "Become a founding sponsor" : "Become a sponsor"} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <a className="button button-primary" href={mailto("Founding sponsor slot")}>
                Reserve a founding slot
              </a>
            )}
            <p className="sp-hold">Month to month. Cancel anytime.</p>
          </div>
          <div className="sp-art">
            <Image src="/atelier/fleet.jpg" alt="A row of five robots in a workshop" width={1800} height={1200} priority />
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell">
          <h2 className="sp-h2">Your line, on the home page</h2>
          <p className="sp-lede">The same strip runs on The Cabinet, Start Here, the Field Manual, Bot Workflows and Crew Kits.</p>
          {/* A real screenshot of the home page strip with sample lines. Retake it whenever the strip's look changes. */}
          <div className="sp-preview">
            <Image
              src="/sponsor/strip-preview.png"
              alt="The Bot Cabinet home page with two sample sponsor lines labeled Advertisement"
              width={1300}
              height={700}
            />
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-facts">
          <div className="sp-fact">
            <strong>6 pages</strong>
            <p>The home page, plus the five pages people open when they choose a bot and get it working.</p>
          </div>
          <div className="sp-fact">
            <strong>${foundingPrice}, locked</strong>
            <p>
              Stay as long as you like and the price never moves. After the first {foundingSlots} sponsors, new slots cost $
              {laterPrice}.
            </p>
          </div>
          <div className="sp-fact">
            <strong>Public clicks</strong>
            <p>Each month we post your click count on this page, with the date. We count without cookies and leave our own visits out.</p>
          </div>
        </div>
      </section>

      {sponsors.length > 0 && (
        <section className="sp-section" aria-labelledby="sponsor-results-heading">
          <div className="shell sp-rules">
            <h2 className="sp-h2" id="sponsor-results-heading">Current sponsors</h2>
            <ul className="sponsor-results">
              {sponsors.map((sponsor) => (
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
        <div className="shell sp-dir">
          <div>
            <h2 className="sp-h2">Run a bot directory? ${directoryPrice} a month</h2>
            <p className="sp-lede">
              {openDirectorySlots() > 0
                ? "Independent directories get a shorter line in the same strip, five at a time."
                : "Directory slots are full right now."}{" "}
              Your Agent Watch listing stays exactly as it is, paid or not.
            </p>
          </div>
          {directoryCheckoutUrl ? (
            <a className="button button-secondary" href={directoryCheckoutUrl} rel="noopener">
              Get a directory slot <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : (
            <a className="button button-secondary" href={mailto("Directory slot")}>
              Reserve a directory slot
            </a>
          )}
        </div>
      </section>

      <section className="sp-section">
        <div className="shell sp-rules">
          <h2 className="sp-h2">Audience numbers on {audienceDay}</h2>
          <p>
            Bot Cabinet is young. On {audienceDay} we publish 30 days of traffic with our own visits taken out. Founding
            sponsors get the low price because they bought before anyone saw that number.
          </p>
          <h2 className="sp-h2 sp-h2-next">The rules</h2>
          <p>
            Every line carries the word Advertisement, and its link tells Google it was paid for. We read each line before
            it goes up and refund anyone we turn down. Sponsors stay off test records, Bot pages, comparisons and downloads.
            The AI companies Bot Cabinet compares can&apos;t buy a slot: OpenAI, Anthropic, Google, xAI, Meta and Nous
            Research.
          </p>
          <p>
            Questions go to <a href={`mailto:${contact}`}>{contact}</a>. Payment runs through Stripe for Linchpin
            Resources LLC, and Bot Cabinet never sees your card. <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
