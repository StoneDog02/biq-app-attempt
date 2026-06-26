export type MacroRole = 'protein' | 'carb' | 'fat';

export type FoodNutrition = {
  label: string;
  /** Per 100 g edible portion */
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  /** Optional friendly unit conversion */
  unitHint?: 'egg' | 'tbsp' | 'tsp' | 'slice' | 'oz' | 'cup';
  gramsPerUnit?: number;
};

export const FOOD_NUTRITION: Record<string, FoodNutrition> = {
  'Greek yogurt': {
    label: 'Greek yogurt',
    calories: 97,
    protein_g: 9,
    carbs_g: 3.6,
    fat_g: 5,
    unitHint: 'cup',
    gramsPerUnit: 227,
  },
  Eggs: {
    label: 'eggs',
    calories: 143,
    protein_g: 13,
    carbs_g: 0.7,
    fat_g: 10,
    unitHint: 'egg',
    gramsPerUnit: 50,
  },
  Oats: {
    label: 'oats (dry)',
    calories: 379,
    protein_g: 13,
    carbs_g: 67,
    fat_g: 7,
    unitHint: 'cup',
    gramsPerUnit: 80,
  },
  Fruit: {
    label: 'mixed berries',
    calories: 57,
    protein_g: 0.7,
    carbs_g: 14,
    fat_g: 0.3,
    unitHint: 'cup',
    gramsPerUnit: 140,
  },
  Honey: {
    label: 'honey',
    calories: 304,
    protein_g: 0.3,
    carbs_g: 82,
    fat_g: 0,
    unitHint: 'tbsp',
    gramsPerUnit: 21,
  },
  'Cottage cheese': {
    label: 'cottage cheese',
    calories: 98,
    protein_g: 11,
    carbs_g: 3.4,
    fat_g: 4.3,
    unitHint: 'cup',
    gramsPerUnit: 226,
  },
  Turkey: {
    label: 'turkey breast',
    calories: 135,
    protein_g: 30,
    carbs_g: 0,
    fat_g: 1,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  'Chicken breast': {
    label: 'chicken breast',
    calories: 165,
    protein_g: 31,
    carbs_g: 0,
    fat_g: 3.6,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  Salmon: {
    label: 'salmon',
    calories: 208,
    protein_g: 20,
    carbs_g: 0,
    fat_g: 13,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  Tuna: {
    label: 'tuna (canned in water)',
    calories: 116,
    protein_g: 26,
    carbs_g: 0,
    fat_g: 1,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  Tofu: {
    label: 'firm tofu',
    calories: 144,
    protein_g: 17,
    carbs_g: 3,
    fat_g: 9,
    unitHint: 'cup',
    gramsPerUnit: 248,
  },
  'Lean beef': {
    label: 'lean beef',
    calories: 250,
    protein_g: 26,
    carbs_g: 0,
    fat_g: 15,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  Shrimp: {
    label: 'shrimp',
    calories: 99,
    protein_g: 24,
    carbs_g: 0.2,
    fat_g: 0.3,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  'Brown rice': {
    label: 'brown rice (cooked)',
    calories: 123,
    protein_g: 2.7,
    carbs_g: 26,
    fat_g: 1,
    unitHint: 'cup',
    gramsPerUnit: 195,
  },
  'Sweet potato': {
    label: 'sweet potato',
    calories: 86,
    protein_g: 1.6,
    carbs_g: 20,
    fat_g: 0.1,
    unitHint: 'cup',
    gramsPerUnit: 133,
  },
  Quinoa: {
    label: 'quinoa (cooked)',
    calories: 120,
    protein_g: 4.4,
    carbs_g: 21,
    fat_g: 1.9,
    unitHint: 'cup',
    gramsPerUnit: 185,
  },
  'Whole wheat bread': {
    label: 'whole wheat bread',
    calories: 247,
    protein_g: 13,
    carbs_g: 41,
    fat_g: 3.4,
    unitHint: 'slice',
    gramsPerUnit: 43,
  },
  Pasta: {
    label: 'whole wheat pasta (cooked)',
    calories: 124,
    protein_g: 5,
    carbs_g: 26,
    fat_g: 0.5,
    unitHint: 'cup',
    gramsPerUnit: 140,
  },
  'Black beans': {
    label: 'black beans (cooked)',
    calories: 132,
    protein_g: 8.9,
    carbs_g: 24,
    fat_g: 0.5,
    unitHint: 'cup',
    gramsPerUnit: 172,
  },
  'Corn tortillas': {
    label: 'corn tortilla',
    calories: 218,
    protein_g: 5.7,
    carbs_g: 45,
    fat_g: 2.9,
    unitHint: 'slice',
    gramsPerUnit: 24,
  },
  Potatoes: {
    label: 'potatoes',
    calories: 87,
    protein_g: 1.9,
    carbs_g: 20,
    fat_g: 0.1,
    unitHint: 'cup',
    gramsPerUnit: 150,
  },
  Avocado: {
    label: 'avocado',
    calories: 160,
    protein_g: 2,
    carbs_g: 9,
    fat_g: 15,
    unitHint: 'cup',
    gramsPerUnit: 146,
  },
  'Olive oil': {
    label: 'olive oil',
    calories: 884,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 100,
    unitHint: 'tbsp',
    gramsPerUnit: 14,
  },
  Almonds: {
    label: 'almonds',
    calories: 579,
    protein_g: 21,
    carbs_g: 22,
    fat_g: 50,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  'Peanut butter': {
    label: 'peanut butter',
    calories: 588,
    protein_g: 25,
    carbs_g: 20,
    fat_g: 50,
    unitHint: 'tbsp',
    gramsPerUnit: 16,
  },
  Walnuts: {
    label: 'walnuts',
    calories: 654,
    protein_g: 15,
    carbs_g: 14,
    fat_g: 65,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  Cheese: {
    label: 'cheese',
    calories: 402,
    protein_g: 25,
    carbs_g: 1.3,
    fat_g: 33,
    unitHint: 'oz',
    gramsPerUnit: 28,
  },
  'Coconut oil': {
    label: 'coconut oil',
    calories: 862,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 100,
    unitHint: 'tbsp',
    gramsPerUnit: 14,
  },
  'Chia seeds': {
    label: 'chia seeds',
    calories: 486,
    protein_g: 17,
    carbs_g: 42,
    fat_g: 31,
    unitHint: 'tbsp',
    gramsPerUnit: 12,
  },
  'Mixed greens': {
    label: 'mixed greens',
    calories: 20,
    protein_g: 2,
    carbs_g: 3,
    fat_g: 0.2,
    unitHint: 'cup',
    gramsPerUnit: 85,
  },
  Broccoli: {
    label: 'broccoli',
    calories: 35,
    protein_g: 2.4,
    carbs_g: 7,
    fat_g: 0.4,
    unitHint: 'cup',
    gramsPerUnit: 91,
  },
  Butter: {
    label: 'butter',
    calories: 717,
    protein_g: 0.9,
    carbs_g: 0.1,
    fat_g: 81,
    unitHint: 'tbsp',
    gramsPerUnit: 14,
  },
};

export function getFoodNutrition(food: string): FoodNutrition | undefined {
  return FOOD_NUTRITION[food];
}

export function macroPerGram(food: string, role: MacroRole): number {
  const info = getFoodNutrition(food);
  if (!info) return 0;
  const key = role === 'carb' ? 'carbs_g' : `${role}_g`;
  return info[key as 'protein_g' | 'carbs_g' | 'fat_g'] / 100;
}

export function caloriesPerGram(food: string): number {
  const info = getFoodNutrition(food);
  if (!info) return 0;
  return info.calories / 100;
}
