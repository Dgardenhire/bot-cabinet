import Link from "next/link";
import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { PlanText } from "./plan-text";
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
    <p className={styles.status}>Sample written in Codex on October 6, 2026. The same assistant wrote and checked the answer. This is not an independent review or a Hermes or Grok app test.</p>
    {evidence ? <>
      <h3>Original answer</h3><PlanText text={evidence.actualAnswer} headingLevel={4} />
      <h3>Checklist results</h3>
      <ul className={styles.checklist}>{evidence.checks.map((check, i) => <li key={i}><strong>{check.status}:</strong> {check.check}{check.evidence ? ` — ${check.evidence}` : ""}</li>)}</ul>
      {evidence.revisedAttempt && <><h3>Correction after reading the checklist</h3><PlanText text={evidence.revisedAttempt.actualAnswer} headingLevel={4} /><p>This correction is not a fresh test.</p></>}
      <h3>Not tested</h3><ul>{evidence.limitations.map((limit, i) => <li key={i}>{limit}</li>)}</ul>
    </> : <p>No answer has been recorded for this plan.</p>}
  </details>;
}

export function SpecialistPage({ bot }: { bot: Specialist }) {
  return <main id="main-content" className="page-main">
    <section className="inner-hero"><div className="shell">
      <Link href="/bots/" className="back-link">← All Bots</Link>
      <Eyebrow>Specialist · manual setup</Eyebrow><h1 className="inner-title">{bot.name}</h1><p className="inner-deck">{bot.summary}</p>
      <p className={styles.status}>Try the fictional task below first. This version has not been tested with connected accounts, imports, schedules or actions outside the conversation.</p>
    </div></section>
    <div className={`shell ${styles.section}`}>
      <section className={styles.block}>
      <h2>Try it in three steps</h2>
      <div className={styles.steps}>
        <article><h3>1. Set the job</h3><p>Open a new Bot or conversation in your AI app. Copy these instructions into its role or instructions field, or send them as the first message.</p><CopyTextButton text={bot.instructions} label="Copy role instructions" /></article>
        <article><h3>2. Give it a small task</h3><p>Send this fictional example as the next message. No account connection is needed.</p><CopyTextButton text={bot.task} label="Copy first task" /></article>
        <article><h3>3. Check the answer</h3><p>Compare the answer with the checklist below. Save any failed answer so you can see what needs fixing. Review the result before using real records.</p><a href="#check-answer" className="text-link">See the checklist →</a></article>
      </div>
      <p>Need app-specific help? <Link href="/start/hermes/">Hermes</Link> · <Link href="/start/grok/">Grok Bot</Link> · <Link href="/start/">Other apps</Link>. These are manual instructions, not an Add Bot link or native import archive.</p>
      </section>
      <section className={`${styles.block} ${styles.task}`}><h2>First task</h2><PlanText text={bot.task} /></section>
      <section className={styles.block}>
      <h2 id="check-answer">What a good answer includes</h2><ul className={styles.checklist}>{bot.checklist.map(check => <li key={check}>{check}</li>)}</ul>
      <ExerciseRecord evidence={bot.evidence} />
      {bot.slug === "deal-reviewer" && <p className={styles.status}>The role instructions now clarify how to label missing records. The original answer and correction above came before that clarification; it has not had a fresh task test.</p>}
      </section>
      <details className={styles.details}><summary>Read and adapt the full instructions</summary><h3>Role instructions</h3><PlanText text={bot.instructions} headingLevel={4} /><h3>Fill in for your own task</h3><PlanText text={bot.inputs} headingLevel={4} /><CopyTextButton text={bot.inputs} label="Copy task template" /><h3>Working with other Bots</h3><PlanText text={bot.crewUse} headingLevel={4} /><a href={`/downloads/specialists/${bot.slug}.md`} download className="text-link">Download the instructions</a></details>
      <p className={styles.status}>Role instructions written by Bot Cabinet, not copied from a Grok template. The crew categories were inspired by <a href="https://github.com/unicodef1wn/grokbot-field-notes">@unicodef1wn’s Grok Bot field notes</a>.</p>
    </div>
  </main>;
}

export function CrewPlanPage({ crew }: { crew: CrewPlan }) {
  const setup = [crew.name, crew.inputs, ...crew.setup, crew.handoffs, crew.extensions, crew.limits].join("\n\n");
  return <main id="main-content" className="page-main">
    <section className="inner-hero"><div className="shell">
      <Link href="/crew-kits/" className="back-link">← Crew Kits</Link><Eyebrow>{crew.extends ? "New workflow for an existing kit" : "New crew · manual setup"}</Eyebrow><h1 className="inner-title">{crew.name}</h1><p className="inner-deck">{crew.summary}</p>
      <p className={styles.status}>Set up the crew and pass the results between Bots yourself. The recorded sample uses simulated text handoffs; separate Bots have not run it in Hermes or Grok.</p>
      {crew.extends && <p>This extends <Link href={`/crew-kits/${crew.extends}/`}>an existing Crew Kit</Link>. It does not replace that kit’s download.</p>}
      <div className="button-row"><CopyTextButton text={setup} label="Copy setup plan" /><a href={`/downloads/crew-plans/${crew.slug}.md`} download className="button button-secondary">Download the plan</a></div>
    </div></section>
    <div className={`shell ${styles.section}`}>
      <section className={styles.block}><h2>When to use this crew</h2><PlanText text={crew.when} /></section>
      <section className={styles.block}><h2>The jobs</h2>
      <ol className={styles.roles}>{crew.roles.map(role => <li key={role.slug}><Link href={`/bots/${role.slug}/`}>{role.name}</Link><p>{role.job}</p></li>)}</ol>
      </section>
      <section className={styles.block}><h2>What you will need</h2><PlanText text={crew.inputs} /><h2>Set up and run</h2><ol className={styles.runSteps}>{crew.setup.map(step => <li key={step}>{step}</li>)}</ol></section>
      <section className={styles.block}><h2>Pass the work in this order</h2><PlanText text={crew.handoffs} /></section>
      <section className={`${styles.block} ${styles.task}`}><h2>First task</h2><PlanText text={crew.task} /><CopyTextButton text={crew.task} label="Copy first task" /></section>
      <section className={styles.block}><h2>Check the result</h2><ul className={styles.checklist}>{crew.checklist.map(check => <li key={check}>{check}</li>)}</ul><ExerciseRecord evidence={crew.evidence} /></section>
      <details className={styles.details}><summary>Task instructions for existing Bots and run limits</summary><PlanText text={crew.extensions} /><h3>Run limits</h3><PlanText text={crew.limits} headingLevel={4} /><h3>Finished output</h3><PlanText text={crew.output} headingLevel={4} /></details>
      <p className={styles.status}>Workflow written by Bot Cabinet. Inspired by {crew.inspiration} <a href={crew.source}>Read the source notes</a>. See Grok’s <a href="https://x.ai/bot/guides">official guides</a> for setup and sharing instructions.</p>
    </div>
  </main>;
}
