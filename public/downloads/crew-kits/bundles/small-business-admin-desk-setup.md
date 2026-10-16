# Small-Business Admin Desk — guided setup

Bundle 1.0.0

Organize incoming requests, draft customer replies and keep track of follow-ups.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated.

Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Chief of Staff

Sort incoming messages, tasks, and decisions and route each one.

Archive: members/chief-of-staff.tar.gz
SHA-256: d605455fc8ec3f07f423e86a07665c5846b51f5ab36fad72613b99caa9fd6be1
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Use sample updates from two projects to produce a one-page priority brief and a decision log for review.

Requested capabilities (configure manually):
- Read-only access to approved planning documents and calendar information
- Optional task-system access after review

## 2. Researcher

Find the approved customer, project, policy, or service context.

Archive: members/researcher.tar.gz
SHA-256: cd4e77069ae82df353b9554b1d6b7d4db14c1b4b761386b614779637eccaeab5
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Answer one narrow question using at least three approved sources and identify any unresolved conflict.

Requested capabilities (configure manually):
- Web research
- Read-only document access when I provide files

## 3. Client Deliverables

Prepare customer and partner communication drafts.

Archive: members/client.tar.gz
SHA-256: f5b2efe996856da333d84b49df2a87b8bd484ef3aa5d304ffd6904a012b88535
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Create a two-page client update from supplied notes and mark every item that needs approval.

Requested capabilities (configure manually):
- Read-only document access
- Optional document-template access

## 4. Ops

Maintain open work, deadlines, exceptions, and status.

Archive: members/ops.tar.gz
SHA-256: 8c24359b762cf91a56c6daa7a4d8dd447eb759054ef72a557bb797523472d2b6
Pack: 2.0.1; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Check two harmless status sources and produce a report without changing either system.

Requested capabilities (configure manually):
- Read-only logs and status endpoints
- Approved notification channel

## 5. Planner

Convert priorities into follow-up steps, owners, and dates.

Archive: members/planner.tar.gz
SHA-256: 8101faff73c3ba9e7b90dce4b563990f13dab6d96282713d343d1b37c12baafd
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Create a two-week plan from one approved objective and identify every missing decision.

Requested capabilities (configure manually):
- Read-only project documents
- Optional task-system access after review

## Run one manual handoff cycle

1. **Chief of Staff / Daily intake:** Classify work and identify needed context.
2. **Researcher + Client Deliverables / Prepare:** Find the relevant information and draft replies or documents.
3. **Ops + Planner / Track:** Update tasks, deadlines, and exceptions.
4. **Person / Weekly review:** Approve priorities and consequential actions.

- [ ] A person reviewed and approved each handoff before the next Bot used it
- [ ] Schedules remain inactive; any future activation needs explicit approval
- [ ] A person reviewed the final deliverable against the success measures

## Human release required
- Send a message or statement
- Make a payment, refund, purchase, or contract change
- Delete a record or change an account

## Success measures
- [ ] Incoming work reaches a clear workflow or owner
- [ ] Drafts use approved records and policies
- [ ] A person approves sending, spending, contracts, and deletions

Reference: https://botcabinet.com/crew-kits/small-business-admin-desk/
