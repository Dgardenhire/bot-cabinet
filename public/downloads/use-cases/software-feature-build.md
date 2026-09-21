# Software feature build

Designed for: Small product teams and solo builders working in an existing codebase

Result: A defined feature, implemented as the smallest reversible change in a working branch or disposable project copy, with review notes and test results.

## Operating guide

- **When to use it:** Use this workflow when you need a defined feature, implemented as the smallest reversible change in a working branch or disposable project copy, with review notes and test results.
- **Lead Bot:** Founding Engineer
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 15–30 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Recommended starting Bot

1. Founding Engineer

One Founding Engineer can plan, build, test, and explain a small feature. Add Architect for a consequential technical choice, or Editor for a separate user-facing review.

Optional specialists: architect, editor.

## Information to gather

- Approved feature request and user outcome
- Existing code, design, and technical constraints
- Acceptance checks, time limit, and project boundaries

## Workflow

### 1. Founding Engineer

Compare the simplest viable approaches, build the approved feature as a small reversible change, run the checks, and explain the result

Output: A working change with decision notes, changed files, test results, release notes, and remaining risks

Message to send:

Use the approved inputs I provide. Compare the simplest viable approaches, build the approved feature as a small reversible change, run the checks, and explain the result. Return this result: A working change with decision notes, changed files, test results, release notes, and remaining risks. Ask me about missing information before you continue.

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

If the result is incomplete, mark the missing information and ask the same Bot to correct it. Add another Bot only when a genuinely separate role or independent check would help.

## Hermes Desktop setup

1. Open the linked Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review the profile's SOUL.md, Bot Passport, and requested access.
3. Run the complete request in that Bot's chat with low-risk material and review the result.
4. Add a schedule, outside connection, or optional specialist only after the manual version works.
