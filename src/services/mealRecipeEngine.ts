import type { IntakeResponses } from '@/src/types/database';
import { getDietStyleOption } from '@/src/data/dietStyles';
import { buildMealTimes } from '@/src/data/mealTiming';
import {
  MEAL_RECIPES,
  getRecipeById,
  slotTitleToKind,
  type MealRecipe,
  type MealSlotKind,
} from '@/src/data/mealRecipes';
import {
  buildMacroTargets,
  getNutritionProfile,
  splitMacrosAcrossMeals,
} from '@/src/services/macroCalculator';
import type { MealsPerDay } from '@/src/types/database';
import {
  ingredientsToDescription,
  ingredientsToLines,
  scaleRecipeToTargets,
  type ScaledIngredient,
} from '@/src/services/mealPortionScaler';

export type { ScaledIngredient };

const MEAL_SLOT_LABELS: Record<number, string[]> = {
  3: ['Breakfast', 'Lunch', 'Dinner'],
  4: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
  5: ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner'],
  6: ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner', 'Snack'],
};

export type MealRecipeOption = {
  id: string;
  name: string;
  description: string;
  matchScore: number;
};

export type MealSlotPlan = {
  slotKey: string;
  title: string;
  time?: string;
  time24?: string;
  timingNote?: string;
  recipeId: string;
  recipeName: string;
  description: string;
  ingredients: ScaledIngredient[];
  ingredientLines: string[];
  macros: string;
  options: MealRecipeOption[];
};

function getMealSlots(mealsPerDay: MealsPerDay): string[] {
  return MEAL_SLOT_LABELS[mealsPerDay] ?? MEAL_SLOT_LABELS[3];
}

function isRecipeAllowedForDiet(recipe: MealRecipe, dietStyle: string | undefined): boolean {
  if (!recipe.excludeForDiets?.length) return true;
  if (!dietStyle) return true;
  return !recipe.excludeForDiets.includes(dietStyle as never);
}

function scoreRecipe(recipe: MealRecipe, intake: IntakeResponses): number {
  const profile = getNutritionProfile(intake);
  let score = 0;

  for (const food of recipe.proteins) {
    if (profile.protein_foods?.includes(food)) score += 4;
  }
  for (const food of recipe.carbs) {
    if (profile.carb_foods?.includes(food)) score += 3;
  }
  for (const food of recipe.fats) {
    if (profile.fat_foods?.includes(food)) score += 2;
  }

  return score;
}

export function getRecipesForSlot(
  slotKind: MealSlotKind,
  intake: IntakeResponses,
  limit = 4
): MealRecipeOption[] {
  const profile = getNutritionProfile(intake);
  const dietStyle = profile.diet_style;

  return MEAL_RECIPES.filter(
    (recipe) => recipe.slot === slotKind && isRecipeAllowedForDiet(recipe, dietStyle)
  )
    .map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      matchScore: scoreRecipe(recipe, intake),
    }))
    .sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function resolveRecipeForSlot(
  slotTitle: string,
  intake: IntakeResponses,
  slotIndex: number,
  dayIndex: number
): MealRecipe {
  const profile = getNutritionProfile(intake);
  const slotKind = slotTitleToKind(slotTitle);
  const selectionKey = slotTitle;
  const selectedId = profile.meal_selections?.[selectionKey];

  if (selectedId) {
    const selected = getRecipeById(selectedId);
    if (selected && selected.slot === slotKind && isRecipeAllowedForDiet(selected, profile.diet_style)) {
      return selected;
    }
  }

  const options = getRecipesForSlot(slotKind, intake, 6);
  const top = options[0];
  if (top) {
    const recipe = getRecipeById(top.id);
    if (recipe) return recipe;
  }

  const fallbackIndex = (dayIndex + slotIndex) % MEAL_RECIPES.length;
  return (
    MEAL_RECIPES.find((r) => r.slot === slotKind && isRecipeAllowedForDiet(r, profile.diet_style)) ??
    MEAL_RECIPES.filter((r) => r.slot === slotKind)[fallbackIndex % 3] ??
    MEAL_RECIPES[0]
  );
}

export function buildTodaysMealSlots(intake: IntakeResponses, dayIndex: number): MealSlotPlan[] {
  const profile = getNutritionProfile(intake);
  const mealsPerDay = (profile.meals_per_day ?? 3) as MealsPerDay;
  const slots = getMealSlots(mealsPerDay);
  const timedSlots = buildMealTimes(profile, slots);
  const targets = buildMacroTargets(intake, { dayIndex });
  const perMealMacros = targets
    ? splitMacrosAcrossMeals(targets, slots.length)
    : slots.map(() => ({ calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }));

  return slots.map((slotTitle, slotIndex) => {
    const recipe = resolveRecipeForSlot(slotTitle, intake, slotIndex, dayIndex);
    const slotKind = slotTitleToKind(slotTitle);
    const timing = timedSlots[slotIndex];
    const targetMacros = perMealMacros[slotIndex];
    const scaled = scaleRecipeToTargets(recipe.id, targetMacros);
    const options = getRecipesForSlot(slotKind, intake);

    return {
      slotKey: slotTitle,
      title: slotTitle,
      time: timing?.timeLabel,
      time24: timing?.time24,
      timingNote: timing?.timingNote,
      recipeId: recipe.id,
      recipeName: recipe.name,
      description: ingredientsToDescription(scaled.ingredients),
      ingredients: scaled.ingredients,
      ingredientLines: ingredientsToLines(scaled.ingredients),
      macros: scaled.macroLine,
      options,
    };
  });
}

export function mealSlotToPlanDescription(slot: MealSlotPlan): string {
  const parts = slot.ingredientLines.length
    ? slot.ingredientLines.join(' · ')
    : slot.description;
  return `${slot.recipeName} — ${parts} — ${slot.macros}`;
}
