# BODYiQ Development Journal

A daily diary of work done on the BODYiQ mobile app.

## Structure

- One file per calendar day, grouped under `Journal/YYYY/`
- **Filename:** `MM-DD-YYYY.md` (filesystem-safe; maps to display date `MM/DD/YYYY`)
- **Title:** Each file starts with `# MM/DD/YYYY`

## Automatic daily rollover

When you start a new Cursor agent session, `.cursor/hooks/ensure-journal-today.sh` runs via `sessionStart` and creates today's file if it does not exist (header only).

Agents also follow [`.cursor/rules/bodyiq-journal.mdc`](../.cursor/rules/bodyiq-journal.mdc): verify today's date from context and append only to today's file — you should not need to ask for a new daily entry each morning.

## Writing entries

- Segment work with `##` headings per chunk (e.g. `## Phase 0 — Expo scaffold`)
- **Same day:** append new sections — do not overwrite earlier entries
- **New day:** a new file is created automatically (hook + agent rule); work goes in that file

## Entry template

```markdown
# MM/DD/YYYY

## Phase X — Chunk title
- What was done
- Files touched
- Notes / blockers
```

## Source plan

Master build plan: [`docs/plans/bodyiq-mobile-app.md`](../docs/plans/bodyiq-mobile-app.md)

Active sprint and all plans: [`docs/plans/README.md`](../docs/plans/README.md)
