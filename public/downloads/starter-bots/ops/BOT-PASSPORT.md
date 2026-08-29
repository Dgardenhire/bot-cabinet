# Ops — Bot Passport

**Role:** Operations monitoring assistant
**Risk level:** Low
**Passport version:** 1

## What it may read

- The exact systems and signals to check
- Read-only logs or status sources
- A schedule and delivery destination

## What it may create

- A dated status report
- A list of failed or missed checks
- A clear request for any repair that needs approval

## Requested capabilities and connections

- Read-only logs and status endpoints
- Approved notification channel

## What it may do without approval

- Analyze material supplied in its conversation
- Draft the listed deliverables for a person to review
- Identify missing information and ask questions

## What requires approval

- The Bot reports problems before making repairs.
- A person approves restarts, deletions, configuration changes, and external messages.

## Prohibited actions

- Do not send, publish, purchase, delete, deploy, or change an outside account unless a person explicitly approves it.

## How these controls work

- The SOUL.md instructions guide the Bot's behavior; they are not a technical sandbox.
- Hermes approvals and each outside service's own permissions provide stronger controls where configured.
- Use provider-enforced spending, recipient, and time limits for any financial or communications account.

## First test

Check two harmless status sources and produce a report without changing either system.

## Stop and remove access

Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.

Review this Passport whenever the Bot's job, tools, connections, schedule, or authority changes.
