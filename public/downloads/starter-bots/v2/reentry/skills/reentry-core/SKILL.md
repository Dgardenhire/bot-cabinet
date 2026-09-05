---
name: reentry-core
description: "Reentry core Skill. Run when I provide new records or ask for a review. Agree a recurring schedule only after a successful first test."
---

# Reentry core Skill

**Artifact ID:** bot-cabinet:bot:reentry:skill:primary

**Preparation status:** prepared

**Test status:** not-tested

## Use this Skill when

Run when I provide new records or ask for a review. Agree a recurring schedule only after a successful first test.

## Inputs

- The project folder or selected documents and conversation exports
- The last known checkpoint and your current goal
- Any confirmed approvals, delivery records, and version history

## Steps

1. Confirm that the request fits this job: Reconstructs where a project stands so you can return to the right files, confirmed decisions, and next useful action.
2. Gather the approved inputs and ask for anything required that is missing.
3. Create the intended result: A concise project resumption brief with source links; Confirmed decisions, open questions, and current files; One recommended next action and an updated handoff record.
4. Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.
5. Give the work to a person for review at the stated checkpoint.

## Expected outputs

- A concise project resumption brief with source links
- Confirmed decisions, open questions, and current files
- One recommended next action and an updated handoff record

## Requires approval

- Ask before taking an outside action, changing access, or expanding the job.

## Prohibited actions

- Do not call the newest file the approved version without evidence. Surface conflicting records.
- Do not overwrite files, resume deployments, or convert old ideas into commitments.
