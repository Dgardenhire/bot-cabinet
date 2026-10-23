import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, ClockCounterClockwise, Flask, WarningCircle, XCircle } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { PROOF_ROOM_DEMOS, PROOF_STATE_NAMES } from "@/data/proof-room";
import { buildPageMetadata } from "@/lib/metadata";
import { CATALOG_TASK_TRIALS, CATALOG_TRIAL_PATH } from "@/data/catalog-task-trials";
import { WEBSITE_TASK_COVERAGE, WEBSITE_TASK_TRIALS, WEBSITE_TASK_STATUS_NAMES } from "@/data/website-task-trials";

export const metadata = buildPageMetadata({
  title: "Test Records · Bot Cabinet",
  description: "Inspect controlled Bot tests, including the input, exact request, preserved output, failures, and limits.",
  path: "/proof/",
  image: "/brand/social/proof-room-1200x630.jpg",
  imageAlt: "Bot Cabinet Test Records — controlled Bot tests and their limits",
});

const stateIcon = {
  "test-designed": ClockCounterClockwise,
  "test-prepared": ClockCounterClockwise,
  "recorded-excerpt": WarningCircle,
  "prompt-contract-recorded": WarningCircle,
  "failed-runtime": XCircle,
  "runtime-passed": CheckCircle,
  reproduced: CheckCircle,
} as const;

