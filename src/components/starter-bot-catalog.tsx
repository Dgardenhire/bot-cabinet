"use client";

import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import specialists from "@/data/specialist-index.json";
import styles from "./manual-bot-plan.module.css";

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
  const visibleSpecialists = specialists.filter(bot => (category === "all" || bot.category === category) && [bot.name, bot.summary].join(" ").toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className="registry-controls" aria-label="Filter Bots">
        <label className="registry-search">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="sr-only">Search Bots</span>
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
        <span>{visible.length + visibleSpecialists.length} Bot{visible.length + visibleSpecialists.length === 1 ? "" : "s"}</span>
        <span>{visible.length} starter packs · {visibleSpecialists.length} manual specialists</span>
      </p>

      {visibleSpecialists.length > 0 && <section className={styles.section}><h2>New specialists</h2><p>Copy the instructions and try a sample task. The recorded answers were written and checked in Codex; these Bots have not been tested in Hermes or Grok.</p><div className={styles.grid}>{visibleSpecialists.map(bot => <Link className={styles.card} key={bot.slug} href={`/bots/${bot.slug}/`}><span className={styles.status}>Manual setup</span><h3>{bot.name}</h3><p>{bot.summary}</p><span>Try the first task →</span></Link>)}</div></section>}
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
                <span>Choose an app and set up →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!visible.length && !visibleSpecialists.length && (
        <div className="registry-empty">
          <h2>No Bots match that search</h2>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Show all Bots</button>
        </div>
      )}
    </div>
  );
}
