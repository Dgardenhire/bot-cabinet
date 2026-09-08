"use client";

import { useState } from "react";
import styles from "./crew-setup-progress.module.css";

export function CrewSetupProgress({ members, steps }: {
  members: { slug: string; name: string }[];
  steps: readonly string[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const finalSteps = ["A person approved each handoff", "Schedules remain inactive", "A person reviewed the final deliverable"];
  const total = members.length * steps.length + finalSteps.length;
  const complete = Object.values(checked).filter(Boolean).length;
  function checkbox(id: string, label: string) {
    return <label key={id} className={styles.item}><input type="checkbox" checked={!!checked[id]} onChange={event => setChecked(previous => ({ ...previous, [id]: event.target.checked }))} /><span>{label}</span></label>;
  }
  return <div className={styles.panel}>
    <p role="status"><strong>{complete} of {total} checkpoints recorded</strong></p>
    <p>These are your confirmations, not automated verification. Progress lasts for this visit; use the downloadable checklist to keep a permanent record.</p>
    <progress max={total} value={complete} aria-label="Crew setup progress" className={styles.progress} />
    <div className={styles.grid}>{members.map(member => <fieldset key={member.slug} className={styles.member}><legend>{member.name}</legend>{steps.map((step, i) => checkbox(`${member.slug}:${i}`, step))}</fieldset>)}</div>
    <fieldset className={styles.member}><legend>One manual crew cycle</legend>{finalSteps.map((step, i) => checkbox(`crew:${i}`, step))}</fieldset>
  </div>;
}
