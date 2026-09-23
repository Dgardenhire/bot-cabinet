"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react";
import { LIVE_BOT_SOURCES, newestListings, parseGrokHubListings, parseMuseAtWorkConfig, parseMuseAtWorkListings, parseMyBotFarmListings, type LiveBotListing } from "@/lib/live-bot-listings";

type SourceState = { name: string; ok: boolean };

async function fetchListings(signal?: AbortSignal) {
  return Promise.allSettled(LIVE_BOT_SOURCES.map(async (source) => {
    if (source.format === "muse") {
      const configResponse = await fetch(source.url, { signal, cache: "no-store" });
      if (!configResponse.ok) throw new Error(`${source.name} unavailable`);
      const { apiUrl, apiKey } = parseMuseAtWorkConfig(await configResponse.text());
      const directoryUrl = `${apiUrl}/rest/v1/workflows?select=id,title,outcome,x_handle,created_at&status=eq.approved&order=created_at.desc&limit=100`;
      const response = await fetch(directoryUrl, {
        signal,
        headers: { Accept: "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`${source.name} unavailable`);
      const listings = parseMuseAtWorkListings(await response.json());
      if (!listings.length) throw new Error(`${source.name} returned no usable workflow listings`);
      return listings;
    }
    const response = await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`${source.name} unavailable`);
    const data: unknown = await response.json();
    const listings = source.name === "My Bot Farm" ? parseMyBotFarmListings(data) : parseGrokHubListings(data);
    if (!listings.length) throw new Error(`${source.name} returned no usable Bot listings`);
    return listings;
  }));
}

export function LiveBotListings() {
  const [items, setItems] = useState<LiveBotListing[]>([]);
  const [sources, setSources] = useState<SourceState[]>([]);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback((signal?: AbortSignal) => {
    void fetchListings(signal).then((results) => {
      if (signal?.aborted) return;
      setSources(results.map((result, index) => ({ name: LIVE_BOT_SOURCES[index].name, ok: result.status === "fulfilled" })));
      const available = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
      if (available.length) setItems(newestListings(available));
      setCheckedAt(new Date());
      setLoading(false);
    });
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
        <div><span className="eyebrow">A small live sample from public directories</span><h2 id="live-bot-title">New Bots and workflows</h2></div>
        <button type="button" onClick={() => { setLoading(true); void refresh(); }} disabled={loading}><ArrowsClockwise size={16} /> Refresh</button>
      </div>
      <p>Six recent listings from My Bot Farm, GrokHub and Muse at Work, rotated so one directory cannot take over the page. These are source descriptions, not recommendations, and they have not been tested by Bot Cabinet.</p>
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
      ))}</div> : !loading ? <p className="live-bot-empty">The directories could not be reached. Try Refresh or open <a href="https://mybot.farm/catalog">My Bot Farm</a>, <a href="https://www.grokhub.io/">GrokHub</a> and <a href="https://museatwork.app/">Muse at Work</a> directly.</p> : null}
    </section>
  );
}
