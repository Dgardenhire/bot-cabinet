import Link from "next/link";
import { Fragment } from "react";
import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import type { StarterPack } from "@/lib/starter-pack-access";
import styles from "./pack.module.css";

function Text({ value }: { value: string }) {
  return <>{value.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : <Fragment key={index}>{part}</Fragment>)}</>;
}
export function StarterPackContent({ pack }: { pack: StarterPack }) {
  return <main id="main-content" data-starter-pack className={`page-main ${styles.page}`}>
    <section className="inner-hero"><div className={`shell ${styles.intro}`}><Eyebrow>Your Open Source starter pack</Eyebrow><h1 className="inner-title">10 Bots you can set up tonight</h1>{pack.intro.map(text => <p className="inner-deck" key={text}>{text}</p>)}<div className={styles.notice}><strong>Not yet tested by Bot Cabinet.</strong> Platform notes are proposed setups, not verified compatibility. All setup times are planning estimates, not measured results. Start with one manual trial using sample information.</div></div></section>
    <div className={`shell ${styles.intro}`}>
      <section className="content-section"><h2 className="section-heading">The 10 Bots</h2><ol className={styles.contents}>{pack.entries.map(entry => <li key={entry.id}><a href={`#${entry.id}`}>{entry.title}</a></li>)}</ol></section>
      <section className="content-section"><h2 className="section-heading">How to pick your first Bot</h2><ol>{pack.pick.map(text => <li key={text}><Text value={text} /></li>)}</ol><h3>Ground rules for every Bot</h3><ul>{pack.ground_rules.map(text => <li key={text}>{text}</li>)}</ul><p>Run once by hand before saving instructions or adding a schedule. Approve account access and consequential actions separately.</p></section>
      <section className="content-section"><h2 className="section-heading">The five Bot Cabinet types</h2><ul>{pack.types.map(text => <li key={text}><Text value={text} /></li>)}</ul><h3>Proposed platform notes · not tested here</h3><ul>{pack.platforms.map(text => <li key={text}><Text value={text} /></li>)}</ul><p>Feature names, plans, and limits change often. Check your app&apos;s current help pages before connecting accounts. Bot Cabinet doesn&apos;t give click-by-click steps here because those steps change and haven&apos;t been checked.</p></section>
      {pack.entries.map(entry => <article key={entry.id} id={entry.id} className={`content-section ${styles.entry}`}>
        <Eyebrow>{String(entry.number).padStart(2, "0")} · {entry.subtitle}</Eyebrow><h2>{entry.title}</h2><Link className={styles.status} href="/trust">{entry.status}</Link>
        <dl className={styles.meta}><div><dt>Who it is for</dt><dd>{entry.audience}</dd></div><div><dt>Estimated setup time · not measured</dt><dd>{entry.setup_time}</dd></div><div><dt>Bot Cabinet type</dt><dd>{entry.bot_type}</dd></div><div><dt>Proposed app fit · not tested</dt><dd>{entry.app_fit}</dd></div></dl>
        <h3>Proposed setup</h3><p>{entry.where}</p><h3>General approach</h3><p>{entry.general}</p>
        <div className={styles.prompt}><h3>Starter prompt</h3><pre>{entry.prompt}</pre><CopyTextButton text={entry.prompt} label={`Copy prompt ${entry.number}`} /></div>
        <h3>Try this first</h3><p>{entry.first}</p><h3>Guardrails: never let it</h3><ul>{entry.guardrails.map(rule => <li key={rule}>{rule}</li>)}</ul><p><strong>Watch for:</strong> {entry.watch}</p><p>{entry.tested}</p>
      </article>)}
      <section className="content-section"><p>Bot Cabinet is free and independent, and is not affiliated with xAI, Nous Research, OpenAI, or Anthropic. Hermes Agent is open source. You&apos;ll need a supported AI provider or app plan, and costs vary. Product behavior changes; check your app&apos;s current documentation before connecting sensitive accounts or allowing consequential actions.</p></section>
    </div>
  </main>;
}
