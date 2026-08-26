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
} from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { CopyTextButton } from "@/components/copy-text-button";
import { getStarterBot } from "@/data/starter-bots";
import { BOT_USE_CASES, getBotUseCase, getUseCaseStepPrompt } from "@/data/use-cases";

export function generateStaticParams() {
  return BOT_USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getBotUseCase(slug);
  if (!useCase) return {};
  return { title: `${useCase.title} · Bot Crews`, description: useCase.outcome };
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getBotUseCase(slug);
  if (!useCase) notFound();

  return (
    <main id="main-content" className="page-main use-case-detail">
      <section className="inner-hero use-case-detail-hero">
        <div className="shell">
          <Link href="/use-cases" className="back-link"><ArrowLeft size={15} /> Back to Bot Crews</Link>
          <div className="inner-hero-grid">
            <div>
              <Eyebrow>Bot Crews workflow</Eyebrow>
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
              <strong>Bots in this workflow</strong>
              <div>
                {useCase.botSlugs.map((botSlug, index) => {
                  const bot = getStarterBot(botSlug);
                  if (!bot) return null;
                  return <Link href={`/bots/${bot.slug}`} key={bot.slug}><span>{index + 1}</span><div><b>{bot.name}</b><small>{bot.title}</small></div><ArrowRight size={14} /></Link>;
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="content-section shell use-case-inputs">
        <div>
          <Eyebrow>Before you begin</Eyebrow>
          <h2 className="section-heading">Gather the information the Bots need</h2>
        </div>
        <ul>{useCase.inputs.map((item) => <li key={item}><CheckCircle size={18} weight="thin" />{item}</li>)}</ul>
      </section>

      <section className="content-section shell use-case-steps-section">
        <Eyebrow>Run the first version one step at a time</Eyebrow>
        <h2 className="section-heading">Send one clear message to each Bot</h2>
        <p className="section-deck">Start in individual Bot chats. After you approve a result, paste it into the next Bot’s chat with the message shown below. This gives you a clear handoff and keeps the order predictable.</p>
        <div className="use-case-detail-steps">
          {useCase.steps.map((step, index) => (
            <article key={`${step.bot}-${step.action}`}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.bot}</h3>
                <p>{step.action}</p>
                <strong>Produces: {step.output}</strong>
                <div className="use-case-step-prompt">
                  <code>{getUseCaseStepPrompt(useCase, index)}</code>
                  <CopyTextButton text={getUseCaseStepPrompt(useCase, index)} />
                </div>
              </div>
              {index < useCase.steps.length - 1 && <ArrowRight size={22} weight="thin" aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section shell use-case-implementation-grid">
        <article>
          <ClipboardText size={29} weight="thin" aria-hidden="true" />
          <h2>Overall request</h2>
          <blockquote>{useCase.kickoffMessage}</blockquote>
          <p>Use this as the project brief. The step messages above tell each Bot which part to complete.</p>
        </article>
        <article>
          <ShieldCheck size={29} weight="thin" aria-hidden="true" />
          <h2>Decisions for a person</h2>
          <ul>{useCase.humanDecisions.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="content-section shell use-case-first-test">
        <div>
          <Eyebrow>First test</Eyebrow>
          <h2>Try the workflow with low-risk material</h2>
        </div>
        <p>{useCase.firstTest}</p>
      </section>

      <section className="content-section shell use-case-desktop-steps">
        <div>
          <Eyebrow>Set it up in Hermes Desktop</Eyebrow>
          <h2>Begin with individual chats, then add a group when the handoffs work</h2>
        </div>
        <ol>
          <li>Open each linked starter page and follow its manual Hermes Desktop setup steps.</li>
          <li>Run each step in that Bot’s own chat and review the result.</li>
          <li>Pass the approved result to the next Bot with the provided step message.</li>
          <li>After the sequence works, create an optional group with the same Bots.</li>
          <li>In a group, @mention the Bot you want. Membership order does not control who responds.</li>
        </ol>
        <a href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode" target="_blank" rel="noreferrer" className="text-link">Read the official Bot Mode guide <ArrowRight size={15} /></a>
      </section>
    </main>
  );
}
