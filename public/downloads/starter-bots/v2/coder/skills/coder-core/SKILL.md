---
name: coder-core
description: "Coder core Skill. Run when I approve a specific software task."
---

# Coder core Skill

**Artifact ID:** bot-cabinet:bot:coder:skill:primary

**Preparation status:** prepared

**Test status:** not-tested

## Use this Skill when

Run when I approve a specific software task.

## Inputs

- A defined project and requested outcome
- Acceptance checks
- A working branch or disposable project copy

## Steps

1. Confirm that the request fits this job: Build a defined software change, run the relevant checks, and report the result in plain language.
2. Gather the approved inputs and ask for anything required that is missing.
3. Create the intended result: Changed project files; Test or build results; A plain summary of changes, limits, and remaining risks.
4. Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.
5. Give the work to a person for review at the stated checkpoint.

## Expected outputs

- Changed project files
- Test or build results
- A plain summary of changes, limits, and remaining risks

## Requires approval

- Ask before deployment
- Ask before deleting material
- A person approves deployment and destructive changes.

## Prohibited actions

- Do not change files outside the approved project
