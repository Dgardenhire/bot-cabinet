"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui";
import { loadStarterPack, requestStarterPack, PackAccessError, type StarterPack } from "@/lib/starter-pack-access";
import { forgetPackSession, readPackSession, rememberPackSession } from "@/lib/starter-pack-session";
import { StarterPackContent } from "./pack-content";
import styles from "./pack.module.css";
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
  return <main id="main-content" data-starter-pack className={`page-main ${styles.page}`}>
    <section className="inner-hero"><div className={`shell ${styles.intro}`}>
      <Eyebrow>Free with Open Source</Eyebrow><h1 className="inner-title">10 Bots you can set up tonight</h1>
      <p className="inner-deck">Get ten practical Bot setups with starter prompts, a first task to try, and guardrails for using them. Subscribe to Open Source to receive your access link.</p>
      <p>Open Source is Damon Gardenhire&apos;s weekly newsletter. One email on Mondays. Unsubscribe anytime.</p>
      <p>Already subscribed? Use your gift link, or request a fresh access link here. You won&apos;t be added twice.</p>
      {error && <p role="alert">{error}</p>}
      {state === "opening" ? <p role="status">Opening your starter pack…</p> : state === "sent" ? <div role="status" className={styles.notice}><strong>Check your inbox for your access link.</strong><p>If you already subscribe, the link opens your pack without another signup.</p></div> : <form className={styles.signup} onSubmit={async event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setState("sending"); setError("");
        try { await requestStarterPack(String(values.get("email") || ""), String(values.get("name") || "")); setState("sent"); }
        catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); setState("idle"); }
      }}>
        <label htmlFor="pack-email">Email address</label><input id="pack-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        <label htmlFor="pack-name">First name (optional)</label><input id="pack-name" name="name" autoComplete="given-name" maxLength={100} />
        <p>By requesting the pack, you agree to subscribe to Open Source. Your email and optional name are used for the existing newsletter and pack delivery. <a href="https://ai-seminar.linchpin.studio/open-source">About Open Source</a></p>
        <button className="button button-primary" disabled={state === "sending"} type="submit">{state === "sending" ? "Requesting your link…" : "Subscribe and get the starter pack"}</button>
      </form>}
      <p><Link href="/use-cases">Browse practical Bot ideas</Link> while your pack arrives.</p>
    </div></section>
  </main>;
}
