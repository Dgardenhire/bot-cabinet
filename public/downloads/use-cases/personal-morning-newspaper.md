# Personal morning newspaper

Designed for: People who want a short, useful morning read instead of beginning with an endless feed

Result: A one-page edition built from selected calendar items, actionable messages and one chosen interest, ready for review and optional printing.

## Operating guide

- **When to use it:** Use this workflow when you need a one-page edition built from selected calendar items, actionable messages and one chosen interest, ready for review and optional printing.
- **Lead Bot:** Scout
- **Cadence:** Each workday, after a person starts or approves the run
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. Scout
2. Editor
3. Ops

## Information to gather

- Selected or fictional calendar entries and messages
- An optional approved source about one interest
- Timezone, page size, exclusions and delivery preference

## Workflow

### 1. Scout

Organize only the supplied calendar, message and interest sources

Output: A dated source sheet with missing context marked

Message to send:

Use the approved inputs I provide. Organize only the supplied calendar, message and interest sources. Return this result: A dated source sheet with missing context marked. Ask me about missing information before you continue.

### 2. Editor

Lay out a one-page edition without inventing details

Output: A readable edition and separate correction notes

Message to send:

Start with this result from Scout: A dated source sheet with missing context marked. Lay out a one-page edition without inventing details. Return this result: A readable edition and separate correction notes. Ask me about missing information before you continue.

### 3. Ops

Prepare the approved file and report the exact delivery step

Output: A reviewed file for manual delivery or one authorized trial

Message to send:

Start with this result from Editor: A readable edition and separate correction notes. Prepare the approved file and report the exact delivery step. Return this result: A reviewed file for manual delivery or one authorized trial. Ask me about missing information before you continue.

## Handoff rules

1. Scout hands the approved output—a dated source sheet with missing context marked—to Editor.
2. Editor hands the approved output—a readable edition and separate correction notes—to Ops.

## Overall request

Create a sample one-page morning newspaper from only the supplied calendar entries, messages and optional source. Preserve dates and timezones, cite every item, mark missing context, keep correction notes outside the edition, and do not connect accounts, schedule, send or print anything.

## Decisions for a person

- Choose sources and private-topic exclusions
- Approve every connected account, schedule and delivery path
- Approve a single print trial before recurring printing

## First test

Use fictional appointments and messages to make one page. Check every detail in print preview; do not schedule or print it yet.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Use fictional appointments and messages to make one page. Check every detail in print preview; do not schedule or print it yet.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Ways to do this job with another AI service

These options may not work the same way. Read what has and has not been tested.

### Grok Bot — Original creator workflow

- **How it could work:** Karen X. Cheng's Morning Newspaper turns selected personal information into a short paper edition that can print overnight.
- **Start here:** Review the original marketplace item and its imported instructions before connecting sources. Start with a preview and confirm the exact delivery and printer path.
- **What we have not tested:** Bot Cabinet checked the official listing, but has not run the Bot, checked its account access, scheduled it or tested its printing.
- **Source:** [The Morning Newspaper — Karen X. Cheng](https://x.ai/bot/marketplace/bots/the-morning-newspaper)
- **Setup guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Hermes — Setup idea — not tested

- **How it could work:** Use a separate Hermes profile and saved instructions to make the approved edition. Add a morning schedule only after a person checks a sample.
- **Start here:** Begin with selected or made-up information. Check the saved instructions, the proposed schedule, where the file will go and how Hermes will report a failure.
- **What we have not tested:** Bot Cabinet has not run this from start to finish. A cloud Hermes agent cannot reach a home printer unless a safe local connection is set up for that printer.
- **Setup guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Muse — What to check — not tested

- **How it could work:** Ask Muse to make the same short edition from the connections your account can use. Then check whether it can save or deliver a printable file.
- **Start here:** Make one sample first. Ask which information it can read, whether it can run each morning, where files are kept, what it costs and how to stop it.
- **What we have not tested:** Meta says Muse can use connected apps and work in the background. Bot Cabinet has not tested this complete job or printing.
- **Source:** [Muse provider announcement](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- **Setup guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Instinct — What to check — not tested

- **How it could work:** Give Instinct the same job and check which personal information, schedules and file types your account can use.
- **Start here:** Ask for one preview. Before connecting accounts or making a daily routine, ask what it can access and what it needs permission to do.
- **What we have not tested:** Bot Cabinet has not tested this with an Instinct account, confirmed its price, made a printable file or tested automatic printing.
- **Source:** [Instinct provider page](https://instinct.com/)
- **Setup guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Another agent or emerging tool — Use with another service

- **How it could work:** Take the job description to any AI service that can read the information you choose, make a short document and wait for your approval before delivery.
- **Start here:** Test it with made-up information. Check what it can read, whether it can run on a schedule, save a file, protect private data, control costs, report errors and stop cleanly.
- **What we have not tested:** A similar chat screen does not mean the service can do the same job. Treat it as untested until you see the complete result.
- **Setup guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
