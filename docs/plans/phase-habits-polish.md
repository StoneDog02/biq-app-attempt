---
name: Habits Tab Polish
overview: "Elevate the Habits tab to match Today's Plan quality: pinned header with day progress, unified copper/checkmark UX, pull-to-refresh, and compact weekly history."
todos:
  - id: habit-progress-service
    content: Add habitProgress.ts + shared HABITS constant; compute day progress from habit_logs
    status: completed
  - id: day-progress-bar
    content: Extract DayProgressBar to src/components/ui/; update today.tsx import
    status: completed
  - id: habits-screen-layout
    content: Refactor habits.tsx — pinned header, DayProgressBar, scrollable cards + history
    status: completed
  - id: habits-card-ux
    content: Upgrade habit cards — SymbolView checkmarks, cardDone styling, compact history dots
    status: completed
  - id: habits-refresh
    content: Add useFocusEffect invalidation + RefreshControl on Habits tab
    status: completed
  - id: habits-docs
    content: Create phase-habits-polish.md; mark today loop complete; update roadmap + Journal
    status: completed
isProject: false
---

# Habits Tab Polish Sprint

Elevate the Habits tab to match Today's Plan quality.

## Delivered

- **Pinned header:** All-caps HABITS label, "Today's habits" title, copper day progress bar
- **Progress service:** `habitProgress.ts` — shared `HABITS` constant, `getHabitDayProgress` from `habit_logs`
- **Shared component:** `DayProgressBar` extracted to `src/components/ui/` (Today imports it unchanged)
- **Habit cards:** SymbolView checkmarks, `cardDone` opacity, tier-aware light vs moderate UX
- **History:** 7-day rows with copper dot indicators (`HabitHistoryDots`)
- **Data freshness:** Pull-to-refresh + `useFocusEffect` query invalidation

## Key files

- `src/services/habitProgress.ts`
- `src/components/ui/DayProgressBar.tsx`
- `src/components/habits/HabitHistoryDots.tsx`
- `app/(tabs)/habits.tsx`
- `app/(tabs)/today.tsx` (DayProgressBar import only)

## Not in sprint

- `habit_logs` → `daily_plans` sync (Daily Loop Sync follow-on)
- HealthKit, push reminders, new habit types, Phase 5 AI

## Follow-on

**Daily Loop Sync** — wire Habits tab logs to Today's Plan `daily_plans` items (meals/workouts/supplements already sync via `markPlan*Complete`).

## UI elevation (06/25/2026)

- Replaced 3 bulky Cards with **single grouped checklist** (`HabitChecklist`, `HabitRow`, `HabitStepper`)
- **Per-row loading** — spinner only on the habit being saved (not all rows)
- **Water (moderate+):** inline +/- stepper with auto-save; no Save button
- **Steps (moderate+):** tap-to-complete only (HealthKit later)
- **Optimistic updates** in `useLogHabit` for instant toggle feedback
- Icons + status hints per habit in `habitProgress.ts`
