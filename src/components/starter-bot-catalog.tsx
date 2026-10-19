"use client";

import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import specialists from "@/data/specialist-index.json";
import { getSpecialistPortrait } from "@/data/specialist-portraits";
import styles from "./manual-bot-plan.module.css";
import archetypeStyles from "./archetype-filter.module.css";
import { WORK_ARCHETYPES, matchesWorkArchetype, type WorkArchetypeId } from "@/data/work-archetypes";

import {
  STARTER_BOTS,
  STARTER_CATEGORY_LABELS,
} from "@/data/starter-bots";

export function StarterBotCatalog() {
  const [query, setQuery] = useState("");
  const [archetype, setArchetype] = useState<WorkArchetypeId | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return STARTER_BOTS.filter((bot) => {
      const categoryMatches = matchesWorkArchetype(bot.slug, archetype);
      const searchMatches =
        !needle ||
        [bot.name, bot.title, bot.summary, bot.whoItHelps, ...bot.asks]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return categoryMatches && searchMatches;
    });
  }, [archetype, query]);
  const visibleSpecialists = specialists.filter(bot => matchesWorkArchetype(bot.slug, archetype) && [bot.name, bot.summary].join(" ").toLowerCase().includes(query.trim().toLowerCase()));

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
        <label className={archetypeStyles.filter}>
          What kind of help do you need?
          <select value={archetype} onChange={event => setArchetype(event.target.value as WorkArchetypeId | "all")}>
            <option value="all">All kinds of help</option>
            {WORK_ARCHETYPES.map(group => <option value={group.id} key={group.id}>{group.name}</option>)}
          </select>
        </label>
      </div>
      <p className={archetypeStyles.description}>{WORK_ARCHETYPES.find(group => group.id === archetype)?.job ?? "Choose a kind of help, then compare the roles below. Some are specialists within the same kind of work."}</p>

      <p className="registry-results-line" aria-live="polite">
        <span>{visible.length + visibleSpecialists.length} Bot{visible.length + visibleSpecialists.length === 1 ? "" : "s"}</span>
        <span>{visible.length} starter packs · {visibleSpecialists.length} manual specialists</span>
      </p>

      {visibleSpecialists.length > 0 && <section className={styles.section}><h2>Specialists for a narrower job</h2><p>Each specialist has a reviewed sample answer from the Hermes SDK. That does not test Desktop setup, connected accounts or Grok. Open a role to see its instructions and try your own task.</p><div className="registry-grid starter-grid">{visibleSpecialists.map(bot => <Link className="registry-card starter-card" key={bot.slug} href={`/bots/${bot.slug}/`}>
        <div className="registry-card-image"><Image src={getSpecialistPortrait(bot.slug).image} alt="" width={768} height={768} sizes="(max-width: 760px) 90vw, 30vw" /><span>Bot Cabinet · Specialist</span></div>
        <div className="registry-card-copy"><div className="registry-card-meta"><span>Manual setup</span><span>Free instructions</span></div><h3>{bot.name}</h3><p>{bot.summary}</p><div className="registry-card-foot"><span>Includes a sample task</span><span>Try it →</span></div></div>
      </Link>)}</div></section>}
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
          <button type="button" onClick={() => { setQuery(""); setArchetype("all"); }}>Show all Bots</button>
        </div>
      )}
    </div>
  );
}
