export const PROTEIN_FOOD_OPTIONS = [
  'Chicken breast',
  'Turkey',
  'Eggs',
  'Salmon',
  'Tuna',
  'Greek yogurt',
  'Cottage cheese',
  'Tofu',
  'Lean beef',
  'Shrimp',
] as const;

export const CARB_FOOD_OPTIONS = [
  'Brown rice',
  'Oats',
  'Sweet potato',
  'Quinoa',
  'Whole wheat bread',
  'Pasta',
  'Fruit',
  'Black beans',
  'Corn tortillas',
  'Potatoes',
] as const;

export const FAT_FOOD_OPTIONS = [
  'Avocado',
  'Olive oil',
  'Almonds',
  'Peanut butter',
  'Walnuts',
  'Cheese',
  'Coconut oil',
  'Chia seeds',
  'Dark chocolate',
  'Flaxseed',
] as const;

export const MEALS_PER_DAY_OPTIONS = [3, 4, 5, 6] as const;

export type MealsPerDay = (typeof MEALS_PER_DAY_OPTIONS)[number];
