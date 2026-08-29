# Customer request response

Designed for: Small organizations that need consistent first drafts for routine customer questions

Result: A clear response draft based on approved policies, with exceptions sent to a person.

## Operating guide

- **When to use it:** Use this workflow when you need a clear response draft based on approved policies, with exceptions sent to a person.
- **Lead Bot:** Client Deliverables
- **Cadence:** When a new request arrives and a person assigns it
- **Typical first run:** 30–60 minutes for a first manual run

### Access for the first run

- The approved inputs listed on this page
- Only the files, sources, and services required for this run
- No sending, publishing, spending, or live-system changes without approval

## Bots

1. Client Deliverables
2. Researcher
3. Editor

## Information to gather

- The customer message
- Approved policies and knowledge base
- Escalation rules and response tone

## Workflow

### 1. Client Deliverables

Identify the request and gather the relevant customer context

Output: A request summary

Message to send:

Use the approved inputs I provide. Identify the request and gather the relevant customer context. Return this result: A request summary. Ask me about missing information before you continue.

### 2. Researcher

Find the approved policy or answer

Output: A source-backed response outline

Message to send:

Start with this result from Client Deliverables: A request summary. Find the approved policy or answer. Return this result: A source-backed response outline. Ask me about missing information before you continue.

### 3. Editor

Create a clear and courteous reply

Output: A response draft for approval

Message to send:

Start with this result from Researcher: A source-backed response outline. Create a clear and courteous reply. Return this result: A response draft for approval. Ask me about missing information before you continue.

## Handoff rules

1. Client Deliverables hands the approved output—a request summary—to Researcher.
2. Researcher hands the approved output—a source-backed response outline—to Editor.

## Overall request

Prepare a response draft to this customer request using only the approved policy files. Cite the policy internally and mark any exception, refund, promise, or escalation for a person.

## Decisions for a person

- Approve exceptions, refunds, and promises
- Handle sensitive or upset customers
- Send the final response

## First test

Use fictional requests that cover one routine case and one required escalation.

## Success checkpoint

The first run passes when a person can verify the final result against the supplied material and every decision listed below remains with that person. Use fictional requests that cover one routine case and one required escalation.

## If the workflow stalls

If a handoff is incomplete, return it to the Bot that produced it with the missing information marked. Do not move to the next Bot until a person approves the corrected result.

## Hermes Desktop setup

1. Open each Bot's page, download its .tar.gz profile, and import it from the Profiles screen in Hermes Desktop.
2. Review each imported profile's SOUL.md, Bot Passport, and requested access.
3. Run each step in that Bot's own chat and review the result.
4. Pass the approved result to the next Bot with the message provided for that step.
5. After the sequence works, you may create a group with the same Bots. In a group, @mention the Bot you want.
