"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./site-navigation.module.css";

export const NAV_GROUPS = [
  { label: "Bots & Crews", links: [["Browse Bots", "/bots"], ["Bot Fit Test", "/fit"], ["Bot Workflows", "/use-cases"], ["Crew Kits", "/crew-kits"], ["Community Registry", "/community"]] },
  { label: "Tools", links: [["Bot Lab", "/workshop"], ["My Workbench", "/workbench"], ["Portrait Studio", "/portraits"]] },
  { label: "Guides", links: [["Field Manual", "/guides"], ["Compare Apps", "/compare"], ["Test Records", "/proof"], ["Inspection Desk", "/trust"], ["About Bot Cabinet", "/about"], ["Contribute", "/contribute"]] },
] as const;

export function SiteNavigation({ mobile = false }: { mobile?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) {
        root.current?.querySelectorAll("details[open]").forEach(detail => detail.removeAttribute("open"));
      }
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function closeOnLink(event: React.MouseEvent<HTMLElement>) {
    if (!(event.target as Element).closest("a")) return;
    root.current?.querySelectorAll("details[open]").forEach(detail => detail.removeAttribute("open"));
    if (mobile) root.current?.closest("details")?.removeAttribute("open");
  }
  return <nav ref={root} className={`${mobile ? "" : "desktop-nav"} ${styles.nav} ${mobile ? styles.mobile : ""}`} aria-label={mobile ? "Mobile navigation" : "Primary navigation"}
    onClick={closeOnLink} onKeyDown={event => {
      if (event.key !== "Escape") return;
      const open = root.current?.querySelector<HTMLDetailsElement>("details[open]");
      if (open) { open.removeAttribute("open"); open.querySelector("summary")?.focus(); }
      else if (mobile) { const outer = root.current?.closest("details"); outer?.removeAttribute("open"); outer?.querySelector("summary")?.focus(); }
    }}>
    <Link href="/start">Start Here</Link>
    {NAV_GROUPS.map(group => <details key={group.label} className={styles.group} name={mobile ? "mobile-sections" : "desktop-sections"}>
      <summary>{group.label}</summary>
      <div className={styles.links}>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
    </details>)}
    <Link href="/watch">Agent Watch</Link>
  </nav>;
}
