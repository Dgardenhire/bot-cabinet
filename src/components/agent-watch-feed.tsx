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

export function AgentWatchFeed({ fallbackItems }: { fallbackItems: AgentWatchItem[] }) {
  const [items, setItems] = useState(fallbackItems);
  const noteworthyBots = items.filter((item) => item.botDetails);
  const watchNotes = items.filter((item) => !item.botDetails);

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
              <span>Specific Bots worth a closer look</span>
              <h2 id="noteworthy-bots-title">New and noteworthy Bots</h2>
            </div>
            <p>Some may deserve a new Cabinet Bot. Others show how an existing Bot could get better. “Inspected” means the public listing and sources were checked, not that the Bot was run.</p>
          </div>
          <div className="noteworthy-bot-grid">
            {noteworthyBots.map((item) => {
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
                    <div><dt>Accounts and access</dt><dd>{bot.requiredAccess}</dd></div>
                    <div><dt>Outside the chat</dt><dd>{bot.outsideActions}</dd></div>
                    <div><dt>Closest Cabinet match</dt><dd><Link href={bot.closestCabinetMatch.href}>{bot.closestCabinetMatch.label} <ArrowRight size={13} /></Link></dd></div>
                    <div className="noteworthy-bot-decision"><dt>Cabinet decision</dt><dd><strong>{botDecisionLabels[bot.cabinetDecision]}</strong>{bot.cabinetFit}</dd></div>
                    <div><dt>What remains uncertain</dt><dd>{item.limits}</dd></div>
                  </dl>
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
        {watchNotes.map((item) => (
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
