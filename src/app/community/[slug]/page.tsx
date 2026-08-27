import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  Desktop,
  FileText,
  GitCommit,
  GitFork,
  ShieldWarning,
  UserCircle,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";
import {
  CATEGORY_LABELS,
  REGISTRY_ENTRIES,
  REVIEW_SURFACE_LABELS,
  REVIEW_SURFACE_EXPLANATIONS,
  commitUrl,
  getRegistryEntry,
  manifestUrl,
  repositoryUrl,
} from "@/data/registry";

export function generateStaticParams() {
  return REGISTRY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getRegistryEntry(slug);
  if (!entry) return {};
  return buildPageMetadata({
    title: `${entry.name} · Community Registry`,
    description: entry.summary,
    path: `/community/${entry.slug}/`,
    image: "/brand/social/community-registry-1200x630.jpg",
    imageAlt: `Community Registry — ${entry.name}`,
  });
}

export default async function CommunityProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getRegistryEntry(slug);
  if (!entry) notFound();

  return (
    <main id="main-content" className="page-main registry-detail">
      <section className="registry-detail-hero">
        <div className="shell">
          <Link href="/community" className="back-link"><ArrowLeft size={15} /> Back to the Community Registry</Link>
          <div className="registry-detail-grid">
            <div className="registry-detail-image">
              <Image src={entry.image} alt={`Illustration of ${entry.name}`} width={1200} height={1200} priority />
              <span>Illustration</span>
            </div>
            <div className="registry-detail-copy">
              <Eyebrow>{CATEGORY_LABELS[entry.category]}</Eyebrow>
              <div className="review-status-row" aria-label="Current review and test status">
                <span>Automated source scan: not run</span>
                <span>Human technical review: unavailable</span>
                <span>Hermes Desktop test: not run</span>
              </div>
              <h1>{entry.name}</h1>
              <p className="registry-detail-summary">{entry.summary}</p>
              <p className="starter-who"><strong>Best for:</strong> {entry.bestFor}</p>
              <dl className="registry-facts">
                <div><dt>Publisher</dt><dd>{entry.maintainer}</dd></div>
                <div><dt>Version listed in source</dt><dd>{entry.version}</dd></div>
                <div><dt>Hermes version listed</dt><dd>{entry.hermesRequires ?? "No minimum listed"}</dd></div>
                <div><dt>License found</dt><dd>{entry.license}</dd></div>
              </dl>
              <div className="button-row">
                <a href={repositoryUrl(entry)} target="_blank" rel="noreferrer" className="button button-primary">Open the publisher’s repository <ArrowSquareOut size={15} /></a>
                <a href={commitUrl(entry)} target="_blank" rel="noreferrer" className="button button-secondary">Open the exact source version <ArrowSquareOut size={15} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section shell starter-practical-grid community-practical-grid">
        <article className="starter-practical-card">
          <Wrench size={27} weight="thin" aria-hidden="true" />
          <h2>What someone could use it for</h2>
          <ul>{entry.exampleTasks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="starter-practical-card">
          <FileText size={27} weight="thin" aria-hidden="true" />
          <h2>Intended output</h2>
          <ul>{entry.expectedOutput.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="starter-practical-card">
          <ShieldWarning size={27} weight="thin" aria-hidden="true" />
          <h2>Setup and review</h2>
          <ul>{entry.setupNotes.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="content-section shell evidence-ledger-section">
        <div className="evidence-ledger-intro">
          <Eyebrow>Review status</Eyebrow>
          <h2 className="section-heading">Source and test status</h2>
          <p className="section-deck">This page identifies one exact source version and reports each review and test separately.</p>
        </div>
        <div className="evidence-ledger">
          <div className="ledger-row ledger-positive"><GitCommit size={22} weight="thin" /><div><strong>Exact source version recorded</strong><p>This listing links to commit <a href={commitUrl(entry)} target="_blank" rel="noreferrer">{entry.sha.slice(0, 10)}</a>, dated {entry.commitDate}. A commit is a fixed version of the repository, so later changes will not alter what this page references.</p></div><span>Recorded</span></div>
          <div className="ledger-row ledger-positive"><GitFork size={22} weight="thin" /><div><strong>Hermes package file found</strong><p>The repository has <code>distribution.yaml</code> at its top level. This file tells Hermes which profile files belong to the package.</p></div><span>Found at recorded commit</span></div>
          <div className="ledger-row ledger-negative"><Wrench size={22} weight="thin" /><div><strong>Automated source scan</strong><p>Bot Cabinet has not run its automated file, credential, and risky-instruction scan on this exact version.</p></div><span>Not run</span></div>
          <div className="ledger-row ledger-negative"><UserCircle size={22} weight="thin" /><div><strong>Human technical review</strong><p>Bot Cabinet has no human technical reviewer for this profile.</p></div><span>Unavailable</span></div>
          <div className="ledger-row ledger-negative"><Desktop size={22} weight="thin" /><div><strong>Hermes Desktop test</strong><p>Bot Cabinet has not installed and tested this recorded version in Hermes Desktop.</p></div><span>Not run</span></div>
        </div>
      </section>

      <section className="content-section shell source-reading-grid">
        <div>
          <Eyebrow>What the package says Hermes may add</Eyebrow>
          <h2 className="section-heading">Review the listed files and connections because they can affect the Bot’s access and actions</h2>
          <p className="section-deck"><strong>{REVIEW_SURFACE_LABELS[entry.reviewSurface]}.</strong> {REVIEW_SURFACE_EXPLANATIONS[entry.reviewSurface]}</p>
        </div>
        <div className="source-reading-card">
          <div className="source-reading-heading"><span>Does the package name its files?</span><strong>{entry.distributionOwned === "explicit" ? "Yes. The package file names every path shown below." : "No. The package file leaves the path list out."}</strong></div>
          <p className="source-reading-explanation">
            {entry.distributionOwned === "explicit"
              ? "Complete path list from distribution.yaml:"
              : "Selected profile-related paths in the public repository. This is not a complete installation list because distribution.yaml does not limit installation to named paths:"}
          </p>
          <ul>{entry.includedPaths.map((path) => <li key={path}>{path}</li>)}</ul>
          <div className="source-reading-heading"><span>What the public repository shows</span></div>
          <ul>{entry.sourceSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          <div className="source-caution"><ShieldWarning size={23} weight="thin" /><p><strong>Main reason for caution</strong>{entry.caution}</p></div>
          <div className="source-link-row">
            <a href={manifestUrl(entry)} target="_blank" rel="noreferrer">Read distribution.yaml <ArrowSquareOut size={14} /></a>
            <a href="https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions" target="_blank" rel="noreferrer">Official profile distribution guide <ArrowSquareOut size={14} /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
