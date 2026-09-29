import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Flask, Warning } from "@phosphor-icons/react/dist/ssr";
import { AgentWatchFeed } from "@/components/agent-watch-feed";
import { AgentWatchSources } from "@/components/agent-watch-sources";
import { LiveBotListings } from "@/components/live-bot-listings";
import { Eyebrow } from "@/components/ui";
import { AGENT_WATCH_ITEMS } from "@/data/agent-watch";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Agent Watch",
  description: "A short, practical guide to noteworthy AI agents, Bots and ways to use them.",
  path: "/watch/",
  image: "/brand/social/field-manual-1200x630.jpg",
  imageAlt: "Agent Watch — noteworthy AI agents, Bots and useful ideas",
});

export default function AgentWatchPage() {
  return (
    <main id="main-content" className="page-main agent-watch-page">
      <section className="inner-hero">
        <div className="shell">
          <Eyebrow>New and noteworthy</Eyebrow>
          <h1 className="inner-title">Agent Watch</h1>
          <p className="inner-deck">
            Find new Bots and ways to use AI. Browse fresh listings from around the web, then see which ideas we have looked into more closely.
          </p>
        </div>
      </section>

      <section className="content-section shell" aria-labelledby="watch-method-title">
        <div className="agent-watch-first-tasks">
          <div>
            <Eyebrow>September 29 · OpenAI Dots</Eyebrow>
            <h2>Another way to put an agent to work</h2>
            <p>OpenAI has begun rolling out personal Dots. We read its launch guide and made a small first-task walkthrough. Specialist Dots are still limited to enterprise pilots; Bot Cabinet has not tested a Dot or built a one-click import.</p>
          </div>
          <Link href="/start/dots" className="text-link">Try a Cabinet job with a Dot <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>

        <LiveBotListings />

        <div className="agent-watch-first-tasks">
          <div>
            <Eyebrow>Try an idea</Eyebrow>
            <h2>Pick a first task</h2>
            <p>Daily Newspaper has one recorded Hermes test. The guide to fixing a bad AI answer is a method you can try in your own chat; we have not task-tested it.</p>
          </div>
          <div className="agent-watch-first-task-links">
            <Link href="/use-cases/personal-morning-newspaper" className="text-link" data-funnel-event="watch_tested_example_opened" data-funnel-surface="agent_watch" data-funnel-destination="morning_newspaper_first_task">
              Try Daily Newspaper <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/guides/fix-one-bad-ai-result" className="text-link" data-funnel-event="watch_diagnosis_guide_opened" data-funnel-surface="agent_watch" data-funnel-destination="diagnose_ai_result_guide">
              Fix a bad AI answer <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="agent-watch-editorial-heading">
          <Eyebrow>Closer look</Eyebrow>
          <h2 className="section-heading" id="watch-method-title">What stands out</h2>
          <p className="section-deck">We chose these ideas to examine further. Each note links to its source and says whether we read about it or actually tried it.</p>
        </div>

        <AgentWatchFeed fallbackItems={AGENT_WATCH_ITEMS} />

        <AgentWatchSources />

        <div className="agent-watch-key">
          <h2>Read the labels literally</h2>
          <div><CheckCircle size={20} weight="thin" /><span><strong>Source reviewed</strong> means the original public source was opened.</span></div>
          <div><Flask size={20} weight="thin" /><span><strong>Tried by Bot Cabinet</strong> means the stated test was actually run.</span></div>
          <div><Warning size={20} weight="thin" /><span><strong>Maker’s claim</strong> remains the maker’s description, not ours.</span></div>
        </div>
      </section>
    </main>
  );
}
