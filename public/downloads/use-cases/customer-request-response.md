# Customer request response

Designed for: Small organizations that need consistent first drafts for routine customer questions

Result: A clear response draft based on approved policies, with exceptions sent to a person.

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

## Overall request

Prepare a response draft to this customer request using only the approved policy files. Cite the policy internally and mark any exception, refund, promise, or escalation for a person.

## Decisions for a person

- Approve exceptions, refunds, and promises
- Handle sensitive or upset customers
- Send the final response

## First test

Use fictional requests that cover one routine case and one required escalation.

## Hermes Desktop setup

1. Open each Bot's page in Bot Cabinet's Hermes Bots collection and follow its manual Hermes Desktop setup steps.
2. Run each step in that Bot's own chat and review the result.
3. Pass the approved result to the next Bot with the message provided for that step.
4. After the sequence works, you may create a group with the same Bots.
5. In a group, @mention the Bot you want. Membership order does not control who responds.
