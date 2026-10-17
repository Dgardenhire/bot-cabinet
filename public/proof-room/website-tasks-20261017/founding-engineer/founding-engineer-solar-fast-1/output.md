**Controlled first-answer test — delivered in conversation only.**

**Smallest mock-data implementation (prototype, no execution):**

A single pure function over a fixed, in-memory sample dataset. No dependencies, no I/O, no external services.

`mock_task_notes.ts`:
```ts
// Fictional prototype sample data — not real data.
const SAMPLE_NOTES = [
  { text: "Mina: draft outline by Nov 2", owner: "Mina", due: "Nov 2" },
  { text: "review budget" },
];

export function parseTaskNotes(notes: string[]): Array<{ text: string; owner: string | null; action: string; due: string | null }> {
  return notes.map((line) => {
    const trimmed = line.trim();
    const ownerMatch = trimmed.match(/^([A-Za-z0-9_.-]+):\s*(.+)$/);
    const parts = ownerMatch
      ? [ownerMatch[1].trim(), ownerMatch[2].trim()]
      : [null, trimmed];

    const dueMatch = parts[1]?.match(/\s+by\s+([^;]+)$/i);
    const action = dueMatch
      ? parts[1].slice(0, -dueMatch[0].length).trim()
      : parts[1];

    return {
      text: trimmed,
      owner: parts[0] || null,
      action: action,
      due: dueMatch ? dueMatch[1].trim() : null,
    };
  });
}
```

Sample output for the acceptance sample:
```ts
parseTaskNotes(["Mina: draft outline by Nov 2", "review budget"])
// [
//   { text: "Mina: draft outline by Nov 2", owner: "Mina", action: "draft outline", due: "Nov 2" },
//   { text: "review budget", owner: null, action: "review budget", due: null }
// ]
```

Key behavior:
- Owner parsed only when prefixed by `Name: `.
- Due date captured as the `by <date>` suffix when present.
- Notes without owner or due date keep `owner: null` and `due: null` — never guessed.

Acceptance checks:
1. `Mina: draft outline by Nov 2` → `owner === "Mina"`, `action === "draft outline"`, `due === "Nov 2"`.
2. `review budget` → `owner === null`, `action === "review budget"`, `due === null`.
3. A note with an owner but no due date, e.g. `Mina: review budget`, produces `owner: "Mina"` and `due: null` (owner is preserved, date not guessed).
4. Empty strings and whitespace-only notes yield `owner: null`, `action: ""`, `due: null` rather than crashing.
5. No sample notes introduce side effects, network calls, file writes, or runtime errors when invoked.

Decision log / shortcuts / risks:
- Shortcut: the implementation only parses the supplied fictional sample; it is not a general-purpose note parser.
- Risk: the regex for date capture is intentionally narrow and only matches explicit `by <date>` suffixes; changing input format would require updating the parsing rules.
- Risk/open question: the sample dataset is in-memory and fixed; any real-world use would require an approved data source and a person to accept the output contract before release.
- No dependencies added; no data structure changed; no outside service connected; no files saved or published.

**Build and tests have not run.** No execution tools, files, or outside services were used in this exercise — this is a written prototype proposal only.