# Product and technology direction

Designed for: Founders and small product teams choosing what to test and how to build it

Result: A product and technology decision record plus the smallest reversible prototype needed to resolve the next uncertainty.

## Operating guide

- **When to use it:** Use this workflow when you need a product and technology decision record plus the smallest reversible prototype needed to resolve the next uncertainty.
- **Lead Bot:** NOVA
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. NOVA
2. ARCHITECT
3. Founding Engineer

## Information to gather

- The product goal, intended user, and current evidence
- The current system and business constraints
- Budget, time limit, risk limits, and acceptance checks

## Workflow

### 1. NOVA

Identify the product assumptions and the evidence needed for the next decision

Output: A product hypothesis and evidence brief

Message to send:

Use the approved inputs I provide. Identify the product assumptions and the evidence needed for the next decision. Return this result: A product hypothesis and evidence brief. Ask me about missing information before you continue.

### 2. ARCHITECT

Compare practical technical directions for the approved product test

Output: An architecture decision record with costs, risks, and approval points

Message to send:

Start with this result from NOVA: A product hypothesis and evidence brief. Compare practical technical directions for the approved product test. Return this result: An architecture decision record with costs, risks, and approval points. Ask me about missing information before you continue.

### 3. Founding Engineer

Build the approved direction as the smallest reversible prototype

Output: A working prototype, acceptance-check results, and a decision log

Message to send:

Start with this result from ARCHITECT: An architecture decision record with costs, risks, and approval points. Build the approved direction as the smallest reversible prototype. Return this result: A working prototype, acceptance-check results, and a decision log. Ask me about missing information before you continue.

## Handoff rules

1. NOVA hands the approved output—a product hypothesis and evidence brief—to ARCHITECT.
2. ARCHITECT hands the approved output—an architecture decision record with costs, risks, and approval points—to Founding Engineer.

## Overall request

Help choose the next product and technology direction from the confirmed evidence and constraints. Compare practical options, mark every approval point, and build only the smallest prototype I approve in a disposable project copy.

## Decisions for a person

- Confirm the user problem and product promise
- Choose the technical direction and approve vendors, dependencies, budget, and risk
- Approve repository access, real data use, and any merge or release

## First test

Use sample data in a disposable project copy to build one narrow proof and review its acceptance results before choosing a production direction.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Use sample data in a disposable project copy to build one narrow proof and review its acceptance results before choosing a production direction.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
