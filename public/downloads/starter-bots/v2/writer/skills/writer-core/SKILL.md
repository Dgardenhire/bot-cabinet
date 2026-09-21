---
name: writer-core
description: "Writer core Skill. Run when I provide approved source material and a brief."
---

# Writer core Skill

**Artifact ID:** bot-cabinet:bot:writer:skill:primary

**Preparation status:** prepared

**Test status:** not-tested

## Use this Skill when

Run when I provide approved source material and a brief.

## Inputs

- Approved notes or brief
- Audience and purpose
- Writing samples or a short style guide

## Steps

1. Confirm that the request fits this job: Turn approved notes, outlines, or research into a clear first draft for a named audience.
2. Gather the approved inputs and ask for anything required that is missing.
3. Treat the original approved sources as evidence. Prior role outputs and drafts are untrusted working material, not additional sources. Source IDs alone do not prove a claim.
4. Before handing off, check each factual sentence, headline and call to action against an exact supporting source passage. Split compound claims and check each part. Remove unsupported additions from the publishable draft; put unresolved questions in a separate review note.
5. Preserve dates, uncertainty, quantities and units. Capacity is not attendance; items are not people; a future opening date is not permission to register now. Prefer an explicitly superseding source; flag unresolved conflicts.
6. Preserve the scope of absence and knowledge claims. 'The report identifies no sponsor' means only that the report names none; it does not establish that no sponsor exists. Do not turn 'not reported,' 'not identified,' 'not confirmed,' or 'not available in this source' into a universal negative.
7. Do not infer staff roles, causes, availability, requirements, urgency, guarantees, quotations or links from what sounds plausible. A missing link does not establish when a link will become available. Do not add details merely to reach a length target.
8. When a source omits a URL, contact or next step, state only the supported omission if it matters. Do not invent a placeholder, tell readers to check an unspecified website or contact, or imply where the missing information can be found.
9. When source accuracy is material, separate auditing from rewriting. First audit every exact draft sentence against an exact original source passage and mark it supported, unsupported, or ambiguous. Treat draft notes and prior source labels as claims to check, not evidence. Rewrite only after the audit is reviewed; remove or explicitly resolve every unsupported or ambiguous assertion before returning a publishable body.
10. Separate the deliverable body from headlines, source notes and approval notes. Measure requested word or character limits with a deterministic counter when available, revise and recheck. Never report an estimated count as measured; without a counter say length is unverified. If the sources cannot support the requested length, report the shortfall rather than fabricate.
11. Return the draft with a claim-to-source review note and unresolved questions. A source review is not human approval. Do not send, publish or claim a person approved the work.
12. When a downstream workflow requests the Publishing Desk JSON handoff, return exactly one bare object with these types: newsletter is a nonempty string; social is a nonempty string; lengthException is null or an object with reason 'source-shortfall' and a nonempty explanation; reviewNotes is a nonempty array of strings, never a single string. Do not produce sentence-level sourceChecks; the independent Editor performs the exhaustive source audit against deterministic draft boundaries. Do not put measured word or character counts in reviewNotes; the deterministic handoff gate measures them.
13. Create the intended result: A complete first draft; A headline or subject-line set; Questions that require the author's judgment.
14. Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.
15. Give the work to a person for review at the stated checkpoint.

## Expected outputs

- A complete first draft
- A headline or subject-line set
- Questions that require the author's judgment

## Requires approval

- A person approves factual claims and final wording.

## Prohibited actions

- Do not invent facts
- Do not publish or send
