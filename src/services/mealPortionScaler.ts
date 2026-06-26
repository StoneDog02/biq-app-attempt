import {
  caloriesPerGram,
  getFoodNutrition,
  macroPerGram,
  type MacroRole,
} from '@/src/data/foodNutrition';
import { getRecipeTemplate, type RecipeTemplateIngredient } from '@/src/data/recipeTemplates';
import { formatMealMacroLine } from '@/src/services/macroCalculator';

export type MealMacroTargets = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type ScaledIngredient = {
  food: string;
  display: string;
  grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

function roundGrams(grams: number): number {
  if (grams >= 100) return Math.round(grams / 5) * 5;
  if (grams >= 30) return Math.round(grams);
  return Math.max(1, Math.round(grams));
}

function formatFraction(value: number): string {
  const whole = Math.floor(value);
  const frac = value - whole;
  if (frac < 0.25) return whole > 0 ? String(whole) : '';
  if (frac < 0.75) return whole > 0 ? `${whole}½` : '½';
  return String(whole + 1);
}

function formatFriendlyAmount(food: string, grams: number): string {
  const info = getFoodNutrition(food);
  if (!info) return `${Math.round(grams)}g ${food}`;

  const label = info.label;

  if (info.unitHint === 'egg' && info.gramsPerUnit) {
    const count = Math.max(1, Math.round(grams / info.gramsPerUnit));
    return count === 1 ? `1 large egg` : `${count} large eggs`;
  }

  if (info.unitHint === 'tbsp' && info.gramsPerUnit) {
    const count = Math.max(1, Math.round(grams / info.gramsPerUnit));
    return count === 1 ? `1 tbsp ${label}` : `${count} tbsp ${label}`;
  }

  if (info.unitHint === 'tsp' && info.gramsPerUnit) {
    const count = Math.max(1, Math.round(grams / info.gramsPerUnit));
    return count === 1 ? `1 tsp ${label}` : `${count} tsp ${label}`;
  }

  if (info.unitHint === 'slice' && info.gramsPerUnit) {
    const count = Math.max(1, Math.round(grams / info.gramsPerUnit));
    return count === 1 ? `1 slice ${label}` : `${count} slices ${label}`;
  }

  if (info.unitHint === 'oz' && info.gramsPerUnit) {
    const oz = Math.max(1, Math.round(grams / info.gramsPerUnit));
    return `${oz} oz ${label}`;
  }

  if (info.unitHint === 'cup' && info.gramsPerUnit) {
    const cups = grams / info.gramsPerUnit;
    const rounded = Math.max(0.25, Math.round(cups * 4) / 4);
    const cupLabel = formatFraction(rounded);
    return `${cupLabel} cup ${label} (${Math.round(grams)}g)`;
  }

  return `${Math.round(grams)}g ${label}`;
}

function computeMacrosForGrams(food: string, grams: number) {
  const info = getFoodNutrition(food);
  if (!info) {
    return { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
  }
  const factor = grams / 100;
  return {
    calories: Math.round(info.calories * factor),
    protein_g: Math.round(info.protein_g * factor),
    carbs_g: Math.round(info.carbs_g * factor),
    fat_g: Math.round(info.fat_g * factor),
  };
}

function scaleTemplateIngredient(
  item: RecipeTemplateIngredient,
  targets: MealMacroTargets
): ScaledIngredient | null {
  if (item.fixedGrams !== undefined && item.share === 0) {
    const grams = item.fixedGrams;
    const macros = computeMacrosForGrams(item.food, grams);
    return {
      food: item.food,
      display: formatFriendlyAmount(item.food, grams),
      grams,
      ...macros,
    };
  }

  const roleKey = item.role === 'carb' ? 'carbs_g' : `${item.role}_g`;
  const roleTarget = targets[roleKey as keyof MealMacroTargets] as number;
  const allocated = roleTarget * item.share;
  if (allocated <= 0) return null;

  const perGram = macroPerGram(item.food, item.role);
  if (perGram <= 0) {
    if (item.role === 'fat') {
      const calPerGram = caloriesPerGram(item.food);
      if (calPerGram <= 0) return null;
      const grams = roundGrams((targets.calories * item.share * 0.25) / calPerGram);
      const macros = computeMacrosForGrams(item.food, grams);
      return { food: item.food, display: formatFriendlyAmount(item.food, grams), grams, ...macros };
    }
    return null;
  }

  const grams = roundGrams(allocated / perGram);
  const macros = computeMacrosForGrams(item.food, grams);
  return {
    food: item.food,
    display: formatFriendlyAmount(item.food, grams),
    grams,
    ...macros,
  };
}

function sumMacros(ingredients: ScaledIngredient[]) {
  return ingredients.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein_g: acc.protein_g + item.protein_g,
      carbs_g: acc.carbs_g + item.carbs_g,
      fat_g: acc.fat_g + item.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
}

export function scaleRecipeToTargets(
  recipeId: string,
  targets: MealMacroTargets
): { ingredients: ScaledIngredient[]; macros: MealMacroTargets; macroLine: string } {
  const template = getRecipeTemplate(recipeId);
  const ingredients = template
    .map((item) => scaleTemplateIngredient(item, targets))
    .filter((item): item is ScaledIngredient => item !== null);

  const totals = sumMacros(ingredients);

  return {
    ingredients,
    macros: totals,
    macroLine: formatMealMacroLine(totals),
  };
}

export function ingredientsToDescription(ingredients: ScaledIngredient[]): string {
  return ingredients.map((item) => item.display).join(' · ');
}

export function ingredientsToLines(ingredients: ScaledIngredient[]): string[] {
  return ingredients.map((item) => item.display);
}
