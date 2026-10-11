import { Fragment } from "react";
import { CopyTextButton } from "@/components/copy-text-button";
import type { StarterPack } from "@/lib/starter-pack-access";
import styles from "./document.module.css";

function Text({ value }: { value: string }) {
  return <>{value.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : <Fragment key={index}>{part}</Fragment>)}</>;
}
function labeled(value: string) {
  const match = value.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
  return match ? { title: match[1], text: match[2] } : { title: "", text: value };
}
function kind(value: string) { return value.match(/^(Assignment|Skill|Routine|Bot|Crew)/)?.[1] || "Assignment"; }
function Badge({ value }: { value: string }) { return <span className={`${styles.badge} ${styles[`t-${value.toLowerCase()}`]}`}>{value}</span>; }

export function StarterPackContent({ pack, onClose }: { pack: StarterPack; onClose?: () => void }) {
  return <main id="main-content" data-starter-pack data-pack-document className={styles.document}>
    <div className={styles.shell}>
      <header className={styles.cover}>
        <div className={styles.brand}><span className={styles.doors} aria-hidden="true" />Bot Cabinet · Starter pack{onClose && <button type="button" className={styles.accessControl} onClick={onClose}>Close pack</button>}</div>
        <h1>10 Bots you can set up <em>tonight</em></h1>
        {pack.intro.map(text => <p className={styles.lede} key={text}>{text}</p>)}
        <div className={styles["platforms-row"]}>{["Grok Bot", "Hermes Agent", "ChatGPT", "Claude", "Free · botcabinet.com"].map(name => <span className={styles.chip} key={name}>{name}</span>)}</div>
      </header>
      <section className={`${styles.section} ${styles.index}`} aria-labelledby="pack-contents">
        <p className={styles.eyebrow}>Inside</p><h2 id="pack-contents">The ten Bots</h2>
        <ol>{pack.entries.map(entry => <li key={entry.id}><a href={`#${entry.id}`}><span className={styles["ix-n"]}>{String(entry.number).padStart(2, "0")}</span><span className={styles["ix-t"]}>{entry.title}</span><Badge value={kind(entry.bot_type)} /></a></li>)}</ol>
      </section>
      <section className={styles.section} aria-labelledby="pack-first-bot"><div className={styles.pick}>
        <p className={styles.eyebrow}>Before you start</p><h2 id="pack-first-bot">How to pick your first Bot</h2>
        <ol>{pack.pick.map(text => <li key={text}><Text value={text} /></li>)}</ol>
        <h3 className={styles.pickHeading}>The five Bot Cabinet types</h3>
        <div className={styles.types}>{pack.types.map((text, index) => { const item = labeled(text); return <div key={text} className={`${styles.type} ${styles[`t-${item.title.toLowerCase()}`]}`}><span className={styles["type-n"]}>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><span>{item.text}</span></div>; })}</div>
        <p className={styles.small}>This pack uses Assignments, Skills, Routines, and Bots. A Crew comes later, once you have two Bots worth combining (for example, the research brief feeding the morning briefing).</p>
        <h3 className={styles.platformHeading}>Where these run</h3>
        <div className={styles.plats}>{pack.platforms.map(text => { const item = labeled(text); return <div className={styles.plat} key={text}><h4>{item.title}</h4><p>{item.text}</p></div>; })}</div>
        <p className={styles.small}>Feature names, plans, and limits change often. Check your app&apos;s current help pages before connecting accounts. Bot Cabinet doesn&apos;t give click-by-click steps here because those steps change and haven&apos;t been checked.</p>
        <div className={styles.rules}><h3>Ground rules for every Bot</h3><ul>{pack.ground_rules.map(text => <li key={text}>{text}</li>)}</ul></div>
      </div></section>
      <section className={styles.section} aria-label="Ten Bot setup guides">
        {pack.entries.map(entry => <article key={entry.id} id={entry.id} className={styles.bot} aria-labelledby={`${entry.id}-title`}>
          <header className={styles["bot-head"]}><div className={styles["bot-num"]} aria-hidden="true">{String(entry.number).padStart(2, "0")}</div><div><p className={styles.eyebrow}>{entry.subtitle}</p><h2 id={`${entry.id}-title`}>{entry.title}</h2></div></header>
          <dl className={styles.meta}>
            <div><dt>Who it&apos;s for</dt><dd>{entry.audience}</dd></div>
            <div><dt>Time to set up · estimate</dt><dd>{entry.setup_time}</dd></div>
            <div><dt>Bot Cabinet type</dt><dd><Badge value={kind(entry.bot_type)} /> {entry.bot_type.replace(/^(Assignment|Skill|Routine|Bot|Crew)[.:]?\s*/, "")}</dd></div>
            <div><dt>Proposed app fit · not tested</dt><dd>{entry.app_fit}</dd></div>
          </dl>
          <div className={styles.status} data-check={/sample-data checked/i.test(entry.status) ? "sample" : "untested"}><span className={styles.dot} aria-hidden="true" /><span className={styles.statusText}>{entry.status}</span></div>
          <div className={styles.two}><div><h3>Where it runs</h3><p>{entry.where}</p></div><div><h3>General approach</h3><p>{entry.general}</p></div></div>
          <div className={styles.prompt}><div className={styles["prompt-bar"]}><span>Starter prompt · copy and paste</span><CopyTextButton text={entry.prompt} label="Copy" accessibleLabel={`Copy prompt ${entry.number}`} className={styles.copy} /></div><pre>{entry.prompt}</pre></div>
          <div className={styles.two}>
            <div className={styles.first}><h3>Try this first</h3><p>{entry.first}</p></div>
            <div className={styles.guard}><h3>Never let it</h3><ul>{entry.guardrails.map(rule => <li key={rule}>{rule}</li>)}</ul><p className={styles.watch}><strong>Watch for:</strong> {entry.watch}</p></div>
          </div>
          <p className={styles.tested}><strong>Tested vs. untested:</strong> {entry.tested.replace(/^Tested vs\. untested:\s*/, "")}</p>
        </article>)}
      </section>
      <footer className={styles.footer}><p>Bot Cabinet is free and independent, and is not affiliated with xAI, Nous Research, OpenAI, or Anthropic. Hermes Agent is open source. You&apos;ll need a supported AI provider or app plan, and costs vary. Product behavior changes; check your app&apos;s current documentation before connecting sensitive accounts or allowing consequential actions.</p><p>Bot Cabinet · built by Damon Gardenhire through LINCHPIN and AI for the Real World · botcabinet.com</p></footer>
    </div>
  </main>;
}
