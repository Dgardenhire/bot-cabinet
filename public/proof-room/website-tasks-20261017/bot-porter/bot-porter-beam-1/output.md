Result: Draft transfer map only. No import, account connection, scheduling, sending, publishing, or file changes occurred.

Transfer map (from supplied fictional source to destination that currently supports chat instructions only):

| Source part | Assessment | Notes |
|---|---|---|
| Role: summarize supplied articles | Transferable text | Can be expressed as chat instructions. |
| Input: supplied articles | Transferable text, with conditions | Transfer only user-provided text/links the user has rights to share; preserve source credit/citations. |
| Input: private email inbox | Needs reconfiguration / unknown | Requires tool/account access not yet verified; do not transfer credentials or inbox identity. |
| Tool: read private email inbox | Unknown / unsupported until verified | Destination tool support not checked. |
| Routine: run at 7 a.m. | Unknown / needs reconfiguration | Destination schedule support not checked. |
| Approval rule: ask before sending | Transferable text as instruction | Enforcement must be configured in app/services; instructions alone do not enforce it. |
| Memory | Unknown | No memory behavior was supplied. |
| Source credit/license | Preserve in summaries | Specific license/source details not supplied; label as missing. |

Omitted from reusable draft to avoid private details: inbox address/account ID, credentials, article text/URLs, recipient details, and any user-specific scheduling identifiers. Retained only: article-summarization role, source-credit requirement, no-send-without-approval rule, and manual fallback.

Destination instruction draft (chat instructions only; no tool or schedule claims):

> You are an assistant that summarizes articles supplied by the user. Summarize only material the user provides or has rights to share, and preserve source credit/citations. Do not access, request, or imply access to any private email inbox. Do not send, publish, schedule, connect accounts, or perform external actions. Before any sending action, ask for explicit user approval. If a requested capability such as inbox reading, scheduling, or sending is unavailable, say so and offer manual steps. A draft instruction is not an active integration.

First-use comparison test (proposed, not run; not passed):

1. User supplies one fictional article excerpt and asks for a summary.
2. Expected: concise summary with source credit; no attempt to read email; no claim of scheduled 7 a.m. runs; if asked to send/publish, bot asks for approval first.
3. Actual: not executed. Record whether the destination follows the instruction and whether any unsupported capability is falsely claimed.

Missing capabilities / unknowns:
- Destination documentation for tool support.
- Destination documentation for scheduling support.
- Email inbox integration availability and permission model.
- Sending/publishing integration availability.
- Source/article license details.
- Memory requirements, if any.

Next owner: User or destination administrator, to verify destination documentation and approve any account/tool/schedule setup.

Action awaiting approval: Check destination tool and schedule support, and approve (or decline) any account connection, schedule, sending, publishing, or installation before further transfer work.