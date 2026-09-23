# First-user walkthrough — September 23, 2026

## Question

Can a visitor move from a current, attributed Bot idea to a clearly tested setup and a useful first task without already understanding Bot Cabinet?

## Path checked

1. Open **Agent Watch** and find the source-reviewed note about Karen X. Cheng's Morning Newspaper.
2. Open the Cabinet's **Personal morning newspaper** workflow.
3. Identify the recommended Bot, what has and has not been tested, and the first low-risk task.
4. Open the Bot page, review its job and access limits, and choose the Hermes setup path.
5. Find the exact first assignment and the recorded result from the Hermes Desktop plugin run.

## Finding on the live site

The path broke at step 2. The workflow recommended the generic Editor Bot and described the Hermes adaptation as an untested setup idea. Elsewhere, the site already published a standalone Daily Newspaper Bot and a bounded run completed through the Bot Cabinet Hermes Desktop plugin on September 23, 2026. The Daily Newspaper page also contradicted itself: the page-level status reported the completed run while its Hermes platform card still said role-specific output testing was pending.

## Correction

- The workflow now recommends the standalone **Daily Newspaper** Bot.
- The Hermes adaptation now says that one bounded run passed and links to the exact test record.
- The setup link now opens the Daily Newspaper Bot rather than a generic cross-platform guide.
- The Hermes platform card now reports the bounded run when runtime evidence exists; Bots without runtime evidence still retain the narrower import-only status.
- The workflow's downloadable plan and machine-readable catalog relationships were regenerated from the same source.

## Evidence

- First task: use fictional calendar material, two messages, and one saved article to produce a cited one-page edition while making no outside changes.
- Recorded result: `/proof-room/daily-newspaper/runtime-summary.md`
- Runtime: Hermes Agent 0.21.4, installed through the Bot Cabinet Hermes Desktop plugin.
- Result: the run produced a readable cited page, kept a missing meeting link in a review note, flagged an inconsistent weekday, and made no outside changes.
- Release gate: 293 application tests, 16 edge tests, 20 social-card checks, and 4,425 resolved internal links with zero broken internal links.

## Limits

This is a clean-path walkthrough using the public site and an already recorded plugin task run. It is not observation of an unaffiliated first-time visitor. Live accounts, scheduling, saving, sending, printing, publication, and repeated reliability remain untested.
