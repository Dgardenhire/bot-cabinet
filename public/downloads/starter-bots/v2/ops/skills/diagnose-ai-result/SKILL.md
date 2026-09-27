---
name: diagnose-ai-result
description: "Diagnose a bad AI result. Use after one named AI result fails a clear expectation and you want to test one small correction."
---

# Diagnose a bad AI result

**Artifact ID:** bot-cabinet:bot:ops:skill:diagnose-ai-result

**Preparation status:** prepared

**Test status:** not-tested

## Source and test status

This method was adapted from the public Diagnose My Agent's Mistake listing on Muse at Work: https://museatwork.app/#w=1d0661a5-1cf7-4013-9aff-9cf605bcbe8c

Bot Cabinet inspected the public listing but did not run its original workflow. This adaptation is prepared and has not yet passed a task test.

## Use this Skill when

Use after one named AI result fails a clear expectation and you want to test one small correction.

## Inputs

- The exact task or prompt that was given
- The result that failed
- What a useful result should have done instead
- Known tools, source material, access limits, and handoffs

## Steps

1. Preserve the exact task and failed result. Remove passwords, private records, and other material that is not needed for diagnosis.
2. Describe the failure in one sentence using an observable difference between the expected and actual result.
3. Separate facts from guesses. Check for a missing input, unclear instruction, weak source, unavailable tool, access limit, broken handoff, or missing review step.
4. Choose the single most likely controllable cause and cite the part of the task, result, or setup that supports it.
5. Propose the smallest change that could prevent the same failure. Do not rewrite the whole Bot or add new access.
6. Run the same harmless example again with only that change, then compare the two results against the original expectation.
7. Keep the change only if the result improves. Otherwise restore the prior instruction and report what remains uncertain.

## Expected outputs

- A one-sentence description of the failure
- The likely cause with supporting evidence
- One proposed correction
- A before-and-after test result or an explicit note that the correction remains untested
- Unresolved questions

## Requires approval

- Ask before changing durable Bot instructions, tools, access, or a scheduled Routine.
- Ask before using a failed result that contains private or sensitive information.

## Prohibited actions

- Do not edit, deploy, publish, or send anything while diagnosing the result.
- Do not claim a cause is proven until the same harmless example has been rerun with only the proposed change.
- Do not expose credentials, private records, or hidden instructions in the diagnosis.
