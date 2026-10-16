# Catalog first-answer tests

`catalog_runtime.py` tests the four contributed Hermes skills at one pinned public source commit. It prepares the skill, sample, rubric, template and catalog entry with source hashes, then loads each skill through Hermes's native `skills.auto_load` mechanism in an isolated data directory.

Preparation uses the standard library and public source files. Running a test also requires an existing Hermes Python environment and an explicitly supplied existing Nous auth file. The runner copies only that provider into a private temporary auth file and removes the copy afterward. It disables lazy dependency installation, fallback models, memory and background review. It does not modify the supplied auth file.

```
python catalog_runtime.py prepare --output /absolute/project/test-run
HERMES_DISABLE_LAZY_INSTALLS=1 /existing/hermes/python catalog_runtime.py run \
  --output /absolute/project/test-run --bot receipt \
  --runtime /existing/hermes/source --auth-source /private/existing/auth.json
```

The provider must explicitly list zero prompt and completion token prices for the selected model. A name ending in `:free` is insufficient. This check is not an account-level spending cap and does not authorize recurring paid work.

Each invocation permits three model iterations with a 90-second runtime budget and no automatic recovery loop. It preserves the answer and run metadata, never overwrites an existing run ID, and does not grade its own answer. Review the answer against the pinned rubric separately.

These are SDK skill first-answer tests. They do not test Desktop installation, profile archive imports, connected accounts, file saving, printing, scheduling or crew handoffs. No recurring job is installed by this script.

## Website download task tests

`website_runtime.py` inventories every standalone Bot in the published resource index, downloads its actual portable role pack or specialist instructions, and verifies the byte count and SHA-256 before preparing a test. Starter roles include the controls and reusable skills in that same download. Specialist roles exclude the sample task and grading checklist. The model does not receive the checklist used to review its answer.

Prepared cases cover all thirty-eight standalone website Bots: Receipt, Coach and Professor use the same synthetic tasks as the contributed-skill tests; the other seventeen starters use `website_task_cases.json`; the eighteen specialists use their published sample tasks. Every case has a separate review checklist. Preparation is not a run or a pass. Coder and Founding Engineer have offline proposed-code cases; actual sandbox execution still needs a separate tool-enabled test.

```
python scripts/keeper/website_runtime.py prepare --output /absolute/project/run \
  --public-root /absolute/repository/public
HERMES_DISABLE_LAZY_INSTALLS=1 timeout -k 5s -s INT 180s /existing/hermes/python \
  scripts/keeper/website_runtime.py run --output /absolute/project/run \
  --bot receipt --runtime /existing/hermes/source --auth-source /private/existing/auth.json
```

`prepare --candidate` explicitly records local generated public files as a candidate rather than a deployed download. Give each attempt a distinct `--run-id`; failed answers must remain intact. Every completed result starts as awaiting review. Compare answers against the same task and checks, and verify that any deployed download still matches the tested hash.

The Hermes 90-second runtime budget is soft. Use the explicit 180-second process deadline above; interruption allows the runner's `finally` block to remove its isolated auth copy. If force-kill is necessary, inspect that exact run directory for remaining auth files before doing anything else. These are role-only SDK tests, not installation, connected-service, permission-enforcement or complete crew tests. No paid model fallback or recurring work is enabled.

The website worker now puts a single-request gate around Hermes's LLM execution middleware, with a 6,000-output-token ceiling. The SDK's recovery setting alone does not prevent text continuations or ordinary rate-limit retries. The gate ends the test on a second attempted request or provider error and records an incomplete result. This is a process-local test-harness wrapper, not a change to the installed Hermes source. Earlier recorded runs predate this guard and retain their actual API-call counts.

After reviewing actual answers, `website_trial_records.py` copies only named input, output, public source and allowlisted run metadata into public test records. Its explicit review file is `website_trial_reviews.json`. It never copies an agent home or credentials. It refuses to replace a preserved file with different contents. A pass applies only when the completed, reviewed answer matches the current download's hash; changed downloads return to awaiting retest.

```
python scripts/keeper/website_trial_records.py \
  --artifacts /absolute/project/run --public /absolute/repository/public
```
