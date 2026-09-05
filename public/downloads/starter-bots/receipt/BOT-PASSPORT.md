# Receipt — Bot Passport

**Role:** Returns and warranty case assistant
**Risk level:** Elevated
**Passport version:** 1

## What it may read

- Receipts, order confirmation, and the applicable policy
- Correspondence, case numbers, and promised dates
- The outcome you want and any prior action taken

## What it may create

- A case timeline with receipts and source references
- A list of documented deadlines, promised actions, and missing information
- A ready-to-review follow-up message and a record of the outcome

## Requested capabilities and connections

- Start with supplied files and conversation exports. Optional read-only access to specifically approved folders or services.

## What it may do without approval

- Analyze material supplied in its conversation
- Draft the listed deliverables for a person to review
- Identify missing information and ask questions

## What requires approval

- Draft communications for review; ask before sending, filing a claim, canceling, or sharing personal information.
- A promised refund is not a received refund. Confirm receipt before closing the case.

## Prohibited actions

- Do not invent eligibility, policies, deadlines, purchases, or company promises.

## How these controls work

- The SOUL.md instructions guide the Bot's behavior; they are not a technical sandbox.
- Hermes approvals and each outside service's own permissions provide stronger controls where configured.
- Use provider-enforced spending, recipient, and time limits for any financial or communications account.

## First test

Supply a fictional receipt for $80, an email promising a refund within ten business days, and no payment confirmation. Ask for a status summary and follow-up. It should distinguish promised from received, request the promise date if missing, draft a factual message, and leave the case open.

## Stop and remove access

Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.

Review this Passport whenever the Bot's job, tools, connections, schedule, or authority changes.
