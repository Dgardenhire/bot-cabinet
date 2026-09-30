import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start here",
  description: "Choose a job to try in Hermes Desktop, a ChatGPT workspace, Grok Bot, or your ChatGPT Dot.",
  path: "/start/",
  image: "/brand/social/first-bot-1200x630.jpg",
  imageAlt: "Start using a Bot with Bot Cabinet",
});

export default function StartPage() {
  return (
    <main id="main-content" className="page-main start-choice-page">
      <section className="content-section shell start-choice-hero">
        <Eyebrow>Start here</Eyebrow>
        <h1>Get one useful result from a Bot</h1>
        <p>Choose the app you use. We&apos;ll help you set up a Bot, try one task, and check the result.</p>
      </section>

      <section className="shell start-choice-grid" aria-label="Choose where to use your Bot">
        <article>
          <span className="start-choice-number">01 · On your computer</span>
          <h2>Use Hermes Desktop</h2>
          <p>Start with Scout. Follow five steps to a short, source-checked research brief.</p>
          <Link href="/start/hermes" className="button button-primary" data-funnel-event="first_run_choose_hermes" data-funnel-surface="start_page">
            Start with Hermes <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Needs Hermes Desktop and an AI provider. Provider costs vary.</small>
        </article>
        <article>
          <span className="start-choice-number">02 · In your ChatGPT workspace</span>
          <h2>Make a Workspace Agent</h2>
          <p>Start with Chief of Staff. Set up its job and limits, then try one private task.</p>
          <Link href="/start/chatgpt/chief-of-staff" className="button button-primary" data-funnel-event="first_run_choose_chatgpt" data-funnel-surface="start_page">
            Start with ChatGPT <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Research preview for Business, Enterprise, and Edu. Your admin must enable access. We have not tested this setup for you.</small>
        </article>
        <article>
          <span className="start-choice-number">03 · In Grok Bot</span>
          <h2>Build a Grok Bot</h2>
          <p>Choose a Cabinet Bot, set it up in Grok Bot, and try one real task.</p>
          <Link href="/start/grok" className="button button-primary" data-funnel-event="first_run_choose_grok" data-funnel-surface="start_page">
            Start with Grok Bot <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Manual setup, not a one-click import. These briefs have not been tested in Grok Bot.</small>
        </article>
      </section>

      <section className="shell start-choice-news" aria-labelledby="dots-start-title">
        <div>
          <Eyebrow>New · September 29, 2026</Eyebrow>
          <h2 id="dots-start-title">Have a ChatGPT Dot?</h2>
          <p>Try a Bot Cabinet job with your first Dot. It is a guided task, not a Bot import or a separate specialist Dot.</p>
        </div>
        <Link href="/start/dots" className="text-link">Try a first task with Dots <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="content-section shell start-choice-more">
        <h2>Not sure which Bot you need?</h2>
        <p>Compare the main ways to use an agent, or browse by the job you want done.</p>
        <Link href="/compare" className="text-link">Compare personal AI agents <ArrowRight size={16} aria-hidden="true" /></Link><br />
        <Link href="/bots" className="text-link">Browse the Bots <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
