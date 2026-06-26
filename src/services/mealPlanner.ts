import type { IntakeResponses, PlanItem } from '@/src/types/database';
import { RESTAURANT_GUIDES, filterRestaurantItems } from '@/src/data/restaurants';
import {
  getDietStyleOption,
  isCarbCycleHighDay,
} from '@/src/data/dietStyles';
import {
  buildMacroTargets,
  getNutritionProfile,
  isNutritionSetupComplete,
} from '@/src/services/macroCalculator';
import { buildTodaysMealSlots, mealSlotToPlanDescription } from '@/src/services/mealRecipeEngine';

export type MealDetail = {
  title: string;
  description: string;
  macros: string;
  time?: string;
  time24?: string;
  timingNote?: string;
  recipeId?: string;
  recipeName?: string;
  ingredientLines?: string[];
};

export type MealSuggestion = {
  id: string;
  dayLabel: string;
  meals: MealDetail[];
  note: string;
  dailyMacros: string;
};

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function primaryGoalCopy(goals: Record<string, unknown>): string {
  const goal = String(goals.primary_goal ?? 'wellness');
  if (goal.toLowerCase().includes('weight')) return 'steady energy and portion awareness';
  if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    return 'protein at each meal';
  }
  if (goal.toLowerCase().includes('energy')) return 'balanced meals that sustain your day';
  return goal.toLowerCase();
}

function dietNote(intake: IntakeResponses): string {
  const profile = getNutritionProfile(intake);
  const dietConfig = getDietStyleOption(profile.diet_style);
  return `Built for your ${dietConfig.label.toLowerCase()} plan.`;
}

function buildMealsForDay(intake: IntakeResponses, dayIndex: number): MealDetail[] {
  return buildTodaysMealSlots(intake, dayIndex).map((slot) => ({
    title: slot.title,
    description: slot.description,
    macros: slot.macros,
    time: slot.time,
    time24: slot.time24,
    timingNote: slot.timingNote,
    recipeId: slot.recipeId,
    recipeName: slot.recipeName,
    ingredientLines: slot.ingredientLines,
  }));
}

function legacyWeeklySuggestions(intake: IntakeResponses | null): MealSuggestion[] {
  const goals = intake?.goals ?? {};
  const dietary = intake?.dietary_prefs ?? {};
  const foodLikes = intake?.food_likes ?? {};
  const goalFocus = primaryGoalCopy(goals);
  const likes = String(foodLikes.likes ?? '')
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const proteinLunch =
    likes.length > 0
      ? `${likes[0]} bowl or salad with lean protein`
      : 'Grilled protein + vegetables + whole grain';

  const easyDinner =
    likes.length > 1
      ? `${likes[1]}-style plate with half the plate as veggies`
      : 'Sheet-pan dinner: protein, roasted vegetables, olive oil';

  return DAY_LABELS.map((day, index) => ({
    id: `day-${index}`,
    dayLabel: day,
    meals: [
      {
        title: 'Breakfast',
        description:
          index % 2 === 0
            ? 'Greek yogurt, berries, and a handful of nuts'
            : 'Eggs or egg whites with avocado toast',
        macros: '',
      },
      {
        title: 'Lunch',
        description:
          index < 5 ? proteinLunch : "Flexible meal — use the eating-out guide if you're on the go",
        macros: '',
      },
      {
        title: 'Dinner',
        description: easyDinner,
        macros: '',
      },
    ],
    note: `${day}: focus on ${goalFocus}. ${String(dietary.diet_type ?? 'balanced')} preferences.`,
    dailyMacros: '',
  }));
}

export function buildWeeklyMealSuggestions(intake: IntakeResponses | null): MealSuggestion[] {
  if (!intake || !isNutritionSetupComplete(intake)) {
    return legacyWeeklySuggestions(intake);
  }

  const goals = intake.goals ?? {};
  const goalFocus = primaryGoalCopy(goals);

  return DAY_LABELS.map((day, index) => {
    const targets = buildMacroTargets(intake, { dayIndex: index });
    const dailyMacros = targets?.label ?? '';
    const cycleNote =
      intake.nutrition_profile?.diet_style === 'carb_cycle'
        ? isCarbCycleHighDay(index)
          ? ' Higher carbs today.'
          : ' Lower carbs today.'
        : '';

    return {
      id: `day-${index}`,
      dayLabel: day,
      meals: buildMealsForDay(intake, index),
      note: `${day}: focus on ${goalFocus}. ${dietNote(intake)}${cycleNote}`,
      dailyMacros,
    };
  });
}

export function getFilteredGuides(intake: IntakeResponses | null) {
  const dietary = intake?.dietary_prefs ?? {};
  const profile = getNutritionProfile(intake);
  const dietStyle = profile.diet_style;

  const mergedPrefs = {
    ...dietary,
    diet_type:
      dietStyle === 'keto' || dietStyle === 'low_carb' || dietStyle === 'carnivore'
        ? 'low carb'
        : dietary.diet_type,
  };

  return RESTAURANT_GUIDES.map((guide) => ({
    ...guide,
    items: filterRestaurantItems(guide, mergedPrefs),
  }));
}

export function buildTodaysMealPlan(intake: IntakeResponses | null): PlanItem[] {
  if (!intake || !isNutritionSetupComplete(intake)) {
    return buildLegacyMealsFromIntake(intake);
  }

  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const slots = buildTodaysMealSlots(intake, dayIndex);

  return slots.map((slot, index) => ({
    id: `m${index + 1}`,
    title: slot.title,
    description: mealSlotToPlanDescription(slot),
    scheduled_time: slot.time,
    recipe_id: slot.recipeId,
    completed: false,
  }));
}

function buildLegacyMealsFromIntake(intake: IntakeResponses | null): PlanItem[] {
  const suggestions = legacyWeeklySuggestions(intake);
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const todayMeals = suggestions[dayIndex].meals;

  return todayMeals.map((meal, index) => ({
    id: `m${index + 1}`,
    title: `${meal.title} idea`,
    description: meal.description,
    completed: false,
  }));
}

export function buildPersonalizedMealsFromIntake(intake: IntakeResponses | null): PlanItem[] {
  return buildTodaysMealPlan(intake);
}

export function getTodaysMealDetails(intake: IntakeResponses | null) {
  if (!intake || !isNutritionSetupComplete(intake)) return null;

  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  return buildMealsForDay(intake, dayIndex);
}
