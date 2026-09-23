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
        <Eyebrow>What is running now</Eyebrow>
        <div className="content-grid-3">
          <article className="content-card"><CheckCircle size={24} weight="thin" /><h2>Every site release is checked</h2><p>The public build checks the pages, internal links, social images, downloads, and application behavior. The exact test count changes as the site grows, so this page does not freeze an old number.</p><a className="text-link" href="https://github.com/Dgardenhire/bot-cabinet/actions" target="_blank" rel="noreferrer">See the latest public run <ArrowSquareOut size={14} /></a></article>
          <article className="content-card"><Warning size={24} weight="thin" /><h2>Keeper’s records are not public yet</h2><p>Cloud Keeper checks the public site every 15 minutes and the public repository every 30 minutes. Those jobs are running, but their dated records are still inside Keeper. Until a public status file is connected here, treat this as an operating report—not independent public proof.</p></article>
          <article className="content-card"><Warning size={24} weight="thin" /><h2>Only some Bots have been tried</h2><p>Some exact packages were imported and run against disclosed fictional examples. Each record says what passed, what failed, and what was not tested. It is not a promise that the Bot will work for everyone.</p><Link className="text-link" href="/proof">Read the test records</Link></article>
        </div>
      </section>

      <section className="content-section shell" aria-labelledby="keeper-status-title">
        <div className="trust-status-heading">
          <Eyebrow>Recorded checks</Eyebrow>
          <h2 className="section-heading" id="keeper-status-title">What Keeper can prove today</h2>
          <p className="section-deck">The table stays unknown until a person reviews and publishes a dated Keeper record. A missing or late record never appears as a pass.</p>
        </div>
        <KeeperTrustStatusTable fallback={KEEPER_TRUST_FALLBACK} />
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
            <Eyebrow>Automatic checks</Eyebrow>
            <h2 className="section-heading">What Keeper can check</h2>
            <p className="section-deck">
              Keeper should do the dull, repeatable checking. People should decide whether a Bot is useful, whether its access is sensible, and whether a change should go live.
            </p>
          </div>
          <ol className="trust-process">
            <li><Robot size={24} weight="thin" /><div><strong>Running now</strong><p>Keeper checks whether key pages, social images, catalog files, and sample downloads can be reached. It also watches the public repository for a new release.</p></div></li>
            <li><Clock size={24} weight="thin" /><div><strong>Built, but not running in the cloud</strong><p>The prepared Keeper package can inspect the full download list, package contents, catalog mismatches, Agent Watch sources, and stale results. These checks are not ongoing until that package is installed and a cloud run is recorded.</p></div></li>
            <li><Clock size={24} weight="thin" /><div><strong>Not public yet</strong><p>Keeper does not yet publish a read-only status file with the latest run time, result, and evidence link for each check. Without that record, visitors should treat the current Keeper result as unknown.</p></div></li>
            <li><UserFocus size={24} weight="thin" /><div><strong>A person still decides</strong><p>A person decides whether the result is useful and approves publication, deployment, purchases, new account access, and destructive changes. Keeper can propose one substantial improvement each week; it cannot approve its own work.</p></div></li>
          </ol>
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
