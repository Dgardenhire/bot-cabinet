import type { Metadata } from "next";
import {
  ArrowSquareOut,
  CheckCircle,
  Flask,
  GitBranch,
  LockKey,
  ShieldWarning,
  UserFocus,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { EvidencePill, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Inspection Desk · Review process",
  description: "How Bot Cabinet records each source version and reports automated source scan, human technical review, and Hermes Desktop test status.",
};

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
            <Eyebrow>Review process</Eyebrow>
            <h1 className="inner-title">Inspection Desk</h1>
            <p className="inner-deck">
              Read the review status before you try a Bot. Each listing records the source version and reports the automated source scan,
              human technical review, and Hermes Desktop test separately. Review the Bot’s requested access and approval points before using it.
            </p>
          </div>
          <aside className="inner-aside trust-caveat">
            <Warning size={22} weight="thin" aria-hidden="true" />
            <strong>Automated source scans have limits.</strong>
            A scan can find known file patterns, possible credentials, and risky instructions. It
            cannot predict every behavior. Human technical review is unavailable at this time.
          </aside>
        </div>
      </section>

      <section className="content-section shell">
        <Eyebrow>Three review statuses</Eyebrow>
        <div className="content-grid-3">
          <article className="content-card"><h2>Automated source scan</h2><p>A scanner checks a limited set of public files for known risk patterns without running the project.</p></article>
          <article className="content-card"><h2>Human technical review</h2><p>A qualified person reads the relevant files and records findings. This review is unavailable at this time.</p></article>
          <article className="content-card"><h2>Hermes Desktop test</h2><p>The exact project version is installed in a disposable profile and tested with a small task.</p></article>
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
            <Eyebrow>Planned submission review</Eyebrow>
            <h2 className="section-heading">How the Inspection Desk would review a submission</h2>
            <p className="section-deck">
              Public submissions are closed. A planned automated source scan would read a fixed,
              limited set of public files without running submitted code. Profiles that require
              technical judgment would remain unpublished while human technical review is unavailable.
            </p>
          </div>
          <ol className="trust-process">
            <li><GitBranch size={24} weight="thin" /><div><strong>Record one exact public version</strong><p>The scan records the repository, a fixed source version, the file that describes the Hermes package, its license, included paths, and required account names. A later source version needs a new scan.</p></div></li>
            <li><LockKey size={24} weight="thin" /><div><strong>Check for private material</strong><p>The scan looks for possible credentials, memories, sessions, logs, personal information, and local computer paths.</p></div></li>
            <li><ShieldWarning size={24} weight="thin" /><div><strong>Check for risky actions</strong><p>The scan looks for instructions or code that can delete files, send data, run commands, contact outside services, stay active, or start on a schedule.</p></div></li>
            <li><UserFocus size={24} weight="thin" /><div><strong>State what the scanner cannot decide</strong><p>Projects that use powerful tools or unclear instructions would stay unpublished while human technical review is unavailable.</p></div></li>
            <li><Flask size={24} weight="thin" /><div><strong>Run a Hermes Desktop test separately</strong><p>A separate test would install the exact project version in a disposable profile and try a small task. The automated source scan would not run submitted code.</p></div></li>
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
