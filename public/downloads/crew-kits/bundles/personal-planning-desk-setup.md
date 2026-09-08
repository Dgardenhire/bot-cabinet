# Personal Planning Desk — guided setup

Bundle 1.0.0

Turn a trip, set of errands, or personal project into a researched plan with constraints, choices, and approval points.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated. Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Researcher

Research approved options, current facts, costs, and constraints.

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

## 2. Planner

Build the sequence, schedule, decisions, and fallback plan.

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

## 3. COACH

Act as Constraint Checker and test fit with stated priorities.

Archive: members/coach.tar.gz
SHA-256: 9e768d2aca1e7508a7927194fa20233aa263c698e9fb206aeb260421461fc3a1
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Use one current, low-stakes decision to compare two options and define one reversible next step.

Requested capabilities (configure manually):
- Conversation and user-supplied notes
- Optional read-only access to approved calendar or planning documents

## Run one manual handoff cycle

1. **Planner + person / Define:** Confirm the goal, constraints, and research questions.
2. **Researcher / Research:** Collect options, costs, and tradeoffs.
3. **Coach / Check:** Test fit and fallback needs.
4. **Person / Decide:** Approve choices and carry out actions personally.

- [ ] A person reviewed and approved each handoff before the next Bot used it
- [ ] Schedules remain inactive; any future activation needs explicit approval
- [ ] A person reviewed the final deliverable against the success measures

## Human release required
- Make a purchase, booking, cancellation, or return
- Send a message or change a calendar
- Access medical, legal, or financial information

## Success measures
- [ ] Options use current information
- [ ] The plan reflects budget and schedule limits
- [ ] A person completes purchases, bookings, and account changes

Reference: https://botcabinet.com/crew-kits/personal-planning-desk/
