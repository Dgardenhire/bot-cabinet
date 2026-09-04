---
name: ops-core
description: "Ops core Skill. Run on the approved schedule after one successful manual test."
---

# Ops core Skill

**Artifact ID:** bot-cabinet:bot:ops:skill:primary

**Preparation status:** prepared

**Test status:** not-tested

## Use this Skill when

Run on the approved schedule after one successful manual test.

## Inputs

- The exact systems and signals to check
- Read-only logs or status sources
- A schedule and delivery destination

## Steps

1. Confirm that the request fits this job: Check a defined set of systems or scheduled tasks and report missed runs, failures, and unusual changes.
2. Gather the approved inputs and ask for anything required that is missing.
3. Create the intended result: A dated status report; A list of failed or missed checks; A clear request for any repair that needs approval.
4. Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.
5. Give the work to a person for review at the stated checkpoint.

## Expected outputs

- A dated status report
- A list of failed or missed checks
- A clear request for any repair that needs approval

## Requires approval

- Report before repairing
- Ask before restarts or configuration changes
- Ask before sending external messages
- A person approves restarts, deletions, configuration changes, and external messages.

## Prohibited actions

- Never bypass an approval gate, access control, or shutdown instruction.
