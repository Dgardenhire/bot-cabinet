"use client";

import Image from "next/image";
import { ArrowUpRight, DownloadSimple, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";

import { CopyTextButton } from "@/components/copy-text-button";
import { downloadBlob } from "@/lib/browser-download";
import {
  buildPortraitPrompt,
  portraitPromptChoices,
  portraitRecipeFileName,
  type PortraitPromptInput,
} from "@/lib/portrait-prompt";

const initialDraft: PortraitPromptInput = {
  rendering: "hermes-avatar",
  botName: "",
  botJob: "",
  character: portraitPromptChoices.characters[0].value,
  palette: portraitPromptChoices.palettes[0].value,
  setting: portraitPromptChoices.settings[0].value,
  prop: portraitPromptChoices.props[0].value,
  expression: portraitPromptChoices.expressions[0].value,
};

export function BotPortraitStudio() {
  const [draft, setDraft] = useState(initialDraft);
  const prompt = buildPortraitPrompt(draft);
  const selectedPalette = portraitPromptChoices.palettes.find(
    (choice) => choice.value === draft.palette,
  );
  const referenceSlug = selectedPalette?.referenceSlug ?? portraitPromptChoices.palettes[0].referenceSlug;
  const selectedRendering = portraitPromptChoices.renderings.find(
    (choice) => choice.value === draft.rendering,
  );

  function update<K extends keyof PortraitPromptInput>(
    field: K,
    value: PortraitPromptInput[K],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function downloadPrompt() {
    downloadBlob(
      new Blob([`${prompt}\n`], { type: "text/plain;charset=utf-8" }),
      portraitRecipeFileName(draft.botName),
    );
  }

  return (
    <section className="shell portrait-builder-section" id="design-your-own" aria-labelledby="portrait-builder-title">
      <div className="portrait-builder-heading">
        <div>
          <p className="portrait-kicker">Make your own</p>
          <h2 id="portrait-builder-title">Build a personalized portrait recipe</h2>
        </div>
        <p>
          Choose the character, color, setting, and personality. Portrait Studio
          builds a complete prompt in your browser. Image creation happens when you
          paste that prompt into Hermes Generate or another image tool.
        </p>
      </div>

      <div className="portrait-builder-grid">
        <form className="portrait-builder-form" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="portrait-rendering-options">
            <legend>How will you create the image?</legend>
            {portraitPromptChoices.renderings.map((choice) => (
              <label key={choice.value} className={draft.rendering === choice.value ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="portrait-rendering"
                  value={choice.value}
                  checked={draft.rendering === choice.value}
                  onChange={() => update("rendering", choice.value)}
                />
                <span>
                  <strong>{choice.label}</strong>
                  <small>{choice.note}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="portrait-identity-fields">
            <label htmlFor="portrait-bot-name">
              <span>Bot name</span>
              <input
                id="portrait-bot-name"
                type="text"
                value={draft.botName}
                maxLength={72}
                placeholder="Scout"
                onChange={(event) => update("botName", event.target.value)}
              />
            </label>
            <label htmlFor="portrait-bot-job">
              <span>What job does this Bot do?</span>
              <textarea
                id="portrait-bot-job"
                value={draft.botJob}
                maxLength={360}
                rows={3}
                placeholder="Find timely research and explain why it matters."
                onChange={(event) => update("botJob", event.target.value)}
              />
            </label>
          </div>

          <div className="portrait-choice-grid">
            <label htmlFor="portrait-character">
              <span>Character</span>
              <select id="portrait-character" value={draft.character} onChange={(event) => update("character", event.target.value)}>
                {portraitPromptChoices.characters.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}
              </select>
            </label>
            <label htmlFor="portrait-palette">
              <span>Color and material</span>
              <select id="portrait-palette" value={draft.palette} onChange={(event) => update("palette", event.target.value)}>
                {portraitPromptChoices.palettes.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}
              </select>
            </label>
            <label htmlFor="portrait-setting">
              <span>Setting</span>
              <select id="portrait-setting" value={draft.setting} onChange={(event) => update("setting", event.target.value)}>
                {portraitPromptChoices.settings.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}
              </select>
            </label>
            <label htmlFor="portrait-prop">
              <span>Object</span>
              <select id="portrait-prop" value={draft.prop} onChange={(event) => update("prop", event.target.value)}>
                {portraitPromptChoices.props.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}
              </select>
            </label>
            <label className="portrait-choice-wide" htmlFor="portrait-expression">
              <span>Personality</span>
              <select id="portrait-expression" value={draft.expression} onChange={(event) => update("expression", event.target.value)}>
                {portraitPromptChoices.expressions.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}
              </select>
            </label>
          </div>
        </form>

        <aside className="portrait-recipe" aria-label="Personalized portrait recipe">
          <div className="portrait-recipe-reference">
            <Image
              src={`/bot-portraits/previews/${referenceSlug}.webp`}
              alt=""
              width={560}
              height={560}
              sizes="(max-width: 700px) 92vw, (max-width: 1180px) 40vw, 220px"
            />
            <span>Color reference</span>
          </div>
          <div className="portrait-recipe-copy">
            <p className="portrait-kicker"><Sparkle size={14} aria-hidden="true" /> Your portrait recipe</p>
            <h3>{draft.botName.trim() || "Your Bot"}</h3>
            <p className="portrait-rendering-note">{selectedRendering?.note}</p>
            <textarea aria-label="Generated portrait prompt" readOnly value={prompt} rows={13} />
            <div className="portrait-recipe-actions">
              <CopyTextButton
                text={prompt}
                label="Copy portrait recipe"
                className="button button-primary"
                analyticsEvent="portrait_recipe_copied"
                analyticsSurface="portrait_studio"
              />
              <button
                type="button"
                className="button button-secondary"
                onClick={downloadPrompt}
                data-funnel-event="portrait_recipe_downloaded"
                data-funnel-surface="portrait_studio"
              >
                <DownloadSimple size={16} aria-hidden="true" /> Download recipe
              </button>
            </div>
            <p className="portrait-local-note">
              Your name, job, and recipe stay in this browser. The image provider sees
              the recipe only after you paste it there. Leave private or client information
              out of these fields.
            </p>
          </div>
        </aside>
      </div>

      <div className="portrait-next-step">
        <div>
          <span>Hermes Generate</span>
          <p>If Generate appears in Edit Profile, paste the recipe there, create the portrait, and save it. Provider setup and charges may apply.</p>
        </div>
        <div>
          <span>Another image tool</span>
          <p>Create a square image with the Cabinet 3D recipe, download it, then choose Edit Profile and Upload in Hermes Desktop.</p>
        </div>
        <a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/image-generation" target="_blank" rel="noreferrer">
          Official image guide <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
