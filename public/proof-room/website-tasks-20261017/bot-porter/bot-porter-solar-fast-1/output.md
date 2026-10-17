The transfer map is below. Ready to draft and compare against the destination documentation once you approve a specific destination to check.

## Transfer map — first-answer controlled test

| Item | Source | Destination | Transfer verdict | Notes |
|---|---|---|---|---|
| Role | Bot Cabinet controlled test (use loaded Bot role) | Same role name | Transferable text | Keep role name identical |
| Input | Supplied fictional source material only | Supplied fictional source material | Transferable text | No external material to carry |
| Tool support | Tool execution | Tool support not checked | Needs reconfiguration | Verify: `npm run test` |
| Schedule support | Runs at 7 a.m. | Schedule support not checked | Needs reconfiguration | Verify: `npm run lint` |
| Ask-before-send rule | Asks before sending | Unknown | Needs reconfiguration / risk-flagged | Verify: `npm run build` |
| Out-of-band user message handling | Not applicable | Unknown | Unsupported unless specified | Treat as unverified |
| Chat instruction support | Not applicable | Supports chat instructions | Transferable text | Destination confirmed |

**Verified claims (from supplied material only):**
- Destination supports chat instructions ✓ (stated in source)
- Tool support: not checked ✗
- Schedule support: not checked ✗

**Unsupported / unverified:**
- Any tool execution capability
- Any scheduled startup (7 a.m. rule)
- Whether the "ask before sending" behaviour is enforceable in destination

**What was omitted and why:**
- No external accounts, secrets, inbox contents, or scheduler configuration were carried — none were supplied. The draft intentionally omits these to avoid leaking private data outside the approved material.

Next step if you want it: point me at a destination file/snippet to check, and I will run a first-use comparison test against the supplied material only. No accounts, saves, schedules, sends, or tool calls will be made unless you explicitly approve them.