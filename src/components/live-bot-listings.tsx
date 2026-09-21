"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react";
import { LIVE_BOT_SOURCES, newestListings, parseGrokHubListings, parseMyBotFarmListings, type LiveBotListing } from "@/lib/live-bot-listings";

type SourceState = { name: string; ok: boolean };

export function LiveBotListings() {
  const [items, setItems] = useState<LiveBotListing[]>([]);
  const [sources, setSources] = useState<SourceState[]>([]);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    const results = await Promise.allSettled(LIVE_BOT_SOURCES.map(async (source) => {
      const response = await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`${source.name} unavailable`);
      const data: unknown = await response.json();
      const listings = source.name === "My Bot Farm" ? parseMyBotFarmListings(data) : parseGrokHubListings(data);
      if (!listings.length) throw new Error(`${source.name} returned no usable Bot listings`);
      return listings;
    }));
    if (signal?.aborted) return;
    setSources(results.map((result, index) => ({ name: LIVE_BOT_SOURCES[index].name, ok: result.status === "fulfilled" })));
    const available = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    if (available.length) setItems(newestListings(available));
    setCheckedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 15 * 60 * 1000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [refresh]);

  return (
    <section className="live-bot-section" aria-labelledby="live-bot-title">
      <div className="live-bot-heading">
        <div><span className="eyebrow">From public Bot directories</span><h2 id="live-bot-title">Fresh Bot listings</h2></div>
        <button type="button" onClick={() => void refresh()} disabled={loading}><ArrowsClockwise size={16} /> Refresh</button>
      </div>
      <p>Newly listed Bots and teams from My Bot Farm and GrokHub. These are their descriptions, not our recommendations. We have not installed or tested them. Open the source before giving any Bot access.</p>
      <div className="live-bot-status" role="status">
        {loading ? "Checking directories…" : sources.map((source) => `${source.name}: ${source.ok ? "connected" : "unavailable"}`).join(" · ")}
        {checkedAt && !loading ? ` · Checked ${checkedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}
      </div>
      {items.length ? <div className="live-bot-grid">{items.map((item) => (
        <article key={item.id} className="live-bot-card">
          <div className="live-bot-card-meta"><span>{item.kind} · {item.source}</span><time dateTime={item.listedAt}>Listed {new Date(item.listedAt).toLocaleDateString()}</time></div>
          <h3>{item.name}</h3><p>{item.job}</p><div className="live-bot-card-bottom"><span>By {item.creator}</span><div>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">View listing <ArrowSquareOut size={13} /></a>
            {item.originalUrl && <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">Original link <ArrowSquareOut size={13} /></a>}
          </div></div>
        </article>
      ))}</div> : !loading ? <p className="live-bot-empty">The directories could not be reached. Try Refresh or open <a href="https://mybot.farm/catalog">My Bot Farm</a> and <a href="https://www.grokhub.io/">GrokHub</a> directly.</p> : null}
    </section>
  );
}
