"use client";

import {
  ArrowSquareOut,
  Blueprint,
  Broom,
  CheckCircle,
  Copy,
  FilePdf,
  FileText,
  FloppyDisk,
  LockKey,
  MagicWand,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  EMPTY_WORKSHOP_DRAFT,
  WORKSHOP_STORAGE_KEY,
  applyWorkshopStarterSuggestions,
  blueprintFileName,
  blueprintPdfFileName,
  blueprintToRoleInstructions,
  blueprintToMarkdown,
  buildBotBlueprint,
  coerceWorkshopDraft,
  isBlueprintComplete,
  type WorkshopFieldKey,
  type WorkshopProfileFieldKey,
  type WorkshopRefinementFieldKey,
  type WorkshopDraft,
} from "@/lib/workshop";
import {
  WorkshopAiError,
  applyWorkshopAiSuggestions,
  generateWorkshopAiSuggestions,
  getBotBlueprintApiUrl,
  getEmptyWorkshopAiSuggestionKeys,
} from "@/lib/workshop-ai";
import { getStarterBot } from "@/data/starter-bots";
import { WorkshopLiveDrawing } from "@/components/workshop-live-drawing";

type FieldDefinition = {
  key: WorkshopFieldKey;
  label: string;
  hint: string;
  placeholder: string;
  rows: number;
};

const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: "botName",
    label: "Bot name",
    hint: "A short working name. You can change it in Hermes Desktop.",
    placeholder: "For example: Morning Briefing",
    rows: 1,
  },
  {
    key: "jobOutcome",
    label: "Job and outcome",
    hint: "Describe the recurring job and what finished, useful work looks like.",
    placeholder:
      "Turn approved source material into a concise morning brief with citations and open questions.",
    rows: 4,
  },
  {
    key: "inputsContext",
    label: "Information and rules",
    hint: "List one source, document, rule, or piece of background information per line.",
    placeholder: "Approved source list\nHouse style guide\nYesterday’s brief",
    rows: 4,
  },
  {
    key: "outputsDeliverables",
    label: "What it should produce",
    hint: "List the files or responses you want the Bot to return, one per line.",
    placeholder: "Five-item briefing\nLinked source list\nOpen questions",
    rows: 4,
  },
  {
    key: "cadenceTrigger",
    label: "When it should run",
    hint: "Describe when a person should start the work or when a future schedule could run it. Set up any schedule later in Hermes Desktop.",
    placeholder: "Weekdays after I provide the day’s approved materials.",
    rows: 3,
  },
  {
    key: "toolsIntegrations",
    label: "Tools and outside services",
    hint: "List only the tools, accounts, or outside services this job needs, one per line.",
    placeholder: "Web research\nRead-only document access",
    rows: 4,
  },
  {
    key: "approvalBoundaries",
    label: "When it must ask you",
    hint: "List each action or decision that requires a person's approval.",
    placeholder:
      "Ask before contacting anyone\nDo not publish or change source files without approval",
    rows: 4,
  },
  {
    key: "firstRunTest",
    label: "First test",
    hint: "Choose a small task with a result you can inspect before adding private information or more access.",
    placeholder:
      "Use three supplied articles to produce a draft brief with linked sources. Make no external changes.",
    rows: 4,
  },
];

type RefinementFieldDefinition = Omit<FieldDefinition, "key"> & {
  key: WorkshopRefinementFieldKey;
};

