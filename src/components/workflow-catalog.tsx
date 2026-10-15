"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { filterWorkflowJobs, JOB_CATEGORIES, type JobCategory, type WorkflowCard } from "@/lib/workflow-catalog";
import styles from "./workflow-catalog.module.css";

export function WorkflowCatalog({ jobs }: { jobs: WorkflowCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "All">("All");
  const [limit, setLimit] = useState(6);
  const matches = filterWorkflowJobs(jobs, query, category);

  return <div className={styles.catalog}>
    <div className={styles.controls}>
      <label className={styles.search}>
        <MagnifyingGlass size={20} aria-hidden="true" />
        <span className="sr-only">Search jobs</span>
        <input type="search" aria-label="Search jobs" placeholder="Try invoices, school, writing…" value={query}
          onChange={event => { setQuery(event.target.value); setLimit(6); }} />
      </label>
      <div className={styles.categories} aria-label="Filter jobs by category">
        {(["All", ...JOB_CATEGORIES] as const).map(item => <button type="button" key={item} aria-pressed={category === item}
          onClick={() => { setCategory(item); setLimit(6); }}>{item}</button>)}
      </div>
    </div>
    <p className={styles.count} role="status">{matches.length} {matches.length === 1 ? "job" : "jobs"}{query.trim() ? ` matching “${query.trim()}”` : " to explore"}</p>
    <div className={styles.grid}>
      {matches.slice(0, limit).map(job => <article className={styles.card} key={job.slug}>
        <Link href={`/use-cases/${job.slug}`} className={styles.art} tabIndex={-1} aria-hidden="true">
          <Image src={job.image} alt="" width={1080} height={720} sizes="(max-width: 640px) 100vw, (max-width: 1050px) 50vw, 33vw" />
        </Link>
        <div className={styles.body}>
          <span className={styles.category}>{job.category}</span>
          <h3><Link href={`/use-cases/${job.slug}`}>{job.title}</Link></h3>
          <p>{job.outcome}</p>
          <div className={styles.footer}>
            <small>{job.hasSample ? "Fictional sample included" : "Setup guide included"}</small>
            <Link href={`/use-cases/${job.slug}`} className="text-link">Try this job <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </article>)}
    </div>
    {!matches.length && <div className={styles.empty}>
      <h3>No jobs match that search</h3><p>Try a broader word or choose another category.</p>
      <button type="button" className="button button-secondary" onClick={() => { setQuery(""); setCategory("All"); setLimit(6); }}>Show all jobs</button>
    </div>}
    {matches.length > limit && <button type="button" className={`button button-secondary ${styles.more}`} onClick={() => setLimit(limit + 6)}>Show more jobs <ArrowRight size={16} aria-hidden="true" /></button>}
  </div>;
}
