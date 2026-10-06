import Link from "next/link";
import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { type Specialist, type CrewPlan } from "@/data/specialist-collection";
import styles from "./manual-bot-plan.module.css";

type Exercise = {
  date: string;
  actualAnswer: string;
  checks: { check: string; status: string; evidence?: string }[];
  limitations: string[];
  revisedAttempt?: { actualAnswer: string } | null;
};

function ExerciseRecord({ evidence }: { evidence: Exercise | null }) {
  return <details className={styles.details}>
    <summary>Read the sample answer and checks</summary>
    <p className={styles.status}>Codex text exercise, October 6, 2026. These checks were graded by the assistant that wrote the answer. They are not an independent review or a Hermes or Grok app test.</p>
    {evidence ? <>
      <h3>Original answer</h3><pre className={styles.text}>{evidence.actualAnswer}</pre>
      <ul>{evidence.checks.map((check, i) => <li key={i}><strong>{check.status}:</strong> {check.check}{check.evidence ? ` — ${check.evidence}` : ""}</li>)}</ul>
      {evidence.revisedAttempt && <><h3>Correction after reading the checklist</h3><pre className={styles.text}>{evidence.revisedAttempt.actualAnswer}</pre><p>This correction is not a fresh test.</p></>}
      <h3>Not tested</h3><ul>{evidence.limitations.map((limit, i) => <li key={i}>{limit}</li>)}</ul>
    </> : <p>No answer has been recorded for this plan.</p>}
  </details>;
}

export function SpecialistPage({ bot }: { bot: Specialist }) {
  return <main id="main-content" className="page-main">
    <section className="inner-hero"><div className="shell">
      <Link href="/bots/" className="back-link">← All Bots</Link>
      <Eyebrow>Specialist · manual setup</Eyebrow><h1 className="inner-title">{bot.name}</h1><p className="inner-deck">{bot.summary}</p>
      <p className={styles.status}>Try the sample with supplied text first. Account connections, native imports, schedules, and outside actions have not been tested for this version.</p>
    </div></section>
    <section className={`shell ${styles.section}`}>
      <h2>Try it in three steps</h2>
      <div className={styles.steps}>
        <article><h2>1. Set the job</h2><p>Open a new Bot or conversation in your AI app. Copy these instructions into its role or instructions field, or send them as the first message.</p><CopyTextButton text={bot.instructions} label="Copy role instructions" /></article>
        <article><h2>2. Give it a small task</h2><p>Send this fictional example as the next message. No account connection is needed.</p><CopyTextButton text={bot.task} label="Copy first task" /></article>
        <article><h2>3. Check the answer</h2><p>Compare the answer with the checklist below. Keep failures. Review the result before using real records.</p><a href="#check-answer" className="text-link">See the checklist →</a></article>
      </div>
      <p>Need app-specific help? <Link href="/start/hermes/">Hermes</Link> · <Link href="/start/grok/">Grok Bot</Link> · <Link href="/start/">Other apps</Link>. These are manual instructions, not an Add Bot link or native import archive.</p>
      <h2>First task</h2><p className={styles.text}>{bot.task}</p>
      <h2 id="check-answer">What a good answer includes</h2><ul>{bot.checklist.map(check => <li key={check}>{check}</li>)}</ul>
      <ExerciseRecord evidence={bot.evidence} />
      {bot.slug === "deal-reviewer" && <p className={styles.status}>The role instructions now clarify how to label missing records. The original answer and correction above came before that clarification; it has not had a fresh task test.</p>}
      <details className={styles.details}><summary>Read and adapt the full instructions</summary><p className={styles.text}>{bot.instructions}</p><h3>Fill in for your own task</h3><p className={styles.text}>{bot.inputs}</p><CopyTextButton text={bot.inputs} label="Copy task template" /><p className={styles.text}>{bot.crewUse}</p><a href={`/downloads/specialists/${bot.slug}.md`} download className="text-link">Download the instructions</a></details>
      <p className={styles.status}>Original role instructions by Bot Cabinet. Crew categories were inspired by <a href="https://github.com/unicodef1wn/grokbot-field-notes">@unicodef1wn’s Grok Bot field notes</a>; this is not a copy of an original Grok template.</p>
    </section>
  </main>;
}

export function CrewPlanPage({ crew }: { crew: CrewPlan }) {
  const setup = [crew.name, crew.inputs, ...crew.setup, crew.handoffs, crew.extensions, crew.limits].join("\n\n");
  return <main id="main-content" className="page-main">
    <section className="inner-hero"><div className="shell">
      <Link href="/crew-kits/" className="back-link">← Crew Kits</Link><Eyebrow>{crew.extends ? "New workflow for an existing kit" : "New crew · manual setup"}</Eyebrow><h1 className="inner-title">{crew.name}</h1><p className="inner-deck">{crew.summary}</p>
      <p className={styles.status}>A plan you can run by hand. The recorded sample uses simulated text handoffs, not separate Bots running in Hermes or Grok.</p>
      {crew.extends && <p>This extends <Link href={`/crew-kits/${crew.extends}/`}>an existing Crew Kit</Link>. It does not replace that kit’s download.</p>}
      <div className="button-row"><CopyTextButton text={setup} label="Copy setup plan" /><a href={`/downloads/crew-plans/${crew.slug}.md`} download className="button button-secondary">Download the plan</a></div>
    </div></section>
    <section className={`shell ${styles.section}`}>
      <h2>When to use this crew</h2><p>{crew.when}</p><h2>The jobs</h2>
      <ol className={styles.roles}>{crew.roles.map(role => <li key={role.slug}><Link href={`/bots/${role.slug}/`}>{role.name}</Link><p>{role.job}</p></li>)}</ol>
      <h2>Bring these inputs</h2><p>{crew.inputs}</p><h2>Set up and run</h2><ol>{crew.setup.map(step => <li key={step}>{step}</li>)}</ol>
      <h2>Pass the work in this order</h2><p className={styles.text}>{crew.handoffs}</p>
      <h2>First task</h2><p className={styles.text}>{crew.task}</p><CopyTextButton text={crew.task} label="Copy first task" />
      <h2>Check the result</h2><ul>{crew.checklist.map(check => <li key={check}>{check}</li>)}</ul><ExerciseRecord evidence={crew.evidence} />
      <details className={styles.details}><summary>Task instructions for existing Bots and run limits</summary><p className={styles.text}>{crew.extensions}</p><p className={styles.text}>{crew.limits}</p><h3>Finished output</h3><p>{crew.output}</p></details>
      <p className={styles.status}>Original Bot Cabinet workflow. Category inspiration: {crew.inspiration} <a href={crew.source}>Read the attributed source notes</a>. For Grok’s sharing and setup features, use the <a href="https://x.ai/bot/guides">official guides</a>.</p>
    </section>
  </main>;
}
