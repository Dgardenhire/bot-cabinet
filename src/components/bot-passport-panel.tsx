import type { BotPassport } from "@/lib/bot-passport";

export function BotPassportPanel({
  passport,
  downloadHref,
}: {
  passport: BotPassport;
  downloadHref?: string;
}) {
  return (
    <section className="bot-passport" aria-labelledby="bot-passport-heading">
      <div className="bot-passport-heading">
        <div>
          <p>Bot Passport · version {passport.version}</p>
          <h2 id="bot-passport-heading">Access and approval record</h2>
        </div>
        <span className={`passport-risk passport-risk-${passport.riskLevel.toLowerCase()}`}>
          {passport.riskLevel} planned risk
        </span>
      </div>
      <p className="bot-passport-intro">
        Review this record before setup. Update it whenever the Bot&apos;s job,
        tools, accounts, schedule, or authority changes.
      </p>
      <div className="bot-passport-grid">
        <article>
          <span>May read</span>
          <ul>{passport.reads.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article>
          <span>May create</span>
          <ul>{passport.creates.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article>
          <span>May do without approval</span>
          <ul>{passport.mayDoWithoutApproval.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="passport-approval-card">
          <span>Must ask first</span>
          <ul>{passport.mustAsk.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="passport-prohibited-card">
          <span>Prohibited actions</span>
          <ul>{passport.prohibited.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>
      <div className="bot-passport-controls">
        <div>
          <strong>Requested capabilities</strong>
          <p>{passport.requestedCapabilities.join(" · ")}</p>
        </div>
        <div>
          <strong>How to stop it</strong>
          <p>{passport.shutdown}</p>
        </div>
      </div>
      <details className="bot-passport-details">
        <summary>Read the control limits</summary>
        <ul>{passport.controlNotes.map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
      {downloadHref && (
        <a className="text-link" href={downloadHref} download>
          Download this Bot Passport (Markdown)
        </a>
      )}
    </section>
  );
}
