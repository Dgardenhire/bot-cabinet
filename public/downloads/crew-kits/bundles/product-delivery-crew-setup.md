# Product Delivery Crew — guided setup

Bundle 1.0.0

Move an approved feature from a clear requirement through technical direction, implementation, checks, and review.

Bot Cabinet generates plans and packages. Hermes Desktop settings and connected-service permissions are applied by you. Passports are checklists, not locks.

This ZIP is a collection of individual profiles, not a one-click crew installer. Unzip it first; import each member .tar.gz separately. No schedules are activated. Crew coordination has not been runtime-tested.

Keep existing Bots and projects intact. Use new profile names where needed; do not overwrite an existing profile.

Import-tested means archive import was checked, not that this Bot or crew has proved its work quality.

## 1. Planner

Define the user outcome, acceptance conditions, scope, and dependencies.

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

## 2. Architect

Choose the technical approach and identify material risks.

Archive: members/architect.tar.gz
SHA-256: 36e3d3f8a324217e4cd3c55d917546297a50b0ce08678b640aa5f49e8ee382f6
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Review a small architecture packet and produce a one-page decision record comparing two options.

Requested capabilities (configure manually):
- Read-only access to approved repositories and technical documents
- Optional web research for current vendor documentation

## 3. Founding Engineer

Implement the approved approach and document actual changes.

Archive: members/founding-engineer.tar.gz
SHA-256: 1961e655244acd16243ae0024ece46a43f40f28b1031b08c71d6647927d77dd1
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Build one small workflow in a disposable project copy, run its acceptance check, and demonstrate the result.

Requested capabilities (configure manually):
- Approved project files
- Terminal access inside the project copy
- Existing test runner

## 4. Coder

Act as Tester by running checks and reporting failures.

Archive: members/coder.tar.gz
SHA-256: dde7d90140283ebea8cefae60c66ba2dc558de7e47d621e52f6ca15839c67e73
Pack: 2.0.0; minimum Hermes: >=0.21.0; import tested with: 0.21.0
Import: import-test-passed; skill: not-tested; routine: inactive; manual-test-required

- [ ] Review SOUL.md and bundled files
- [ ] Import profile into Hermes Desktop without replacing an existing Bot
- [ ] Select only the tools this role needs
- [ ] Confirm read-only or draft-only permissions in connected services
- [ ] Run the first test with sample material and review the result

First test: Make one small reversible change in a project copy and run the existing checks.

Requested capabilities (configure manually):
- Project file access
- Terminal access inside the project
- Version control

## 5. Editor

Prepare review notes, release copy, and unresolved questions.

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

1. **Planner + person / Definition:** Agree on the outcome and boundaries.
2. **Architect / Direction:** Choose the approach and record risks.
3. **Founding Engineer + Coder / Build and check:** Implement the change and run checks.
4. **Editor + person / Release decision:** Review evidence before release.

- [ ] A person reviewed and approved each handoff before the next Bot used it
- [ ] Schedules remain inactive; any future activation needs explicit approval
- [ ] A person reviewed the final deliverable against the success measures

## Human release required
- Change authentication, billing, or production data
- Install an unfamiliar dependency
- Merge, deploy, or publish a release

## Success measures
- [ ] Behavior matches the acceptance conditions
- [ ] Tests pass or failures are plainly reported
- [ ] A person approves merge and deployment

Reference: https://botcabinet.com/crew-kits/product-delivery-crew/
