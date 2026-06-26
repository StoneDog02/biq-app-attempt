---
name: Nutrition Plan Builder
overview: "Expand intake with body metrics, macro-category food preferences, and meals-per-day; compute rule-based macro targets and personalized meal plans; surface today's plan on Nutrition tab; Nutrition Setup mini-flow for existing users."
todos:
  - id: npb-schema
    content: Add nutrition_profile migration, types, saveIntakeProgress + macroFoodOptions data
    status: completed
  - id: npb-engine
    content: Build macroCalculator.ts + mealPlanner v2 + regenerateTodayMeals in planRefresh
    status: completed
  - id: npb-setup-flow
    content: Extract shared setup form components; build app/nutrition/setup mini-flow (4 screens)
    status: completed
  - id: npb-onboarding
    content: Add body_metrics, macro_foods, meal_schedule steps to onboarding + summary
    status: completed
  - id: npb-nutrition-tab
    content: Add MacroSummaryCard + TodayMealPlanPanel to Nutrition tab; setup CTA when incomplete
    status: completed
  - id: npb-docs
    content: Upgrade meal-plan weekly screen with macro totals; docs + roadmap + Journal
    status: completed
isProject: false
---

# Nutrition Plan Builder Sprint

Build personalized macro targets and meal plans from expanded intake data.

## Delivered

- **Schema:** `nutrition_profile` JSONB on `intake_responses` (weight, goal weight, meals/day, macro-category foods)
- **Macro engine:** `macroCalculator.ts` — rule-based daily calorie + P/C/F targets
- **Meal planner v2:** `mealPlanner.ts` — named meals with food combos + per-meal macro lines
- **Nutrition Setup mini-flow:** `/nutrition/setup` (4 screens) for existing users
- **Onboarding expansion:** body_metrics, macro_foods, meal_schedule steps
- **Nutrition tab:** MacroSummaryCard, TodayMealPlanPanel, setup banner when incomplete
- **Plan regeneration:** `regenerateTodayMeals()` updates today's `daily_plans.meals`

## Key files

- `supabase/migrations/20260625160000_nutrition_profile.sql`
- `src/services/macroCalculator.ts`, `src/services/mealPlanner.ts`
- `src/data/macroFoodOptions.ts`
- `src/components/nutrition/setup/NutritionSetupForms.tsx`
- `src/components/nutrition/MacroSummaryCard.tsx`, `TodayMealPlanPanel.tsx`, `NutritionSetupBanner.tsx`
- `app/nutrition/setup/*`, `app/(tabs)/nutrition.tsx`
- `src/hooks/useNutritionProfile.ts`

## Not in sprint

- Phase 5 AI meal generation
- Sex/height/BMI for BMR
- Persisted macro_targets table (computed at runtime)

## Follow-on

**Daily Loop Sync** — habits → daily_plans. **Fitness tab elevation.**
