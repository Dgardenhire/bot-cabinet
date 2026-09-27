# Bot Cabinet discovery-to-use evidence — September 25, 2026

This internal record replaces stale status claims in the September 24 record. It distinguishes live proof from work that still needs a real visitor or an explicit approval.

## Live and verified

### Current discovery

- Agent Watch's public API returned six reviewed notes and a live sample of 120 listings drawn from fourteen sources.
- The source report covered 4,538 listings across the official Grok Bot Marketplace, My Bot Farm, GrokHub, BotDirectory, GrokBots.best, grokbot.dev, really.bot, Muse at Work, Grok Bot Field Notes, Hermes Agent, OpenClaw, OpenBot, GitHub and GitLab.
- All fourteen source checks reported healthy at `2026-09-25T06:38:41Z`.
- The sample is broad, but it still contains mirrored duplicates and low-signal software repositories. Source breadth is proved; consistently useful ranking is not.

### A useful task through the Hermes Desktop plugin

- The Bot Cabinet plugin loaded the live catalog, previewed and installed the Daily Newspaper archive in an isolated Hermes profile, and completed one bounded task using fictional material.
- The result cited the supplied items, preserved a missing meeting link as a review note, caught an inconsistent weekday and made no outside changes.
- Hermes reported two model calls, 30,079 tokens and an estimated cost of `$0.00299147`.
- Evidence: `../bot-cabinet-hermes/docs/ACCEPTANCE-2026-09-23.md` and `FIRST-USER-WALKTHROUGH-2026-09-23.md`.

### Keeper schedules and approved-update cycle

- The zero-model public-site job fired automatically at `2026-09-25T06:35:42Z`. Hermes accepted the scheduled run, completed it and advanced the next-run time without manual intervention.
- The latest public-site record checked eight pages, eight social images, 100 catalog references, three core API resources and five representative downloads with no issues.
- Keeper identified that production portrait files differed from reviewed source files. The correction was reviewed in pull request 22, merged, deployed and followed by a healthy download inventory at main commit `0787e0cf4f96122c7de6d47edf3a3244a5c88c85`.
- This proves one complete cycle: detected problem → human-approved change → deployment → post-deployment verification.

### Public Keeper status

- The append-only status table and the `keeper-status` and `keeper-status-publish` functions were deployed on September 25.
- A person approved revision 1. The public endpoint returned HTTP 200 and the live Trust page displayed the dated record.
- Four checks passed. The repository check correctly reported that dependency pull requests still needed attention.
- Keeper's maintenance queue led to a concrete security review of pull request 2. Production on Next 16.3.2 had one critical Next advisory and one high sharp advisory. Damon approved the merge; Next 16.3.6 deployed in commit `a365da1`, resolving sharp to 0.35.4. A fresh production-only audit reported zero vulnerabilities, GitHub's full repository verification passed and the live homepage returned HTTP 200.
- Keeper's post-deployment check then found the remaining `js-yaml` update stale. Pull request 4 was rebased, passed the repository checks, received approval, merged and deployed in commit `516f88a263a49fcdbe9eb1f647355c77f562a3d1`. Pull request 3 closed automatically because the Next upgrade had already supplied sharp 0.35.4.
- Damon approved one dedicated Keeper-only publishing secret on September 25. The same random secret is stored in Cabinet Keeper and the Supabase publishing function; it grants no billing, model, Ordos or Logos access.
- Cabinet Keeper then made two harmless probes without publishing a status. The authenticated request passed authorization and returned HTTP 400 because the deliberately invalid body had no approval record. The unauthenticated request returned HTTP 401. The secret was not printed, no file was changed and public revision 1 remained unchanged.
- The installed manual publisher expects a Keeper-side variable named `CABINET_KEEPER_STATUS_PUBLISH_SECRET`; that binding is now configured, while the unusable alias created during setup was removed. `CABINET_KEEPER_STATE_DIR` is also explicitly bound to `/opt/data/local/cabinet-keeper`, preventing manual tools from writing to a duplicated nested path.
- After both dependency deployments, Keeper reran the five source checks and prepared a fresh private candidate at `2026-09-25T16:36:38+00:00`. Public site, public GitHub state, download inventory, Agent Watch and the agent landscape all passed; the run used zero model calls and sent zero external messages.
- The preview-only publisher wrote the exact approval packet to `/opt/data/local/cabinet-keeper/reports/trust-status-publication.json`. The candidate JSON SHA-256 is `cf84047c781364679b393c26668d6d8903eae5f7ea1bd409348b13e52b68c900`; the approval-bound content SHA-256 is `64d453341c823e94a1a817f9e41017fe40865349e86aaa9b25e8bf08fc3024ed`.
- Authentication and the hash-bound approval preview are therefore verified. No publication request was made. A new public revision still requires Damon's explicit approval of that exact content hash.

