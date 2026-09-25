# Daily Newspaper — bounded first-mission run

**Run date:** September 23, 2026  
**Hermes Agent:** 0.21.4  
**Profile:** `daily-newspaper-plugin-test-20260923`  
**Model:** `deepseek/deepseek-v4.1-flash` through the configured Nous provider

## What was tested

The Daily Newspaper archive was installed through the Bot Cabinet Hermes Desktop plugin into a new isolated profile. That exact profile then received fictional calendar entries, two messages, and a saved article. The material deliberately included a missing meeting link and an inconsistent weekday.

The Bot was asked to create one short personal morning edition using only the supplied material. It was told not to connect to accounts, save, send, schedule, publish, or print anything.

## Result

The run passed the disclosed checks:

- produced one readable page;
- cited every item by its supplied source label;
- kept the missing meeting link in a review note instead of inventing it;
- flagged the inconsistent weekday;
- made no outside changes.

Hermes reported two API calls, 30,079 total tokens, and an estimated cost of **$0.00299147**.

## What this does not prove

This is one bounded run using fictional source material. It does not prove general reliability, live account connections, unattended scheduling, saving, sending, printing, or publication. Those actions still require separate setup, testing, and human approval.
