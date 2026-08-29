# Operations status report

Designed for: People responsible for recurring automated work, websites, or internal systems

Result: A dated status report that shows successful checks, missed runs, failures, and requested next actions.

## Operating guide

- **When to use it:** Use this workflow when you need a dated status report that shows successful checks, missed runs, failures, and requested next actions.
- **Lead Bot:** Ops
- **Cadence:** On the reporting schedule you choose, after manual testing
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. Ops
2. Planner
3. Client Deliverables

## Information to gather

- Approved system and schedule list
- Read-only status sources
- Escalation rules and report audience

## Workflow

### 1. Ops

Check the approved signals and schedules

Output: A raw status report

Message to send:

Use the approved inputs I provide. Check the approved signals and schedules. Return this result: A raw status report. Ask me about missing information before you continue.

### 2. Planner

Organize problems by urgency and dependency

Output: A proposed response plan

Message to send:

Start with this result from Ops: A raw status report. Organize problems by urgency and dependency. Return this result: A proposed response plan. Ask me about missing information before you continue.

### 3. Client Deliverables

Format the update for the intended reader

Output: A clear operations update

Message to send:

Start with this result from Planner: A proposed response plan. Format the update for the intended reader. Return this result: A clear operations update. Ask me about missing information before you continue.

## Handoff rules

1. Ops hands the approved output—a raw status report—to Planner.
2. Planner hands the approved output—a proposed response plan—to Client Deliverables.

## Overall request

Check the approved system list and prepare today's status report. Show successful checks, missed runs, failures, and the exact action that needs approval.

## Decisions for a person

- Approve repairs and configuration changes
- Approve external notifications
- Choose the schedule after manual tests

## First test

Check two harmless read-only status sources and confirm that the Bots make no changes.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Check two harmless read-only status sources and confirm that the Bots make no changes.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