## Measurement baseline

The production analytics window from September 18 through September 25 recorded:

- 77 visitors;
- 249 page views;
- 68 percent bounce rate;
- one profile download by one visitor;
- one install-command copy by one visitor; and
- one first-run profile download by one visitor.

The complete event list contained seven event names. It contained no `first_bot_run_reported`, `first_bot_run_friction_reported`, `repeat_bot_run_reported` or `returned_after_first_bot_result` event.

This is the first post-release first-use and return-use baseline: **zero reported first results and zero measured returns after a successful first result.** It proves that measurement is installed and receiving other events. It does not prove that anyone completed a useful task or returned because of it.

### Measurement defect found after the baseline

- The result and friction question was rendered only after all five setup checkboxes were marked complete. A visitor who became stuck could not report the blocking step.
- The local correction renders the bounded outcome question throughout the checklist. Its existing one-time record still accepts only `worked` or `stuck`; a stuck visitor can then choose one setup stage without submitting task text.
- A clean-context walkthrough then found that the first correction also enabled “Yes, it worked” at zero completed steps. The revised correction keeps “I got stuck” available throughout setup but disables a success report until the Run and Check steps are marked complete.
- Focused verification passes 16 tests across the checklist, outcome record, friction report and repeat-use prompt. This correction is prepared in pull request 23 and is not claimed as deployed.

### Clean-context path inspection

- A fresh agent with no repository or conversation context followed a sourced idea from Agent Watch through Fit Test and the Ops page. It correctly understood that the source had been inspected but not run, and Fit Test correctly recommended a reusable Skill rather than a duplicate Bot.
- The path did not deliver an executable first result for that specific idea. Agent Watch recommended improving Ops, but the public Ops package still starts with a monitoring task rather than the sourced AI-diagnosis task. Fit Test ends by telling the visitor to draft a `SKILL.md` without taking them directly to a builder or ready adaptation.
- This is product evidence from an independent clean-context inspection, not a genuine unaffiliated visitor session and not proof of repeat usefulness.

## Still required before the goal is complete

- Observe a genuinely new visitor attempt the discovery-to-use path. The existing walkthrough is a clean-path inspection, not an unaffiliated first-user session.
- Record at least one honest first-result response from production, or document where the visitor stopped and use that evidence for the next approved improvement.
- Observe the return window long enough to record a return-after-result or repeat-run outcome. A zero baseline alone is not evidence of repeat usefulness.
- Exercise an urgent-defect delivery path end to end. Keeper currently preserves evidence and updates the private queue, but no prompt external alert channel has been demonstrated.
- Review the one discovery lead currently waiting in Keeper's private queue. No public recommendation or product proposal should be inferred from its presence.
- Connect one reviewed Agent Watch idea to a directly usable adaptation, builder path or tested setup instead of ending at a recommendation that the visitor must implement alone.

The paid model-backed radar remains paused. Its local budget gate is not a verified provider billing cap and must not be resumed without separate cost controls and approval.