const REFINEMENT_FIELD_DEFINITIONS: RefinementFieldDefinition[] = [
  {
    key: "audienceSuccess",
    label: "Who is this for, and what makes the result useful?",
    hint: "Name the person who will use the result and the standard they will apply.",
    placeholder:
      "For example: The owner reads it before the morning meeting. It should be accurate, concise, and easy to scan in five minutes.",
    rows: 4,
  },
  {
    key: "accessSensitive",
    label: "What may it access, and what information is sensitive?",
    hint: "Name exact files, folders, accounts, or services. Identify private or sensitive material.",
    placeholder:
      "Read-only access to the approved research folder. Client names and financial figures are sensitive and should stay in that folder.",
    rows: 4,
  },
  {
    key: "prohibitedUncertainty",
    label: "What must it never do, and what should it do when unsure?",
    hint: "Separate prohibited actions from decisions that require a question.",
    placeholder:
      "Never publish, send messages, or edit source files. If a fact is unclear, identify the gap and ask before continuing.",
    rows: 4,
  },
  {
    key: "continuityMemory",
    label: "What should continue across conversations?",
    hint: "Describe useful memory, recurring routines, and any work with other Bots.",
    placeholder:
      "Remember the preferred briefing format and previously rejected topics. A future weekday routine may prepare the draft. The Editor Bot reviews it before use.",
    rows: 4,
  },
  {
    key: "reviewCriteria",
    label: "Who reviews the first test, and what should they check?",
    hint: "Name the reviewer or role and the conditions for passing the test.",
    placeholder:
      "The owner reviews every source link, confirms all five sections are present, and checks that no outside action occurred.",
    rows: 4,
  },
];

type ProfileFieldDefinition = Omit<FieldDefinition, "key"> & {
  key: WorkshopProfileFieldKey;
};

const PROFILE_FIELD_DEFINITIONS: ProfileFieldDefinition[] = [
  {
    key: "profileTitle",
    label: "Title shown in Hermes",
    hint: "Leave this blank to use the title created from the job and outcome.",
    placeholder: "For example: Prepares a concise briefing from approved sources",
    rows: 1,
  },
  {
    key: "profileDescription",
    label: "Description shown in Hermes",
    hint: "Leave this blank to use the generated description.",
    placeholder: "A short description that helps you recognize the Bot in the roster.",
    rows: 3,
  },
  {
    key: "roleInstructions",
    label: "Permanent role instructions",
    hint: "Leave this blank to create role instructions from the Blueprint. Add or replace the text when the Bot needs more specific standing instructions.",
    placeholder: "Standing instructions that should apply throughout the Bot’s continuing conversation.",
    rows: 8,
  },
];

type SaveState = "loading" | "saving" | "saved" | "unavailable";
type CopyState = "idle" | "copied" | "error";
type PdfState = "idle" | "preparing" | "downloaded" | "error";
type AssistantState = "idle" | "loading";

