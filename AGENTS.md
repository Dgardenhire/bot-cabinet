# Bot Cabinet: instructions for coding agents

Read this before changing anything in this repository. It applies to Codex, Claude and any other agent.

## What Bot Cabinet is

Bot Cabinet is a **cross-platform** bot resource. It collects the most useful bots and agent use cases from every platform people actually use and turns them into templates that run on any of them.

Platforms in scope include ChatGPT (GPTs, workspace agents and dots), Claude, Gemini (Gems), Grok Bot, Meta Muse, Instinct, Hermes Agent and others as they appear.

Bot Cabinet is not:

- a Hermes registry, even though Hermes was its first collection and some older copy still says so;
- a Grok Bot catalog;
- a news page about other people's bots.

When copy or code frames it as any of those, treat that as legacy to correct, not as the scope to preserve.

## The intake rule

Agent Watch (`src/data/agent-watch.ts`, shown at `/watch`) is how bots come **in**. It is not where they stay.

When Agent Watch spots a useful bot on any platform and Bot Cabinet decides to add it (`botDetails.cabinetDecision: "add-new"`):

1. Build it as a Bot Cabinet template: a `StarterBot` in `src/data/starter-bots.ts` with its own `/bots/<slug>` page.
2. Make it portable. It ships with every platform version the current pack format supports, and setup notes for the rest. A Grok Bot template that comes in becomes something people can also run in ChatGPT, Claude, Gemini, Muse and Hermes.
3. Credit the original creator with `inspiredBy` (creator, work, link to the original). Never present someone else's bot as Bot Cabinet's own idea.
4. Point the Agent Watch item at the template: set `botDetails.cabinetTemplate` and make the template the first entry in `cabinetLinks`. Links in the newsletter and elsewhere should land on the template, not on `/watch` or only on the original.

`src/data/agent-watch-intake.test.ts` enforces steps 1, 3 and 4. The build fails if an `add-new` item has no matching template.

Items marked `test-adaptation` (for example Import Bot and Bill Import Bot) are candidates for the same treatment. Do not let them sit indefinitely.

## Adding a template: what the build expects

The Unstick Me commit (adapted from Yanqing Cheng's Grok Bot) is a working example. A new `StarterBot` needs:

- **A unique portrait.**
  - Put the 1024x1536 PNG original in `public/downloads/bot-portraits/originals/<slug>-original.png`.
  - Add an entry, with its SHA-256 and crop, to `src/data/bot-portraits.json`.
  - Add a row to `docs/BOT-PORTRAIT-PROVENANCE.md`.
  - Use the house style: friendly, clean, contemporary mechanical robot, restrained Victorian-instrument details. No weapons, no fantasy costumes, nothing dystopian.
- **A release packet** in `src/data/bot-release-packets.ts`, plus a showcase card in `scripts/build-section-og.mjs` and `scripts/audit-social-metadata.mjs`.
- **A work archetype** in `src/data/work-archetypes.ts`.
- **A website task case** in `scripts/keeper/website_task_cases.json`, and a reviewed passing sample run recorded in `public/proof-room/` (see `scripts/keeper/README.md`). Any change to the download changes its hash, and the bot must be retested.
- **Approval wording** for each prohibition in `src/data/bot-control-copy.ts`.
- **Regenerated output:** run `npm run generate:content`, then `npm test`.

## Honesty about testing

Label only what was actually done. A prepared adaptation is "prepared, not tested". A Hermes archive that hasn't been imported stays `not-tested`. A sample run reviewed by an agent is not human approval. Keep failed and interrupted runs in the record.

## Known limitation (planned work)

Portable Bot Pack V2 currently stores only Hermes and Grok Bot versions:

- ChatGPT instructions are generated from the pack.
- Claude, Gemini, Muse and Instinct get setup notes and guides.

Widening the format so every template carries its own version for each platform is planned. Until then, do not describe the two stored platforms as the product's scope.
