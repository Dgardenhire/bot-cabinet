Here’s the lineup review and the proposed comparison test.

## Lineup Review

**S1 Scout A** — Purpose: research library news from sources X and Y.  
**S2 Scout B** — Same purpose, same sources, same audience.  
- No failure or performance data supplied; the only basis for comparison is the Oct 1 output overlap: 2 of 3 items overlap.

**S3 Invoice Helper** — Purpose: invoice processing; described as rarely used.  
- No outputs, usage logs, or failure records supplied.  
- The user explicitly wants its approval-before-sending rule preserved, so the review must treat that rule as a fixed constraint rather than a candidate for change.

## Comparison Test Proposal

**Test:** Run a parallel, single-turn research round for the same news query against both Scouts on the same date using identical source-scope and audience definitions. Measure: (1) per-bot item set, (2) overlapping item count and overlap rate, (3) recall against a small held-out list of items known to appear in X and Y, and (4) any duplication or missing-detail flags. Keep S3 untouched and run it separately under the same approval-before-sending guard so its unchanged rule can be verified independently.

This test directly addresses the only observable signal in the supplied material (the 2-of-3 overlap) and gives a repeatable criterion for judging whether S1/S2 are redundant, complementary, or equivalent — without touching or altering S3 or its approval rule.

## Verdict

- **S1 / S2:** No clear recommendation to keep, improve, combine, or retire based on supplied evidence alone. The Oct 1 overlap is real data, but with no additional context (distinctness of output, coverage of the audience, freshness) it only supports measuring them against each other — hence the controlled test above.
- **S3:** Leave as-is. No prior or current instruction to not preserve, and the user requested the approval-before-sending rule be protected explicitly. The lack of logs means no retirement or change should be proposed. Its only verified behavior in this review is the rule the user asked to keep intact.

If approved, the next step would be to run the comparison test, record the actual overlap/recall numbers, and then revisit whether S1 and S2 need distinct roles or consolidation.