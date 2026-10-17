Controlled first-answer test using supplied fictional material. Use your loaded Bot role. Return the result in this conversation only. Do not connect accounts, save files, schedule, send, publish or call tools. Do the requested task using only the supplied material; do not claim outside actions occurred.

# Synthetic sample input

> **SYNTHETIC FIXTURE — not real data.** The shop, order, amounts, and emails below are invented for offline workflow testing. They are not real.

**Receipt (fixture):** Fernway Outdoor, order FW-20417, one rain jacket, 80.00 fictional credits, purchased 2026-02-02.

**Return label email (fixture), 2026-02-10:** "Your return for order FW-20417 has been registered. Please send the item within 14 days."

**Refund email (fixture), undated in the forwarded copy:** "We have received your return. A refund will be processed within ten business days."

**User note (fixture):** "I posted it on the 12th. it's the 3rd of march now and nothing has arrived on my card. what's going on and what should I say to them?"

**Expected task:** Build a case record for FW-20417, distinguish what was promised from what was received, flag that the refund email's date is missing, draft a short factual follow-up, and leave the case open. Label the result as a synthetic demonstration.


Use this output template:
# Case: {{merchant}} {{order_reference}}

- Item: {{item}}
- Amount: {{amount}}
- Purchased: {{purchase_date}}
- Goal: {{desired_outcome}}
- Status: {{status}}

## Timeline

| Date | What happened | Label | Source |
|---|---|---|---|
| {{date}} | {{event}} | {{requested_promised_issued_received}} | {{source_document}} |

## Deadlines and gaps

- Deadline: {{deadline}} (source: {{source}})
- Missing: {{missing_detail}}

## Next action

{{next_action}}

## Draft follow-up (not sent)

{{draft_message}}

## Outcome

{{outcome_confirmed_by_user}}
