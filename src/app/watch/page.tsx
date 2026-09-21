import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowSquareOut, Binoculars, CalendarCheck, CheckCircle, Flask, Rss, Warning } from "@phosphor-icons/react/dist/ssr";
import { AgentWatchVisitStatus } from "@/components/agent-watch-visit-status";
import { EvidencePill, Eyebrow } from "@/components/ui";
import { AGENT_WATCH_ITEMS, AGENT_WATCH_UPDATED, type WatchEvidence, type WatchResponseStatus } from "@/data/agent-watch";
import { buildPageMetadata } from "@/lib/metadata";

const baseMetadata = buildPageMetadata({
  title: "Agent Watch",
  description: "Dated, source-linked signals from the changing agent ecosystem—and what Bot Cabinet is testing, publishing or deliberately not doing about them.",
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
  observed: "Source observed",
  "provider-claim": "Provider claims",
  "cabinet-tested": "Cabinet tested",
};

const statusLabels: Record<WatchResponseStatus, string> = {
  published: "Cabinet response published",
  prepared: "Prepared locally · not deployed",
  testing: "Testing or installation pending",
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
            <Eyebrow>Living field notes · Updated {AGENT_WATCH_UPDATED}</Eyebrow>
            <h1 className="inner-title">Agent Watch</h1>
            <p className="inner-deck">
              What changed, why it may matter, and what Bot Cabinet has actually done about it. Named platforms are examples—not the boundary of the search.
            </p>
            <a href="/watch/feed.xml" className="button button-secondary" data-funnel-event="agent_watch_rss_open" data-funnel-surface="agent_watch">Subscribe to Agent Watch RSS <Rss size={16} aria-hidden="true" /></a>
            <AgentWatchVisitStatus slugs={AGENT_WATCH_ITEMS.map(item => item.slug)} />
          </div>
          <div className="agent-watch-method">
            <Binoculars size={31} weight="thin" aria-hidden="true" />
            <h2>Signal is not proof</h2>
            <p>Every note separates public evidence, Cabinet interpretation, implementation status and the next review date.</p>
          </div>
        </div>
      </section>

      <section className="content-section shell" aria-labelledby="watch-method-title">
        <div className="agent-watch-key">
          <h2 id="watch-method-title">How to read this page</h2>
          <div><CheckCircle size={20} weight="thin" /><span><strong>Observed</strong> means Cabinet inspected the linked public source.</span></div>
          <div><Flask size={20} weight="thin" /><span><strong>Testing</strong> means code or guidance exists but the stated runtime or cloud step is unfinished.</span></div>
          <div><Warning size={20} weight="thin" /><span><strong>Provider claim</strong> is not an independent reliability or availability test.</span></div>
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
                <div><dt>Signal</dt><dd>{item.signal}</dd></div>
                <div><dt>Why it matters</dt><dd>{item.whyItMatters}</dd></div>
                <div><dt>Cabinet response</dt><dd>{item.cabinetResponse}</dd></div>
                <div className="agent-watch-limit"><dt>What remains unproven</dt><dd>{item.limits}</dd></div>
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
