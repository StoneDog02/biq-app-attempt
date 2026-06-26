import type { IntakeResponses, NutritionProfile } from '@/src/types/database';
import {
  getCarbCycleShares,
  getDietStyleOption,
  isCarbCycleHighDay,
} from '@/src/data/dietStyles';

export type MacroTargets = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  label: string;
  dietLabel?: string;
};

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 13,
  light: 14,
  moderate: 15,
  active: 16,
  very_active: 17,
};

export function getNutritionProfile(intake: IntakeResponses | null): NutritionProfile {
  return intake?.nutrition_profile ?? {};
}

export function isNutritionSetupComplete(intake: IntakeResponses | null): boolean {
  const profile = getNutritionProfile(intake);
  return Boolean(
    profile.setup_completed &&
      profile.current_weight_lb &&
      profile.goal_weight_lb &&
      profile.meals_per_day
  );
}

function isMuscleGoal(primaryGoal: string): boolean {
  const goal = primaryGoal.toLowerCase();
  return (
    goal.includes('muscle') ||
    goal.includes('strength') ||
    goal.includes('gain') ||
    goal.includes('bulk')
  );
}

function isWeightLossGoal(current: number, goal: number, primaryGoal: string): boolean {
  if (goal < current) return true;
  const text = primaryGoal.toLowerCase();
  return text.includes('weight') || text.includes('lose') || text.includes('fat');
}

type BuildMacroOptions = {
  /** 0 = Monday … 6 = Sunday — used for carb cycling day splits */
  dayIndex?: number;
};

export function buildMacroTargets(
  intake: IntakeResponses | null,
  options: BuildMacroOptions = {}
): MacroTargets | null {
  const profile = getNutritionProfile(intake);
  const current = profile.current_weight_lb;
  const goal = profile.goal_weight_lb;

  if (!current || !goal) return null;

  const goals = intake?.goals ?? {};
  const activity = intake?.activity ?? {};
  const primaryGoal = String(goals.primary_goal ?? '');
  const activityLevel = String(activity.activity_level ?? 'moderate');
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 15;

  let calories = Math.round(current * multiplier);

  if (isWeightLossGoal(current, goal, primaryGoal)) {
    calories = Math.max(1200, calories - 400);
  } else if (isMuscleGoal(primaryGoal) && goal >= current) {
    calories += 250;
  }

  const proteinMultiplier = isMuscleGoal(primaryGoal) ? 1.0 : 0.85;
  const protein_g = Math.round(goal * proteinMultiplier);
  const proteinCalories = protein_g * 4;
  const remainingCalories = Math.max(0, calories - proteinCalories);

  const dietStyle = profile.diet_style ?? 'standard';
  const dietConfig = getDietStyleOption(dietStyle);

  let { carbShare, fatShare } = dietConfig;
  if (dietStyle === 'carb_cycle' && options.dayIndex !== undefined) {
    const cycle = getCarbCycleShares(options.dayIndex);
    carbShare = cycle.carbShare;
    fatShare = cycle.fatShare;
  }

  const shareTotal = carbShare + fatShare || 1;
  let carbCalories = Math.round((remainingCalories * carbShare) / shareTotal);
  let fatCalories = Math.max(0, remainingCalories - carbCalories);

  let carbs_g = Math.round(carbCalories / 4);
  let fat_g = Math.round(fatCalories / 9);

  if (dietConfig.maxCarbsG !== undefined) {
    carbs_g = Math.min(carbs_g, dietConfig.maxCarbsG);
    carbCalories = carbs_g * 4;
    fatCalories = Math.max(0, remainingCalories - carbCalories);
    fat_g = Math.round(fatCalories / 9);
  }

  let dietLabel = dietConfig.label;
  if (dietStyle === 'carb_cycle' && options.dayIndex !== undefined) {
    dietLabel += isCarbCycleHighDay(options.dayIndex) ? ' · high-carb day' : ' · low-carb day';
  }

  return {
    calories,
    protein_g,
    carbs_g,
    fat_g,
    label: `${calories} cal · ${protein_g}P · ${carbs_g}C · ${fat_g}F`,
    dietLabel,
  };
}

export function splitMacrosAcrossMeals(
  targets: MacroTargets,
  mealCount: number
): { calories: number; protein_g: number; carbs_g: number; fat_g: number }[] {
  const count = Math.max(1, mealCount);
  const perMeal = {
    calories: Math.round(targets.calories / count),
    protein_g: Math.round(targets.protein_g / count),
    carbs_g: Math.round(targets.carbs_g / count),
    fat_g: Math.round(targets.fat_g / count),
  };
  return Array.from({ length: count }, () => ({ ...perMeal }));
}

export function formatMealMacroLine(macros: {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}): string {
  return `~${macros.calories} cal · ${macros.protein_g}P · ${macros.carbs_g}C · ${macros.fat_g}F`;
}
