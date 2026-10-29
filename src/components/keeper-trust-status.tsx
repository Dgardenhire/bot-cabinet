"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Prohibit, Warning } from "@phosphor-icons/react";
import { KEEPER_STATUS_API_URL, type KeeperTrustResult, type KeeperTrustStatus, ageKeeperStatus, keeperSnapshotIsOld, parsePublicKeeperStatus } from "@/lib/keeper-status-live";

const labels: Record<KeeperTrustResult, string> = {
  passed: "Passed",
  attention: "Needs attention",
  late: "Out of date",
  "not-running": "Not running",
  "no-record": "No public record",
};

function ResultIcon({ result }: { result: KeeperTrustResult }) {
  if (result === "passed") return <CheckCircle size={20} weight="thin" aria-hidden="true" />;
  if (result === "attention") return <Warning size={20} weight="thin" aria-hidden="true" />;
  if (result === "not-running") return <Prohibit size={20} weight="thin" aria-hidden="true" />;
  return <Clock size={20} weight="thin" aria-hidden="true" />;
}

function when(value: string | null) {
  if (!value) return "No dated record";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC";
}

const RECHECK_AFTER_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Returns why the dated rows are hidden, or null when the newest reviewed snapshot is at most 14 days old and can show
 * as a table. Before scripts run, the caller passes the build time, so the server-rendered page and the loaded page
 * judge the same snapshot the same way.
 */
export function keeperRecheckNotice(status: KeeperTrustStatus, nowMs: number): string | null {
  if (!status.publishedAt) return "No recent reviewed site checks to show.";
  if (nowMs <= Date.parse(status.publishedAt) + RECHECK_AFTER_MS) return null;
  const day = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(status.publishedAt));
  return `The last reviewed site checks, from ${day}, are too old to rely on, so they are hidden.`;
}

export function KeeperTrustStatusTable({ fallback, builtAt }: { fallback: KeeperTrustStatus; builtAt: number }) {
  const [status, setStatus] = useState(fallback);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const frame = window.requestAnimationFrame(() => setNow(Date.now()));
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    fetch(KEEPER_STATUS_API_URL, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("status unavailable")))
      .then((value) => {
        const live = parsePublicKeeperStatus(value);
        if (live) {
          setNow(Date.now());
          setStatus(live);
        }
      })
      .catch(() => undefined);
    return () => { controller.abort(); window.cancelAnimationFrame(frame); window.clearInterval(interval); };
  }, []);

  const notice = keeperRecheckNotice(status, now ?? builtAt);
  const shown = now === null ? status : ageKeeperStatus(status, now);
  const snapshotOld = now !== null && keeperSnapshotIsOld(status, now);

  if (notice) {
    return (
      <div className="keeper-trust-status">
        <div className="keeper-trust-status-head" style={{ borderBottom: 0 }}>
          <div><span>Latest reviewed checks</span><strong>{status.publishedAt ? "Out of date" : "None to show"}</strong></div>
          <p>{notice} Each Bot’s own test record in the <Link href="/proof">Proof Room</Link> shows its date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="keeper-trust-status">
      <div className="keeper-trust-status-head">
        <div><span>Latest reviewed checks</span><strong>{when(status.publishedAt)}</strong></div>
        <p>{snapshotOld
          ? `Revision ${status.revision}. These results are out of date. They cannot confirm whether the site works today or whether Keeper has run more recent checks.`
          : `Revision ${status.revision}. These are Keeper’s check results. They do not establish that every Bot works well or is safe for your task.`}</p>
      </div>
      <div className="keeper-trust-status-table" role="table" aria-label="Latest approved Keeper checks">
        {shown.checks.map((item) => (
          <div className={`keeper-trust-status-row status-${item.result}`} role="row" key={item.key}>
            <div role="cell"><ResultIcon result={item.result} /><strong>{item.label}</strong></div>
            <span role="cell">{labels[item.result]}</span>
            <time role="cell" dateTime={item.lastRun ?? undefined}>{when(item.lastRun)}</time>
          </div>
        ))}
      </div>
    </div>
  );
}
