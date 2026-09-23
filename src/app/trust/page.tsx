import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowSquareOut,
  CheckCircle,
  Clock,
  Robot,
  UserFocus,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { EvidencePill, Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "What Bot Cabinet actually checks",
  description: "See which Bot Cabinet checks run now, which are controlled tests, and which Keeper jobs are not yet connected.",
  path: "/trust/",
  image: "/brand/social/inspection-desk-1200x630.jpg",
  imageAlt: "Inspection Desk — what Bot Cabinet actually checks",
});

const evidence = [
  {
    kind: "official" as const,
    title: "Official Hermes source",
    copy: "Official Hermes documentation, release notes, or source code supports the statement. The listing links to that source.",
  },
  {
    kind: "tested" as const,
    title: "Tested by Bot Cabinet",
    copy: "A Hermes Desktop test record names the Hermes version, computer system, date, exact project version, steps, and result. A later project version requires another test.",
  },
  {
    kind: "blueprint" as const,
    title: "Example plan",
    copy: "This is a plan someone can adapt. It does not claim that a downloadable package or working system already exists.",
  },
  {
    kind: "maintainer" as const,
    title: "Publisher description",
    copy: "The project publisher described this behavior. Bot Cabinet has not reproduced it in a Hermes Desktop test.",
  },
];

export default function TrustPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Checks and test status</Eyebrow>
            <h1 className="inner-title">What we actually check</h1>
            <p className="inner-deck">
              See what has actually been checked, when it was checked, and what the result does not prove.
              Bot Cabinet separates release checks, controlled Bot tests, recurring Keeper work, and human judgment.
            </p>
          </div>
          <aside className="inner-aside trust-caveat">
            <Warning size={22} weight="thin" aria-hidden="true" />
            <strong>No badge means “safe” or “works for everyone.”</strong>
            A package check can find known problems. A controlled task can expose failures. Neither replaces reading the requested access, testing the job yourself, or making the final decision.
          </aside>
        </div>
      </section>

      <section className="content-section shell">
        <Eyebrow>Current operating status · September 23, 2026</Eyebrow>
        <div className="content-grid-3">
          <article className="content-card"><CheckCircle size={24} weight="thin" /><h2>Release checks are running</h2><p>The latest release passed 291 application tests, 16 edge tests, 20 social-card checks, and 4,425 internal-link checks with no broken internal links. These checks cover the site release, not every external link or every Bot’s usefulness.</p><a className="text-link" href="https://github.com/Dgardenhire/bot-cabinet/actions" target="_blank" rel="noreferrer">See the public release runs <ArrowSquareOut size={14} /></a></article>
          <article className="content-card"><Clock size={24} weight="thin" /><h2>Keeper’s recurring jobs are not connected</h2><p>Cabinet Keeper exists, but its recurring source, site, download, and catalog checks are not yet installed and verified in the cloud. Until that changes, this page will not present them as live monitoring.</p></article>
          <article className="content-card"><Warning size={24} weight="thin" /><h2>Bot tests are controlled trials</h2><p>Some exact packages were imported and run against disclosed fictional fixtures. Those records show what happened in those tests. They are not customer results, independent review, or proof of dependable real-world use.</p><Link className="text-link" href="/proof">Read the Test Records</Link></article>
        </div>
      </section>

      <section className="content-section shell">
        <Eyebrow>How evidence is described</Eyebrow>
        <div className="evidence-grid">
          {evidence.map((item) => (
            <article className="evidence-card" key={item.title}>
              <EvidencePill kind={item.kind}>{item.title}</EvidencePill>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section shell">
        <div className="promise-grid">
          <div>
            <Eyebrow>Cabinet Keeper’s proper job</Eyebrow>
            <h2 className="section-heading">What Keeper can check automatically</h2>
            <p className="section-deck">
              Keeper should do the repetitive inspection work and produce a dated report. It should not quietly publish, deploy, install unknown code, or turn an automated scan into a safety claim.
            </p>
          </div>
          <ol className="trust-process">
            <li><Robot size={24} weight="thin" /><div><strong>Site and download health</strong><p>Check pages, internal links, package files, manifests, checksums, metadata, and catalog consistency. Report changes and failures with a date.</p></div></li>
            <li><Robot size={24} weight="thin" /><div><strong>Source and version changes</strong><p>Check approved marketplaces, directories, repositories, and release feeds. Deduplicate findings and put new or changed items into a private review queue.</p></div></li>
            <li><Robot size={24} weight="thin" /><div><strong>Bounded package inspection</strong><p>Read a fixed set of public files for known credential patterns, private data, risky actions, schedules, network calls, and unclear permissions without running unknown code.</p></div></li>
            <li><UserFocus size={24} weight="thin" /><div><strong>A person still decides</strong><p>A person approves publication, deployment, purchases, account connections, destructive changes, and any claim that requires judgment. Keeper may advance at most one substantial product proposal each week.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="content-section shell truth-boundaries">
        <Eyebrow>Important boundaries</Eyebrow>
        <div className="content-grid-3">
          <article className="content-card"><h2>A profile separates Bot data</h2><p>Each Hermes profile keeps its own settings, memory, and history. The Bot can still use the files and tools that a person gives it permission to use.</p></article>
          <article className="content-card"><h2>Anyone can download a public repository</h2><p>Create a new public package for sharing. Keep credentials, memories, sessions, client material, and private instructions in the live profile.</p></article>
          <article className="content-card"><h2>Public source still requires review</h2><p>Hermes profile packages do not include a built-in signature from the Registry. Record the exact version and review changes before updating.</p></article>
        </div>
      </section>

      <section className="content-section shell trust-source-block">
        <CheckCircle size={34} weight="thin" aria-hidden="true" />
        <div>
          <h2>Official sources for these rules</h2>
          <p>Selected version-specific guidance links directly to official Hermes documentation and released source code. When those sources differ, both links are provided with an explanation.</p>
          <div className="source-link-row">
            <a href="https://hermes-agent.nousresearch.com/docs/user-guide/security" target="_blank" rel="noreferrer">Security guide <ArrowSquareOut size={14} /></a>
            <a href="https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions" target="_blank" rel="noreferrer">Distribution guide <ArrowSquareOut size={14} /></a>
            <a href="https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.19" target="_blank" rel="noreferrer">v0.20.5 release <ArrowSquareOut size={14} /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
