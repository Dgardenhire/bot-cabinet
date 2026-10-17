**Result**

Reported defect (fictional, supplied): required company-name field accepts three spaces but should reject a blank name.

**Reproduction steps (unrun — no sandbox supplied)**
1. Open the sandbox form containing the required company-name field.
2. Leave the field empty, or enter exactly three space characters (`"   "`).
3. Submit the form.
4. Observe whether submission is accepted (defect) or rejected with a required-field error (expected).

**Expected behavior:** A value of only whitespace (`"   "`) must be treated as blank and rejected with the required-field validation error.

**Observed (per report):** Three spaces are accepted as a valid company name.

**Smallest reproduction input:** `"   "` (three ASCII spaces) submitted as the company-name value.

**Regression test proposal (would fail before repair, pass after)**
- Test name: `company_name_rejects_whitespace_only`
- Setup: render/submit the form with company-name = `"   "`.
- Assert: submission is rejected AND a required-field validation error is shown for company-name.
- Also assert: `"Acme Corp"` (non-blank) still submits successfully (guard against over-rejection).

**Cause status:** Still a guess — not demonstrated. Likely the validation trims or checks `length > 0` incorrectly (e.g., checks truthiness/length without `.trim()`, or trims only on display). Cannot confirm without inspecting the validation code and running.

**Missing information:** the form implementation, validation function, field schema, and any existing tests; access to a runnable sandbox.

**Next owner:** developer/bug fixer to implement trim-aware required validation and run the proposed test.

**Action awaiting approval:** none requested; no tools/accounts touched.