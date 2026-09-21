import type { Metadata } from "next";
import { Binoculars, CheckCircle, Flask, Warning } from "@phosphor-icons/react/dist/ssr";
import { AgentWatchFeed } from "@/components/agent-watch-feed";
import { LiveBotListings } from "@/components/live-bot-listings";
import { Eyebrow } from "@/components/ui";
import { AGENT_WATCH_ITEMS, AGENT_WATCH_UPDATED } from "@/data/agent-watch";
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
        <div className="shell agent-watch-hero">
          <div>
            <Eyebrow>New and noteworthy · Updated {AGENT_WATCH_UPDATED}</Eyebrow>
            <h1 className="inner-title">Agent Watch</h1>
            <p className="inner-deck">
              A short guide to AI agents, Bots and useful new ways to work. See what each one does, who it may help, what to try and what remains uncertain.
            </p>
          </div>
          <div className="agent-watch-method">
            <Binoculars size={31} weight="thin" aria-hidden="true" />
            <h2>Find the signal</h2>
            <p>Skip the hype. Start with the job, the access it needs and one useful test you can try safely.</p>
          </div>
        </div>
      </section>

      <section className="content-section shell" aria-labelledby="watch-method-title">
        <LiveBotListings />
        <div className="agent-watch-key">
          <h2 id="watch-method-title">What the labels mean</h2>
          <div><CheckCircle size={20} weight="thin" /><span><strong>Source reviewed</strong> means the note links to the original public source.</span></div>
          <div><Flask size={20} weight="thin" /><span><strong>Tried by Bot Cabinet</strong> means the stated test was run for this guide.</span></div>
          <div><Warning size={20} weight="thin" /><span><strong>Maker’s claim</strong> means the maker describes the feature, but the claim has not been independently tested here.</span></div>
        </div>

        <div className="section-heading">
          <Eyebrow>Worth your attention</Eyebrow>
          <h2>Useful changes and ideas</h2>
          <p>See specific Bots first, followed by larger changes that may affect how people use agents.</p>
        </div>

        <AgentWatchFeed fallbackItems={AGENT_WATCH_ITEMS} />
      </section>
    </main>
  );
}
