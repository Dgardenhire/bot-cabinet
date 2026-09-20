# Customer Support Desk — guided setup

Bundle 1.0.0

Sort routine customer requests, find the right policy, and prepare clear responses while escalating exceptions.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated. Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Chief of Staff

Act as Intake, classify the request, and route it to the right path.

Archive: members/chief-of-staff.tar.gz
SHA-256: b30deb058b066b82ae1aab0f40d8bb4e0bc01ae9de8f31a29d81a18ce5f230eb
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
SHA-256: 0b112367c8278bc99a90bb2da8a11c0297f309a9733c7e6d351a9a8fc7ad4928
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
SHA-256: 7f1f3d29a8f5189b4964a68a0734c1010996a443c3a874c1312e48d8c312d722
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
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

Act as Support Reviewer and check tone, accuracy, and escalation.

Archive: members/editor.tar.gz
SHA-256: 7f16ed8dccd5ec9d07fff0d42944bc14ac903a6f9e1b8bcc7234117a3c689dc2
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
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
