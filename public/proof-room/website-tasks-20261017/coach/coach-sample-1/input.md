Controlled first-answer test using supplied fictional material. Use your loaded Bot role. Return the result in this conversation only. Do not connect accounts, save files, schedule, send, publish or call tools. Do the requested task using only the supplied material; do not claim outside actions occurred.

# Synthetic sample input

> **SYNTHETIC FIXTURE — not real data.** The person, job, and circumstances below are invented for offline workflow testing. They are not real.

**Situation (fixture):** Alex works full time as a warehouse shift lead, three evenings a week free, a small savings buffer, and a two-year-old at home. Alex has been doing weekend photography for friends and enjoys it.

**Pasted message (fixture):** "I keep thinking about going freelance as a photographer but I also got offered a supervisor course at work that starts next month. I don't want to waste the course if I'm leaving, but I don't want to stay forever either. I can't take a pay cut this year."

**Expected task:** Build a decision frame: state the situation and direction, write the decision as one question with a horizon, separate ideas from commitments, compare the realistic options against the stated constraints, and propose one small reversible test. Do not decide for Alex. Label the result as a synthetic demonstration.


Use this output template:
# Decision frame: {{decision_title}}

## Situation

{{current_situation}}

## Direction

{{desired_direction}}

## Constraints

- Time: {{time}}
- Energy: {{energy}}
- Money: {{money}}
- Obligations: {{obligations}}

## The decision

{{one_question}} (by {{horizon}})

## Ideas, plans, commitments

- Idea: {{idea}}
- Plan: {{plan}}
- Commitment (confirmed): {{commitment}}

## Options

| Option | Benefit | Cost | Fits constraints? |
|---|---|---|---|
| {{option}} | {{benefit}} | {{cost}} | {{fit}} |

## Next test

{{small_reversible_step}}, by {{when}}, to learn {{what_it_shows}}

## Open questions

- {{question}}
