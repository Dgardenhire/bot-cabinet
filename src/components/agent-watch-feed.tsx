"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowSquareOut, CalendarCheck } from "@phosphor-icons/react";
import { AgentWatchVisitStatus } from "@/components/agent-watch-visit-status";
import { EvidencePill } from "@/components/ui";
import type { AgentWatchItem, WatchEvidence, WatchResponseStatus } from "@/data/agent-watch";
import { AGENT_WATCH_API_URL, mergeWatchItems, parsePublicWatchFeed } from "@/lib/agent-watch-live";

const evidenceLabels: Record<WatchEvidence, string> = { observed: "Source checked", "provider-claim": "What the company says", "cabinet-tested": "Tested by Bot Cabinet" };
const statusLabels: Record<WatchResponseStatus, string> = { published: "Added to Bot Cabinet", prepared: "Ready, but not live", testing: "Still being tested", watching: "Watching" };
const evidenceKinds: Record<WatchEvidence, "official" | "tested" | "blueprint"> = { observed: "official", "provider-claim": "blueprint", "cabinet-tested": "tested" };

export function AgentWatchFeed({ fallbackItems }: { fallbackItems: AgentWatchItem[] }) {
  const [items, setItems] = useState(fallbackItems);
  const [usingLiveFeed, setUsingLiveFeed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(AGENT_WATCH_API_URL, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("feed unavailable")))
      .then((value) => {
        const live = parsePublicWatchFeed(value);
        if (live.length > 0) {
          setItems(mergeWatchItems(live, fallbackItems));
          setUsingLiveFeed(true);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [fallbackItems]);

  return (
    <>
      <p className="agent-watch-feed-state" aria-live="polite">
        {usingLiveFeed ? "Showing the latest human-reviewed Keeper updates." : "Showing the latest built-in updates while the live feed is unavailable or has no newer items."}
      </p>
      <AgentWatchVisitStatus slugs={items.map((item) => item.slug)} />
      <div className="agent-watch-list">
        {items.map((item) => (
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
              {item.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} <ArrowSquareOut size={13} /></a>)}
              {item.cabinetLinks?.map((link) => <Link href={link.href} key={link.href}>{link.label} <ArrowRight size={13} /></Link>)}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
