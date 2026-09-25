"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  BOT_CHECKPOINT_IDS,
  BOT_MAX_RECORDED_RUNS,
  BOT_RUN_CHECKPOINT_IDS,
  BOT_SETUP_CHECKPOINT_IDS,
  readBotProgress,
} from "@/lib/bot-progress";
import { summarizeBotWorkbench, workbenchNextAction, type WorkbenchSummary } from "@/lib/workbench-hub";
import styles from "./workbench-hub.module.css";

export type WorkbenchBot = {
  slug: string;
  name: string;
  title: string;
  packVersion: string;
};

type ActiveWorkbench = WorkbenchBot & { summary: WorkbenchSummary };

export function WorkbenchHub({ bots }: { bots: readonly WorkbenchBot[] }) {
  const [active, setActive] = useState<ActiveWorkbench[]>([]);
  const [ready, setReady] = useState(false);

  const restore = useCallback(() => {
    const restored = bots.map(bot => ({
      ...bot,
      summary: summarizeBotWorkbench(readBotProgress(window.localStorage, bot.slug, bot.packVersion, BOT_CHECKPOINT_IDS)),
    })).filter(bot => bot.summary.active).sort((a, b) => (
      b.summary.lastReportedAt - a.summary.lastReportedAt || a.name.localeCompare(b.name)
    ));
    setActive(restored);
    setReady(true);
  }, [bots]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(restore);
    window.addEventListener("focus", restore);
    window.addEventListener("storage", restore);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", restore);
      window.removeEventListener("storage", restore);
    };
  }, [restore]);

  if (!ready) return <p className={styles.loading} role="status">Loading this browser’s Bot workbench…</p>;

  if (!active.length) return (
    <div className={styles.empty}>
      <h2>No active Bots in this browser yet</h2>
      <p>Start a Bot’s guided workbench and it will appear here. No account is required, and progress does not leave this browser.</p>
      <div className="button-row">
        <Link href="/start" className="button button-primary">Run your first Bot</Link>
        <Link href="/bots" className="button button-secondary">Browse The Cabinet</Link>
      </div>
    </div>
  );

  return (
    <div className={styles.list} aria-label="Active Bot workbenches">
      {active.map(bot => (
        <article className={styles.card} key={bot.slug}>
          <div className={styles.cardHeading}>
            <div><span>Pack {bot.packVersion}</span><h2>{bot.name}</h2><p>{bot.title}</p></div>
            <strong>{workbenchNextAction(bot.summary)}</strong>
          </div>
          <dl className={styles.metrics}>
            <div><dt>One-time setup</dt><dd>{bot.summary.setupCompleted}/{BOT_SETUP_CHECKPOINT_IDS.length}</dd></div>
            <div><dt>Current run checks</dt><dd>{bot.summary.runChecksCompleted}/{BOT_RUN_CHECKPOINT_IDS.length}</dd></div>
            <div><dt>Recorded outcomes</dt><dd>{bot.summary.outcomesCompleted}/{BOT_MAX_RECORDED_RUNS}</dd></div>
          </dl>
          {bot.summary.lastOutcome ? <p className={styles.lastOutcome}>Latest recorded outcome: <strong>{bot.summary.lastOutcome === "useful" ? "useful" : "needed another pass"}</strong></p> : null}
          <Link href={`/bots/${bot.slug}/#bot-workbench`} className={styles.continue} data-funnel-event="bot_workbench_resume" data-funnel-surface="workbench_hub" data-funnel-destination={bot.slug}>Continue {bot.name}</Link>
        </article>
      ))}
    </div>
  );
}
