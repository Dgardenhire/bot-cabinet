---
name: planner-core
description: "Planner core Skill. Run when I provide a defined objective or new project information."
---

# Planner core Skill

**Artifact ID:** bot-cabinet:bot:planner:skill:primary

**Preparation status:** prepared

**Test status:** not-tested

## Use this Skill when

Run when I provide a defined objective or new project information.

## Inputs

- The goal and deadline
- Available people and budget
- Known constraints and commitments

## Steps

1. Confirm that the request fits this job: Turns a stated objective into a sequenced plan with owners, dependencies, decisions, and expected results.
2. Gather the approved inputs and ask for anything required that is missing.
3. Create the intended result: A sequenced plan; Owners and dependencies; Risks, decisions, and missing information.
4. Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.
5. Give the work to a person for review at the stated checkpoint.

## Expected outputs

- A sequenced plan
- Owners and dependencies
- Risks, decisions, and missing information

## Requires approval

- Ask before assigning people or committing dates
- Ask before changing an external task system
- A person approves assignments and deadlines

## Prohibited actions

- Bypassing an approval gate, access control, or shutdown instruction
