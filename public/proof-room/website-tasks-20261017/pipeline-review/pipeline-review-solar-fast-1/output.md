Pipeline Review applied to the supplied fictional export only.

**Records supplied**
- D1 — $1,000, no activity for 20 days
- D1 — $1,000, duplicate entry for the same deal
- D2 — $2,000, no activity for 3 days

**Deduplication**
D1 appears twice in the export. Treating the duplicate as the same deal, the unique open deals are D1 ($1,000) and D2 ($2,000).

**Unique open value**
$1,000 + $2,000 = **$3,000 USD** (after removing the duplicate row).

**Stale-deal check (rule: stale after 14 days)**
- D1: 20 days inactive → **stale**
- D2: 3 days inactive → not stale

**Result**
- Unique open value: **$3,000 USD**
- Stale deals: **D1** (20 days)
- Not stale: **D2** (3 days)

**Notes**
- The two D1 rows were identical in amount ($1,000) and both fall outside the 14-day threshold, so no ambiguity about which copy was current. I did not combine them or treat them as separate deals.
- This is a controlled review of supplied material only. No accounts, files, schedules, sends, or external actions were performed. Actual movement/activity status is based solely on the stated inactivity periods in the export.