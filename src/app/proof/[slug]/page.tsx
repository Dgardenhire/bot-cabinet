import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  FileText,
  Hourglass,
  MinusCircle,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import {
  PROOF_NEXT_STEP_COPY,
  PROOF_PROMPT_EYEBROWS,
  PROOF_PROMPT_HEADINGS,
  PROOF_ROOM_DEMOS,
  PROOF_STATE_NAMES,
  getProofRoomDemo,
  type ProofCheckState,
} from "@/data/proof-room";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return PROOF_ROOM_DEMOS.map((demo) => ({ slug: demo.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const demo = getProofRoomDemo(slug);
  return demo
    ? buildPageMetadata({
        title: `${demo.title} · Proof Room`,
        description: demo.summary,
        path: `/proof/${demo.slug}/`,
        image: "/brand/social/proof-room-1200x630.jpg",
        imageAlt: `Bot Cabinet Proof Room — ${demo.title}`,
      })
    : {};
}

const checkIcon: Record<ProofCheckState, typeof CheckCircle> = {
  passed: CheckCircle,
  partial: WarningCircle,
  "not-run": Hourglass,
  unavailable: MinusCircle,
};

const checkLabel: Record<ProofCheckState, string> = {
  passed: "Passed",
  partial: "Partial record",
  "not-run": "Not run",
  unavailable: "Unavailable",
};

const statusIcon = {
  "test-designed": Hourglass,
  "test-prepared": Hourglass,
  "recorded-excerpt": WarningCircle,
  "prompt-contract-recorded": WarningCircle,
  reproduced: ShieldCheck,
} as const;

export default async function ProofRoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = getProofRoomDemo(slug);
  if (!demo) notFound();
  const nextStep = PROOF_NEXT_STEP_COPY[demo.state];
  const StatusIcon = statusIcon[demo.state];

  return (
    <main id="main-content" className="page-main proof-detail-page">
      <section className="inner-hero proof-detail-hero">
        <div className="shell">
          <Link href="/proof" className="back-link"><ArrowLeft size={15} /> Back to Proof Room</Link>
          <div className="inner-hero-grid">
            <div>
              <Eyebrow>{PROOF_STATE_NAMES[demo.state]}</Eyebrow>
              <h1 className="inner-title">{demo.title}</h1>
              <p className="inner-deck">{demo.outcome}</p>
              <div className="button-row">
                <Link href={`/bots/${demo.botSlug}`} className="button button-primary">Open the Bot profile <ArrowRight size={16} /></Link>
                <a href={`/downloads/starter-bots/${demo.botSlug}.tar.gz`} download className="button button-secondary">Download for Hermes <DownloadSimple size={16} /></a>
              </div>
            </div>
            <aside className="inner-aside proof-detail-status">
              <StatusIcon size={28} weight="thin" aria-hidden="true" />
              <strong>{PROOF_STATE_NAMES[demo.state]} · {demo.stateDetail}</strong>
              <p>{demo.evidenceNote}</p>
              <dl>
                <div><dt>Platform</dt><dd>{demo.platform}</dd></div>
                <div><dt>Profile</dt><dd>v{demo.profileVersion}</dd></div>
                <div><dt>Passport</dt><dd>v{demo.passportVersion}</dd></div>
                {demo.run && <>
                  <div><dt>Run date</dt><dd>{demo.run.runAt}</dd></div>
                  <div><dt>Hermes</dt><dd>{demo.run.hermesVersion ?? "Not recorded"}</dd></div>
                  <div><dt>Provider</dt><dd>{demo.run.provider ?? "Not recorded"}</dd></div>
                  <div><dt>Model</dt><dd>{demo.run.model ?? "Not recorded"}</dd></div>
                  <div><dt>Elapsed</dt><dd>{demo.run.elapsedNote ?? (demo.run.elapsedSeconds === undefined ? "Not recorded" : `${demo.run.elapsedSeconds} seconds`)}</dd></div>
                  <div><dt>Cost</dt><dd>{demo.run.costNote}</dd></div>
                </>}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {demo.recordedMedia && (
        <section className="content-section shell proof-detail-video">
          <div>
            <Eyebrow>Recorded excerpt</Eyebrow>
            <h2 className="section-heading">{demo.recordedMedia.label}</h2>
            <p>The video preserves part of the conversation and its intended result. It does not replace the missing raw run record described above.</p>
          </div>
          <figure className="bot-proof-video-frame">
            <video controls playsInline preload="metadata" poster={demo.recordedMedia.poster} aria-label={demo.recordedMedia.label}>
              <source src={demo.recordedMedia.href} type={demo.recordedMedia.mimeType} />
            </video>
            <figcaption>{demo.recordedMedia.caption}</figcaption>
          </figure>
        </section>
      )}

      <section className="content-section shell proof-material-grid">
        <div>
          <Eyebrow>{demo.inputStatus === "planned" ? "Material planned" : "Material supplied"}</Eyebrow>
          <h2 className="section-heading">
            {demo.inputStatus === "planned" ? "The reproduction sources are disclosed" : "The Bot begins with disclosed inputs"}
          </h2>
          <p className="section-intro">{demo.fixtureDisclosure}</p>
        </div>
        <div className="proof-artifact-list">
          {demo.inputArtifacts.map((artifact) => (
            <article key={artifact.label}>
              <FileText size={21} aria-hidden="true" />
              <div><h3>{artifact.label}</h3><p>{artifact.description}</p></div>
              {artifact.href && (artifact.href.startsWith("http")
                ? <a href={artifact.href} target="_blank" rel="noreferrer">Open source <ArrowRight size={14} /></a>
                : <a href={artifact.href} download>Download file <DownloadSimple size={14} /></a>)}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section shell proof-prompt-section">
        <div className="proof-section-heading">
          <div><Eyebrow>{PROOF_PROMPT_EYEBROWS[demo.state]}</Eyebrow><h2 className="section-heading">{PROOF_PROMPT_HEADINGS[demo.state]}</h2></div>
          <CopyTextButton text={demo.exactPrompt} label={demo.state === "recorded-excerpt" ? "Copy reproduction prompt" : "Copy exact prompt"} />
        </div>
        {demo.state === "recorded-excerpt" && <p className="section-intro">This request is for the future isolated reproduction. It did not generate the recorded excerpt.</p>}
        <blockquote>{demo.exactPrompt}</blockquote>
      </section>

      <section className="content-section shell proof-result-grid">
        <article>
          <Eyebrow>Conversation evidence</Eyebrow>
          <h2>What the record currently contains</h2>
          {demo.conversationDisclosure && <p className="proof-conversation-disclosure">{demo.conversationDisclosure}</p>}
          {demo.conversationExcerpt ? (
            <div className="proof-conversation">
              {demo.conversationExcerpt.map((turn, index) => (
                <div key={`${turn.role}-${index}`}>
                  <span>{turn.role}{turn.abridged ? " · excerpt" : ""}</span>
                  <p>{turn.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="proof-empty-state">The test has not been run. No conversation is shown.</p>
          )}
          {demo.transcript && (
            <a className="proof-transcript-link" href={demo.transcript.href} download>
              <FileText size={18} />
              <span><strong>{demo.transcript.label}</strong><small>{demo.transcript.description}</small></span>
              <DownloadSimple size={16} />
            </a>
          )}
        </article>
        <article>
          <Eyebrow>Finished deliverable</Eyebrow>
          <h2>What a person can inspect</h2>
          {demo.deliverable ? (
            <a className="proof-deliverable" href={demo.deliverable.href} download>
              <FileText size={24} /><div><strong>{demo.deliverable.label}</strong><span>{demo.deliverable.description}</span></div><DownloadSimple size={18} />
            </a>
          ) : (
            <p className="proof-empty-state">No downloadable finished deliverable has been preserved for this test.</p>
          )}
        </article>
      </section>

      <section className="content-section shell proof-material-grid">
        <div>
          <Eyebrow>Starter package</Eyebrow>
          <h2 className="section-heading">The files used to set up this Bot</h2>
          <p className="section-intro">These are the Bot profile and readable setup files. They are separate from any finished result produced during a run.</p>
        </div>
        <div className="proof-artifact-list">
          {demo.supportingArtifacts.map((artifact) => (
            <article key={artifact.label}>
              <FileText size={21} aria-hidden="true" />
              <div><h3>{artifact.label}</h3><p>{artifact.description}</p></div>
              <a href={artifact.href} download={artifact.download}>Download file <DownloadSimple size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section shell proof-human-decisions">
        <div><Eyebrow>Human decisions</Eyebrow><h2 className="section-heading">The Bot prepares work; a person remains responsible</h2></div>
        <ol>{demo.humanDecisions.map((decision, index) => <li key={decision}><span>{index + 1}</span><p>{decision}</p></li>)}</ol>
      </section>

      <section className="content-section shell proof-check-ledger">
        <div className="proof-section-heading">
          <div><Eyebrow>Evidence ledger</Eyebrow><h2 className="section-heading">Separate checks for separate claims</h2></div>
          <p>Package, import, role-run, reproduction, and human-review status are reported independently.</p>
        </div>
        <div className="proof-check-grid">
          {demo.checks.map((check) => {
            const Icon = checkIcon[check.state];
            return (
              <article className={`proof-check proof-check-${check.state}`} key={check.label}>
                <Icon size={22} aria-hidden="true" />
                <div><span>{check.label}</span><strong>{checkLabel[check.state]}</strong><p>{check.detail}</p>{check.checkedAt && <small>Checked {check.checkedAt}</small>}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section shell proof-next-test">
        <div>
          <Eyebrow>{nextStep.eyebrow}</Eyebrow>
          <h2 className="section-heading">{nextStep.heading}</h2>
          <p>{nextStep.body}</p>
        </div>
        <Link href="/proof" className="button button-secondary">Return to all demonstrations <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
