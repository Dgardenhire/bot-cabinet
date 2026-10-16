Controlled first-answer test using supplied fictional material. Use your loaded Bot role. Return the result in this conversation only. Do not connect accounts, save files, schedule, send, publish or call tools. Do the requested task using only the supplied material; do not claim outside actions occurred.

# Synthetic sample input

> **SYNTHETIC FIXTURE — not real data.** The learner, course, and dates below are invented for offline workflow testing. They are not real.

**Learner (fixture):** Jo, adult evening student, 3 hours a week, quiz on 2026-04-14.

**Goal (fixture):** "I need to understand percentages properly for my bookkeeping course quiz. I can do 50% and 10% in my head but I get lost with things like 'what percent of 80 is 12' or percentage increase."

**Course notes (fixture):** "Unit 2: percentages. percent means per hundred. part = percent × whole. percentage change = (new − old) ÷ old × 100."

**Expected task:** Check the starting point, produce a one-week study plan that fits 3 hours, explain the first idea in plain language using the course notes as the source, and write five practice questions with the answers in a separate section. Label the result as a synthetic demonstration.


Use this output template:
# Study plan: {{subject}}

- Goal: {{goal}}
- Deadline: {{deadline}}
- Time available: {{hours_per_week}} per week
- Starting point: {{starting_point}}

## Plan

| Session | Topic | Length | Source |
|---|---|---|---|
| {{n}} | {{topic}} | {{minutes}} | {{source}} |

## Explanation: {{first_topic}}

{{plain_language_explanation}}

Worked example: {{example}}

## Practice

1. {{question}}

## Answers (keep separate)

1. {{answer}}

## Progress notes

- Right: {{right}}
- Revisit: {{revisit}}
