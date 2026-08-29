import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CurrencyDollar, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { FirstRunChecklist } from "@/components/first-run-checklist";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start here · Your first Bot",
  description: "Put Scout to work in Hermes Desktop with a clear five-step guide, an exact first prompt, and a visible success checkpoint.",
  path: "/start/",
  image: "/brand/social/first-bot-1200x630.jpg",
  imageAlt: "Start your first Bot with Bot Cabinet and Scout",
});

export default function StartPage() {
  return (
    <main id="main-content" className="page-main first-run-page">
      <section className="first-run-hero">
        <div className="shell first-run-hero-grid">
          <div className="first-run-hero-copy">
            <Eyebrow>Your first Bot in about 10 minutes</Eyebrow>
            <h1>Put Scout to work</h1>
            <p>
              Follow five plain-language steps to install Hermes Desktop, import a research Bot,
              give it a real job, and check the result. Every step tells you what success looks like.
            </p>
            <div className="button-row">
              <a href="#first-run-steps" className="button button-primary" data-funnel-event="first_run_guide_opened" data-funnel-surface="start_page">
                Start the guide <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link href="/bots/scout" className="button button-secondary" data-funnel-event="first_run_scout_details" data-funnel-surface="start_page">
                Meet Scout
              </Link>
            </div>
            <div className="first-run-facts" aria-label="What to expect">
              <span><Clock size={18} weight="thin" aria-hidden="true" /> About 10 minutes</span>
              <span><CurrencyDollar size={18} weight="thin" aria-hidden="true" /> Bot Cabinet and Hermes are free</span>
              <span><ShieldCheck size={18} weight="thin" aria-hidden="true" /> Start with public, low-risk material</span>
            </div>
          </div>
          <figure className="first-run-hero-art">
            <Image
              src="/atelier/scout.jpg"
              alt="Scout, a friendly brass and cream research Bot in a Victorian study"
              width={1200}
              height={1800}
              priority
            />
            <figcaption>Scout · Research and source finding</figcaption>
          </figure>
        </div>
      </section>

      <section className="first-run-cost-note" aria-label="What you need">
        <div className="shell">
          <strong>What you need:</strong>
          <span>A computer, Hermes Desktop, and a supported AI provider. Provider costs vary.</span>
        </div>
      </section>

      <section className="content-section shell" id="first-run-steps">
        <div className="first-run-section-heading">
          <div>
            <Eyebrow>Follow the checkpoints</Eyebrow>
            <h2 className="section-heading">From download to a useful research brief</h2>
          </div>
          <p className="section-deck">
            Complete each step in order. Your progress stays in this browser. Funnel measurement
            records which steps people use, never your prompt, provider key, conversation, or research result.
          </p>
        </div>
        <FirstRunChecklist />
      </section>

      <section className="content-section shell first-run-next">
        <div>
          <Eyebrow>What happens next</Eyebrow>
          <h2 className="section-heading">Keep the conversation going</h2>
          <p className="section-deck">
            Scout keeps its role and conversation inside Hermes. Ask it to refine the brief,
            compare sources, or hand the verified findings to a Writer Bot. The Cabinet includes
            more roles when you are ready for another job.
          </p>
        </div>
        <div className="button-row">
          <Link href="/bots" className="button button-primary">Browse The Cabinet <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href="/use-cases" className="button button-secondary">See Bots work together</Link>
        </div>
      </section>
    </main>
  );
}
