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
import { BotPassportPanel } from "@/components/bot-passport-panel";
import { BotPlatformChooser } from "@/components/bot-platform-chooser";
import { LegacyRoute } from "@/components/legacy-route";
import {
  STARTER_BOTS,
  STARTER_CATEGORY_LABELS,
  getStarterBot,
} from "@/data/starter-bots";
import { REGISTRY_ENTRIES, getRegistryEntry } from "@/data/registry";
import { starterBotToPassport } from "@/lib/bot-passport";
import { buildPageMetadata } from "@/lib/metadata";

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
  return buildPageMetadata({
    title: `${bot.name} · The Cabinet`,
    description: bot.summary,
    path: `/bots/${bot.slug}/`,
    image: "/brand/social/the-cabinet-1200x630.jpg",
    imageAlt: `The Cabinet — ${bot.name}, a practical Hermes Bot starter`,
  });
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

  const profileArchiveUrl = `https://botcabinet.com/downloads/starter-bots/${bot.slug}.tar.gz`;
  const importCommand = `curl --fail --location ${profileArchiveUrl} --output /tmp/botcabinet-${bot.slug}.tar.gz && hermes profile import /tmp/botcabinet-${bot.slug}.tar.gz --name ${bot.slug}`;
  const passport = starterBotToPassport(bot);

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
                <a href={`/downloads/starter-bots/${bot.slug}.tar.gz`} download className="button button-primary" data-funnel-event="bot_profile_download" data-funnel-surface="bot_detail" data-funnel-destination={bot.slug}>Download for Hermes Desktop <DownloadSimple size={16} /></a>
                <a href={`/downloads/grok-bot-templates/${bot.slug}.md`} download className="button button-secondary">Download the Grok build brief <DownloadSimple size={16} /></a>
                <a href={`/downloads/portable-bot-packs/${bot.slug}.md`} download className="button button-secondary">Download the portable Bot Pack <DownloadSimple size={16} /></a>
                <a href="#files-and-review" className="button button-secondary">View files and review status <ShieldCheck size={16} /></a>
              </div>
              <p className="starter-install-note">The Hermes profile is ready to download. The Grok Bot build brief is prepared and awaits a runtime test. The portable pack keeps the shared job recipe, limits, first task, Skill recipe, and Routine recipe together.</p>
              <Link href={`/workshop?starter=${bot.slug}`} className="text-link">Customize this Bot in Bot Lab <Wrench size={15} /> </Link>
            </div>
          </div>
        </div>
      </section>

      <BotPlatformChooser
        botName={bot.name}
        botSlug={bot.slug}
        hermesImportCommand={importCommand}
      />

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

      <section className="content-section shell starter-passport-section">
        <BotPassportPanel passport={passport} downloadHref={`/downloads/starter-bots/${bot.slug}/BOT-PASSPORT.md`} />
      </section>

      <section className="content-section shell starter-setup-section" id="files-and-review">
        <div>
          <Eyebrow>Set it up in Hermes Desktop</Eyebrow>
          <h2 className="section-heading">Import the profile and run one small test</h2>
          <p className="section-deck">The Hermes download includes the Bot’s role instructions, Bot Passport, setup guide, package manifest, and license. The ZIP contains the same files for inspection.</p>
        </div>
        <ol className="starter-setup-steps">
          <li><span>1</span><div><strong>Download the Hermes profile.</strong><p>Import the .tar.gz archive from the Profiles screen, or copy the terminal command above.</p></div></li>
          <li><span>2</span><div><strong>Review the imported profile.</strong><p>Read README.md and SOUL.md, then confirm the name, description, and standing instructions.</p></div></li>
          <li><span>3</span><div><strong>Choose the access it needs.</strong><p>Add only the skills, tools, and connections required for this job.</p></div></li>
          <li><span>4</span><div><strong>Run a low-risk test.</strong><p>Use sample material and confirm that the result matches the intended output before adding private files, accounts, or schedules.</p></div></li>
        </ol>
        <div className="source-link-row starter-file-links">
          <a href={`/downloads/starter-bots/${bot.slug}/README.md`} target="_blank" rel="noreferrer">Read the starter guide</a>
          <a href={`/downloads/starter-bots/${bot.slug}/SOUL.md`} target="_blank" rel="noreferrer">Read the role instructions</a>
          <a href={`/downloads/starter-bots/${bot.slug}/BOT-PASSPORT.md`} target="_blank" rel="noreferrer">Read the Bot Passport</a>
          <a href={`/downloads/starter-bots/${bot.slug}.zip`} download>Download readable files (ZIP)</a>
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
        <p><strong>Current review status:</strong> Automated package tests confirmed that the ZIP and Hermes profile archive contain the six listed files and match the readable copies. The Scout reference archive imported successfully with Hermes Agent 0.20.5. Human technical review: unavailable. Role-specific output test: not run.</p>
      </section>
    </main>
  );
}
