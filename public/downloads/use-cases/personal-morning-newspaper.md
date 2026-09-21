# Personal morning newspaper

Designed for: People who want a finite, useful morning read instead of beginning with an endless feed

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

Lay out a finite one-page edition without inventing details

Output: A readable edition and separate correction notes

Message to send:

Start with this result from Scout: A dated source sheet with missing context marked. Lay out a finite one-page edition without inventing details. Return this result: A readable edition and separate correction notes. Ask me about missing information before you continue.

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

## Ways to run this outcome across platforms

Each path has its own evidence status. A shared outcome does not establish identical behavior or compatibility.

### Grok Bot — Original creator workflow

- **Approach:** Karen X. Cheng's Morning Newspaper turns selected personal context into a finite paper edition that can print overnight.
- **Start here:** Review the original marketplace item and its imported instructions before connecting sources. Start with a preview and confirm the exact delivery and printer path.
- **Known limit:** Cabinet verified the official listing, not its runtime behavior, account permissions, scheduling or printing.
- **Original source:** [The Morning Newspaper — Karen X. Cheng](https://x.ai/bot/marketplace/bots/the-morning-newspaper)
- **Cabinet guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Hermes — Cabinet implementation brief

- **Approach:** Use a dedicated profile and reusable skill to create the approved edition; add a named scheduled job only after a manual edition passes review.
- **Start here:** Begin with selected or fictional inputs, inspect the generated skill, then propose the schedule, local output and failure notice for human approval.
- **Known limit:** This adaptation has not been run end to end. A cloud Hermes instance cannot reach a home printer without a separately configured, narrowly scoped bridge.
- **Cabinet guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Muse — Capability review only

- **Approach:** Ask the personal agent to create the same bounded edition from connections available in the user's account, then determine whether printable-file delivery is supported.
- **Start here:** Run a manual sample first and ask the service to identify actual source access, scheduling, export, retention, cost and stop controls before enabling anything recurring.
- **Known limit:** Provider descriptions mention connected apps and background work, but Cabinet has not verified this complete workflow or printer delivery.
- **Original source:** [Muse provider announcement](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- **Cabinet guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Instinct — Capability review only

- **Approach:** Use the same outcome brief in the conversational assistant and verify which personal sources, routines and file outputs the current account supports.
- **Start here:** Request a non-recurring preview, then ask for an explicit capability and permission report before connecting accounts or creating a routine.
- **Known limit:** Cabinet has not verified an account-specific implementation, pricing, printable export or automatic printing.
- **Original source:** [Instinct provider page](https://instinct.com/)
- **Cabinet guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

### Another agent or emerging tool — Portable outcome brief

- **Approach:** Carry the job definition—not a vendor-specific package—into any agent that can use selected sources, produce a finite document and support a reviewed delivery step.
- **Start here:** Test the sample brief with fictional inputs. Verify source access, scheduling, export, privacy, costs, error handling and stop controls against that tool's current behavior.
- **Known limit:** A similar chat interface or claimed integration does not establish compatibility. Treat each host as untested until the complete outcome is observed.
- **Cabinet guide:** https://botcabinet.com/guides/morning-newspaper-across-agents/

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
