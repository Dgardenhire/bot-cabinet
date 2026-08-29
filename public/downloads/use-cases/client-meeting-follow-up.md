# Client meeting follow-up

Designed for: Consultants and project teams that need clear notes and next steps after meetings

Result: A follow-up draft with decisions, action items, owners, and unresolved questions.

## Operating guide

- **When to use it:** Use this workflow when you need a follow-up draft with decisions, action items, owners, and unresolved questions.
- **Lead Bot:** Editor
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. Editor
2. Planner
3. Client Deliverables

## Information to gather

- Meeting notes or transcript
- Participant names and roles
- Approved commitments and dates

## Workflow

### 1. Editor

Clean the notes and separate decisions from discussion

Output: Structured meeting notes

Message to send:

Use the approved inputs I provide. Clean the notes and separate decisions from discussion. Return this result: Structured meeting notes. Ask me about missing information before you continue.

### 2. Planner

Extract action items, owners, dependencies, and questions

Output: A proposed action list

Message to send:

Start with this result from Editor: Structured meeting notes. Extract action items, owners, dependencies, and questions. Return this result: A proposed action list. Ask me about missing information before you continue.

### 3. Client Deliverables

Format the material for the client

Output: A formatted follow-up draft with decisions, owners, dates, and open questions

Message to send:

Start with this result from Planner: A proposed action list. Format the material for the client. Return this result: A formatted follow-up draft with decisions, owners, dates, and open questions. Ask me about missing information before you continue.

## Handoff rules

1. Editor hands the approved output—structured meeting notes—to Planner.
2. Planner hands the approved output—a proposed action list—to Client Deliverables.

## Overall request

Turn these meeting notes into a follow-up draft. Separate decisions, action items, owners, dates, and open questions. Mark every assignment or commitment that needs confirmation.

## Decisions for a person

- Confirm decisions and assignments
- Approve dates and commitments
- Send the follow-up

## First test

Use a short internal meeting transcript and compare every action item with the original notes.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Use a short internal meeting transcript and compare every action item with the original notes.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
