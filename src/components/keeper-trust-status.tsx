"use client";

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

export function KeeperTrustStatusTable({ fallback }: { fallback: KeeperTrustStatus }) {
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

  const shown = now === null ? status : ageKeeperStatus(status, now);
  const snapshotOld = now !== null && keeperSnapshotIsOld(status, now);

  return (
    <div className="keeper-trust-status">
      <div className="keeper-trust-status-head">
        <div><span>Latest reviewed checks</span><strong>{status.publishedAt ? when(status.publishedAt) : "No results published yet"}</strong></div>
        <p>{!status.publishedAt
          ? "No reviewed Keeper results have been published. The checks below remain unknown."
          : snapshotOld
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
