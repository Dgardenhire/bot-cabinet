import type { Metadata } from "next";
import { CheckCircle, Flask, Warning } from "@phosphor-icons/react/dist/ssr";
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
        <LiveBotListings />

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
