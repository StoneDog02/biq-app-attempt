---
name: Today Plan Loop Polish
overview: "Polish the Today's Plan vertical slice: auto-refresh daily plans, dynamic coach copy, section action links, day progress summary, and UX refinements for Level 1 users."
todos:
  - id: tpl-a-refresh
    content: Add planCoach.ts + planRefresh.ts; refactor seedDailyPlan; ensureTodayPlan
    status: completed
  - id: tpl-a-hook
    content: Add planProgress.ts + update useTodayPlan to call ensureTodayPlan
    status: completed
  - id: tpl-c-links
    content: Today screen action links for Habits/Workout/Meals/Supplements
    status: completed
  - id: tpl-d-ux
    content: Day progress bar, checkmarks, useFocusEffect refetch, pull-to-refresh
    status: completed
  - id: tpl-e-docs
    content: Docs, README, roadmap, Journal
    status: completed
isProject: false
---

# Today's Plan Loop — Vertical Slice Polish

Cross-cutting sprint to make Today's Plan the polished daily hub.

## Delivered

- **Auto-refresh:** `ensureTodayPlan` seeds a fresh plan when calendar day changes
- **Coach copy:** `planCoach.ts` — weekday greeting + engagement tone + goal
- **Action links:** Log habits / movement / meals / supplements → respective tabs
- **Progress:** `planProgress.ts` + copper progress bar
- **UX:** Checkmarks on completed cards, pull-to-refresh, refetch on tab focus

## Key files

- `src/services/planRefresh.ts`, `planCoach.ts`, `planProgress.ts`
- `app/(tabs)/today.tsx`
- `src/hooks/usePlan.ts`

## Not in sprint

AI coach, habit_logs sync, push content, Shopify/CareValidate

## Segmented layout (06/25/2026)

- **Segment bar:** Habits | Movement | Meals | Supplements — one domain visible at a time
- **Smart order:** `planSectionOrder.ts` — segment order from intake `primary_goal`
- **Auto-focus:** Opens first incomplete domain; time-of-day tie-break; auto-advance when domain completed
- **Components:** `DomainSegmentBar`, `PlanSection` in `src/components/today/`

## Status

**Complete** — segmented layout, pinned header, DomainStatusBadge, pull-to-refresh (06/25/2026).
