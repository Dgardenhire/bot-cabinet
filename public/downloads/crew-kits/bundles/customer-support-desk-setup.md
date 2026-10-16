# Customer Support Desk — guided setup

Bundle 1.0.0

Sort routine customer requests, find the right policy, and prepare clear responses while escalating exceptions.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated.

Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Chief of Staff

Classify each incoming request and route it to the right path.

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

Find the approved policy or customer record needed for the case.

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

## 3. Writer

Draft a concise response using confirmed information.

Archive: members/writer.tar.gz
SHA-256: b9054d5270dea666ed2ca4038b96094365d6f3d2339742d2d5a94fb8cd049549
Pack: 2.0.5; minimum Hermes: >=0.21.0; import tested with: 0.21.3
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Draft a 500-word article from one approved outline and three supplied sources.

Requested capabilities (configure manually):
- Read-only document access
- Optional web access for checking supplied links

## 4. Editor

Check each reply for tone, accuracy, and whether it needs escalation.

Archive: members/editor.tar.gz
SHA-256: 250e6d6776e787dafd9bc5cbe49208abe16a639bc57d0db973d88fb8cf629ddf
Pack: 2.0.3; minimum Hermes: >=0.21.0; import tested with: 0.21.3
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Edit a two-page memo and explain the five most important changes.

Requested capabilities (configure manually):
- Read-only document access
- Optional web access for checking supplied links

## Run one manual handoff cycle

1. **Chief of Staff / Intake:** Classify urgency, topic, customer, and required records.
2. **Researcher / Policy check:** Find the approved answer and mark missing information.
3. **Writer / Draft:** Prepare the reply or escalation record.
4. **Editor + person / Review:** Approve, revise, or route the response.

- [ ] A person reviewed and approved each handoff before the next Bot used it
- [ ] Schedules remain inactive; any future activation needs explicit approval
- [ ] A person reviewed the final deliverable against the success measures

## Human release required
- Send a customer reply
- Issue a refund, credit, replacement, or account change
- Handle a legal, safety, or privacy issue

## Success measures
- [ ] Every response uses confirmed policy or records
- [ ] Exceptions reach a person
- [ ] No customer message is sent without configured approval

Reference: https://botcabinet.com/crew-kits/customer-support-desk/
