# Event Operations Desk — guided setup

Bundle 1.0.0

Turn an approved event brief into a schedule, run of show, responsibility map, and exception list.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated. Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Planner

Build the event plan, milestones, dependencies, and run of show.

Archive: members/planner.tar.gz
SHA-256: 278b9fcd044be4c7c218f95924e5f0c9a5d3b1ec762fe3cffc012952f4e3a6e1
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

## 2. Chief of Staff

Act as Coordinator and maintain owners, decisions, and deadlines.

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

## 3. Client Deliverables

Prepare guest, speaker, vendor, and internal communication drafts.

Archive: members/client.tar.gz
SHA-256: f72a70696e86663a8d8e7e833c8e27eb7edca24114b3937da761549bc7643dc6
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

Track readiness, logistics, unresolved risks, and day-of notes.

Archive: members/ops.tar.gz
SHA-256: afb217c5f761e50b65d63cee53a243846497aa50da9676109d87d25cc76f6845
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
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

## Run one manual handoff cycle

1. **Planner / Planning:** Build milestones, dependencies, and decision dates.
2. **Chief of Staff + Client Deliverables / Coordination:** Maintain the tracker and communication drafts.
3. **Ops + person / Readiness:** Review logistics, risks, and fallback plans.
4. **Ops + person / Closeout:** Record exceptions and follow-up.

- [ ] A person reviewed and approved each handoff before the next Bot used it
- [ ] Schedules remain inactive; any future activation needs explicit approval
- [ ] A person reviewed the final deliverable against the success measures

## Human release required
- Contact a guest, speaker, vendor, or venue
- Make a purchase, booking, or cancellation
- Change the event date, program, or public announcement

## Success measures
- [ ] Every critical task has an owner and decision date
- [ ] The run of show includes fallback actions
- [ ] A person controls spending, contracts, and announcements

Reference: https://botcabinet.com/crew-kits/event-operations-desk/
