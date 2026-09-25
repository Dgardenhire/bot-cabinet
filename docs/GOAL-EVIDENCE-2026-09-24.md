# Bot Cabinet discovery-to-use goal evidence — September 24, 2026

This is an internal evidence record. It is not public site copy and does not upgrade prepared or local work to shipped work.

## Proved

### A real Hermes Desktop plugin task run

- The unified Bot Cabinet plugin loaded the live catalog in Hermes Desktop.
- It previewed and installed the Daily Newspaper archive in an isolated profile.
- The installed profile completed one bounded task using fictional material.
- The result cited each supplied item, preserved a missing meeting link as a review note, caught an inconsistent weekday and made no outside changes.
- Hermes reported two model calls, 30,079 tokens and an estimated cost of `$0.00299147`.
- Evidence: `../bot-cabinet-hermes/docs/ACCEPTANCE-2026-09-23.md` and the public runtime summary referenced by the first-user walkthrough.

### A production analytics baseline

- The September 13–20 production window recorded 90 visitors, 281 page views and 51% bounce rate.
- The visible custom-event panel included 12 profile downloads from seven visitors and one install-command copy.
- These counts are not a cohort funnel and do not prove task completion or return use.
- Evidence: Cabinet Keeper package `ANALYTICS-BASELINE-2026-09-20.md`.

### Two live, zero-model Keeper jobs

- The cloud Keeper dashboard showed the public-site job scheduled every 15 minutes and the GitHub-public job every 30 minutes.
- The cloud log showed both jobs firing on September 24–25 and the Files view contained timestamped output records.
- The cron summaries contain `Status: silent (empty output)` when a successful check has nothing that requires attention. The underlying Keeper event logs preserve the actual result.
- The latest inspected public-site event was `ok` with no issues after checking eight pages, eight social images, 100 catalog references, three core API resources and five representative artifacts.
- The latest inspected GitHub event was `ok` with no issues after checking 1,190 public repository paths at main commit `18e90c972d05ef970875c53c32f82cc683973460`.
- The model-backed daily radar remained paused.
- Both live jobs currently deliver to `Local`. The cloud instance has no messaging or push channel configured; only its API server is connected.
- This proves that both schedules fire and that their latest checks passed. It also proves that a prompt external alert is not presently configured; the urgent-defect delivery path still needs an end-to-end exercise.

## Partly proved

### First-user walkthrough

- `FIRST-USER-WALKTHROUGH-2026-09-23.md` records a clean path from Agent Watch to Daily Newspaper, the plugin setup and the bounded result.
- That walkthrough found and corrected a real recommendation/status contradiction.
- It was not observation of an unaffiliated first-time visitor and predates the current unshipped Agent Watch changes.

### First-use and return-use measurement

- The local site contains bounded first-result, friction, return-visit and repeat-run events.
- The September 20 production baseline predates those local changes.
- No post-deployment first-result or return-use results have been recorded.

### Current discovery coverage

- The local Agent Watch candidate now distinguishes Bots, agent products, releases and agent infrastructure across fourteen named sources.
- Nasiko is represented as examined infrastructure, not as a tested Bot.
- The Grok fleet example and Nasiko link supplied by Damon were submitted through Keeper's deterministic intake into a private two-item review queue at `keeper-state/goal-cycle-20260924`.
- Submitting the identical Nasiko record again returned `status: unchanged` and `queue_changed: false`, proving exact-source deduplication without a model call or external message.
- Both items remain `awaiting-human-review`; no recommendation, implementation authority or publication approval was invented.
- The expanded Keeper package passed all 91 bounded Python tests on September 24. Its updated 50-file `MANIFEST.sha256` then verified every declared file, including the expanded source registry and landscape tests.
- The three changed site test files passed all eight targeted tests after correcting two public-copy mismatches.
- The complete existing application suite then passed 63 source test files with 300 tests plus 15 package and editorial tests. ESLint and the no-output TypeScript check also passed.
- The current edits have not received the full build, commit or deployment verification.

## Not yet proved

- The cloud Keeper does not run the deterministic landscape sensor or private review-queue renderer.
- The fail-closed paid-radar budget gate and weekly proposal gate are locally tested but not installed in the cloud.
- No live Keeper finding has completed the sequence: detected → deduplicated → reviewed by a person → approved update → verified result.
- No urgent-defect delivery path has been demonstrated end to end.
- No post-deployment first-use or return-use measurement window exists.

## Current execution boundary

The host had 15 GiB free on `/System/Volumes/Data` at the latest check, below the required 20 GiB reserve. Builds, PDF rendering and the full verification suite remain stopped. The unrelated `agent-demo` Lima VM was identified as the likely active space consumer, but it has not been stopped or modified without permission.
