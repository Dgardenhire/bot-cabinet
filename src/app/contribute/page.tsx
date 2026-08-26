import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  GitBranch,
  LockKey,
  MagnifyingGlass,
  Queue,
  ShieldWarning,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Submission Desk · Future contributions",
  description: "How to prepare a public Hermes profile package or community project for Bot Cabinet’s Hermes Bot Registry.",
};

export default function ContributePage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell inner-hero-grid">
          <div><Eyebrow>Prepare for future submissions</Eyebrow><h1 className="inner-title">Submission Desk</h1><p className="inner-deck">Prepare a public Hermes project for future review. The Hermes Bot Registry plans to accept public Bot packages, starter collections, and educational guides. Each listing would identify a recorded source version and show automated source scan, human technical review, and Hermes Desktop test status separately.</p></div>
          <aside className="inner-aside">
            <strong>Public submissions are closed.</strong>
            Authors can use the preparation form now to organize the required information and
            download a Markdown record to keep with their public project. Questions can be sent to{" "}
            <a className="inline-link" href="mailto:damon@linchpin.studio">damon@linchpin.studio</a>.
          </aside>
        </div>
      </section>

      <section className="content-section shell">
        <Eyebrow>How the Submission Desk could work</Eyebrow>
        <ol className="contribute-steps">
          <li><span>01</span><GitBranch size={27} weight="thin" /><div><h2>Share the main public GitHub link</h2><p>The form asks what the project does, what accounts it needs, which files and tools it can use, which actions require approval, and whether the submitter has permission to share it.</p></div></li>
          <li><span>02</span><LockKey size={27} weight="thin" /><div><h2>Run the automated source scan</h2><p>The planned scanner would read a fixed, limited set of public files without running the submitted code. It would look for private material, dangerous instructions, broad access, package conflicts, and missing release information.</p></div></li>
          <li><span>03</span><MagnifyingGlass size={27} weight="thin" /><div><h2>Publish a plain-English report</h2><p>The report would explain each finding, why it matters, and whether the automated source scan, human technical review, and Hermes Desktop test were completed. Projects the scanner could not assess would stay unpublished while human technical review is unavailable.</p></div></li>
          <li><span>04</span><CheckCircle size={27} weight="thin" /><div><h2>Create a listing with clear status labels</h2><p>The listing would explain the project’s purpose, example requests, intended result, required access, recorded source version, and the status of each review step.</p></div></li>
        </ol>
      </section>

      <section className="content-section shell contribute-grid">
        <div>
          <Eyebrow>Before submissions open</Eyebrow>
          <h2 className="section-heading">Create a new package specifically for public release</h2>
          <p className="section-deck">A live profile can contain credentials, memory, sessions, logs, cached documents, client information, and private instructions. Keep those files out of the public package and its Git history.</p>
          <Link href="/guides/share-a-sanitized-profile" className="text-link">Read how to prepare a public profile package <ArrowRight size={15} /></Link>
        </div>
        <div className="submission-checklist">
          <h3>Proposed requirements for future public intake</h3>
          <ul>
            <li>Main public GitHub repository URL</li>
            <li>Clear project type and current publisher</li>
            <li>A top-level file named distribution.yaml that tells Hermes which files belong to an installable package</li>
            <li>Names of required accounts, credentials, files, and tools</li>
            <li>License text for original and bundled work</li>
            <li>No secrets, memories, sessions, personal information, or client material</li>
            <li>Known limitations and actions that require a person’s approval</li>
          </ul>
        </div>
      </section>

      <section className="content-section shell contribute-warning">
        <ShieldWarning size={32} weight="thin" aria-hidden="true" />
        <div><h2>Human technical review is unavailable</h2><p>A planned automated source scan could handle repeatable checks. Projects that require technical judgment would remain unpublished while human technical review is unavailable.</p></div>
      </section>

      <section className="content-section shell contribute-cta">
        <Queue size={40} weight="thin" aria-hidden="true" />
        <div><Eyebrow>Preparation form</Eyebrow><h2>Prepare a submission packet for later</h2><p>The form creates a Markdown record in your browser. Keep it with your public project until submissions open. The form does not upload a repository, run a scan, or add a listing.</p></div>
        <Link href="/submit" className="button button-primary">Open the preparation form <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
