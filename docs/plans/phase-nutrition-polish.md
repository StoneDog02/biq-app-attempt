---
name: Nutrition Tab Polish
overview: "Elevate the Nutrition tab to match Habits/Today quality: pinned header, day progress, grouped check-in panel (L1), compact meal log + meal list (L2+), pull-to-refresh, optimistic updates."
todos:
  - id: nutrition-progress-service
    content: Add nutritionProgress.ts with day progress + CHECKIN_OPTIONS config (icons/hints)
    status: completed
  - id: nutrition-components
    content: Add NutritionCheckinPanel/Row, MealLogPanel, MealLogRow, MealLogList components
    status: completed
  - id: nutrition-screen-refactor
    content: Refactor nutrition.tsx — pinned header, DayProgressBar, grouped panels, refresh/focus
    status: completed
  - id: nutrition-mutation-optimistic
    content: Optimistic updates + todayPlan invalidation in useNutrition hooks
    status: completed
  - id: nutrition-docs
    content: Create phase-nutrition-polish.md; update roadmap, README, Journal
    status: completed
isProject: false
---

# Nutrition Tab Polish Sprint

Elevate the Nutrition tab to match Habits/Today quality.

## Delivered

- **Pinned header:** NUTRITION label, "Today's meals" title, copper day progress bar
- **Progress service:** `nutritionProgress.ts` — check-in + meal progress by tracking level
- **Level 1:** Grouped check-in panel (On plan / Mostly / Off plan) with row layout + per-row loading
- **Level 2+:** Compact quick-action chips, grouped meal log panel, compact meal list rows
- **Data freshness:** Pull-to-refresh + `useFocusEffect` query invalidation
- **Optimistic updates:** Instant check-in selection and meal append; `todayPlan` invalidation on settle

## Key files

- `src/services/nutritionProgress.ts`
- `src/components/nutrition/NutritionCheckinPanel.tsx`, `NutritionCheckinRow.tsx`
- `src/components/nutrition/MealLogPanel.tsx`, `MealLogRow.tsx`, `MealLogList.tsx`
- `app/(tabs)/nutrition.tsx`
- `src/hooks/useNutrition.ts`

## Not in sprint

- Barcode / photo / voice flow changes
- Open Food Facts integration depth
- Phase 5 nutrition AI

## Follow-on

**Fitness tab elevation** — same UX pattern pass for Movement tab.
