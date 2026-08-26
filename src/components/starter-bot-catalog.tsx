"use client";

import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import {
  STARTER_BOTS,
  STARTER_CATEGORY_LABELS,
  type StarterBotCategory,
} from "@/data/starter-bots";

const categories = Object.entries(STARTER_CATEGORY_LABELS) as [StarterBotCategory, string][];

export function StarterBotCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StarterBotCategory | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return STARTER_BOTS.filter((bot) => {
      const categoryMatches = category === "all" || bot.category === category;
      const searchMatches =
        !needle ||
        [bot.name, bot.title, bot.summary, bot.whoItHelps, ...bot.asks]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return categoryMatches && searchMatches;
    });
  }, [category, query]);

  return (
    <div>
      <div className="registry-controls" aria-label="Filter Hermes Bots">
        <label className="registry-search">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="sr-only">Search Hermes Bots</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by job or result"
          />
        </label>
        <div className="registry-filter-row" aria-label="Filter by category">
          <button type="button" className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All</button>
          {categories.map(([key, label]) => (
            <button type="button" className={category === key ? "active" : ""} onClick={() => setCategory(key)} key={key}>{label}</button>
          ))}
        </div>
      </div>

      <p className="registry-results-line" aria-live="polite">
        <span>{visible.length} Hermes Bot{visible.length === 1 ? "" : "s"}</span>
        <span>Role instructions · setup steps · example requests</span>
      </p>

      <div className="registry-grid starter-grid">
        {visible.map((bot) => (
          <Link href={`/bots/${bot.slug}`} className="registry-card starter-card" key={bot.slug}>
            <div className="registry-card-image">
              <Image src={bot.image} alt="" width={900} height={900} />
              <span>LINCHPIN starter template</span>
            </div>
            <div className="registry-card-copy">
              <div className="registry-card-meta">
                <span>{STARTER_CATEGORY_LABELS[bot.category]}</span>
                <span>Free starter</span>
              </div>
              <h2>{bot.name}</h2>
              <strong className="starter-card-title">{bot.title}</strong>
              <p>{bot.summary}</p>
              <div className="registry-card-foot">
                <span>Includes examples and setup</span>
                <span>View this Hermes Bot →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!visible.length && (
        <div className="registry-empty">
          <h2>No Hermes Bots match that search</h2>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Show all Hermes Bots</button>
        </div>
      )}
    </div>
  );
}
