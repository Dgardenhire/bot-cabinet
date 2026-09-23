"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Prohibit, Warning } from "@phosphor-icons/react";
import { KEEPER_STATUS_API_URL, type KeeperTrustResult, type KeeperTrustStatus, parsePublicKeeperStatus } from "@/lib/keeper-status-live";

const labels: Record<KeeperTrustResult, string> = {
  passed: "Passed",
  attention: "Needs attention",
  late: "Late",
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

  useEffect(() => {
    const controller = new AbortController();
    fetch(KEEPER_STATUS_API_URL, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("status unavailable")))
      .then((value) => {
        const live = parsePublicKeeperStatus(value);
        if (live) setStatus(live);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <div className="keeper-trust-status">
      <div className="keeper-trust-status-head">
        <div><span>Latest approved record</span><strong>{status.publishedAt ? when(status.publishedAt) : "Not connected yet"}</strong></div>
        <p>{status.publishedAt ? `Revision ${status.revision}. This record reports what Keeper found; it does not prove that a Bot is useful or safe for every job.` : "Until an approved Keeper record is published, every automated result below remains unknown."}</p>
      </div>
      <div className="keeper-trust-status-table" role="table" aria-label="Latest approved Keeper checks">
        {status.checks.map((item) => (
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
