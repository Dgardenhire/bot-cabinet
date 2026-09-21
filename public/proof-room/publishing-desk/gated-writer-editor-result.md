# Publishing Desk 1.0.2 gated Writer/Editor result

Run date: September 20, 2026
Locked source SHA-256: `ba8faf8619afebe2077c570608565ea1f94cf34e967edbd3d1560dcf10ed4cca`
Tested bundle ZIP SHA-256: `a6628a5c8cb5fd1469ee5938037b0a93e7e21dbbdf6c3bf7fe8175a8101773f5`
Writer 2.0.2 archive SHA-256: `80b2d7be68b0d57b834157d2a3749c77f8728114e7098f886b92d73dad3c2a5d`
Editor 2.0.1 archive SHA-256: `6e0141767028d36d78fd363f61942163d18383fefe377f349ee16a1c6522b9f0`

This was a gated continuation of the locked Tool Library test, not a new full five-role run. It reused the previously preserved Story handoff and reran the current Writer and Editor archives with no tools.

Writer completed with strict JSON. Its publishable body measured 267 words and its social draft measured 162 Unicode code points. The response used the required review-note array, but attached a contradictory source-shortfall object and included an unverified numeric-count note. The deterministic gate left the newsletter and social text untouched, cleared the contradictory exception, removed the numeric-count note, recorded both normalizations, and passed the canonical handoff to Editor.

Editor completed its model turn after receiving 23 deterministic newsletter assertions and four deterministic social assertions. Its response contained an unescaped control character and was not valid JSON. The bounded parser rejected it before schema, source-evidence, semantic, or human-review acceptance. No deliverable was approved.

Provider-derived estimates were `$0.00035095` for Writer and `$0.000266804` for Editor, totaling `$0.000617754`. These are estimates, not an invoice. Both stages passed the post-run credential-residue check.

Current result: **failed acceptance**. The executable inter-role gate prevented malformed output from advancing, but Publishing Desk has not passed the unchanged unseen fixture.
