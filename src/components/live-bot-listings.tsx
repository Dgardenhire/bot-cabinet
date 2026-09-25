"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react";
import { LIVE_BOT_SOURCES, type LiveBotListing } from "@/lib/live-bot-listings";

type SourceState = { name: string; ok: boolean; count: number };
type LiveFeed = { checkedAt: string; sources: SourceState[]; totalCount: number; items: LiveBotListing[] };

function settleWithin<T>(promise: Promise<T>, milliseconds = 8_000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("Source timed out")), milliseconds);
    promise.then(
      (value) => { window.clearTimeout(timer); resolve(value); },
      (error) => { window.clearTimeout(timer); reject(error); },
    );
  });
}

async function fetchListings(signal?: AbortSignal): Promise<LiveFeed> {
  const response = await settleWithin(fetch("/api/agent-watch/listings", { signal, headers: { Accept: "application/json" }, cache: "no-store" }));
  if (!response.ok) throw new Error("Current listings are unavailable");
  return response.json() as Promise<LiveFeed>;
}

export function LiveBotListings() {
  const [items, setItems] = useState<LiveBotListing[]>([]);
  const [sources, setSources] = useState<SourceState[]>([]);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [kind, setKind] = useState<"All" | LiveBotListing["kind"]>("All");
  const [visibleLimit, setVisibleLimit] = useState(12);

  const refresh = useCallback((signal?: AbortSignal) => {
    void fetchListings(signal).then((feed) => {
      if (signal?.aborted) return;
      setSources(feed.sources);
      setItems(feed.items);
      setTotalCount(feed.totalCount);
      setCheckedAt(new Date(feed.checkedAt));
      setLoading(false);
    }).catch(() => { if (!signal?.aborted) setLoading(false); });
  }, []);

  const filteredItems = kind === "All" ? items : items.filter((item) => item.kind === kind);
  const visibleItems = filteredItems.slice(0, visibleLimit);
  const availableKinds = (["All", "Bot", "Team", "Workflow", "Role", "Tool", "Repository", "Release"] as const)
    .filter((value) => value === "All" || items.some((item) => item.kind === value));
  const connectedCount = sources.filter((source) => source.ok).length;

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 15 * 60 * 1000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [refresh]);

  return (
    <section className="live-bot-section" aria-labelledby="live-bot-title">
      <div className="live-bot-heading">
        <div><span className="eyebrow">Updated when you open this page</span><h2 id="live-bot-title">Current listings</h2></div>
        <button type="button" onClick={() => { setLoading(true); void refresh(); }} disabled={loading}><ArrowsClockwise size={16} /> Refresh</button>
      </div>
      <p>A short, mixed sample from every connected source. Dates appear only when a source provides them. These are listings, not recommendations.</p>
      <div className="live-bot-status" role="status">
        {loading ? "Checking directories…" : `${totalCount.toLocaleString()} entries found across ${connectedCount} of ${LIVE_BOT_SOURCES.length} live sources`}
        {checkedAt && !loading ? ` · Checked ${checkedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}
      </div>
      {items.length ? <div className="live-bot-filters" aria-label="Filter current listings">{availableKinds.map((value) => <button type="button" aria-pressed={kind === value} onClick={() => { setKind(value); setVisibleLimit(12); }} key={value}>{value}</button>)}</div> : null}
      {visibleItems.length ? <ol className="live-bot-list">{visibleItems.map((item) => (
        <li key={item.id}>
          <div className="live-bot-list-meta"><span>{item.kind} · {item.source}</span>{item.listedAt ? <time dateTime={item.listedAt}>{new Date(item.listedAt).toLocaleDateString()}</time> : <span>Current entry</span>}</div>
          <div className="live-bot-list-copy"><div><h3>{item.name}</h3><p>{item.job}</p></div><span>By {item.creator}</span></div>
          <div className="live-bot-list-links"><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Open source <ArrowSquareOut size={13} /></a>{item.originalUrl && <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">Original <ArrowSquareOut size={13} /></a>}</div>
        </li>
      ))}</ol> : !loading ? <p className="live-bot-empty">No current entries match this filter. The source list below links to every source directly.</p> : null}
      {visibleItems.length < filteredItems.length ? <button className="button button-secondary live-bot-more" type="button" onClick={() => setVisibleLimit((value) => value + 12)}>Show 12 more</button> : null}
      {!loading && sources.some((source) => !source.ok) ? <details className="live-bot-source-health"><summary>Source status</summary><p>{sources.map((source) => `${source.name}: ${source.ok ? `${source.count.toLocaleString()} entries` : "unavailable"}`).join(" · ")}</p></details> : null}
    </section>
  );
}
