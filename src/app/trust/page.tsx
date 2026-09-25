import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowSquareOut,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { EvidencePill, Eyebrow } from "@/components/ui";
import { KeeperTrustStatusTable } from "@/components/keeper-trust-status";
import { KEEPER_TRUST_FALLBACK } from "@/lib/keeper-status-live";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "How Bot Cabinet checks its work",
  description: "See what Bot Cabinet checks automatically, which Bots have been tried, and where public proof is still missing.",
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
            <Eyebrow>Checks and test results</Eyebrow>
            <h1 className="inner-title">How we check the work</h1>
            <p className="inner-deck">
              This page shows which checks run automatically, which Bots have been tried, and where proof is still missing.
              If a result is not public and dated, we say so.
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
        <div aria-labelledby="keeper-status-title">
        <div className="trust-status-heading">
          <Eyebrow>Current site status</Eyebrow>
          <h2 className="section-heading" id="keeper-status-title">Latest approved Keeper checks</h2>
          <p className="section-deck">Keeper checks the public site, repository, downloads, and changing Bot sources. Only a dated result that a person has reviewed appears here. Missing or late evidence never appears as a pass.</p>
        </div>
        <KeeperTrustStatusTable fallback={KEEPER_TRUST_FALLBACK} />
        </div>
        <div className="content-grid-3 trust-summary-grid">
          <article className="content-card"><CheckCircle size={24} weight="thin" /><h2>Release checks</h2><p>Every public release checks pages, links, social images, downloads, and site behavior.</p><a className="text-link" href="https://github.com/Dgardenhire/bot-cabinet/actions" target="_blank" rel="noreferrer">See the latest public run <ArrowSquareOut size={14} /></a></article>
          <article className="content-card"><Warning size={24} weight="thin" /><h2>Bot test results</h2><p>A site check cannot show whether a Bot does useful work. The Proof Room records the exact Bots and sample tasks that have been tried.</p><Link className="text-link" href="/proof">Read the test results</Link></article>
          <article className="content-card"><Warning size={24} weight="thin" /><h2>Human decisions</h2><p>Keeper can find a problem and prepare a proposed fix. A person still approves publication, deployment, purchases, access, and destructive changes.</p></article>
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
        <Eyebrow>What a check proves</Eyebrow>
        <div className="content-grid-3">
          <article className="content-card"><h2>Reachable is not useful</h2><p>A page or download can respond correctly and still be confusing, outdated, or unhelpful. Keeper can find the first kind of problem. A real task test and human review are needed for the second.</p></article>
          <article className="content-card"><h2>Package checks are narrow</h2><p>A package check can confirm expected files, hashes, and readable contents. It cannot prove that the instructions are good or that a Bot will handle a real job well.</p></article>
          <article className="content-card"><h2>No public record, no green light</h2><p>A private log may help maintain the site, but visitors cannot inspect it. A missing or late public record means the current result is unknown.</p></article>
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
