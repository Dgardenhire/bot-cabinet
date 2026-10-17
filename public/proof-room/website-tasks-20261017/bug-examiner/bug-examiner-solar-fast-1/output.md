**Reproduction steps (sandbox form, not executed):**

1. Open the company-registration form in the sandbox UI.
2. In the **Company Name** field, delete any existing text and confirm the field is blank.
3. Press **Submit** / **Continue**.
4. Observe the validation behavior.
5. Expected: the form rejects the blank name with a visible error (e.g., "Company name is required" or a red border), and the submission is blocked.
6. Actual: the field accepts three spaces as a valid entry and the form submits without a validation error, treating `"   "` as a populated company name.

Summary of the defect: the required `company_name` field fails to reject blank/whitespace-only input (`"   "`); three spaces pass validation, but a genuinely blank name should be rejected.

**Regression test (unit-level, pre-repair expected to fail, post-repair expected to pass):**

```python
def test_company_name_rejects_blank_and_whitespace_only():
    # Pre-repair: assert rejects blank-only input
    form = CompanyRegistrationForm(data={"company_name": "   "})
    assert form.is_valid() is False
    assert "company_name" in form.errors

    # Post-repair: blank input is also rejected
    form = CompanyRegistrationForm(data={"company_name": ""})
    assert form.is_valid() is False
    assert "company_name" in form.errors
```

This test should be placed in the form-validation test suite. Note: the sandbox form was not supplied, so the reproduction steps above are proposed, not executed, and no claim is made that the sandbox was actually run.