# Operations status report

Designed for: People responsible for recurring automated work, websites, or internal systems

Result: A dated status report that shows successful checks, missed runs, failures, and requested next actions.

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

## Overall request

Check the approved system list and prepare today's status report. Show successful checks, missed runs, failures, and the exact action that needs approval.

## Decisions for a person

- Approve repairs and configuration changes
- Approve external notifications
- Choose the schedule after manual tests

## First test

Check two harmless read-only status sources and confirm that the Bots make no changes.

## Hermes Desktop setup

1. Open each Bot's page in Bot Cabinet's Hermes Bots collection and follow its manual Hermes Desktop setup steps.
2. Run each step in that Bot's own chat and review the result.
3. Pass the approved result to the next Bot with the message provided for that step.
4. After the sequence works, you may create a group with the same Bots.
5. In a group, @mention the Bot you want. Membership order does not control who responds.
