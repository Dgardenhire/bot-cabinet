import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start here",
  description: "Choose a Bot and see how to get started in Hermes Desktop, a ChatGPT workspace, or Grok Bot.",
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
        <p>Pick where you want to use it. We&apos;ll show you what to set up, what to ask first, and how to tell whether the answer helped.</p>
      </section>

      <section className="shell start-choice-grid" aria-label="Choose where to use your Bot">
        <article>
          <span className="start-choice-number">01 · On your computer</span>
          <h2>Use Hermes Desktop</h2>
          <p>Start with Scout, a research Bot. Follow five steps from download to a short, source-checked brief.</p>
          <Link href="/start/hermes" className="button button-primary" data-funnel-event="first_run_choose_hermes" data-funnel-surface="start_page">
            Start with Hermes <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Needs a computer, Hermes Desktop, and a supported AI provider. Provider costs vary.</small>
        </article>
        <article>
          <span className="start-choice-number">02 · In your ChatGPT workspace</span>
          <h2>Make a Workspace Agent</h2>
          <p>Start with Chief of Staff, or choose another Cabinet Bot. Copy its job and limits into the agent builder, then try a sample task privately.</p>
          <Link href="/start/chatgpt/chief-of-staff" className="button button-primary" data-funnel-event="first_run_choose_chatgpt" data-funnel-surface="start_page">
            Start with ChatGPT <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>Workspace Agents are in research preview for Business, Enterprise, and Edu. Your admin must enable access and let you create agents. Setup and task testing are still yours to do.</small>
        </article>
        <article>
          <span className="start-choice-number">03 · In Grok Bot</span>
          <h2>Build a Grok Bot</h2>
          <p>Choose a Cabinet Bot, use its build brief to set up the role in Grok Bot, then try a real task.</p>
          <Link href="/start/grok" className="button button-primary" data-funnel-event="first_run_choose_grok" data-funnel-surface="start_page">
            Start with Grok Bot <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <small>This is a manual build guide, not an import. Bot Cabinet has prepared the briefs but has not runtime-tested them in Grok Bot.</small>
        </article>
      </section>

      <section className="content-section shell start-choice-more">
        <h2>Not sure which Bot you need?</h2>
        <p>Browse by the job you want done. You can inspect a Bot before choosing a platform.</p>
        <Link href="/bots" className="text-link">Browse the Bots <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
