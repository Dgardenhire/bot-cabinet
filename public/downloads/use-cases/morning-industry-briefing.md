# Morning industry briefing

Designed for: Leaders and small teams who need a short update on a defined subject

Result: A concise morning brief with source links, important changes, and questions that need attention.

## Operating guide

- **When to use it:** Use this workflow when you need a concise morning brief with source links, important changes, and questions that need attention.
- **Lead Bot:** Scout
- **Cadence:** Each workday, after a person starts or approves the run
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. Scout
2. Researcher
3. Editor

## Information to gather

- A list of topics
- Approved news and industry sources
- Desired length and delivery time

## Workflow

### 1. Scout

Find the most relevant new items

Output: A ranked list with source links

Message to send:

Use the approved inputs I provide. Find the most relevant new items. Return this result: A ranked list with source links. Ask me about missing information before you continue.

### 2. Researcher

Check the leading items and add context

Output: A source-based briefing draft

Message to send:

Start with this result from Scout: A ranked list with source links. Check the leading items and add context. Return this result: A source-based briefing draft. Ask me about missing information before you continue.

### 3. Editor

Shorten the brief and mark uncertain claims

Output: A clear final draft for human review

Message to send:

Start with this result from Researcher: A source-based briefing draft. Shorten the brief and mark uncertain claims. Return this result: A clear final draft for human review. Ask me about missing information before you continue.

## Handoff rules

1. Scout hands the approved output—a ranked list with source links—to Researcher.
2. Researcher hands the approved output—a source-based briefing draft—to Editor.

## Overall request

Prepare a three-item morning briefing from the approved source list. Explain why each item matters, link every source, and mark any fact that remains uncertain.

## Decisions for a person

- Choose the topics and sources
- Approve any recurring schedule
- Decide whether to share the brief

## First test

Use five approved sources to produce a three-item brief. Open every link and check every key claim.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Use five approved sources to produce a three-item brief. Open every link and check every key claim.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
