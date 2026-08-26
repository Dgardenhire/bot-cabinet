"use client";

import { useMemo, useState } from "react";
import { Check, Copy, DownloadSimple, FileText } from "@phosphor-icons/react";

type FormState = {
  repository: string;
  artifactType: string;
  displayName: string;
  capabilities: string;
  credentials: string;
  access: string;
  scheduledBehavior: string;
  dependencies: string;
  testing: string;
};

const initialState: FormState = {
  repository: "",
  artifactType: "Installable Hermes profile package",
  displayName: "",
  capabilities: "",
  credentials: "",
  access: "",
  scheduledBehavior: "",
  dependencies: "",
  testing: "",
};

const fields: { key: keyof FormState; label: string; help: string; placeholder: string; multiline?: boolean }[] = [
  { key: "repository", label: "Public GitHub repository", help: "Use the main repository link. Leave out branch, file, archive, and private links.", placeholder: "https://github.com/OWNER/REPOSITORY" },
  { key: "displayName", label: "Public project name", help: "A project name is enough. Leave out private contact information.", placeholder: "Daily Research Brief" },
  { key: "capabilities", label: "What the project does", help: "Describe current behavior separately from ideas for later versions.", placeholder: "Summarizes documents selected by the user and returns citations. Requires a person to approve file changes and messages.", multiline: true },
  { key: "credentials", label: "Accounts and outside services", help: "Name required accounts or variable names. Never include credential values. Write “None” when the project needs none.", placeholder: "OPENAI_API_KEY for model access; optional SERPAPI_KEY for search. Credential values are stored by the user.", multiline: true },
  { key: "access", label: "Files, tools, and actions", help: "List file reading or writing, terminal commands, browser use, uploads, messages, purchases, and deletions.", placeholder: "Reads files selected by the user and visits approved websites. A person must approve file changes and account actions.", multiline: true },
  { key: "scheduledBehavior", label: "Schedules and automatic runs", help: "List every schedule, startup action, stop condition, and approval point.", placeholder: "None.", multiline: true },
  { key: "dependencies", label: "Extra software and setup", help: "List packages, scripts, build steps, applications, containers, and extra commands.", placeholder: "None beyond a current Hermes Desktop installation.", multiline: true },
  { key: "testing", label: "Tests completed by the publisher (optional)", help: "Record only tests that happened: Hermes version, computer system, date, steps, and result.", placeholder: "Hermes v0.20.5; macOS; 2026-08-25; installed in a disposable profile and completed the documented first task.", multiline: true },
];

const attestationLabels = [
  "I publish this repository or have the publisher’s permission to submit it.",
  "I removed secrets, credentials, personal data, private client material, memories, sessions, local databases, logs, and local machine paths from the current commit.",
  "I consent to an automated public source scan and a public report.",
  "I understand that an earlier report does not cover a later commit.",
];

function makePacket(form: FormState, attestations: boolean[]) {
  return `# Bot Cabinet — Hermes Bot Registry submission packet

## Public GitHub repository
${form.repository || "_Not provided_"}

## Project type
${form.artifactType}

## Public display name
${form.displayName || "_Not provided_"}

## What the project does
${form.capabilities || "_Not provided_"}

## Accounts and outside services
${form.credentials || "_Not provided_"}

## Files, tools, and actions
${form.access || "_Not provided_"}

## Schedules and automatic runs
${form.scheduledBehavior || "_Not provided_"}

## Extra software and setup
${form.dependencies || "_Not provided_"}

## Tests completed by the publisher
${form.testing || "_No testing claimed_"}

## Required attestations
${attestationLabels.map((label, index) => `- [${attestations[index] ? "x" : " "}] ${label}`).join("\n")}
`;
}

export function SubmissionPacketBuilder() {
  const [form, setForm] = useState(initialState);
  const [attestations, setAttestations] = useState([false, false, false, false]);
  const [status, setStatus] = useState("");
  const packet = useMemo(() => makePacket(form, attestations), [form, attestations]);
  const complete = Boolean(
    form.repository.trim() &&
    form.displayName.trim() &&
    form.capabilities.trim() &&
    form.credentials.trim() &&
    form.access.trim() &&
    form.scheduledBehavior.trim() &&
    form.dependencies.trim() &&
    attestations.every(Boolean),
  );

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus("");
  }

  async function copyPacket() {
    await navigator.clipboard.writeText(packet);
    setStatus("Packet copied. Nothing was submitted.");
  }

  function downloadPacket() {
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bot-cabinet-submission.md";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Markdown downloaded. Nothing was submitted.");
  }

  return (
    <div className="submission-builder">
      <form className="submission-form" onSubmit={(event) => event.preventDefault()}>
        <div className="submission-form-heading">
          <FileText size={27} weight="thin" aria-hidden="true" />
          <div><h2>Submission packet</h2><p>Your answers stay in this browser until you copy or download them. The progress label shows whether every required field and box is complete.</p></div>
          <span className={complete ? "complete" : ""}>{complete ? "Fields and boxes filled" : "Draft"}</span>
        </div>

        <label className="submission-field">
          <span>Project type</span>
          <small>The first option needs <code>distribution.yaml</code> at the top level. That file tells Hermes which profile files belong to the package.</small>
          <select value={form.artifactType} onChange={(event) => update("artifactType", event.target.value)}>
            <option>Installable Hermes profile package</option>
            <option>Profile collection or starter kit</option>
            <option>Example workflow or educational guide</option>
          </select>
        </label>

        {fields.map((field) => (
          <label className="submission-field" key={field.key}>
            <span>{field.label}</span>
            <small>{field.help}</small>
            {field.multiline ? (
              <textarea rows={4} value={form[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} />
            ) : (
              <input value={form[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} />
            )}
          </label>
        ))}

        <fieldset className="submission-attestations">
          <legend>Statements required when public submissions open</legend>
          {attestationLabels.map((label, index) => (
            <label key={label}>
              <input type="checkbox" checked={attestations[index]} onChange={(event) => setAttestations((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} />
              <span className="submission-checkmark"><Check size={13} weight="bold" /></span>
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <div className="submission-actions">
          <button type="button" className="button button-primary" onClick={copyPacket}><Copy size={16} /> Copy packet</button>
          <button type="button" className="button button-secondary" onClick={downloadPacket}><DownloadSimple size={16} /> Download Markdown</button>
          <p aria-live="polite">{status || "This prepares a packet. It does not submit or scan your repository."}</p>
        </div>
      </form>

      <aside className="submission-preview">
        <div className="submission-preview-topline"><span>Live preview</span><span>{complete ? "Fields and boxes filled" : "Fields or boxes still empty"}</span></div>
        <pre>{packet}</pre>
      </aside>
    </div>
  );
}
