import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, DownloadSimple, ShieldCheck, UsersThree } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { CREW_KITS, getCrewKit } from "@/data/crew-kits";
import { getStarterBot } from "@/data/starter-bots";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return CREW_KITS.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kit = getCrewKit(slug);
  return kit
    ? buildPageMetadata({
        title: `${kit.name} · Crew Kit`,
        description: kit.promise,
        path: `/crew-kits/${kit.slug}/`,
        image: "/brand/crew-kits-og-v2-1200x630.jpg",
        imageAlt: `Bot Cabinet Crew Kits — ${kit.name}`,
      })
    : {};
}

export default async function CrewKitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = getCrewKit(slug);
  if (!kit) notFound();
  const resolvedRoles = kit.roles.flatMap((role) => {
    const bot = getStarterBot(role.botSlug);
    return bot ? [{ ...role, bot }] : [];
  });

  return (
    <main id="main-content" className="page-main crew-kit-detail">
      <section className="inner-hero crew-kit-detail-hero">
        <div className="shell">
          <Link href="/crew-kits" className="back-link"><ArrowLeft size={15} /> Back to Crew Kits</Link>
          <div className="inner-hero-grid">
            <div>
              <Eyebrow>{kit.eyebrow}</Eyebrow>
              <h1 className="inner-title">{kit.name}</h1>
              <p className="inner-deck">{kit.promise}</p>
              <p className="use-case-detail-audience"><strong>Designed for:</strong> {kit.audience}</p>
              <div className="button-row">
                <a href={`/downloads/crew-kits/${kit.slug}.pdf`} download className="button button-primary">Download the designed PDF <DownloadSimple size={16} /></a>
                <a href={`/downloads/crew-kits/${kit.slug}.md`} download className="button button-secondary">Download editable Markdown <DownloadSimple size={16} /></a>
                <a href="#crew-passport" className="button button-secondary">Review the Crew Passport <ShieldCheck size={16} /></a>
              </div>
            </div>
            <aside className="inner-aside use-case-roster">
              <UsersThree size={28} weight="thin" aria-hidden="true" />
              <strong>{resolvedRoles.length} Bots in this standing team</strong>
              <div>{resolvedRoles.map(({ bot }, index) => <Link href={`/bots/${bot.slug}`} key={bot.slug}><span>{index + 1}</span><div><b>{bot.name}</b><small>{bot.title}</small></div><ArrowRight size={14} /></Link>)}</div>
            </aside>
          </div>
        </div>
      </section>

      <section className="content-section shell crew-kit-purpose">
        <div><Eyebrow>The standing assignment</Eyebrow><h2 className="section-heading">What this team is responsible for</h2></div>
        <p>{kit.description}</p>
      </section>

      <section className="content-section shell">
        <Eyebrow>Roles and responsibilities</Eyebrow>
        <h2 className="section-heading">Each Bot owns one part of the desk</h2>
        <div className="crew-role-grid">{resolvedRoles.map(({ bot, botSlug, responsibility }) => <article key={botSlug}><span>{bot.name}</span><h3>{bot.title}</h3><p>{responsibility}</p><Link href={`/bots/${bot.slug}`}>Open this Bot <ArrowRight size={14} /></Link></article>)}</div>
      </section>

      <section className="content-section shell crew-workflow-library">
        <Eyebrow>Included workflows</Eyebrow>
        <h2 className="section-heading">Jobs this Crew Kit can run</h2>
        <div>{kit.workflows.map((workflow, index) => <article key={workflow.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{workflow.name}</h3><p>{workflow.description}</p></div>{workflow.useCaseSlug && <Link href={`/use-cases/${workflow.useCaseSlug}`}>Open workflow <ArrowRight size={14} /></Link>}</article>)}</div>
      </section>

      <section className="content-section shell crew-operating-grid">
        <article><Eyebrow>Shared inputs</Eyebrow><h2>Prepare the desk</h2><ul>{kit.sharedInputs.map((item) => <li key={item}><CheckCircle size={17} />{item}</li>)}</ul></article>
        <article><Eyebrow>Operating rhythm</Eyebrow><h2>Run the work in stages</h2><ol>{kit.operatingRhythm.map((item) => <li key={item.timing}><span>{item.timing}</span><strong>{item.action}</strong><small>{item.owner}</small></li>)}</ol></article>
      </section>

      <section className="content-section shell crew-passport" id="crew-passport">
        <div className="crew-passport-heading"><div><Eyebrow>Crew Passport</Eyebrow><h2 className="section-heading">Shared access and approval rules</h2></div><span>Planning checklist</span></div>
        <p className="section-intro">This record is not automatically installed or enforced. Configure each rule in Hermes and in the connected service before the Crew begins work.</p>
        <div className="crew-passport-grid">
          <article><h3>Allowed access</h3><ul>{kit.passport.allowedAccess.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><h3>A person must perform or release</h3><ul>{kit.passport.approvalActions.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><h3>Bots must never</h3><ul>{kit.passport.prohibitedActions.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        <div className="crew-passport-note"><ShieldCheck size={22} /><div><strong>Use real enforcement where it exists</strong><ul>{kit.passport.enforcementNotes.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
      </section>

      <section className="content-section shell crew-setup">
        <div><Eyebrow>Set up the kit</Eyebrow><h2 className="section-heading">Prove the handoffs before adding automation</h2></div>
        <ol>{kit.setupSteps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      </section>
    </main>
  );
}
