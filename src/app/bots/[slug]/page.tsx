import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  FileText,
  ShieldCheck,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { LegacyRoute } from "@/components/legacy-route";
import {
  STARTER_BOTS,
  STARTER_CATEGORY_LABELS,
  getStarterBot,
} from "@/data/starter-bots";
import { REGISTRY_ENTRIES, getRegistryEntry } from "@/data/registry";

export function generateStaticParams() {
  return [
    ...STARTER_BOTS.map((bot) => ({ slug: bot.slug })),
    ...REGISTRY_ENTRIES.map((entry) => ({ slug: entry.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  const communityEntry = getRegistryEntry(slug);
  if (!bot && communityEntry) return { title: `${communityEntry.name} moved` };
  if (!bot) return {};
  return { title: `${bot.name} · The Cabinet`, description: bot.summary };
}

export default async function StarterBotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  if (!bot) {
    const communityEntry = getRegistryEntry(slug);
    if (communityEntry) {
      return <LegacyRoute eyebrow="Community Registry project" title={`${communityEntry.name} moved to the Community Registry.`} copy="Its current page explains the purpose in plain language, links to the recorded source version, and reports automated source scan, human technical review, and Hermes Desktop test status." href={`/community/${communityEntry.slug}`} action="Open the project page" />;
    }
    notFound();
  }

  return (
    <main id="main-content" className="page-main starter-detail">
      <section className="registry-detail-hero starter-detail-hero">
        <div className="shell">
          <Link href="/bots" className="back-link"><ArrowLeft size={15} /> Back to The Cabinet</Link>
          <div className="registry-detail-grid">
            <div className="registry-detail-image starter-detail-image">
              <Image src={bot.image} alt={`Illustration for ${bot.name} in The Cabinet’s Hermes Bot collection`} width={1200} height={1200} priority />
              <span>The Cabinet · Hermes Bot starter</span>
            </div>
            <div className="registry-detail-copy">
              <Eyebrow>{STARTER_CATEGORY_LABELS[bot.category]}</Eyebrow>
              <p className="starter-status-label">Free starter · role and instructions included</p>
              <h1>{bot.name}</h1>
              <h2 className="starter-detail-title">{bot.title}</h2>
              <p className="registry-detail-summary">{bot.summary}</p>
              <p className="starter-who"><strong>Best for:</strong> {bot.whoItHelps}</p>
              <div className="button-row">
                <Link href={`/workshop?starter=${bot.slug}`} className="button button-primary">Open this template in Bot Lab <Wrench size={16} /></Link>
                <a href={`/downloads/starter-bots/${bot.slug}.zip`} download className="button button-secondary">Download starter files (ZIP) <DownloadSimple size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section shell starter-practical-grid">
        <article className="starter-practical-card">
          <Sparkle size={27} weight="thin" aria-hidden="true" />
          <h2>Try asking</h2>
          <ul>{bot.asks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="starter-practical-card">
          <FileText size={27} weight="thin" aria-hidden="true" />
          <h2>Intended output</h2>
          <ul>{bot.produces.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="starter-practical-card">
          <CheckCircle size={27} weight="thin" aria-hidden="true" />
          <h2>What you provide</h2>
          <ul>{bot.setup.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="starter-practical-card">
          <ShieldCheck size={27} weight="thin" aria-hidden="true" />
          <h2>Keep these decisions with a person</h2>
          <ul>{bot.boundaries.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="content-section shell starter-setup-section">
        <div>
          <Eyebrow>Set it up in Hermes Desktop</Eyebrow>
          <h2 className="section-heading">Create the Bot and run one small test</h2>
          <p className="section-deck">The ZIP contains readable source files. Create the Bot manually in Hermes Desktop. The download includes public role instructions, a step-by-step README, a <code>distribution.yaml</code> file that lists the package contents for a future public GitHub repository, and an MIT license.</p>
        </div>
        <ol className="starter-setup-steps">
          <li><span>1</span><div><strong>Download and read the files.</strong><p>Open README.md and SOUL.md so you know exactly what the role says.</p></div></li>
          <li><span>2</span><div><strong>Create a Bot in Hermes Desktop.</strong><p>Use the Bot Mode create control. Enter the name and title from this page.</p></div></li>
          <li><span>3</span><div><strong>Add the role instructions.</strong><p>Open the Bot’s advanced settings and use the text from SOUL.md. Add tools only when the job needs them.</p></div></li>
          <li><span>4</span><div><strong>Run a low-risk test.</strong><p>Use sample material and confirm that the result matches the intended output before adding private files, accounts, or schedules.</p></div></li>
        </ol>
        <div className="source-link-row starter-file-links">
          <a href={`/downloads/starter-bots/${bot.slug}/README.md`} target="_blank" rel="noreferrer">Read the starter guide</a>
          <a href={`/downloads/starter-bots/${bot.slug}/SOUL.md`} target="_blank" rel="noreferrer">Read the role instructions</a>
          <a href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode" target="_blank" rel="noreferrer">Official Bot Mode guide</a>
        </div>
      </section>

      <section className="content-section shell starter-teammates">
        <div>
          <Eyebrow>Useful combinations</Eyebrow>
          <h2>Pair {bot.name} with another role</h2>
        </div>
        <div className="starter-teammate-links">
          {bot.worksWith.map((slug) => {
            const teammate = getStarterBot(slug);
            if (!teammate) return null;
            return <Link href={`/bots/${teammate.slug}`} key={teammate.slug}>{teammate.name}<span>{teammate.title}</span><ArrowRight size={15} /></Link>;
          })}
        </div>
        <Link href="/use-cases" className="text-link">See complete Bot Crews workflows <ArrowRight size={15} /></Link>
      </section>

      <section className="content-section shell starter-review-note">
        <ShieldCheck size={24} weight="thin" aria-hidden="true" />
        <p><strong>Current review status:</strong> The package test confirmed that the ZIP contains the four listed files. Human technical review: unavailable. Hermes Desktop test: not run.</p>
      </section>
    </main>
  );
}
