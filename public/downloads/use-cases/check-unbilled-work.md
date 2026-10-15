# Find work missing from an invoice

Designed for: Consultants and small businesses checking completed work against invoices

Result: An itemized list of possible missed charges, with calculations and questions to check before billing.

## Try a sample first

Illustrative example, not a recorded Bot run. This adaptation has not been runtime-tested.

### Complete first request

Compare the work log, agreed rates and invoice. Show matched items, possible omissions and anything that needs confirmation. Do not treat a possible omission as an approved charge Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

Fictional records. Agreement A1: approved support is $120 per hour; travel is included. Work log W1: Cedar client, 2 hours support on October 5 and 1 hour on October 6; 1 hour travel. Invoice I1: Cedar, October 5 support, $240. No approval record for the October 6 support is supplied.

### Example result

October 5: 2 × $120 = $240, matched to I1. October 6: 1 × $120 = $120 potentially missing; approval is not documented, so confirm before billing. Travel: no extra charge under A1. This is a review list, not a new invoice.

### Check the answer

- Identify the potential $120 omission.
- Keep missing approval visible.
- Do not add a travel charge or send an invoice.

Inspired by a community use shared by @CPUGenuis: https://x.com/CPUGenuis/status/2108913906773074057
Found through Bot Usecases (https://botusecases.netlify.app/), curated by KP. This fictional sample was written by Bot Cabinet.

## Operating guide

- **When to use it:** Use this workflow when you need an itemized list of possible missed charges, with calculations and questions to check before billing.
- **Lead Bot:** Client Deliverables
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 15–30 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Recommended starting Bot

1. Client Deliverables

Use Client Deliverables with the task below. This is a workflow for an existing role, not a separate installed Bot.

## Information to gather

- Start with the fictional records below
- For your own task, choose only the records you want the Bot to use
- Remove private details you do not need for the task

## Workflow

### 1. Client Deliverables

Compare the work log, agreed rates and invoice. Show matched items, possible omissions and anything that needs confirmation. Do not treat a possible omission as an approved charge

Output: An itemized list of possible missed charges, with calculations and questions to check before billing.

Message to send:

Use the approved inputs I provide. Compare the work log, agreed rates and invoice. Show matched items, possible omissions and anything that needs confirmation. Do not treat a possible omission as an approved charge. Return this result: An itemized list of possible missed charges, with calculations and questions to check before billing.. Ask me about missing information before you continue.

## Overall request

Compare the work log, agreed rates and invoice. Show matched items, possible omissions and anything that needs confirmation. Do not treat a possible omission as an approved charge Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

## Decisions for a person

- Check the result against the supplied records
- Approve any account connection, schedule or outside action separately
- Review anything before it is sent, submitted, purchased or published

## First test

Identify the potential $120 omission. Keep missing approval visible. Do not add a travel charge or send an invoice.

## Success checkpoint

Check the result against your original material. You make the decisions listed below. Identify the potential $120 omission. Keep missing approval visible. Do not add a travel charge or send an invoice.

## If the workflow stalls

If the result is incomplete, mark the missing information and ask the same Bot to correct it. Add another Bot only when a genuinely separate role or independent check would help.

## Hermes Desktop setup

1. Open the linked Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review the profile's SOUL.md, Bot Passport, and requested access.
3. Run the complete request in that Bot's chat with low-risk material and review the result.
4. Add a schedule, outside connection, or optional specialist only after the manual version works.
