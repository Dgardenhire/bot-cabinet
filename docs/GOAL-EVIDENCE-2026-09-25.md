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
- Keeper's maintenance queue led to a concrete security review of pull request 2. Production on Next 16.3.2 had one critical Next advisory and one high sharp advisory. The proposed Next 16.3.6 lockfile resolves sharp to 0.35.4; a fresh production-only audit reported zero vulnerabilities, and GitHub's full repository verification was green. The pull request was not merged or deployed without separate approval.
- Damon approved one dedicated Keeper-only publishing secret on September 25. The same random secret is stored in Cabinet Keeper and the Supabase publishing function; it grants no billing, model, Ordos or Logos access.
- Cabinet Keeper then made two harmless probes without publishing a status. The authenticated request passed authorization and returned HTTP 400 because the deliberately invalid body had no approval record. The unauthenticated request returned HTTP 401. The secret was not printed, no file was changed and public revision 1 remained unchanged.
- The installed manual publisher expects a Keeper-side variable named `CABINET_KEEPER_STATUS_PUBLISH_SECRET`; that binding is now configured, while the unusable alias created during setup was removed. `CABINET_KEEPER_STATE_DIR` is also explicitly bound to `/opt/data/local/cabinet-keeper`, preventing manual tools from writing to a duplicated nested path.
- In a fresh Keeper session, the publisher's preview-only path read the real candidate and wrote the exact approval packet to `/opt/data/local/cabinet-keeper/reports/trust-status-publication.json`. Its declared candidate hash was `770b7121cd0c67801a6fe2af3d3097f66e463ddef78895f78e66afe2737deeec`. No publication request was made, and the mistaken 1,601-byte nested preview plus its empty directories were removed after exact inspection.
- Authentication and the hash-bound approval preview are therefore verified. A real Keeper-to-public revision still requires a fresh specific human-approved candidate and has not been claimed here.

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

## Still required before the goal is complete

- Observe a genuinely new visitor attempt the discovery-to-use path. The existing walkthrough is a clean-path inspection, not an unaffiliated first-user session.
- Record at least one honest first-result response from production, or document where the visitor stopped and use that evidence for the next approved improvement.
- Observe the return window long enough to record a return-after-result or repeat-run outcome. A zero baseline alone is not evidence of repeat usefulness.
- Exercise an urgent-defect delivery path end to end. Keeper currently preserves evidence and updates the private queue, but no prompt external alert channel has been demonstrated.
- Review the one discovery lead currently waiting in Keeper's private queue. No public recommendation or product proposal should be inferred from its presence.

The paid model-backed radar remains paused. Its local budget gate is not a verified provider billing cap and must not be resumed without separate cost controls and approval.
