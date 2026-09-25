"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowSquareOut, CalendarCheck } from "@phosphor-icons/react";
import { EvidencePill } from "@/components/ui";
import type { AgentWatchItem, WatchBotDecision, WatchBotEvidence, WatchEvidence, WatchResponseStatus } from "@/data/agent-watch";
import { AGENT_WATCH_API_URL, mergeWatchItems, parsePublicWatchFeed } from "@/lib/agent-watch-live";

const evidenceLabels: Record<WatchEvidence, string> = { observed: "Source reviewed", "provider-claim": "Maker’s claim", "cabinet-tested": "Tried by Bot Cabinet" };
const statusLabels: Record<WatchResponseStatus, string> = { published: "Guide available", prepared: "Guide in progress", testing: "Testing in progress", watching: "Watching" };
const evidenceKinds: Record<WatchEvidence, "official" | "tested" | "blueprint"> = { observed: "official", "provider-claim": "blueprint", "cabinet-tested": "tested" };
const botEvidenceLabels: Record<WatchBotEvidence, string> = {
  listed: "Listed",
  inspected: "Inspected",
  imported: "Imported",
  "task-tested": "Task-tested",
  repeated: "Repeated",
};
const botDecisionLabels: Record<WatchBotDecision, string> = {
  "improve-existing": "Improve an existing Bot",
  "test-adaptation": "Test an adaptation",
  "write-guide": "Write a guide",
  "add-new": "Add a new Bot",
  watch: "Watch",
};

function variedPlatforms(items: AgentWatchItem[], limit = 2) {
  const selected: AgentWatchItem[] = [];
  const platforms = new Set<string>();
  for (const item of items) {
    const platform = item.botDetails?.platform;
    if (!platform || platforms.has(platform)) continue;
    selected.push(item);
    platforms.add(platform);
    if (selected.length === limit) return selected;
  }
  for (const item of items) {
    if (!selected.includes(item)) selected.push(item);
    if (selected.length === limit) break;
  }
  return selected;
}

export function AgentWatchFeed({ fallbackItems }: { fallbackItems: AgentWatchItem[] }) {
  const [items, setItems] = useState(fallbackItems);
  const [showAll, setShowAll] = useState(false);
  const noteworthyBots = items.filter((item) => item.botDetails);
  const watchNotes = items.filter((item) => !item.botDetails);
  const visibleBots = showAll ? noteworthyBots : variedPlatforms(noteworthyBots);
  const visibleNotes = showAll ? watchNotes : watchNotes.slice(0, 2);
  const hiddenCount = Math.max(0, items.length - Math.min(2, noteworthyBots.length) - Math.min(2, watchNotes.length));

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
      {noteworthyBots.length > 0 ? (
        <section className="noteworthy-bots" aria-labelledby="noteworthy-bots-title">
          <div className="noteworthy-bots-heading">
            <div>
              <span>From the latest listings</span>
              <h2 id="noteworthy-bots-title">New and noteworthy Bots</h2>
            </div>
            <p>We opened and reviewed these public listings. We have not run the Bots yet.</p>
          </div>
          <div className="noteworthy-bot-grid">
            {visibleBots.map((item) => {
              const bot = item.botDetails!;
              return (
                <article className="noteworthy-bot-card" id={item.slug} key={item.slug}>
                  <div className="noteworthy-bot-meta">
                    <EvidencePill kind={evidenceKinds[item.evidence]}>{botEvidenceLabels[bot.evidenceStatus]}</EvidencePill>
                    <span>{bot.platform}</span>
                  </div>
                  <h3>{bot.name}</h3>
                  <p className="noteworthy-bot-job">{bot.job}</p>
                  <dl>
                    <div><dt>Creator</dt><dd>{bot.creator}</dd></div>
                    <div><dt>Why it stands out</dt><dd>{item.whyItMatters}</dd></div>
                    <div><dt>Access and outside actions</dt><dd>{bot.requiredAccess} {bot.outsideActions}</dd></div>
                    <div className="noteworthy-bot-decision"><dt>Best next step</dt><dd><strong>{botDecisionLabels[bot.cabinetDecision]}</strong>{bot.cabinetFit} Closest current match: <Link href={bot.closestCabinetMatch.href}>{bot.closestCabinetMatch.label} <ArrowRight size={13} /></Link></dd></div>
                  </dl>
                  <details className="agent-watch-uncertainty"><summary>Limits and unknowns</summary><p>{item.limits}</p></details>
                  <div className="agent-watch-links">
                    {item.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} <ArrowSquareOut size={13} /></a>)}
                    {item.cabinetLinks?.map((link) => <Link href={link.href} key={link.href}>{link.label} <ArrowRight size={13} /></Link>)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
      <div className="agent-watch-list">
        {visibleNotes.map((item) => (
          <article className="agent-watch-card" id={item.slug} key={item.slug}>
            <div className="agent-watch-card-meta">
              <EvidencePill kind={evidenceKinds[item.evidence]}>{evidenceLabels[item.evidence]}</EvidencePill>
              <span>{statusLabels[item.responseStatus]}</span>
            </div>
            <h2>{item.title}</h2>
            <p className="agent-watch-signal">{item.signal}</p>
            <dl><div><dt>Why it matters</dt><dd>{item.whyItMatters}</dd></div><div><dt>Try this</dt><dd>{item.cabinetResponse}</dd></div></dl>
            <details className="agent-watch-uncertainty"><summary>Limits and unknowns</summary><p>{item.limits}</p></details>
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
      {hiddenCount > 0 ? <button className="button button-secondary agent-watch-more" type="button" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show fewer" : `Show ${hiddenCount} more reviewed notes`}</button> : null}
    </>
  );
}
