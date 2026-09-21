import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowSquareOut, Binoculars, CalendarCheck, CheckCircle, Flask, Rss, Warning } from "@phosphor-icons/react/dist/ssr";
import { AgentWatchVisitStatus } from "@/components/agent-watch-visit-status";
import { EvidencePill, Eyebrow } from "@/components/ui";
import { AGENT_WATCH_ITEMS, AGENT_WATCH_UPDATED, type WatchEvidence, type WatchResponseStatus } from "@/data/agent-watch";
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

const evidenceLabels: Record<WatchEvidence, string> = {
  observed: "Source checked",
  "provider-claim": "What the company says",
  "cabinet-tested": "Tested by Bot Cabinet",
};

const statusLabels: Record<WatchResponseStatus, string> = {
  published: "Added to Bot Cabinet",
  prepared: "Ready, but not live",
  testing: "Still being tested",
  watching: "Watching",
};

const evidenceKinds: Record<WatchEvidence, "official" | "tested" | "blueprint"> = {
  observed: "official",
  "provider-claim": "blueprint",
  "cabinet-tested": "tested",
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
            <AgentWatchVisitStatus slugs={AGENT_WATCH_ITEMS.map(item => item.slug)} />
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

        <div className="agent-watch-list">
          {AGENT_WATCH_ITEMS.map((item) => (
            <article className="agent-watch-card" id={item.slug} key={item.slug}>
              <div className="agent-watch-card-meta">
                <EvidencePill kind={evidenceKinds[item.evidence]}>{evidenceLabels[item.evidence]}</EvidencePill>
                <span>{statusLabels[item.responseStatus]}</span>
              </div>
              <h2>{item.title}</h2>
              <dl>
                <div><dt>What changed</dt><dd>{item.signal}</dd></div>
                <div><dt>Why it matters</dt><dd>{item.whyItMatters}</dd></div>
                <div><dt>What Bot Cabinet did</dt><dd>{item.cabinetResponse}</dd></div>
                <div className="agent-watch-limit"><dt>What we still do not know</dt><dd>{item.limits}</dd></div>
              </dl>
              <div className="agent-watch-dates">
                <span><CalendarCheck size={16} weight="thin" /> Observed {item.observedOn}</span>
                <span>Review again by {item.reviewAgainBy}</span>
              </div>
              <div className="agent-watch-links">
                {item.sources.map((source) => (
                  <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} <ArrowSquareOut size={13} /></a>
                ))}
                {item.cabinetLinks?.map((link) => (
                  <Link href={link.href} key={link.href}>{link.label} <ArrowRight size={13} /></Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
