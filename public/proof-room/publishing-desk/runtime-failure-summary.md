# Publishing Desk runtime handoff — failed acceptance

Run date: September 20, 2026
Platform: Hermes Agent Python runtime
Runtime revision: `v2026.8.31-11812-g4d14aaf477`
Provider: Nous
Requested model: `deepseek/deepseek-v4-flash`
Tools enabled: none
Human publication approval: not given

## What ran

Five profiles from the Publishing Desk 2.0.0 bundle were imported into an isolated Hermes project home. Scout, Researcher, Story, Writer and Editor each received the original fictional source packet plus the preceding handoff. A separate Editor retry and a later audit-only Editor experiment were also preserved.

Tested 2.0.0 bundle SHA-256: `b5f47f0c3d0108f8a3ea42a43ccd63c9b54c3a3678290c55ada76e91feb46c6c`. The current downloadable bundle may be a later candidate and is not represented by this fingerprint.

This was Codex-orchestrated through the Hermes runtime. It was not an autonomous workforce or a Hermes Desktop UI test.

## Result

The handoff **failed acceptance**.

- Scout proposed “Register Now” before the supplied registration date; the handoff review corrected it.
- Researcher produced an adequate evidence brief for the fixture.
- Story produced a usable structure, but one line could imply promised attendance rather than capacity.
- Writer invented volunteers, item eligibility and focus, parts availability, timing, demand and registration rules.
- The original Editor hit its iteration limit and retained invented facts while claiming correction.
- The expanded Editor retry completed but retained unsupported claims and misstated the newsletter word count.
- The later audit-only Editor identified the central unsupported claims, but did not prove complete sentence coverage or produce a corrected deliverable.

The available nonzero provider-derived estimates across the original run totaled about $0.000981, excluding stages whose cost was not captured. The audit-only experiment later reported an estimate of $0.000318312. These estimates are not invoices or a complete cost guarantee.

## Deterministic regression gate

The preserved Writer draft is now paired with a twelve-sentence audit fixture. The deterministic gate verifies exact sentence coverage and literal source passages, then blocks the draft because six sentences are unsupported and four are ambiguous.

A structurally valid audit still reports semantic support, factual accuracy and human approval as unverified. The gate prevents a false pass; it does not turn the failed draft into trustworthy copy.

## Required next proof

Run a bounded corrected rewrite against this fixture and an unseen fixture. The length gate must either confirm the requested range or preserve an explicit source-shortfall declaration; a model cannot earn a pass by padding thin evidence. Both cases must pass the audit gate and semantic source review, then receive a human publication decision before Publishing Desk can be labeled a successful crew demonstration.
