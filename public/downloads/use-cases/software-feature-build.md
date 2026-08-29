# Software feature build

Designed for: Small product teams and solo builders working in an existing codebase

Result: A defined feature, implemented as the smallest reversible change in a working branch or disposable project copy, with review notes and test results.

## Operating guide

- **When to use it:** Use this workflow when you need a defined feature, implemented as the smallest reversible change in a working branch or disposable project copy, with review notes and test results.
- **Lead Bot:** ARCHITECT
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. ARCHITECT
2. Founding Engineer
3. Editor

## Information to gather

- Approved feature request and user outcome
- Existing code, design, and technical constraints
- Acceptance checks, time limit, and project boundaries

## Workflow

### 1. ARCHITECT

Compare the simplest viable technical approaches and identify risks

Output: An implementation decision record with approval points

Message to send:

Use the approved inputs I provide. Compare the simplest viable technical approaches and identify risks. Return this result: An implementation decision record with approval points. Ask me about missing information before you continue.

### 2. Founding Engineer

Build the approved feature as a small reversible change and run the available checks

Output: Changed files, test results, shortcuts, and remaining risks

Message to send:

Start with this result from ARCHITECT: An implementation decision record with approval points. Build the approved feature as a small reversible change and run the available checks. Return this result: Changed files, test results, shortcuts, and remaining risks. Ask me about missing information before you continue.

### 3. Editor

Review user-facing copy and the handoff summary

Output: Copy-review notes and a release-note draft

Message to send:

Start with this result from Founding Engineer: Changed files, test results, shortcuts, and remaining risks. Review user-facing copy and the handoff summary. Return this result: Copy-review notes and a release-note draft. Ask me about missing information before you continue.

## Handoff rules

1. ARCHITECT hands the approved output—an implementation decision record with approval points—to Founding Engineer.
2. Founding Engineer hands the approved output—changed files, test results, shortcuts, and remaining risks—to Editor.

## Overall request

Build this approved feature inside the stated project boundary. Compare the simplest viable approaches, wait for approval on dependencies or data changes, build the smallest reversible version, run the relevant checks, and report every change and remaining risk.

## Decisions for a person

- Approve the scope, technical approach, and any new dependency
- Approve security, data, and outside-service changes
- Approve merge and deployment

## First test

Build one reversible feature in a project copy and confirm every acceptance check before merging.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Build one reversible feature in a project copy and confirm every acceptance check before merging.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
