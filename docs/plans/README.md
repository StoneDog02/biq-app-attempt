# BODYiQ Build Plans

Version-controlled build plans for the BODYiQ mobile app. These mirror Cursor Plan mode documents so the team and git history have full context alongside the [Journal](../../Journal/).

## Where things live

| Location | Purpose |
|----------|---------|
| [`docs/plans/`](.) | **Git-tracked plans** (this folder) — documentation source of truth in the repo |
| [`Journal/`](../../Journal/) | Daily work diary — what was done, when, and any blockers |
| [`.cursor/rules/`](../../.cursor/rules/) | Condensed agent context (product, roadmap, stack) |
| `~/.cursor/plans/` | Cursor IDE Plan mode copies (local to your machine) |

## Sync rule

When a plan is **created or materially updated** in Cursor Plan mode:

1. Mirror the updated content to `docs/plans/` using a **readable filename** (no UUID suffix)
2. Update [`.cursor/rules/bodyiq-roadmap.mdc`](../../.cursor/rules/bodyiq-roadmap.mdc) if phase scope changes
3. Add a [Journal](../../Journal/) entry noting the plan change

## Plan index

| File | Description | Status |
|------|-------------|--------|
| [bodyiq-mobile-app.md](bodyiq-mobile-app.md) | Master plan — Phases 0–5, stack, architecture | Phase 0–1 complete |
| [phase-2-nutrition.md](phase-2-nutrition.md) | Phase 2 sprint — tiered food tracking, meal planning | Base layout complete |
| [phase-3-fitness.md](phase-3-fitness.md) | Phase 3 sprint — Fitness tab, programs, exercise library, recovery shells | Base layout complete |
| [phase-4-care.md](phase-4-care.md) | Phase 4 sprint — Care tab, supplement logging, shop, portal, telehealth, labs shells | Base layout complete |
| [phase-today-plan-loop.md](phase-today-plan-loop.md) | Today's Plan loop polish — auto-refresh, coach copy, segmented layout, status badges | Complete |
| [phase-habits-polish.md](phase-habits-polish.md) | Habits tab polish — pinned header, progress bar, grouped checklist, history dots | Complete |
| [phase-nutrition-polish.md](phase-nutrition-polish.md) | Nutrition tab polish — pinned header, check-in panel, meal log/list, optimistic updates | Complete |
| [phase-nutrition-plan-builder.md](phase-nutrition-plan-builder.md) | Nutrition plan builder — intake expansion, macros, meal plan v2, setup mini-flow | Complete |
| [repo-plans-documentation.md](repo-plans-documentation.md) | How this folder is set up and kept in sync | Complete |

## Active sprint

No active cross-cutting sprint. Next recommended: **Fitness tab elevation** or **Daily Loop Sync** (habits → daily_plans).

## Sync workflow (Option B)

When a new phase plan is proposed in Cursor Plan mode, the agent **dual-writes** in the same turn: Cursor plan (`~/.cursor/plans/`) + repo copy here (`docs/plans/`). See [`.cursor/rules/bodyiq-plans.mdc`](../../.cursor/rules/bodyiq-plans.mdc).
