"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowSquareOut, CalendarCheck } from "@phosphor-icons/react";
import { EvidencePill } from "@/components/ui";
import type { AgentWatchItem, WatchEvidence, WatchResponseStatus } from "@/data/agent-watch";
import { AGENT_WATCH_API_URL, mergeWatchItems, parsePublicWatchFeed } from "@/lib/agent-watch-live";

const evidenceLabels: Record<WatchEvidence, string> = { observed: "Source reviewed", "provider-claim": "Maker’s claim", "cabinet-tested": "Tried by Bot Cabinet" };
const statusLabels: Record<WatchResponseStatus, string> = { published: "Guide available", prepared: "Guide in progress", testing: "Testing in progress", watching: "Watching" };
const evidenceKinds: Record<WatchEvidence, "official" | "tested" | "blueprint"> = { observed: "official", "provider-claim": "blueprint", "cabinet-tested": "tested" };

export function AgentWatchFeed({ fallbackItems }: { fallbackItems: AgentWatchItem[] }) {
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    const controller = new AbortController();
    fetch(AGENT_WATCH_API_URL, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("feed unavailable")))
      .then((value) => {
        const live = parsePublicWatchFeed(value);
        if (live.length > 0) {
          setItems(mergeWatchItems(live, fallbackItems));
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [fallbackItems]);

  return (
    <>
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
              <div><dt>Try this</dt><dd>{item.cabinetResponse}</dd></div>
              <div className="agent-watch-limit"><dt>What remains uncertain</dt><dd>{item.limits}</dd></div>
            </dl>
            <div className="agent-watch-dates">
              <span><CalendarCheck size={16} weight="thin" /> Updated {item.observedOn}</span>
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
