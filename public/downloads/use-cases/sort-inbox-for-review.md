# Sort an inbox and draft the next replies

Designed for: People deciding which messages need attention without giving an assistant control of their inbox

Result: A source-linked list of urgent messages, waiting items and draft replies for you to review.

## Try a sample first

Illustrative example, not a recorded Bot run. This adaptation has not been runtime-tested.

### Complete first request

Sort the supplied messages into needs a decision, waiting on someone else, and information only. Quote the message ID for each item, preserve stated deadlines, flag suspicious requests, and draft replies without sending, deleting, archiving or opening links Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

Fictional messages. E1, October 18: Cedar asks you to approve a revised scope by October 20; the scope attachment is not supplied. E2: your supplier says a replacement ships after you confirm the address; no dispatch date is given. E3: a message from an unfamiliar sender demands an urgent payment through a new bank link. E4: a newsletter announces a public webinar; no response is requested.

### Example result

Needs a decision: E1, scope approval requested by October 20; obtain the missing attachment before deciding. Draft: 'Please resend the revised scope so I can review it.' E2, address confirmation needed; verify the address privately before replying. Waiting: shipment under E2 is not confirmed. E3, suspicious payment request: verify through a known contact, without opening the link. Information only: E4. No replies sent and no messages moved.

### Check the answer

- Keep E1's deadline and missing attachment visible.
- Do not treat E2 as a confirmed shipment.
- Flag E3 without opening its link or paying; leave all messages unchanged.

Inspired by Grok Bot's Inbox Manager use case: https://x.ai/bot/s4f048c7b7da9e010c2c3
Found through Grok Bot use cases (https://x.ai/bot/use-cases). This fictional sample was written by Bot Cabinet.

## Operating guide

- **When to use it:** Use this workflow when you need a source-linked list of urgent messages, waiting items and draft replies for you to review.
- **Lead Bot:** Chief of Staff
- **Cadence:** When a person supplies the approved brief and starts the workflow
- **Typical first run:** 15–30 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Recommended starting Bot

1. Chief of Staff

Use Chief of Staff with the task below. This is a workflow for an existing role, not a separate installed Bot.

## Information to gather

- Start with the fictional records below
- For your own task, choose only the records you want the Bot to use
- Remove private details you do not need for the task

## Workflow

### 1. Chief of Staff

Sort the supplied messages into needs a decision, waiting on someone else, and information only. Quote the message ID for each item, preserve stated deadlines, flag suspicious requests, and draft replies without sending, deleting, archiving or opening links

Output: A source-linked list of urgent messages, waiting items and draft replies for you to review.

Message to send:

Use the approved inputs I provide. Sort the supplied messages into needs a decision, waiting on someone else, and information only. Quote the message ID for each item, preserve stated deadlines, flag suspicious requests, and draft replies without sending, deleting, archiving or opening links. Return this result: A source-linked list of urgent messages, waiting items and draft replies for you to review.. Ask me about missing information before you continue.

## Overall request

Sort the supplied messages into needs a decision, waiting on someone else, and information only. Quote the message ID for each item, preserve stated deadlines, flag suspicious requests, and draft replies without sending, deleting, archiving or opening links Use only the records I supply. Label missing or uncertain information. Do not connect accounts, browse, send, submit, publish, spend money or create a schedule. Return a draft for my review.

## Decisions for a person

- Check the result against the supplied records
- Approve any account connection, schedule or outside action separately
- Review anything before it is sent, submitted, purchased or published

## First test

Keep E1's deadline and missing attachment visible. Do not treat E2 as a confirmed shipment. Flag E3 without opening its link or paying; leave all messages unchanged.

## Success checkpoint

Check the result against your original material. You make the decisions listed below. Keep E1's deadline and missing attachment visible. Do not treat E2 as a confirmed shipment. Flag E3 without opening its link or paying; leave all messages unchanged.

## If the workflow stalls

If the result is incomplete, mark the missing information and ask the same Bot to correct it. Add another Bot only when a genuinely separate role or independent check would help.

## Hermes Desktop setup

1. Open the linked Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review the profile's SOUL.md, Bot Passport, and requested access.
3. Run the complete request in that Bot's chat with low-risk material and review the result.
4. Add a schedule, outside connection, or optional specialist only after the manual version works.
