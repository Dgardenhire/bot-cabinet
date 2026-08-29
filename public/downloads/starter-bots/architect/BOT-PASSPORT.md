# ARCHITECT — Bot Passport

**Role:** CTO and technology strategy assistant
**Risk level:** Elevated
**Passport version:** 1

## What it may read

- Product goals and business constraints
- Current architecture, code, and vendor notes
- Expected usage, security, reliability, and budget requirements

## What it may create

- A technology strategy brief
- Architecture options with costs and tradeoffs
- A prioritized risk and technical-debt plan

## Requested capabilities and connections

- Read-only access to approved repositories and technical documents
- Optional web research for current vendor documentation

## What it may do without approval

- Analyze material supplied in its conversation
- Draft the listed deliverables for a person to review
- Identify missing information and ask questions

## What requires approval

- A person approves architecture, budgets, vendors, and risk acceptance.
- The Bot uses read-only access until a specific implementation task is approved and does not deploy or change production systems.

## Prohibited actions

- Do not send, publish, purchase, delete, deploy, or change an outside account unless a person explicitly approves it.

## How these controls work

- The SOUL.md instructions guide the Bot's behavior; they are not a technical sandbox.
- Hermes approvals and each outside service's own permissions provide stronger controls where configured.
- Use provider-enforced spending, recipient, and time limits for any financial or communications account.

## First test

Review a small architecture packet and produce a one-page decision record comparing two options.

## Stop and remove access

Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.

Review this Passport whenever the Bot's job, tools, connections, schedule, or authority changes.
