# Release Crew

Turn one approved software change into something that has been built, checked, and reviewed.

Category inspiration: Night Shift, from the supplied @unicodef1wn chart.
Cabinet treatment: Expand Product Delivery Crew.
Version: 0.1 · October 6, 2026.
Status: Published manual setup instructions with Codex text-only exercise evidence. Native imports, tools, and Bot-to-Bot handoffs remain untested.

Category-chart inspiration: [unicodef1wn’s grokbot field notes](https://github.com/unicodef1wn/grokbot-field-notes). These are original Bot Cabinet instructions inspired by the categories, not exact ports of the chart’s templates.

## Bots and jobs

| Bot | Treatment | Job |
|---|---|---|
| [Planner](https://botcabinet.com/bots/planner/) | Existing Cabinet Bot | Define what should change and the conditions for success. |
| [Founding Engineer](https://botcabinet.com/bots/founding-engineer/) | Existing Cabinet Bot | Implement the agreed change inside the approved project. |
| [Bug Examiner](../specialists/bug-examiner.md) | Published manual role | Independently reproduce the problem and check the repaired behavior. |
| [Change Reviewer](../specialists/change-reviewer.md) | Published manual role | Review the exact change and evidence for overlooked risks. |

Use Architect when a technical decision is consequential. Use Ops for a single approved post-release check. A night schedule is optional and must specify the host, repository, test budget, failure stop, and approval rules. Overnight work is not the default.

## When a crew helps

Implementation, testing, and review benefit from separate responsibilities. The reviewing role must not be the role that authored the change. For a tiny personal script, one Coder plus human review may be enough.

## Bring these inputs

Named repository and sandbox, problem description, allowed files, test commands, existing failures, acceptance conditions, and merge/deployment owner.

## Set up and run

1. Select only the roles this job needs. Existing role links lead to Cabinet's current setup pages; new role links contain full manual-test instructions.
2. Put each selected role in its own conversation or Bot. Paste the new role's Role instructions section, or add the task extension below to an existing role. These files are not native import archives or add-to-app links.
3. Start with the fictional first task below. Supply the same approved source records to each role that needs them. A copied handoff alone is not evidence for a factual claim.
4. Pass reviewed results in the order below. If your app lacks Bot-to-Bot handoff, copy the small handoff yourself. Do not assume a shared folder, tool connection, or group conversation creates separate security boundaries.
5. Record each actual answer and failed attempt. Review before connecting real accounts or adding a schedule. Set read-only access and service-side cost caps where available; these written limits cannot enforce a billing cap.

## Who passes what to whom

1. Planner fixes the requirement and permitted scope. Preserve the original revision for comparison before making changes.
2. Bug Examiner records the original problem against that revision in the approved sandbox, or marks the reproduction unrun if tools are missing.
3. Founding Engineer makes the approved repair and returns the exact changes and actual command results.
4. Bug Examiner reruns the same cases against the revised version, keeping before-and-after results and any new failures.
5. Change Reviewer compares the changes and independent evidence; the person decides whether to merge and deploy.

Use this handoff:

- Task and current version:
- Approved source records:
- Result and its status: draft, checked, or approved:
- Unresolved questions:
- Next owner and action:
- External action awaiting specific approval:

If a role cannot finish, it returns the missing input or failed attempt. The next role must not manufacture a success record.

## Task extensions for existing Bots

### Planner

Keep the existing Bot's role and boundaries. For this crew: Define what should change and the conditions for success. Define the outcome, scope, owners, dependencies, deadline, and conditions for success from confirmed requirements. Use only the input assigned to you for this task. Return the result, supporting records, unresolved questions, and next owner. A handoff does not approve an external action.

### Founding Engineer

Keep the existing Bot's role and boundaries. For this crew: Implement the agreed change inside the approved project. Build the smallest approved change inside the named project. Record actual changes, commands, failures, and evidence. Do not merge or deploy without approval. Use only the input assigned to you for this task. Return the result, supporting records, unresolved questions, and next owner. A handoff does not approve an external action.

## First task

Fictional requirement: a required company-name field must reject whitespace but accept Acorn Tutors. Have Planner write cases, Founding Engineer propose the smallest repair, Bug Examiner prepare checks for empty, whitespace, and valid text, and Change Reviewer examine the evidence. No repository is supplied, so all implementation and runtime checks remain proposed.

## Check the result

- Defines all three input cases before a repair is judged.
- Keeps implementation evidence separate from an independent review.
- Claims no edit, run, passing test, merge, or deployment in the no-repository sample.
- When used with a real sandbox, preserves commands, actual results, and failures.

Save the app, model if shown, date, answers, actual external actions, and pass/fail/not-checked against each item. A written checklist or a favorable review does not prove a runtime pass.

## Limits for this sample

One approved change. No schedules, dependency installation, production writes, or retries without a defined limit. Apply the user's disk rules before any real build.

Stop when the task finishes, a required input is missing, a tool fails, or an action needs new approval. No automatic retries. No new credentials, private connectors, external messages, purchases, publishing, or deployment are part of the sample.

## Finished output

A requirement, exact change or proposed patch, reproduction evidence, and release review.


## Exercise evidence

The [collection record](../specialists/collection.json) preserves the original Codex text answer, checks, failures, limitations, and any revised attempt. These records are instruction exercises, not native-app validation. Proposed operational tests remain unrun where the record says so.
