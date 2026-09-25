"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react";
import { LIVE_BOT_SOURCES, newestListings, parseGitHubReleases, parseGrokBotFieldNotes, parseGrokHubListings, parseMuseAtWorkConfig, parseMuseAtWorkListings, parseMyBotFarmListings, parseOfficialGrokMarketplaceListings, type LiveBotListing } from "@/lib/live-bot-listings";

type SourceState = { name: string; ok: boolean };

function settleWithin<T>(promise: Promise<T>, milliseconds = 8_000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("Source timed out")), milliseconds);
    promise.then(
      (value) => { window.clearTimeout(timer); resolve(value); },
      (error) => { window.clearTimeout(timer); reject(error); },
    );
  });
}

async function fetchListings(signal?: AbortSignal) {
  return Promise.allSettled(LIVE_BOT_SOURCES.map((source) => settleWithin((async () => {
    if (source.format === "bot-cabinet-feed") {
      const response = await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`${source.name} unavailable`);
      const listings = parseOfficialGrokMarketplaceListings(await response.json());
      if (!listings.length) throw new Error(`${source.name} returned no usable Bot listings`);
      return listings;
    }
    if (source.format === "github-releases") {
      const response = await fetch(source.url, { signal, headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`${source.name} unavailable`);
      const listings = parseGitHubReleases(await response.json(), source.name, source.creator);
      if (!listings.length) throw new Error(`${source.name} returned no releases`);
      return listings;
    }
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
    if (source.format === "field-notes") {
      const response = await fetch(source.url, { signal, headers: { Accept: "text/plain" }, cache: "no-store" });
      if (!response.ok) throw new Error(`${source.name} unavailable`);
      const listings = parseGrokBotFieldNotes(await response.text());
      if (!listings.length) throw new Error(`${source.name} returned no usable roles`);
      return listings;
    }
    const response = await fetch(source.url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`${source.name} unavailable`);
    const data: unknown = await response.json();
    const listings = source.name === "My Bot Farm" ? parseMyBotFarmListings(data) : parseGrokHubListings(data);
    if (!listings.length) throw new Error(`${source.name} returned no usable Bot listings`);
    return listings;
  })())));
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
        <div><span className="eyebrow">Updated when you open this page</span><h2 id="live-bot-title">Current listings</h2></div>
        <button type="button" onClick={() => { setLoading(true); void refresh(); }} disabled={loading}><ArrowsClockwise size={16} /> Refresh</button>
      </div>
      <p>See one current item from every connected source. Dates appear only when a source provides them. These are listings, not recommendations.</p>
      <div className="live-bot-status" role="status">
        {loading ? "Checking directories…" : sources.map((source) => `${source.name}: ${source.ok ? "connected" : "unavailable"}`).join(" · ")}
        {checkedAt && !loading ? ` · Checked ${checkedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}
      </div>
      {items.length ? <ol className="live-bot-list">{items.map((item) => (
        <li key={item.id}>
          <div className="live-bot-list-meta"><span>{item.kind} · {item.source}</span>{item.listedAt ? <time dateTime={item.listedAt}>{new Date(item.listedAt).toLocaleDateString()}</time> : <span>Current entry</span>}</div>
          <div className="live-bot-list-copy"><div><h3>{item.name}</h3><p>{item.job}</p></div><span>By {item.creator}</span></div>
          <div className="live-bot-list-links"><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Open source <ArrowSquareOut size={13} /></a>{item.originalUrl && <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">Original <ArrowSquareOut size={13} /></a>}</div>
        </li>
      ))}</ol> : !loading ? <p className="live-bot-empty">The refreshable sources could not be reached. The coverage list above links to every source directly.</p> : null}
    </section>
  );
}