export default function ProofRoomPage() {
  const runRecords = PROOF_ROOM_DEMOS.filter((demo) => demo.state !== "test-designed" && demo.state !== "test-prepared");
  const unfinishedPlans = PROOF_ROOM_DEMOS.filter((demo) => demo.state === "test-designed" || demo.state === "test-prepared");
  const completedTasks = WEBSITE_TASK_COVERAGE.records.filter(record => record.attempts.some(attempt => attempt.completed && attempt.sha256 === record.sha256));
  const pendingTasks = WEBSITE_TASK_COVERAGE.records.filter(record => !completedTasks.includes(record));
  const passedTasks = WEBSITE_TASK_COVERAGE.records.filter(record => record.status === "passed-sample");

  const renderCard = (demo: (typeof PROOF_ROOM_DEMOS)[number]) => {
    const StateIcon = stateIcon[demo.state];
    return (
      <article className={`proof-room-card proof-state-${demo.state}`} key={demo.slug}>
        <div className="proof-room-card-image">
          <Image src={demo.cardImage} alt="" width={900} height={700} sizes="(max-width: 860px) 100vw, (max-width: 1120px) 48vw, 33vw" />
        </div>
        <div className="proof-room-card-copy">
          <span className="proof-state-label"><StateIcon size={17} aria-hidden="true" />{PROOF_STATE_NAMES[demo.state]} · {demo.stateDetail}</span>
          <h3>{demo.title}</h3>
          <p className="proof-room-outcome">{demo.outcome}</p>
          <p>{demo.summary}</p>
          <dl className="proof-room-card-facts">
            <div><dt>Platform</dt><dd>{demo.platform}</dd></div>
            <div><dt>{demo.subjectKind === "crew" ? "Bundle" : "Profile"}</dt><dd>v{demo.profileVersion}</dd></div>
            <div><dt>Passport</dt><dd>v{demo.passportVersion}</dd></div>
          </dl>
          <Link href={`/proof/${demo.slug}`} className="button button-secondary">
            Inspect the test record <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  };

  return (
    <main id="main-content" className="page-main proof-room-page">
      <section className="inner-hero proof-room-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Controlled tests, including failures</Eyebrow>
            <h1 className="inner-title">Test Records</h1>
            <p className="inner-deck">
              These are lab tests, usually using fictional material. They show how one exact package
              behaved on one disclosed task. They do not prove that a Bot is reliable, useful to a
              real user, or ready for unattended work.
            </p>
          </div>
          <aside className="inner-aside proof-room-legend">
            <Flask size={28} weight="thin" aria-hidden="true" />
            <strong>Evidence labels have specific meanings</strong>
            <dl>
              <div><dt>Test designed</dt><dd>The test is defined, but required source material is still pending.</dd></div>
              <div><dt>Test prepared</dt><dd>Input and prompt are ready; the run has not happened.</dd></div>
              <div><dt>Recorded excerpt</dt><dd>Part of a run exists, but the full record is incomplete.</dd></div>
              <div><dt>Prompt-contract runs</dt><dd>Real outputs are preserved, but the exact downloadable profile was not imported.</dd></div>
              <div><dt>Failed runtime</dt><dd>The disclosed run happened, but its output did not pass the stated acceptance checks.</dd></div>
              <div><dt>Runtime passed once</dt><dd>One exact-package run passed; independent reproduction and human approval remain separate.</dd></div>
              <div><dt>Reproduced</dt><dd>The same package, input, and prompt passed the disclosed checks again.</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="proof-room-disclosure">
        <div className="shell">
          <WarningCircle size={20} aria-hidden="true" />
          <p>
            A passed fixture is test evidence, not real-world proof. Missing and failed records stay
            visible so a green label cannot hide what was never tested.
          </p>
        </div>
      </section>

      <section className="content-section shell proof-room-library" aria-labelledby="catalog-trials-title">
        <div className="proof-room-library-heading">
          <div><Eyebrow>October 15, 2026 · Hermes catalog skills</Eyebrow><h2 id="catalog-trials-title" className="section-heading">Four first-task trials</h2></div>
          <p>The contributed skills ran through Hermes’s skill loader with fictional inputs. A separate AI review checked the answers against the contributed checklists. These are first-answer tests, not Desktop installation, connected-account tests or human approval.</p>
        </div>
        <div className="content-grid-2">
          {CATALOG_TASK_TRIALS.map(trial => <article className="content-card" key={trial.slug}>
            <Eyebrow>{trial.status}</Eyebrow><h3>{trial.name}</h3><p>{trial.result}</p>
            <p><a className="text-link" href={`${CATALOG_TRIAL_PATH}/${trial.slug}-input.md`}>Input</a>{" · "}<a className="text-link" href={`${CATALOG_TRIAL_PATH}/${trial.slug}-output.md`}>Actual answer</a>{" · "}<a className="text-link" href={`${CATALOG_TRIAL_PATH}/${trial.slug}-run.json`}>Run details</a></p>
          </article>)}
        </div>
      </section>

      <section className="content-section shell proof-room-library" aria-labelledby="website-trials-title">
        <div className="proof-room-library-heading">
          <div><Eyebrow>{WEBSITE_TASK_COVERAGE.date} · Website downloads</Eyebrow><h2 id="website-trials-title" className="section-heading">Website Bot tests</h2></div>
          <p>{completedTasks.length} of {WEBSITE_TASK_COVERAGE.records.length} Bots have returned a completed answer using the current downloaded instructions. {passedTasks.length} passed their supplied-material sample. These Hermes tests use fictional inputs; they do not cover Desktop installation, connected accounts or Crew handoffs. A separate AI review checked the answers.</p>
        </div>
        {WEBSITE_TASK_TRIALS.map(trial => <details className="content-card" key={trial.slug}>
          <summary>{trial.name} — {WEBSITE_TASK_STATUS_NAMES[trial.status]}</summary>
          <p><a className="text-link" href={trial.case}>Task and checks</a></p>
          <ul>{trial.attempts.map(attempt => <li key={attempt.id}>
            <p>{attempt.summary}</p>
            <p><a className="text-link" href={attempt.files.input}>Exact request</a>{" · "}
              {attempt.files.output ? <><a className="text-link" href={attempt.files.output}>Actual answer</a>{" · "}</> : null}
              <a className="text-link" href={attempt.files.source}>Tested instructions</a>{" · "}
              <a className="text-link" href={attempt.files.run}>Run details</a></p>
          </li>)}</ul>
        </details>)}
        <details className="content-card">
          <summary>{pendingTasks.length} Bots without a completed answer</summary>
          <p>{pendingTasks.length ? pendingTasks.map(record => record.name).join(", ") : "Every current Bot has a completed answer in this series. Completed does not mean passed; individual results and failures are listed above."}</p>
        </details>
        <p><a className="text-link" href="/proof-room/website-tasks-20261015/index.json">Complete task coverage and file hashes</a></p>
      </section>

      <section className="content-section shell proof-room-library" aria-labelledby="proof-room-library-title">
        <div className="proof-room-library-heading">
          <div>
            <Eyebrow>Runs with preserved evidence</Eyebrow>
            <h2 id="proof-room-library-title" className="section-heading">See the input, output, and limits</h2>
          </div>
          <p>Curator, Reentry, and Receipt passed two controlled fixture runs. Publishing Desk passed once and then failed an independent reproduction. None of those results establishes real-world usefulness or long-term reliability.</p>
        </div>

        <div className="proof-room-card-grid">
          {runRecords.map(renderCard)}
        </div>
      </section>

      {unfinishedPlans.length ? (
        <section className="content-section shell proof-room-library" aria-labelledby="unfinished-test-plans-title">
          <div className="proof-room-library-heading">
            <div>
              <Eyebrow>No runtime evidence yet</Eyebrow>
              <h2 id="unfinished-test-plans-title" className="section-heading">Unfinished test plans</h2>
            </div>
            <p>These entries are retained as work still to do. They are not demonstrations and do not count as evidence that the Bot works.</p>
          </div>
          <div className="proof-room-card-grid">{unfinishedPlans.map(renderCard)}</div>
        </section>
      ) : null}
    </main>
  );
}
