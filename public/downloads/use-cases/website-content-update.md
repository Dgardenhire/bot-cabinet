# Website content update

Designed for: Small teams updating an existing page from approved facts and design patterns

Result: Revised page copy and a website change with recorded check results that follows the existing design.

## Bots

1. Researcher
2. Writer
3. Coder

## Information to gather

- The existing page and code project
- Approved facts and requested change
- Design reference and acceptance checks

## Workflow

### 1. Researcher

Check the facts and source links

Output: A sourced fact sheet for human approval

Message to send:

Use the approved inputs I provide. Check the facts and source links. Return this result: A sourced fact sheet for human approval. Ask me about missing information before you continue.

### 2. Writer

Draft clear page copy for the intended reader

Output: A page-copy draft for human review

Message to send:

Start with this result from Researcher: A sourced fact sheet for human approval. Draft clear page copy for the intended reader. Return this result: A page-copy draft for human review. Ask me about missing information before you continue.

### 3. Coder

Update the page and run the project checks

Output: Changed files and verification results

Message to send:

Start with this result from Writer: A page-copy draft for human review. Update the page and run the project checks. Return this result: Changed files and verification results. Ask me about missing information before you continue.

## Overall request

Update this page using the approved fact sheet and copy. Follow the existing design system, run the available checks, and report every file changed.

## Decisions for a person

- Approve the facts and final copy
- Approve design changes
- Approve publication

## First test

Update one low-risk page in a project copy and compare it with the approved design before publishing.

## Hermes Desktop setup

1. Open each Bot's page in Bot Cabinet's Hermes Bots collection and follow its manual Hermes Desktop setup steps.
2. Run each step in that Bot's own chat and review the result.
3. Pass the approved result to the next Bot with the message provided for that step.
4. After the sequence works, you may create a group with the same Bots.
5. In a group, @mention the Bot you want. Membership order does not control who responds.
