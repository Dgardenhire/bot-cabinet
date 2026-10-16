"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import styles from "./compare.module.css";

type Agent = {
  name: string;
  maker: string;
  job: string;
  shape: string;
  runs: string;
  entry: string;
  caution: string;
  source: string;
  sourceUrl: string;
  path: string;
};

export const defaultComparison = ["Hermes Agent", "Grok Bot", "ChatGPT Dots"];

export function AgentComparison({ agents, initialSelection = defaultComparison }: {
  agents: readonly Agent[];
  initialSelection?: readonly string[];
}) {
  const [selection, setSelection] = useState(initialSelection);
  const [expanded, setExpanded] = useState(false);
  const selected = selection.map((name) => agents.find((agent) => agent.name === name)!);
  const rows: { label: string; key: "job" | "shape" | "runs" }[] = [
    { label: "A good first job", key: "job" },
    { label: "One agent or several?", key: "shape" },
    { label: "Where it runs", key: "runs" },
  ];

  return (
    <section className={styles.comparison} aria-labelledby="compare-title">
      <div className={styles.toolbar}>
        <div>
          <h2 id="compare-title">Three at a time.</h2>
          <p>Pick any three of the eight apps.</p>
        </div>
        <button type="button" className={styles.detailToggle} aria-expanded={expanded} aria-controls="comparison-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide access & cautions" : "Show access & cautions"}
          <CaretDown size={16} aria-hidden="true" />
        </button>
      </div>
      <p className={styles.scrollHint}>Swipe across to compare all three apps.</p>
      <div className={styles.tableScroll} role="region" aria-label="Compare selected agents" tabIndex={0}>
        <table className={styles.table}>
          <caption className="sr-only">Compare three selected apps. Use each product menu to choose another app. Access requirements and cautions can be expanded.</caption>
          <thead>
            <tr>
              <td className={styles.corner} />
              {selected.map((agent, index) => (
                <th key={index} scope="col">
                  <label htmlFor={`compare-app-${index}`} className={styles.selectLabel}>App {index + 1}</label>
                  <div className={styles.selectWrap}>
                    <select id={`compare-app-${index}`} value={agent.name} onChange={(event) => setSelection(selection.map((name, slot) => slot === index ? event.target.value : name))}>
                      {agents.map((option) => <option key={option.name} value={option.name} disabled={selection.includes(option.name) && option.name !== agent.name}>{option.name}</option>)}
                    </select>
                    <CaretDown size={16} aria-hidden="true" />
                  </div>
                  <span className={styles.maker}>{agent.maker}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, key }) => <tr key={key}>
              <th scope="row">{label}</th>
              {selected.map((agent) => <td key={agent.name}><span className={styles.mobileLabel} aria-hidden="true">{label}</span>{agent[key]}</td>)}
            </tr>)}
          </tbody>
          <tbody id="comparison-details" hidden={!expanded}>
            <tr><th scope="row">How to get in</th>{selected.map((agent) => <td key={agent.name}><span className={styles.mobileLabel} aria-hidden="true">How to get in</span>{agent.entry}</td>)}</tr>
            <tr><th scope="row">Check before using</th>{selected.map((agent) => <td key={agent.name}><span className={styles.mobileLabel} aria-hidden="true">Check before using</span>{agent.caution}</td>)}</tr>
          </tbody>
          <tfoot>
            <tr><th scope="row" className={styles.corner}><span className="sr-only">Guides and sources</span></th>{selected.map((agent) => <td key={agent.name}>
              {agent.path.startsWith("/") ? <Link href={agent.path} className={styles.guideLink}>Setup guide <ArrowRight size={14} aria-hidden="true" /></Link> : null}
              <a href={agent.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>{agent.source} <ArrowUpRight size={13} aria-hidden="true" /></a>
            </td>)}</tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