function BlueprintList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (!items.length) {
    return <p className="blueprint-empty-value">{emptyLabel}</p>;
  }

  return (
    <ul className="blueprint-value-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function copyTextFallback(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function downloadBlob(blob: Blob, fileName: string, openInNewTab = false) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  if (openInNewTab) {
    anchor.target = "_blank";
    anchor.rel = "noopener";
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function WorkshopBuilder() {
  const [draft, setDraftState] = useState<WorkshopDraft>({
    ...EMPTY_WORKSHOP_DRAFT,
  });
  const draftRef = useRef(draft);
  const aiRequestId = useRef(0);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [assistantMessage, setAssistantMessage] = useState("");
  const aiEndpoint = getBotBlueprintApiUrl();
  const aiAvailable = Boolean(aiEndpoint);
  const emptyAiFields = getEmptyWorkshopAiSuggestionKeys(draft);

  const setDraft = useCallback((
    update: WorkshopDraft | ((current: WorkshopDraft) => WorkshopDraft),
  ) => {
    setDraftState((current) => {
      const next = typeof update === "function" ? update(current) : update;
      draftRef.current = next;
      return next;
    });
  }, []);

  const blueprint = useMemo(() => buildBotBlueprint(draft), [draft]);
  const roleInstructions = useMemo(
    () => blueprintToRoleInstructions(blueprint),
    [blueprint],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const starterSlug = new URLSearchParams(window.location.search).get("starter");
        const starter = starterSlug ? getStarterBot(starterSlug) : undefined;
        const stored = window.localStorage.getItem(WORKSHOP_STORAGE_KEY);
        if (starter) {
          setDraft({
            ...starter.workshopDraft,
            profileTitle: "",
            profileDescription: "",
            roleInstructions: "",
          });
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.delete("starter");
          window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        } else if (stored) {
          const restored = coerceWorkshopDraft(JSON.parse(stored));
          if (restored) setDraft(restored);
        }
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      } finally {
        setReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [setDraft]);

  useEffect(() => {
    if (!ready) return;

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(WORKSHOP_STORAGE_KEY, JSON.stringify(draft));
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [draft, ready]);

  function updateField(
    key: WorkshopFieldKey | WorkshopRefinementFieldKey | WorkshopProfileFieldKey,
    value: string,
  ) {
    if (
      assistantState === "loading" &&
      (key === "botName" || key === "jobOutcome")
    ) {
      aiRequestId.current += 1;
      setAssistantState("idle");
      setAssistantMessage(
        "The Bot name or job changed. Choose AI suggestions again when ready.",
      );
    }
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setSaveState("saving");
    setCopyState("idle");
    setPdfState("idle");
  }

  function resetDraft() {
    const hasContent = Object.values(draft).some(
      (value) => typeof value === "string" && value.trim(),
    );
    if (
      hasContent &&
      !window.confirm("Clear every field in this browser-local Bot Lab draft?")
    ) {
      return;
    }

    aiRequestId.current += 1;
    setDraft({ ...EMPTY_WORKSHOP_DRAFT });
    setCopyState("idle");
    setPdfState("idle");
    setAssistantState("idle");
    setAssistantMessage("");
    try {
      window.localStorage.removeItem(WORKSHOP_STORAGE_KEY);
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    }
  }

  function useBasicTemplate() {
    if (!draft.jobOutcome.trim()) return;
    const result = applyWorkshopStarterSuggestions(draft);
    if (!result.filled.length) {
      setAssistantMessage("Every field covered by the basic template already has text.");
      return;
    }

    setDraft(result.draft);
    setSaveState("saving");
    setCopyState("idle");
    setPdfState("idle");
    setAssistantMessage(
      `Added ${result.filled.length} editable suggestions from the ${result.pattern} basic template. Review each one before export.`,
    );
  }

  async function createAiSuggestions() {
    if (
      assistantState === "loading" ||
      !aiEndpoint ||
      !draft.botName.trim() ||
      draft.jobOutcome.trim().length < 3 ||
      emptyAiFields.length === 0
    ) {
      if (emptyAiFields.length === 0) {
        setAssistantMessage("Every AI planning field already has text.");
      }
      return;
    }

    const requestId = aiRequestId.current + 1;
    aiRequestId.current = requestId;
    setAssistantState("loading");
    setAssistantMessage("Creating suggestions with AI…");
    try {
      const suggestions = await generateWorkshopAiSuggestions(
        { botName: draft.botName, jobOutcome: draft.jobOutcome },
        { endpoint: aiEndpoint },
      );
      if (aiRequestId.current !== requestId) return;

      const result = applyWorkshopAiSuggestions(draftRef.current, suggestions);
      setDraft(result.draft);
      setSaveState("saving");
      setCopyState("idle");
      setPdfState("idle");
      setAssistantMessage(
        result.filled.length > 0
          ? `Added ${result.filled.length} AI suggestion${result.filled.length === 1 ? "" : "s"} to empty fields. Review and edit them before export.`
          : "Every AI planning field already has text.",
      );
    } catch (error) {
      if (aiRequestId.current !== requestId) return;
      if (error instanceof WorkshopAiError && error.code === "rate-limited") {
        setAssistantMessage(
          "The AI suggestion limit has been reached for today. You can use the basic template.",
        );
      } else if (
        error instanceof WorkshopAiError &&
        error.code === "invalid-input"
      ) {
        setAssistantMessage(
          "Enter a Bot name and a job description of up to 2,000 characters.",
        );
      } else {
        setAssistantMessage(
          "AI suggestions could not be created. You can use the basic template or complete the plan yourself.",
        );
      }
    } finally {
      if (aiRequestId.current === requestId) setAssistantState("idle");
    }
  }

  async function copyRoleInstructions() {
    try {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(roleInstructions);
          copied = true;
        } catch {
          copied = false;
        }
      }
      if (!copied) copied = copyTextFallback(roleInstructions);
      if (!copied) {
        throw new Error("Clipboard unavailable");
      }
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function downloadMarkdown() {
    if (!isBlueprintComplete(blueprint)) return;
    const markdown = blueprintToMarkdown(blueprint);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    downloadBlob(blob, blueprintFileName(blueprint));
  }

  async function downloadPdf() {
    if (!isBlueprintComplete(blueprint) || pdfState === "preparing") return;

    setPdfState("preparing");
    try {
      const [{ pdf }, { WorkshopBlueprintPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/workshop-blueprint-pdf"),
      ]);
      const blob = await pdf(
        <WorkshopBlueprintPdf
          blueprint={blueprint}
          generatedAt={new Date().toISOString()}
          coverImageSrc={new URL(
            "/atelier/bot-blueprint-cover-v1.png",
            window.location.origin,
          ).toString()}
          wordmarkImageSrc={new URL(
            "/brand/bot-cabinet-wordmark-dark-v1.png",
            window.location.origin,
          ).toString()}
        />,
      ).toBlob();

      downloadBlob(blob, blueprintPdfFileName(blueprint), true);
      setPdfState("downloaded");
    } catch {
      setPdfState("error");
    }
  }

  const saveLabel =
    saveState === "loading"
      ? "Checking this browser…"
      : saveState === "saving"
        ? "Saving locally…"
        : saveState === "saved"
          ? "Saved in this browser"
          : "Local save unavailable";
  const complete = isBlueprintComplete(blueprint);
  const downloadStatus = !complete
    ? `Complete all eight fields to download the Blueprint. Remaining: ${blueprint.missingFields.join(", ")}.`
    : pdfState === "preparing"
      ? "Preparing the designed PDF in this browser…"
      : pdfState === "error"
        ? "The PDF could not be created. Your draft is still saved in this browser, and the Markdown download remains available."
        : pdfState === "downloaded"
          ? "The PDF has been prepared. Your browser may save it or open a preview."
          : copyState === "copied"
            ? "The role instructions are on your clipboard."
            : copyState === "error"
              ? "Clipboard access failed. Open the text below and copy it manually."
              : "Download the designed PDF and matching Markdown file, or copy the role instructions into Hermes Desktop.";

  return (
    <section className="workshop-builder" aria-labelledby="workshop-builder-heading">
      <div className="workshop-privacy-strip">
        <LockKey size={18} weight="regular" aria-hidden="true" />
        <p>
          <strong>Your draft saves in this browser.</strong> If you choose AI
          suggestions, Bot Lab sends only the Bot name and job description to
          Anthropic through Bot Cabinet&apos;s server function. Keep private or
          sensitive information out of those two fields.
        </p>
      </div>

      <div className="workshop-builder-layout">
        <div className="workshop-drafting-bench">
          <header className="workshop-panel-heading">
            <div>
              <p className="workshop-panel-kicker">Your Bot plan</p>
              <h2 id="workshop-builder-heading">Define the Bot’s job</h2>
            </div>
            <div className="workshop-save-status" aria-live="polite">
              <FloppyDisk size={16} weight="regular" aria-hidden="true" />
              <span>{saveLabel}</span>
            </div>
          </header>

          <div className="workshop-progress-wrap">
            <div className="workshop-progress-copy">
              <span>Plan progress</span>
              <span>
                {blueprint.completedFields}/{blueprint.totalFields}
              </span>
            </div>
            <progress
              className="workshop-progress"
              value={blueprint.completedFields}
              max={blueprint.totalFields}
              aria-label={`${blueprint.completedFields} of ${blueprint.totalFields} Bot Lab fields filled`}
            />
          </div>

          <div className="workshop-fields">
            {FIELD_DEFINITIONS.map((field, index) => {
              const id = `workshop-${field.key}`;
              const hintId = `${id}-hint`;
              const sharedProps = {
                id,
                name: field.key,
                value: draft[field.key],
                placeholder: field.placeholder,
                onChange: (
                  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                ) => updateField(field.key, event.target.value),
                "aria-describedby": hintId,
                autoComplete: "off",
                spellCheck: true,
              };

              return (
                <Fragment key={field.key}>
                <div className="workshop-field">
                  <div className="workshop-field-heading">
                    <span className="workshop-field-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <label htmlFor={id}>{field.label}</label>
                      <p id={hintId}>{field.hint}</p>
                    </div>
                  </div>
                  {field.rows === 1 ? (
                    <input {...sharedProps} type="text" maxLength={100} />
                  ) : (
                    <textarea
                      {...sharedProps}
                      rows={field.rows}
                      maxLength={field.key === "jobOutcome" ? 2000 : 3000}
                    />
                  )}
                </div>
                {index === 1 && (
                  <section className="workshop-assistant" aria-labelledby="workshop-assistant-heading">
                    <div className="workshop-assistant-icon" aria-hidden="true">
                      <MagicWand size={22} weight="regular" />
                    </div>
                    <div>
                      <p className="workshop-assistant-kicker">Bot Lab Assistant</p>
                      <h3 id="workshop-assistant-heading">Draft the remaining fields</h3>
                      <p>
                        AI can use the Bot name and job description to draft every empty
                        field. It keeps the text you already wrote. Review every suggestion.
                      </p>
                      <div className="workshop-assistant-actions">
                        <button
                          className="workshop-assistant-primary"
                          type="button"
                          onClick={createAiSuggestions}
                          disabled={
                            !aiAvailable ||
                            !draft.botName.trim() ||
                            draft.jobOutcome.trim().length < 3 ||
                            emptyAiFields.length === 0 ||
                            assistantState === "loading"
                          }
                          aria-busy={assistantState === "loading"}
                        >
                          <MagicWand size={16} weight="regular" aria-hidden="true" />
                          {assistantState === "loading"
                            ? "Drafting with AI…"
                            : "Draft empty fields with AI"}
                        </button>
                        <button
                          className="workshop-assistant-secondary"
                          type="button"
                          onClick={useBasicTemplate}
                          disabled={!draft.jobOutcome.trim() || assistantState === "loading"}
                        >
                          Use a basic template
                        </button>
                      </div>
                      <p className="workshop-assistant-status" aria-live="polite">
                        {assistantMessage || (!draft.botName.trim()
                          ? "Enter the Bot name and job description first."
                          : draft.jobOutcome.trim().length < 3
                            ? "Add a little more detail about the job."
                            : aiAvailable
                              ? emptyAiFields.length === 0
                                ? "Every AI planning field already has text."
                                : "Ready to draft suggestions with AI."
                              : "AI generation is turned off in this preview. The basic template remains available.")}
                      </p>
                      <p className="workshop-assistant-privacy">
                        AI suggestions use Anthropic. Read{" "}
                        <a
                          href="https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Anthropic&apos;s API data retention information
                        </a>
                        .
                      </p>
                    </div>
                  </section>
                )}
                </Fragment>
              );
            })}
          </div>

          <details className="workshop-refinement">
            <summary>
              <span>
                <strong>Refine your Blueprint</strong>
                <small>Optional questions for a more complete plan</small>
              </span>
            </summary>
            <div className="workshop-refinement-intro">
              <p>
                Add the people, quality standards, access limits, continuing conversation,
                and test criteria that matter for this Bot.
              </p>
            </div>
            <div className="workshop-fields workshop-refinement-fields">
              {REFINEMENT_FIELD_DEFINITIONS.map((field, index) => {
                const id = `workshop-${field.key}`;
                const hintId = `${id}-hint`;
                return (
                  <div className="workshop-field" key={field.key}>
                    <div className="workshop-field-heading">
                      <span className="workshop-field-number" aria-hidden="true">
                        R{String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <label htmlFor={id}>{field.label}</label>
                        <p id={hintId}>{field.hint}</p>
                      </div>
                    </div>
                    <textarea
                      id={id}
                      name={field.key}
                      value={draft[field.key] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      aria-describedby={hintId}
                      autoComplete="off"
                      spellCheck
                      rows={field.rows}
                      maxLength={3000}
                    />
                  </div>
                );
              })}
            </div>
          </details>

          <details className="workshop-refinement">
            <summary>
              <span>
                <strong>Review the Hermes profile text</strong>
                <small>Optional edits before export</small>
              </span>
            </summary>
            <div className="workshop-refinement-intro">
              <p>
                Bot Lab creates these fields from your answers. Edit them here when you
                want different wording in Hermes Desktop.
              </p>
            </div>
            <div className="workshop-fields workshop-refinement-fields">
              {PROFILE_FIELD_DEFINITIONS.map((field, index) => {
                const id = `workshop-${field.key}`;
                const hintId = `${id}-hint`;
                const value = draft[field.key] ?? "";
                const generatedPlaceholder =
                  field.key === "profileTitle"
                    ? blueprint.profile.title
                    : field.key === "profileDescription"
                      ? blueprint.profile.description
                      : roleInstructions;

                return (
                  <div className="workshop-field" key={field.key}>
                    <div className="workshop-field-heading">
                      <span className="workshop-field-number" aria-hidden="true">
                        P{String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <label htmlFor={id}>{field.label}</label>
                        <p id={hintId}>{field.hint}</p>
                      </div>
                    </div>
                    {field.rows === 1 ? (
                      <input
                        id={id}
                        name={field.key}
                        value={value}
                        placeholder={generatedPlaceholder || field.placeholder}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        aria-describedby={hintId}
                        autoComplete="off"
                        spellCheck
                        type="text"
                        maxLength={180}
                      />
                    ) : (
                      <textarea
                        id={id}
                        name={field.key}
                        value={value}
                        placeholder={generatedPlaceholder || field.placeholder}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        aria-describedby={hintId}
                        autoComplete="off"
                        spellCheck
                        rows={field.rows}
                        maxLength={6000}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </details>

          <div className="workshop-form-actions">
            <button className="workshop-reset-button" type="button" onClick={resetDraft}>
              <Broom size={17} weight="regular" aria-hidden="true" />
              Clear draft
            </button>
            <p>Apply the finished plan in Hermes Desktop.</p>
          </div>
        </div>

        <aside className="blueprint-sheet" aria-labelledby="blueprint-heading">
          <div className="blueprint-grid-field" aria-hidden="true" />
          <span className="blueprint-coordinate blueprint-coordinate-top" aria-hidden="true">
            A–08
          </span>
          <span className="blueprint-coordinate blueprint-coordinate-side" aria-hidden="true">
            BB–01
          </span>

          <header className="blueprint-heading-row">
            <div className="blueprint-mark" aria-hidden="true">
              <Blueprint size={26} weight="regular" />
            </div>
            <div>
              <p className="blueprint-kicker">Your Bot plan</p>
              <h2 id="blueprint-heading">{blueprint.profile.name}</h2>
            </div>
            <span className="blueprint-status">Draft plan</span>
          </header>

          <WorkshopLiveDrawing blueprint={blueprint} />

          <div className="blueprint-profile-block">
            <span className="blueprint-section-code">BOT BASICS</span>
            <dl className="blueprint-profile-specs">
              <div>
                <dt>Name</dt>
                <dd>{blueprint.profile.name}</dd>
              </div>
              <div>
                <dt>Title</dt>
                <dd>{blueprint.profile.title}</dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{blueprint.profile.description}</dd>
              </div>
            </dl>
          </div>

          <div className="blueprint-flow" aria-label="Bot setup plan">
            <section className="blueprint-node blueprint-node-mission">
              <span className="blueprint-section-code">01 / MISSION</span>
              <h3>Job and outcome</h3>
              <p className={blueprint.mission ? "" : "blueprint-empty-value"}>
                {blueprint.mission || "Define the work this bot exists to finish."}
              </p>
            </section>

            <div className="blueprint-connector" aria-hidden="true">
              <span />
            </div>

            <div className="blueprint-node-pair">
              <section className="blueprint-node">
                <span className="blueprint-section-code">02 / INPUTS</span>
                <h3>What it works from</h3>
                <BlueprintList
                  items={blueprint.inputs}
                  emptyLabel="List the context and materials it may use."
                />
              </section>
              <section className="blueprint-node">
                <span className="blueprint-section-code">03 / OUTPUTS</span>
                <h3>What it should produce</h3>
                <BlueprintList
                  items={blueprint.outputs}
                  emptyLabel="List the finished deliverables."
                />
              </section>
            </div>

            <div className="blueprint-connector" aria-hidden="true">
              <span />
            </div>

            <div className="blueprint-node-pair">
              <section className="blueprint-node">
                <span className="blueprint-section-code">04 / WHEN IT RUNS</span>
                <h3>When it begins</h3>
                <p className={blueprint.cadence ? "" : "blueprint-empty-value"}>
                  {blueprint.cadence || "Describe when a person should begin the work or when a future schedule could run it."}
                </p>
              </section>
              <section className="blueprint-node">
                <span className="blueprint-section-code">05 / TOOLS</span>
                <h3>Tools and connections</h3>
                <BlueprintList
                  items={blueprint.tools}
                  emptyLabel="Add only tools or integrations the job needs."
                />
              </section>
            </div>

            <div className="blueprint-connector" aria-hidden="true">
              <span />
            </div>

            <section className="blueprint-node blueprint-node-boundary">
              <span className="blueprint-section-code">06 / HUMAN CONTROL</span>
              <div className="blueprint-node-title-with-icon">
                <ShieldCheck size={19} weight="regular" aria-hidden="true" />
                <h3>When it must ask you</h3>
              </div>
              <BlueprintList
                items={blueprint.approvals}
                emptyLabel="List when the Bot must stop and ask."
              />
            </section>

            <div className="blueprint-connector" aria-hidden="true">
              <span />
            </div>

            <section className="blueprint-node blueprint-node-test">
              <span className="blueprint-section-code">07 / FIRST TEST</span>
              <div className="blueprint-node-title-with-icon">
                <CheckCircle size={19} weight="regular" aria-hidden="true" />
                <h3>First test</h3>
              </div>
              <p className={blueprint.firstRunTest ? "" : "blueprint-empty-value"}>
                {blueprint.firstRunTest || "Choose a small test with a result you can inspect."}
              </p>
            </section>
          </div>

          <section className="blueprint-soul-notes">
            <span className="blueprint-section-code">ROLE INSTRUCTIONS</span>
            <h3>Role instructions for Hermes Desktop</h3>
            <p>{blueprint.soulText}</p>
          </section>

          <section className="blueprint-official-note">
            <p className="blueprint-evidence-label">Available in Hermes Desktop</p>
            <ol>
              <li>Open the Bots tab and choose New Agent.</li>
              <li>Enter the Name, Title, and Description shown above.</li>
              <li>Open Advanced and paste the role instructions into Custom SOUL.md.</li>
              <li>Select only the skills, tools, and outside connections this Bot needs.</li>
              <li>Create the Bot and run the first test with low-risk material.</li>
            </ol>
            <a
              href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode"
              target="_blank"
              rel="noreferrer"
            >
              Read the official Bot Mode guide
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          </section>

          {blueprint.missingFields.length > 0 && (
            <div className="blueprint-missing-note">
              <span>Fields to complete</span>
              <p>{blueprint.missingFields.join(" · ")}</p>
            </div>
          )}

          <div className="blueprint-actions">
            <button
              className="blueprint-primary-action"
              type="button"
              onClick={downloadPdf}
              disabled={!complete || pdfState === "preparing"}
            >
              <FilePdf size={18} weight="regular" aria-hidden="true" />
              {pdfState === "preparing" ? "Preparing PDF…" : "Download designed PDF"}
            </button>
            <button
              className="blueprint-secondary-action"
              type="button"
              onClick={downloadMarkdown}
              disabled={!complete}
            >
              <FileText size={18} weight="regular" aria-hidden="true" />
              Download Markdown file
            </button>
            <button
              className="blueprint-secondary-action blueprint-role-action"
              type="button"
              onClick={copyRoleInstructions}
            >
              <Copy size={18} weight="regular" aria-hidden="true" />
              {copyState === "copied" ? "Role instructions copied" : "Copy role instructions for Hermes"}
            </button>
            <p className="blueprint-action-status" aria-live="polite">
              {downloadStatus}
            </p>
          </div>

          <details className="blueprint-prompt-preview">
            <summary>Preview the role instructions</summary>
            <pre>
              <code>{roleInstructions}</code>
            </pre>
          </details>
        </aside>
      </div>
    </section>
  );
}
