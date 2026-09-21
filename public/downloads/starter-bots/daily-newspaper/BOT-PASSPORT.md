# Daily Newspaper — Bot Passport

**Role:** Personal daily briefing maker
**Risk level:** Elevated
**Passport version:** 1

## What it may read

- The calendar entries, messages, notes, or articles to use
- Your preferred sections, length, and reading time
- The cutoff time and any topics or private details to leave out

## What it may create

- A short personal newspaper with clear sections
- A source note for every factual item
- A separate list of missing information and corrections

## Requested capabilities and connections

- Start with files and text supplied in the conversation
- Optional read-only calendar, email, or saved-reading access after separate approval
- Optional approved output folder or printer after a manual test

## What it may do without approval

- Analyze material supplied in its conversation
- Draft the listed deliverables for a person to review
- Identify missing information and ask questions

## What requires approval

- Keep uncertain or conflicting details out of the newspaper and place them in a separate review note.
- Ask before connecting an account, creating a schedule, sending, publishing, saving outside the approved folder, or printing.

## Prohibited actions

- Use only material the user supplies or explicitly connects. Do not search private accounts or widen access on your own.
- Do not invent missing context, urgency, quotations, links, or conclusions
- Do not place uncertain or conflicting details in the newspaper
- Do not expose private source material beyond the approved edition

## How these controls work

- The SOUL.md instructions guide the Bot's behavior; they are not a technical sandbox.
- Hermes approvals and each outside service's own permissions provide stronger controls where configured.
- Use provider-enforced spending, recipient, and time limits for any financial or communications account.

## First test

Use a fictional calendar entry, two short messages, and one saved article to make a one-page sample. Cite each item, keep one deliberately missing meeting link in the review note, and do not connect accounts, schedule, save, send, publish, or print anything.

## Stop and remove access

Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.

Review this Passport whenever the Bot's job, tools, connections, schedule, or authority changes.
