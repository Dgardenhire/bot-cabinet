"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStarterPack, requestStarterPack, PackAccessError, type StarterPack } from "@/lib/starter-pack-access";
import { forgetPackSession, readPackSession, rememberPackSession } from "@/lib/starter-pack-session";
import { StarterPackContent } from "./pack-content";
import styles from "./pack.module.css";
import document from "./document.module.css";
export function PackAccess() {
  const [pack, setPack] = useState<StarterPack | null>(null);
  const [state, setState] = useState<"idle" | "opening" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Private browser settings may disable storage. */ }
    let expiryTimer: number | undefined;
    const openLink = (event?: HashChangeEvent) => {
      const incoming = new URLSearchParams(window.location.hash.slice(1)).get("access");
      if (event && !incoming) return; // Ordinary guide anchors must not reopen access.
      const session = readPackSession(storage);
      const token = incoming || session?.token;
      if (!token) return;
      if (incoming) window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setPack(null); setError(""); setState("opening");
      loadStarterPack(token).then(value => {
        // Remember only server-validated access, for this tab and a fixed 30 minutes.
        const expiresAt = incoming ? rememberPackSession(token, storage) : session?.expiresAt;
        if (expiryTimer !== undefined) window.clearTimeout(expiryTimer);
        if (expiresAt !== undefined) expiryTimer = window.setTimeout(() => forgetPackSession(storage), Math.max(0, expiresAt - Date.now()));
        setPack(value); setState("idle");
      }).catch(reason => {
        if (reason instanceof PackAccessError && (reason.status === 401 || reason.status === 403)) forgetPackSession(storage);
        setError(reason instanceof Error ? reason.message : "Your pack couldn’t load."); setState("idle");
      });
    };
    openLink();
    window.addEventListener("hashchange", openLink);
    return () => { window.removeEventListener("hashchange", openLink); if (expiryTimer !== undefined) window.clearTimeout(expiryTimer); };
  }, []);
  if (pack) return <StarterPackContent pack={pack} onClose={() => {
    try { forgetPackSession(window.sessionStorage); } catch { /* Storage may be unavailable. */ }
    setPack(null); setError(""); setState("idle"); window.scrollTo(0, 0);
  }} />;
  return <main id="main-content" data-starter-pack data-pack-offer className={document.document}>
    <div className={document.shell}>
      <header className={document.cover}>
        <div className={document.brand}><span className={document.doors} aria-hidden="true" />Bot Cabinet · Starter pack</div>
        <h1>10 Bots you can set up <em>tonight</em></h1>
        <p className={document.lede}>Ten small, useful Bots for the jobs that pile up every week. Each setup comes with a starter prompt, a first task to try, and plain rules for what it should never do on its own.</p>
        <p className={document.lede}>Start with the AI app you already use. Get the free pack when you subscribe to Open Source, Damon Gardenhire&apos;s weekly newsletter.</p>
        <div className={document["platforms-row"]}>{["Grok Bot", "Hermes Agent", "ChatGPT", "Claude", "Free with Open Source"].map(name => <span className={document.chip} key={name}>{name}</span>)}</div>
      </header>
      <section className={`${document.section} ${styles.offer}`} aria-labelledby="pack-access-heading">
        <div className={styles.offerNotes}>
          <p className={document.eyebrow}>One useful job at a time</p><h2>Pick a Bot.<br />Try one real task.</h2>
          <ol className={styles.steps}><li><strong>Choose what bugs you every week.</strong><span>The inbox, the receipts, the Sunday-night schedule.</span></li><li><strong>Copy the starter prompt.</strong><span>Use safe inputs in the app you already have.</span></li><li><strong>Check the first result yourself.</strong><span>Keep approval for anything that sends, pays, deletes, or signs.</span></li></ol>
          <div className={styles.scope}><h3>What has been checked</h3><p>Synthetic sample outputs were checked in native Codex. App connections, scheduling, and compatibility across apps still need checking. Each guide explains its limits.</p></div>
        </div>
        <div className={styles.accessCard}>
          <p className={document.eyebrow}>Free with Open Source</p><h2 id="pack-access-heading">Get your starter pack</h2>
          <p>One email on Mondays. Unsubscribe anytime.</p>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          {state === "opening" ? <p role="status" className={styles.notice}>Opening your starter pack…</p> : state === "sent" ? <div role="status" className={styles.notice}><strong>Check your inbox for your access link.</strong><p>If you already subscribe, the link opens your pack without another signup.</p></div> : <form className={styles.signup} onSubmit={async event => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            setState("sending"); setError("");
            try { await requestStarterPack(String(values.get("email") || ""), String(values.get("name") || "")); setState("sent"); }
            catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); setState("idle"); }
          }}>
            <label htmlFor="pack-email">Email address</label><input id="pack-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
            <label htmlFor="pack-name">First name <span>(optional)</span></label><input id="pack-name" name="name" autoComplete="given-name" maxLength={100} />
            <button className="button button-primary" disabled={state === "sending"} type="submit">{state === "sending" ? "Requesting your link…" : "Subscribe and get the starter pack"}</button>
            <p className={styles.consent}>By requesting the pack, you subscribe to Open Source. Your email and optional name are used for newsletter and pack delivery. <a href="https://ai-seminar.linchpin.studio/open-source">About Open Source</a></p>
          </form>}
          <p className={styles.existing}>Already subscribed? Open your gift link or use this form for a fresh one. You won&apos;t be added twice.</p>
        </div>
      </section>
      <section className={`${document.section} ${styles.preview}`} aria-labelledby="pack-preview-heading">
        <p className={document.eyebrow}>Inside your pack</p><h2 id="pack-preview-heading">Ten everyday jobs. A place to start.</h2>
        <ol>{["Inbox triage", "Subscription audit", "Unclaimed property search", "Meeting follow-up drafts", "Weekly family planning", "Price-drop watching", "Research briefs", "Receipt and expense tracking", "Morning news briefing", "Job or apartment alerts"].map((title, index) => <li key={title}><span className={styles.previewNumber}>{String(index + 1).padStart(2, "0")}</span><span>{title}</span></li>)}</ol>
        <div className={styles.included}>{["Copy-paste starter prompts", "One first task to try", "Tools and inputs to prepare", "Human approval and limits"].map(item => <span key={item}>{item}</span>)}</div>
      </section>
      <footer className={document.footer}><p>Browse <Link href="/use-cases">practical Bot ideas</Link> while your pack arrives.</p><p>Bot Cabinet is free and independent. App features and plans vary; setup times are estimates.</p></footer>
    </div>
  </main>;
}
