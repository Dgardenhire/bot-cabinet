import type { Metadata } from "next";
import Link from "next/link";

import { SPONSOR_PROGRAM } from "@/data/sponsors";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description: "What Bot Cabinet collects, what stays in your browser, and what is sent elsewhere.",
  path: "/privacy/",
  image: "/brand/social/about-bot-cabinet-1200x630.jpg",
  imageAlt: "Bot Cabinet privacy",
});

export default function PrivacyPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell">
          <h1 className="inner-title">Privacy</h1>
          <p className="inner-deck">
            Bot Cabinet has no accounts and sets no cookies. Here is everything it collects, keeps in your browser
            or sends somewhere else.
          </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">Visit counts</h2>
        <p>
          Bot Cabinet uses Vercel Web Analytics, which counts visits without cookies. It records the page, the site
          you came from, your country, and your browser and device type. It also counts a few named clicks, such as
          downloading a Bot, choosing a platform or clicking a sponsor&apos;s line. It never records what you type
          into a form.
        </p>
        <p>
          Vercel hosts the site, and like any web host it handles the technical details of each request, including
          your IP address.
        </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">What stays in your browser</h2>
        <p>
          Bot Lab drafts, your first-run checklist and your light or dark theme are saved in your own browser. Bot
          Cabinet doesn&apos;t receive them, and clearing your browser&apos;s site data removes them. Fit Test answers
          never leave your browser.
        </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">What is sent elsewhere</h2>
        <p>
          If you ask Bot Lab for AI suggestions, it sends only the Bot name and job description to Anthropic through
          Bot Cabinet&apos;s server function.
        </p>
        <p>
          If you request the Starter Pack, your email and optional name go to Open Source, Damon Gardenhire&apos;s
          weekly newsletter, which delivers the pack. You can unsubscribe from any issue.
        </p>
        <p>
          A few pages load live lists of Bots and status updates from Bot Cabinet&apos;s own data service. Those
          requests carry no personal information.
        </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">Sponsors</h2>
        <p>
          Sponsor lines are plain links. They load no outside scripts and set no cookies. Sponsors pay through
          Stripe, which handles the card; Bot Cabinet never sees card numbers. See the{" "}
          <Link href="/sponsor">sponsor page</Link>.
        </p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="prose-column">
        <h2 className="section-heading">Questions</h2>
        <p>
          Email <a href={`mailto:${SPONSOR_PROGRAM.contact}`}>{SPONSOR_PROGRAM.contact}</a>.
        </p>
        </div>
      </section>
    </main>
  );
}
