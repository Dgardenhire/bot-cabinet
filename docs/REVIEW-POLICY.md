# Bot Cabinet — Hermes Bot Registry review policy

Last updated: August 25, 2026

The Hermes Bot Registry is Bot Cabinet's first collection and public-project review function. Bot Cabinet is independent from Nous Research. Nous Research does not operate or endorse Bot Cabinet or the Registry.

## Who reviews projects today

Bot Cabinet currently has one editor who decides whether a project fits the directory and whether a page describes it clearly. Human technical review is not available.

The project contains an automated source scanner. It can identify specific files and patterns in a public GitHub repository. It cannot establish that software is secure or predict every action a Bot may take.

The public submission and publication system is closed while this process is developed. There is no review queue or promised response time. A volunteer technical review program is a possible future goal.

## Projects the Registry may consider

A future submission may describe one of three things:

- **Installable profile package:** a public repository with `distribution.yaml` at its top level. This file tells Hermes what the package contains.
- **Profile collection or starter kit:** several profiles or instructions that require manual setup.
- **Use-case guide:** an educational plan that explains how Bots could work together.

The person submitting a project must publish it in a public GitHub repository and must have the publisher's permission. The Registry will not request private repository access, client information, phone numbers, or private credentials.

## What the automated source check reads

The scanner works from one exact repository version, called a commit. It reads a limited set of public text files and records:

- the repository address and exact commit;
- the package description and license information;
- the files that the package says it includes;
- possible credentials, local Hermes data, personal information, or local computer paths;
- commands, installation scripts, outside network connections, scheduled work, background processes, and file-writing behavior;
- instructions that attempt to override a reviewer or hide behavior; and
- tests or setup instructions supplied by the publisher.

The scanner creates a plain-English report and a machine-readable JSON file. It treats submitted files as text. It does not run the submitted code, install dependencies, follow instructions inside the files, connect to private repositories, or publish a listing.

Automated pattern checks can miss problems and can also flag harmless text. A clear report means only that the configured checks did not find a listed pattern in the files they read.

## Limits on each scan

The scanner stops and reports that it cannot complete the review when the repository exceeds any of these limits:

- 5,000 file-tree entries
- 120 relevant text files
- 160 KiB for one relevant text file
- 1.25 MiB of relevant text in total
- 10 seconds for one GitHub request
- 35 seconds for repository retrieval

These limits keep one submission from consuming unlimited time or memory. A publisher can reduce the package to the files people actually need and run the check again.

## Possible results

- **Cannot review:** the scanner could not obtain a complete view within its limits.
- **Blocked from listing:** the scanner found a critical issue such as a likely credential, private Hermes data, a destructive command, an invalid package, or an overly broad file list.
- **Source preview eligible:** the scanner completed its limited checks and found only low-risk source patterns. An editor would still need to decide whether the page is useful and accurate.
- **Human technical review required:** the project can run commands, install software, use credentials, connect to outside services, write files, send messages, schedule work, or perform another action that needs technical judgment. The Registry currently leaves these projects unpublished.

The scanner has no publication step. Every automated result records `publicationAction: "none"`.

## Why the package file list matters

Hermes profile packages can use `distribution_owned` in `distribution.yaml` to name the files they contain. In the released Hermes v0.20.5 code, a missing or empty list can use older behavior that copies nearly every top-level package item except a fixed group of excluded names.

The Registry therefore expects a short, explicit list, such as `SOUL.md`, selected skill or schedule files, and `distribution.yaml`. It flags broad directories, parent-directory paths, user-state folders, `.env`, and `auth.json`.

Hermes excludes several exact local-state names during this copy process. Those exclusions do not remove a private file that someone has already published on GitHub. Publishers must inspect their public repository before sharing it.

Relevant Hermes sources:

- [`_copy_dist_payload` in Hermes v0.20.5](https://github.com/NousResearch/hermes-agent/blob/v2026.8.19/hermes_cli/profile_distribution.py#L513-L588)
- [`USER_OWNED_EXCLUDE` in Hermes v0.20.5](https://github.com/NousResearch/hermes-agent/blob/v2026.8.19/hermes_cli/profile_distribution.py#L87-L110)
- [Hermes Profile Distributions guide](https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions)

## A possible future technical review

A future reviewer would record:

- their GitHub name, relevant experience, and any conflict of interest;
- the exact commit they inspected;
- the files and lines they examined;
- the actions the project can take and the access it requests;
- its dependencies, installation scripts, outside services, schedules, file changes, messages, and data transfers;
- its license; and
- a first test using a disposable Hermes profile and sample credentials.

Projects that can perform consequential actions may require a second reviewer before the Registry provides installation instructions. This program does not exist today.

## When a repository changes

A report applies only to the commit named in that report. The project's default branch can change immediately afterward. A new version requires another source check and, when available, another technical review.

## If the scanner finds a credential

1. Replace the credential immediately.
2. Remove it from the current files and Git history.
3. Add the appropriate `.gitignore` rule.
4. Publish a cleaned version.
5. Run the source check against the new commit.

The report names relevant file paths without reproducing possible secret values.

## Run the scanner locally

Use Node 20 or newer. A GitHub token raises GitHub's request limit. Keep that token private.

```bash
GITHUB_TOKEN=your_token node scripts/registry-review.mjs \
  --repo https://github.com/OWNER/REPOSITORY \
  --artifact-type "Installable profile distribution" \
  --markdown registry-review.md \
  --json registry-review.json
```

Run the scanner's tests with:

```bash
node --test scripts/registry-review.test.mjs
```
