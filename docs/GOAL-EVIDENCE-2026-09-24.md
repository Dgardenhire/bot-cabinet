# Bot Cabinet discovery-to-use goal evidence — September 24, 2026

This is an internal evidence record. It is not public site copy and does not upgrade prepared or local work to shipped work.

## Proved

### A real Hermes Desktop plugin task run

- The unified Bot Cabinet plugin loaded the live catalog in Hermes Desktop.
- It previewed and installed the Daily Newspaper archive in an isolated profile.
- The installed profile completed one bounded task using fictional material.
- The result cited each supplied item, preserved a missing meeting link as a review note, caught an inconsistent weekday and made no outside changes.
- Hermes reported two model calls, 30,079 tokens and an estimated cost of `$0.00299147`.
- The plugin's current tree was rechecked on September 24: all 24 Python policy/package/API tests and all three catalog-model tests passed.
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
- The local Agent Watch feed now has a bounded parser for the official Grok Bot Marketplace instead of treating GrokHub as a substitute. Against the public marketplace page on September 24, it extracted all 81 current templates with their names, creators, descriptions and stable x.ai links. The source does not publish reliable listing dates, so the site labels these as current listings and does not claim that marketplace order proves recency.
- The official-marketplace parser rejects oversized responses, malformed records, unsafe identifiers and off-domain listing links. Five Deno parser/feed tests, ten focused site tests, Deno type checking, TypeScript and ESLint passed for this change.
- The Grok fleet example and Nasiko link supplied by Damon were submitted through Keeper's deterministic intake into a private two-item review queue at `keeper-state/goal-cycle-20260924`.
- Submitting the identical Nasiko record again returned `status: unchanged` and `queue_changed: false`, proving exact-source deduplication without a model call or external message.
- Both items remain `awaiting-human-review`; no recommendation, implementation authority or publication approval was invented.
- Keeper's own official-marketplace sensor was corrected to read the current embedded catalog instead of relying only on the marketplace's older link layout. It keeps that older parser as a fallback, baselines the first successful run without flooding the queue, and emits private candidates only for added or changed templates.
- A pre-install audit found that later source-registry work had made five manifest hashes stale and left the My Bot Farm sensor and its test out of the release manifest. The manifest now covers all 57 declared files; every hash verifies and all 96 bounded Python tests pass. No cloud file was changed during this repair.
- The three changed site test files passed all eight targeted tests after correcting two public-copy mismatches.
- The complete existing application suite then passed 63 source test files with 300 tests plus 15 package and editorial tests. ESLint and the no-output TypeScript check also passed.
- The website branch now connects the current-listings interface to the existing public Agent Watch Edge function instead of an incompatible Next.js server route. The Edge implementation checks fourteen named live sources and returns a bounded, mixed sample with per-source status. TypeScript, focused parser/UI tests and Deno checking pass.
- The first attempt at this change failed CI because the site is a static export and the proposed dynamic route could never run there. That route was removed; commit `720c642` passed the complete GitHub CI suite and its Vercel preview. PR #21 remains unmerged, and the updated Edge function has not been deployed, so the public site does not yet receive the fourteen-source live result.

### Platform choice after discovery

- Every Bot detail page on the current branch now offers separate setup paths for Hermes Agent, Grok Bot, ChatGPT Workspace Agents, Claude and the platform-neutral Bot Pack.
- A new source-linked guide explains how to carry the job, limits, approval points and first test into ChatGPT or Claude without claiming that files install identically across platforms. It uses Chief of Staff as one worked example and distinguishes Cowork from Claude Code and Artifacts.
- The ChatGPT and Claude adapters are labeled `Setup guide · test pending`; neither has been installed or task-tested. This work is included in commit `720c642` on unmerged PR #21.

## Not yet proved

- The cloud Keeper does not run the deterministic landscape sensor or private review-queue renderer.
- The fail-closed paid-radar budget gate and weekly proposal gate are locally tested but not installed in the cloud.
- No live Keeper finding has completed the sequence: detected → deduplicated → reviewed by a person → approved update → verified result.
- No urgent-defect delivery path has been demonstrated end to end.
- No post-deployment first-use or return-use measurement window exists.
- The fourteen-source Agent Watch Edge function is not deployed, and PR #21 is not merged. A green preview proves the static build, not the public live feed.
- No ChatGPT Workspace Agent or Claude plugin generated from a Cabinet Bot has completed its first-task test.

## Current execution boundary

The host had 11 GiB free on `/System/Volumes/Data` at the latest check, below the required 20 GiB reserve. Builds, PDF rendering, packaging and the full verification suite remain stopped. The running Hermes `agent-demo` Lima VM has not been stopped, deleted, resized or otherwise modified, in accordance with Damon's explicit direction.
