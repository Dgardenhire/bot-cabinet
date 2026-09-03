# Bot Cabinet public catalog

Bot Cabinet publishes a complete JSON catalog plus three discovery files. They help feed readers, search tools, and Bots find the current public catalog without scraping the website.

## Public endpoints

- `https://botcabinet.com/api/v1/bots.json` contains every public Bot definition. Use this file when you need full job, setup, access, approval, relationship, and platform information.
- `https://botcabinet.com/api/v1/updates.json` is a smaller catalog snapshot. Use it to check the current release and find each profile's public page and download files.
- `https://botcabinet.com/api/v1/bot-fit-test.json` publishes the Bot Fit Test input schema and supported repository CLI. It lets an automated tool choose an Assignment, Skill, Routine, Bot, or Crew and receive the same plan used by the website.
- `https://botcabinet.com/feed.xml` is an RSS 2.0 feed for readers and monitoring tools.
- `https://botcabinet.com/llms.txt` explains the site's main resources and links to each current public Bot.

## How to check for catalog changes

1. Read `updates.json` and save its `feedVersion`, `catalogVersion`, `revision`, and entry IDs.
2. On the next check, compare those values with the saved copy.
3. Fetch `bots.json` when the catalog version, revision, or an entry ID changes.
4. Show the profile name, job, and public link to the person using your tool. Let that person decide whether to download or install anything.

Each entry ID combines the Bot slug and profile version, such as `bot:scout@1.0.0`. A changed profile version creates a changed entry ID.

`catalogVersion` is the human-managed version for a reviewed catalog release. `revision` is a deterministic SHA-256 digest of the complete canonical public catalog, so it changes for any public catalog-content change even when `catalogVersion` remains the same. Consumers should treat the revision as the complete content-change signal and the catalog version as release context.

Entries always follow the source-list order in the public catalog. That order is stable for an unchanged catalog and is included in the revision; consumers that display a list can preserve it directly.

## What the feeds do not claim

These files do not publish copy counts, install counts, ratings, reviews, test results, or proof claims. Check the profile page for the information Bot Cabinet currently provides about a specific Bot.

## Release dates and versions

The discovery release date and feed version are fixed in source. A normal build reproduces the same files byte for byte. Bot Cabinet changes those values only for a reviewed catalog release.
