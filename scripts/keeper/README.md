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
