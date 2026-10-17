# Architecture Decision: Static Directory vs. Database-Backed App

## Record of decision
- **No vendor selected.** No dependency added. No system changed. This is a controlled, in-conversation analysis only. No files, accounts, or schedules were touched.

## Requirements (from supplied material)
- **Mandatory:**
  - Public directory with exactly 30 entries.
  - Maintained by one editor.
  - No user accounts.
  - No private data.
  - No live writes.
  - No payment requirement.
- **In-scope:** Readers see the 30 entries. An editor manages updates. Pages should keep working.
- **Out-of-scope:** Authentication, personalized data, real-time writes, transactional behavior, multi-tenant content, payments.

## Assumptions
1. “Public directory” means read-mostly pages, not a dynamic user-facing form or API.
2. The existing project already renders static pages, so adding HTML/JSON content is in scope.
3. The 30 entries are treated as immutable content that changes occasionally.
4. Budget and platform expectations match a low-maintenance public site.

## Options comparison

| Option | How it works | Upfront/ongoing cost | Labor/Risks | Reversibility |
|---|---|---|---|---|
| **Extend static site** | Add a directory/data file and render the 30 entries as static pages. | $0–$20/month if bandwidth/domain/CDN fees apply. No vendors needed. | Low. Editor adds content manually. Only risk: stale content. | Highly reversible. Content can be removed or converted to a page. |
| **Database-backed app** | Add auth, schema, storage, a write path, and dynamic reads for the directory. | Often exceeds $20/month once you add hosting, DB, auth, payment/plan limits. | Higher. Server, schema, backups, access control, data migration, editor workflow. | Reversible, but more code, more risk, and higher maintenance. |

## Verdict
**Extend the static site.**

- Meets all requirements with no user accounts, private data, live writes, or payments.
- Keeps the existing static rendering path intact and avoids unnecessary infrastructure.
- Avoids accruing functions, database, auth, and hosting layer complexity for a read-mostly directory.
- Remaining spend, if any, would only cover hosting/domain/CDN, which the current budget ($20/month) should cover.

## Costs needing verification (not assumed)
- Domain and hosting cost if existing provider is unwilling.
- CDN/bandwidth fees at scale.
- Editor workflow cost: content format, file location, and review process are unverified.
- Whether the project already proxies or serves static files from a directory.

## Next step (reversible)
- Add a single data source (e.g., a JSON file or a folder of entries) and a static rendering route in the existing project.
- Render the 30 entries as static pages, with a simple editor workflow (manual file edit or small import tool).
- Verify locally: list 30 entries, confirm all render as static pages, confirm no auth/auth-less writes are introduced.
- If needed, remove the feature by deleting the data file and route — no production risk.