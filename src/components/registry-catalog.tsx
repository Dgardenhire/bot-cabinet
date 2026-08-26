"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Funnel, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  REGISTRY_ENTRIES,
  REVIEW_SURFACE_LABELS,
  type RegistryCategory,
} from "@/data/registry";

const categories = (Object.entries(CATEGORY_LABELS) as [RegistryCategory, string][]).filter(([key]) =>
  REGISTRY_ENTRIES.some((entry) => entry.category === key),
);

const categoryOrder: Record<RegistryCategory, number> = {
  personal: 0,
  operations: 1,
  research: 2,
  "getting-started": 3,
  creative: 4,
  tools: 5,
};

function categoryFromQuery(value: string | null): RegistryCategory | "all" {
  if (!value) return "all";
  if (value === "coding") return "tools";
  if (value in CATEGORY_LABELS) return value as RegistryCategory;
  return "all";
}

export function RegistryCatalog() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RegistryCategory | "all">(() =>
    categoryFromQuery(searchParams.get("job")),
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return REGISTRY_ENTRIES
      .filter((entry) => {
        const categoryMatch = category === "all" || entry.category === category;
        const textMatch =
          !needle ||
          [
            entry.name,
            entry.maintainer,
            entry.summary,
            entry.bestFor,
            ...entry.exampleTasks,
            ...entry.expectedOutput,
            CATEGORY_LABELS[entry.category],
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return categoryMatch && textMatch;
      })
      .sort((left, right) => categoryOrder[left.category] - categoryOrder[right.category]);
  }, [category, query]);

  return (
    <div>
      <div className="registry-controls" aria-label="Filter Community Registry profiles">
        <label className="registry-search">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="sr-only">Search Community Registry profiles</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by role, project, or publisher"
          />
        </label>
        <div className="registry-filter-label">
          <Funnel size={16} aria-hidden="true" /> Job
        </div>
        <div className="registry-filter-row">
          <button type="button" className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All</button>
          {categories.map(([key, label]) => (
            <button type="button" className={category === key ? "active" : ""} onClick={() => setCategory(key)} key={key}>{label}</button>
          ))}
        </div>
      </div>

      <div className="registry-results-line" aria-live="polite">
        <span>{visible.length} profile{visible.length === 1 ? "" : "s"} in the Community Registry</span>
        <span>Install counts are unavailable.</span>
      </div>

      {visible.length ? (
        <div className="registry-grid">
          {visible.map((entry) => (
            <Link href={`/community/${entry.slug}`} className="registry-card" key={entry.slug}>
              <div className="registry-card-image">
                <Image src={entry.image} alt="" width={900} height={900} />
                <span>Illustration</span>
              </div>
              <div className="registry-card-copy">
                <div className="registry-card-meta">
                  <span>{CATEGORY_LABELS[entry.category]}</span>
                  <span className={`surface-${entry.reviewSurface}`}>{REVIEW_SURFACE_LABELS[entry.reviewSurface]}</span>
                </div>
                <h2>{entry.name}</h2>
                <p>{entry.summary}</p>
                <div className="registry-card-foot">
                  <span>Published by {entry.maintainer}</span>
                  <span>See use and review status →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="registry-empty">
          <WarningCircle size={28} weight="thin" aria-hidden="true" />
          <h2>No records match those filters</h2>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
