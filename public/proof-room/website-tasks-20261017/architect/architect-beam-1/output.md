**Decision frame**
This is a low-complexity, read-mostly public directory: 30 entries, one editor, no accounts, private data, live writes, or payments. Given an existing static-site capability and a ≤$20/month budget, the simplest viable option is likely to extend the static site, while keeping a database-backed app as a later option if requirements change.

**Confirmed requirements**
- Public, read-only directory
- 30 entries
- One maintainer/editor
- No user accounts or private data
- No live writes
- No payment flow
- Existing project can produce static pages
- Monthly budget ceiling: $20
- No vendor or price information supplied; no vendor may be selected from this analysis

**Assumptions to confirm**
- Entries change infrequently enough that a rebuild/redeploy workflow is acceptable.
- The editor can work with the repository/content source or an approved content workflow.
- Search/filtering can be handled client-side or is not required.
- The 30-entry count and schema are stable enough for a simple structured content model.
- Current static hosting can absorb the directory without a new service.

**Option comparison**

| Option | Fit | Main tradeoffs |
|---|---|---|
| Extend static site | Strong fit for current requirements | Lowest operational burden; very reversible; content updates depend on editor workflow and rebuild/deploy; limited live interactivity |
| Database-backed app | Overfit for current requirements | Enables live writes, search, multi-editor workflows, and dynamic behavior; adds hosting, database, security, backup, patching, and cost obligations |

**Costs needing verification**
Before choosing or committing, verify actual prices for:
- Static hosting bandwidth/storage/build minutes
- Domain renewal and DNS
- Optional content-management or form service
- Database-app compute, database, storage, backup, and egress
- Monitoring/logging/security tooling if used
- Any editor workflow tooling or CI minutes

No vendor is selected here. The ≤$20/month ceiling should be treated as a hard gate during verification.

**Risk and technical-debt notes**
- Static extension risks: editor friction, stale content, build/deploy failure, limited future interactivity.
- Database app risks: unnecessary complexity, security surface, data backup/recovery burden, cost overrun, maintenance debt.
- Reversibility: static changes are easy to revert; a database-backed app creates migration and operational lock-in.

**Recommended reversible next step**
Do not change production and do not add dependencies or vendors yet. Prepare a non-production prototype/branch that:
1. Defines a simple structured content model for the 30 entries.
2. Renders the directory through the existing static page pipeline.
3. Documents the editor update workflow.
4. Estimates monthly cost against the $20 ceiling using verified pricing.
5. Identifies any missing requirements, such as filtering, accessibility, SEO, or update cadence.

Bring that prototype, cost estimate, and open questions to a person for approval before any deployment, vendor selection, dependency addition, or production change.