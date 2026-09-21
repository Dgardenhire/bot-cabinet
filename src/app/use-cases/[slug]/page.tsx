import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardText,
  DownloadSimple,
  ShieldCheck,
  UsersThree,
  Wrench,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { CopyTextButton } from "@/components/copy-text-button";
import { getStarterBot } from "@/data/starter-bots";
import { BOT_USE_CASES, getBotUseCase, getUseCaseStepPrompt } from "@/data/use-cases";
import { getUseCaseOperations } from "@/data/use-case-operations";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return BOT_USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getBotUseCase(slug);
  if (!useCase) return {};
  return buildPageMetadata({
    title: `${useCase.title} · Workflow Guide`,
    description: useCase.outcome,
    path: `/use-cases/${useCase.slug}/`,
    image: "/brand/social/bot-crews-v2-1200x630.jpg",
    imageAlt: `Bot Cabinet workflow — ${useCase.title}`,
  });
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getBotUseCase(slug);
  if (!useCase) notFound();
  const operations = getUseCaseOperations(useCase);
  const isSingleBot = useCase.botSlugs.length === 1;

  return (
    <main id="main-content" className="page-main use-case-detail">
      <section className="inner-hero use-case-detail-hero">
        <div className="shell">
          <Link href="/use-cases" className="back-link"><ArrowLeft size={15} /> Back to workflows</Link>
          <div className="inner-hero-grid">
            <div>
              <Eyebrow>{isSingleBot ? "One-Bot workflow" : "Multi-Bot workflow"}</Eyebrow>
              <h1 className="inner-title">{useCase.title}</h1>
              <p className="inner-deck">{useCase.outcome}</p>
              <p className="use-case-detail-audience"><strong>Designed for:</strong> {useCase.audience}</p>
              <div className="button-row">
                <a href={`/downloads/use-cases/${useCase.slug}.md`} download className="button button-primary">Download the setup plan <DownloadSimple size={16} /></a>
                <Link href={`/workshop?starter=${useCase.botSlugs[0]}`} className="button button-secondary">Open the first Bot’s setup plan in Bot Lab <Wrench size={16} /></Link>
              </div>
            </div>
            <aside className="inner-aside use-case-roster">
              <UsersThree size={28} weight="thin" aria-hidden="true" />
              <strong>{isSingleBot ? "Recommended starting Bot" : "Bots in this workflow"}</strong>
              <div>
                {useCase.botSlugs.map((botSlug, index) => {
                  const bot = getStarterBot(botSlug);
                  if (!bot) return null;
                  return <Link href={`/bots/${bot.slug}`} key={bot.slug}><span>{index + 1}</span><div><b>{bot.name}</b><small>{bot.title}</small></div><ArrowRight size={14} /></Link>;
                })}
              </div>
              {useCase.setupNote && <p className="use-case-setup-note">{useCase.setupNote}</p>}
              {useCase.optionalBotSlugs && useCase.optionalBotSlugs.length > 0 && (
                <div className="use-case-optional-bots">
                  <strong>Optional specialists</strong>
                  <p>{useCase.optionalBotSlugs.map((botSlug) => getStarterBot(botSlug)?.name).filter(Boolean).join(" · ")}</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="content-section shell use-case-inputs">
        <div>
          <Eyebrow>Before you begin</Eyebrow>
          <h2 className="section-heading">Gather the information {isSingleBot ? "the Bot needs" : "the Bots need"}</h2>
        </div>
        <ul>{useCase.inputs.map((item) => <li key={item}><CheckCircle size={18} weight="thin" />{item}</li>)}</ul>
      </section>

      <section className="content-section shell workflow-operating-card">
        <div className="workflow-operating-heading">
          <div><Eyebrow>Operating guide</Eyebrow><h2 className="section-heading">Know when to run it and who leads</h2></div>
          <dl>
            <div><dt>Lead Bot</dt><dd>{getStarterBot(operations.leadBotSlug)?.name}</dd></div>
            <div><dt>Typical first run</dt><dd>{operations.estimatedTime}</dd></div>
            <div><dt>Cadence</dt><dd>{operations.cadence}</dd></div>
          </dl>
        </div>
        <p className="workflow-when-to-use">{operations.whenToUse}</p>
        <div className="workflow-access-list"><strong>Access for the first run</strong><ul>{operations.access.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>

      <section className="content-section shell use-case-steps-section">
        <Eyebrow>Run the first version one step at a time</Eyebrow>
        <h2 className="section-heading">{isSingleBot ? "Give one Bot the complete job" : "Send one clear message to each Bot"}</h2>
        <p className="section-deck">{isSingleBot
          ? "Use one Bot for the first run. Add a specialist only when the job becomes complicated enough to need a separate role, different access, or independent review."
          : "Start in individual Bot chats. After you approve a result, paste it into the next Bot’s chat with the message shown below. This gives you a clear handoff and keeps the order predictable."}</p>
        <div className="use-case-detail-steps">
          {useCase.steps.map((step, index) => {
            const prompt = getUseCaseStepPrompt(useCase, index);
            return <article key={`${step.bot}-${step.action}`}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.bot}</h3>
                <p>{step.action}</p>
                <strong>Produces: {step.output}</strong>
                <div className="use-case-step-prompt">
                  <code>{prompt}</code>
                  <CopyTextButton text={prompt} />
                </div>
              </div>
              {index < useCase.steps.length - 1 && <ArrowRight size={22} weight="thin" aria-hidden="true" />}
            </article>;
          })}
        </div>
      </section>

      <section className="content-section shell use-case-implementation-grid">
        <article>
          <ClipboardText size={29} weight="thin" aria-hidden="true" />
          <h2>Overall request</h2>
          <blockquote>{useCase.kickoffMessage}</blockquote>
          <p>{isSingleBot ? "Use this as the complete first-run request." : "Use this as the project brief. The step messages above tell each Bot which part to complete."}</p>
        </article>
        <article>
          <ShieldCheck size={29} weight="thin" aria-hidden="true" />
          <h2>Decisions for a person</h2>
          <ul>{useCase.humanDecisions.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      {!isSingleBot && (
        <section className="content-section shell workflow-handoff-section">
          <div><Eyebrow>Handoff rules</Eyebrow><h2 className="section-heading">Move only approved work to the next Bot</h2></div>
          <ol>{operations.handoffs.map((handoff, index) => <li key={handoff}><span>{index + 1}</span><p>{handoff}</p></li>)}</ol>
        </section>
      )}

      <section className="content-section shell use-case-first-test">
        <div>
          <Eyebrow>First test</Eyebrow>
          <h2>Try the workflow with low-risk material</h2>
        </div>
        <p>{useCase.firstTest}</p>
      </section>

      {useCase.adaptations && (
        <section className="content-section shell workflow-adaptations">
          <div>
            <Eyebrow>Use this idea with another AI service</Eyebrow>
            <h2 className="section-heading">Choose the service that can do the job</h2>
            <p className="section-deck">Each option is labeled clearly. A similar-looking AI service may not have the same access, schedule, file or printing features.</p>
          </div>
          <div className="workflow-adaptation-grid">
            {useCase.adaptations.map((adaptation) => (
              <article key={adaptation.platform} data-adaptation-status={adaptation.status}>
                <div>
                  <h3>{adaptation.platform}</h3>
                  <span>{adaptation.statusLabel}</span>
                </div>
                <p><strong>How it could work:</strong> {adaptation.approach}</p>
                <p><strong>Start here:</strong> {adaptation.setup}</p>
                <p><strong>What we have not tested:</strong> {adaptation.limitations}</p>
                <div className="workflow-adaptation-links">
                  {adaptation.source && <a href={adaptation.source.href} target="_blank" rel="noreferrer">{adaptation.source.label} <ArrowSquareOut size={13} /></a>}
                  {adaptation.cabinetGuide && <Link href={adaptation.cabinetGuide}>Open the setup guide <ArrowRight size={13} /></Link>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="content-section shell workflow-checkpoints">
        <article><CheckCircle size={27} weight="thin" /><h2>Success checkpoint</h2><p>{operations.successCheckpoint}</p></article>
        <article><ShieldCheck size={27} weight="thin" /><h2>If the workflow stalls</h2><p>{operations.recovery}</p></article>
      </section>

      <section className="content-section shell use-case-desktop-steps">
        <div>
          <Eyebrow>Set it up in Hermes Desktop</Eyebrow>
          <h2>{isSingleBot ? "Begin with one Bot and one manual run" : "Begin with individual chats, then add a group when the handoffs work"}</h2>
        </div>
        {isSingleBot ? (
          <ol>
            <li>Open the linked starter page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.</li>
            <li>Review the profile’s SOUL.md, Bot Passport, and requested access.</li>
            <li>Run the complete request in that Bot’s chat with low-risk material and review the result.</li>
            <li>Add a schedule, outside connection, or optional specialist only after the manual version works.</li>
          </ol>
        ) : (
          <ol>
            <li>Open each linked starter page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.</li>
            <li>Review each imported profile’s SOUL.md, Bot Passport, and requested access.</li>
            <li>Run each step in that Bot’s own chat and review the result.</li>
            <li>Pass the approved result to the next Bot with the provided step message.</li>
            <li>After the sequence works, create an optional group with the same Bots. In a group, @mention the Bot you want.</li>
          </ol>
        )}
        <a href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode" target="_blank" rel="noreferrer" className="text-link">Read the official Bot Mode guide <ArrowRight size={15} /></a>
      </section>
    </main>
  );
}
