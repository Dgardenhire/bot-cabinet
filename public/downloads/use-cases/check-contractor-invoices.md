# Check a contractor's supplier invoices

Designed for: Small contractors comparing supplier bills with orders and delivery notes

Result: A discrepancy list showing price differences, duplicate lines and items without delivery evidence.

## Try a sample first

Illustrative example, not a recorded Bot run. This adaptation has not been runtime-tested.

### Complete first request

Compare purchase orders, delivery notes and supplier invoices by item and quantity. Calculate discrepancies, distinguish missing evidence from a missing delivery, and prepare questions for the supplier Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

Fictional records. PO1: 10 fixtures at $18 each, no other items. D1: 8 fixtures signed for. Invoice I1: 10 fixtures at $20 each plus a $15 delivery fee. No delivery-fee agreement is supplied.

### Example result

Unit-price difference: 10 × ($20 − $18) = $20. Delivery evidence covers 8 of the 10 billed fixtures; receipt of the other 2 is unconfirmed, not proven absent. The $15 delivery fee has no supplied agreement. Ask about all three before approving payment.

### Check the answer

- Calculate the $20 price difference.
- Do not claim two fixtures were never delivered.
- Flag the fee without paying or disputing it automatically.

Inspired by a community use shared by @mthomas_99og: https://x.com/mthomas_99og/status/2108837576526164248
Found through Bot Usecases (https://botusecases.netlify.app/), curated by KP. This fictional sample was written by Bot Cabinet.

## Operating guide

- **When to use it:** Use this workflow when you need a discrepancy list showing price differences, duplicate lines and items without delivery evidence.
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

Compare purchase orders, delivery notes and supplier invoices by item and quantity. Calculate discrepancies, distinguish missing evidence from a missing delivery, and prepare questions for the supplier

Output: A discrepancy list showing price differences, duplicate lines and items without delivery evidence.

Message to send:

Use the approved inputs I provide. Compare purchase orders, delivery notes and supplier invoices by item and quantity. Calculate discrepancies, distinguish missing evidence from a missing delivery, and prepare questions for the supplier. Return this result: A discrepancy list showing price differences, duplicate lines and items without delivery evidence.. Ask me about missing information before you continue.

## Overall request

Compare purchase orders, delivery notes and supplier invoices by item and quantity. Calculate discrepancies, distinguish missing evidence from a missing delivery, and prepare questions for the supplier Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

## Decisions for a person

- Check the result against the supplied records
- Approve any account connection, schedule or outside action separately
- Review anything before it is sent, submitted, purchased or published

## First test

Calculate the $20 price difference. Do not claim two fixtures were never delivered. Flag the fee without paying or disputing it automatically.

## Success checkpoint

Check the result against your original material. You make the decisions listed below. Calculate the $20 price difference. Do not claim two fixtures were never delivered. Flag the fee without paying or disputing it automatically.

## If the workflow stalls

If the result is incomplete, mark the missing information and ask the same Bot to correct it. Add another Bot only when a genuinely separate role or independent check would help.

## Hermes Desktop setup

1. Open the linked Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review the profile's SOUL.md, Bot Passport, and requested access.
3. Run the complete request in that Bot's chat with low-risk material and review the result.
4. Add a schedule, outside connection, or optional specialist only after the manual version works.
