import type { Metadata } from "next";
import { Binoculars, CheckCircle, Flask, Rss, Warning } from "@phosphor-icons/react/dist/ssr";
import { AgentWatchFeed } from "@/components/agent-watch-feed";
import { Eyebrow } from "@/components/ui";
import { AGENT_WATCH_ITEMS, AGENT_WATCH_UPDATED } from "@/data/agent-watch";
import { buildPageMetadata } from "@/lib/metadata";

const baseMetadata = buildPageMetadata({
  title: "Agent Watch",
  description: "New AI tools and useful ways to use them, with sources, clear test notes and updates from Bot Cabinet.",
  path: "/watch/",
  image: "/brand/social/field-manual-1200x630.jpg",
  imageAlt: "Agent Watch — current signals and Bot Cabinet responses",
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: { "application/rss+xml": [{ url: "/watch/feed.xml", title: "Agent Watch RSS" }] },
  },
};

export default function AgentWatchPage() {
  return (
    <main id="main-content" className="page-main agent-watch-page">
      <section className="inner-hero">
        <div className="shell agent-watch-hero">
          <div>
            <Eyebrow>Updated {AGENT_WATCH_UPDATED}</Eyebrow>
            <h1 className="inner-title">Agent Watch</h1>
            <p className="inner-deck">
              New AI tools and useful ways to put them to work. Each note explains what changed, why it matters, what Bot Cabinet added, and what still needs to be tested.
            </p>
            <a href="/watch/feed.xml" className="button button-secondary" data-funnel-event="agent_watch_rss_open" data-funnel-surface="agent_watch">Follow by RSS <Rss size={16} aria-hidden="true" /></a>
          </div>
          <div className="agent-watch-method">
            <Binoculars size={31} weight="thin" aria-hidden="true" />
            <h2>We show what we know</h2>
            <p>We link to the source. We say when a claim comes from a company. We only call something tested after we have run it.</p>
          </div>
        </div>
      </section>

      <section className="content-section shell" aria-labelledby="watch-method-title">
        <div className="agent-watch-key">
          <h2 id="watch-method-title">How to read this page</h2>
          <div><CheckCircle size={20} weight="thin" /><span><strong>Source checked</strong> means we opened and read the linked public page.</span></div>
          <div><Flask size={20} weight="thin" /><span><strong>Still being tested</strong> means some work is done, but an important test or setup step remains.</span></div>
          <div><Warning size={20} weight="thin" /><span><strong>What the company says</strong> means Bot Cabinet has not yet proved the claim itself.</span></div>
        </div>

        <div className="section-heading">
          <Eyebrow>Latest updates</Eyebrow>
          <h2>What Bot Cabinet is watching</h2>
          <p>This page is the Agent Watch feed. New notes appear here after we review them. RSS is simply another way to follow the same notes.</p>
        </div>

        <AgentWatchFeed fallbackItems={AGENT_WATCH_ITEMS} />
      </section>
    </main>
  );
}
