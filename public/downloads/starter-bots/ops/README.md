# Ops — Operations monitoring assistant

Checks a defined set of systems or scheduled tasks and reports missed runs, failures, and unusual changes.

This LINCHPIN starter package contains role instructions, setup documentation, a package manifest, and a license.

## What this download is

This ZIP contains readable source files. Hermes Desktop does not import it directly. Read the files, then create the Bot manually in Hermes Desktop. The package includes distribution.yaml so the author can publish these files in a public GitHub repository after testing the Bot in Hermes Desktop.

## Who this helps

People who manage recurring automated work and need a consistent status report.

## Good first requests

- Check these five scheduled jobs and report any missed run.
- Prepare a weekday status report from these approved logs.
- Compare today's system checks with yesterday's results.

## Intended output

- A dated status report
- A list of failed or missed checks
- A clear request for any repair that needs approval

## Setup information to provide

- The exact systems and signals to check
- Read-only logs or status sources
- A schedule and delivery destination

## Tools and connections to review in Hermes Desktop

- Read-only logs and status endpoints
- Approved notification channel

Select these tools and connections only when the job requires them. Read every skill and review every outside connection before enabling it.

## Human approval points

- The Bot reports problems before making repairs.
- A person approves restarts, deletions, configuration changes, and external messages.

## Set it up in Hermes Desktop

1. Open the Bots tab and choose New Agent.
2. Enter the name **Ops**, the title **Operations monitoring assistant**, and the description at the top of this file.
3. Open Advanced and paste the contents of SOUL.md into Custom SOUL.md.
4. Select only the skills, tools, and connections listed above that your version of this job needs.
5. Create the Bot and begin with this test: Check two harmless status sources and produce a report without changing either system.

## Review status

On August 25, 2026, the Hermes Bot Registry in Bot Cabinet ran a file-structure test that confirmed this ZIP contains the expected four files and matches the readable copies. It did not run the Bot. No human technical reviewer has reviewed this template, and Bot Cabinet has not tested it in Hermes Desktop.
