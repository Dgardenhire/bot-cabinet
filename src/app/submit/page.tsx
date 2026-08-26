import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GithubLogo, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { SubmissionPacketBuilder } from "@/components/submission-packet-builder";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Prepare a submission packet",
  description: "Prepare a public-source submission packet for Bot Cabinet’s Hermes Bot Registry.",
};

export default function SubmitPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Prepare a public submission</Eyebrow>
            <h1 className="inner-title">Prepare a submission packet</h1>
            <p className="inner-deck">
              Assemble the information a planned public intake may require. This page creates a
              Markdown text document in your browser; it does not upload, scan, or submit anything.
            </p>
          </div>
          <aside className="inner-aside submit-status-card">
            <GithubLogo size={24} weight="thin" aria-hidden="true" />
            <strong>Public submissions are closed.</strong>
            This form prepares a document in your browser and saves it only when you select
            Download Markdown. Keep the file with your public project until submissions open.
          </aside>
        </div>
      </section>

      <section className="submission-policy-strip">
        <div className="shell">
          <ShieldWarning size={22} weight="thin" aria-hidden="true" />
          <p><strong>Create a new public GitHub repository for the release.</strong> Remove credentials, memories, sessions, local databases, logs, client material, personal addresses, and private instructions before you publish it.</p>
        </div>
      </section>

      <section className="content-section shell">
        <SubmissionPacketBuilder />
      </section>

      <section className="content-section shell submit-next-step">
        <div>
          <Eyebrow>Future Inspection Desk review</Eyebrow>
          <h2 className="section-heading">How the Inspection Desk would check one exact public version</h2>
          <p className="section-deck">The planned scanner would read a fixed, limited set of files without running submitted code. A public report would explain each finding and why it matters. Projects that require technical judgment would remain unpublished while human technical review is unavailable.</p>
        </div>
        <div className="button-row">
          <Link href="/contribute" className="button button-primary">Return to the Submission Desk <ArrowRight size={15} /></Link>
          <Link href="/guides/share-a-sanitized-profile" className="button button-secondary">Read how to prepare a public package</Link>
        </div>
      </section>
    </main>
  );
}
