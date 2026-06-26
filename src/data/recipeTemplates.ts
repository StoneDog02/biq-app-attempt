import type { MacroRole } from '@/src/data/foodNutrition';

export type RecipeTemplateIngredient = {
  food: string;
  role: MacroRole;
  /** Share of this macro role allocated to this ingredient (0–1) */
  share: number;
  /** Fixed amount for garnish / negligible items */
  fixedGrams?: number;
};

export const RECIPE_TEMPLATES: Record<string, RecipeTemplateIngredient[]> = {
  'bfast-yogurt-bowl': [
    { food: 'Greek yogurt', role: 'protein', share: 1 },
    { food: 'Fruit', role: 'carb', share: 0.8 },
    { food: 'Honey', role: 'carb', share: 0.2 },
    { food: 'Almonds', role: 'fat', share: 1 },
  ],
  'bfast-eggs-avocado': [
    { food: 'Eggs', role: 'protein', share: 1 },
    { food: 'Whole wheat bread', role: 'carb', share: 1 },
    { food: 'Avocado', role: 'fat', share: 1 },
  ],
  'bfast-oatmeal-pb': [
    { food: 'Oats', role: 'carb', share: 0.7 },
    { food: 'Fruit', role: 'carb', share: 0.3 },
    { food: 'Greek yogurt', role: 'protein', share: 1 },
    { food: 'Peanut butter', role: 'fat', share: 0.7 },
    { food: 'Chia seeds', role: 'fat', share: 0.3 },
  ],
  'bfast-cottage-fruit': [
    { food: 'Cottage cheese', role: 'protein', share: 1 },
    { food: 'Fruit', role: 'carb', share: 1 },
    { food: 'Walnuts', role: 'fat', share: 1 },
  ],
  'bfast-egg-wrap': [
    { food: 'Eggs', role: 'protein', share: 0.6 },
    { food: 'Turkey', role: 'protein', share: 0.4 },
    { food: 'Corn tortillas', role: 'carb', share: 1 },
    { food: 'Avocado', role: 'fat', share: 1 },
  ],
  'bfast-keto-eggs': [
    { food: 'Eggs', role: 'protein', share: 0.6 },
    { food: 'Turkey', role: 'protein', share: 0.4 },
    { food: 'Avocado', role: 'fat', share: 0.6 },
    { food: 'Cheese', role: 'fat', share: 0.4 },
  ],
  'lunch-chicken-rice': [
    { food: 'Chicken breast', role: 'protein', share: 1 },
    { food: 'Brown rice', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
    { food: 'Mixed greens', role: 'carb', share: 0, fixedGrams: 85 },
  ],
  'lunch-salmon-salad': [
    { food: 'Salmon', role: 'protein', share: 1 },
    { food: 'Quinoa', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
    { food: 'Mixed greens', role: 'carb', share: 0, fixedGrams: 85 },
  ],
  'lunch-turkey-wrap': [
    { food: 'Turkey', role: 'protein', share: 1 },
    { food: 'Whole wheat bread', role: 'carb', share: 1 },
    { food: 'Avocado', role: 'fat', share: 1 },
  ],
  'lunch-tofu-bowl': [
    { food: 'Tofu', role: 'protein', share: 1 },
    { food: 'Quinoa', role: 'carb', share: 0.4 },
    { food: 'Sweet potato', role: 'carb', share: 0.35 },
    { food: 'Black beans', role: 'carb', share: 0.25 },
    { food: 'Olive oil', role: 'fat', share: 1 },
  ],
  'lunch-tuna-salad': [
    { food: 'Tuna', role: 'protein', share: 0.7 },
    { food: 'Greek yogurt', role: 'protein', share: 0.3 },
    { food: 'Whole wheat bread', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
    { food: 'Mixed greens', role: 'carb', share: 0, fixedGrams: 85 },
  ],
  'lunch-keto-burger': [
    { food: 'Lean beef', role: 'protein', share: 1 },
    { food: 'Cheese', role: 'fat', share: 0.5 },
    { food: 'Avocado', role: 'fat', share: 0.5 },
    { food: 'Mixed greens', role: 'carb', share: 0, fixedGrams: 85 },
  ],
  'dinner-salmon-sweet-potato': [
    { food: 'Salmon', role: 'protein', share: 1 },
    { food: 'Sweet potato', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
    { food: 'Broccoli', role: 'carb', share: 0, fixedGrams: 91 },
  ],
  'dinner-chicken-pasta': [
    { food: 'Chicken breast', role: 'protein', share: 1 },
    { food: 'Pasta', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
    { food: 'Broccoli', role: 'carb', share: 0, fixedGrams: 91 },
  ],
  'dinner-steak-potatoes': [
    { food: 'Lean beef', role: 'protein', share: 1 },
    { food: 'Potatoes', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
  ],
  'dinner-shrimp-rice': [
    { food: 'Shrimp', role: 'protein', share: 1 },
    { food: 'Brown rice', role: 'carb', share: 1 },
    { food: 'Coconut oil', role: 'fat', share: 1 },
  ],
  'dinner-turkey-sheet': [
    { food: 'Turkey', role: 'protein', share: 1 },
    { food: 'Potatoes', role: 'carb', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
  ],
  'dinner-keto-steak': [
    { food: 'Lean beef', role: 'protein', share: 1 },
    { food: 'Avocado', role: 'fat', share: 0.5 },
    { food: 'Butter', role: 'fat', share: 0.5 },
    { food: 'Mixed greens', role: 'carb', share: 0, fixedGrams: 85 },
  ],
  'snack-yogurt-nuts': [
    { food: 'Greek yogurt', role: 'protein', share: 1 },
    { food: 'Almonds', role: 'fat', share: 1 },
  ],
  'snack-apple-pb': [
    { food: 'Fruit', role: 'carb', share: 1 },
    { food: 'Peanut butter', role: 'fat', share: 1 },
  ],
  'snack-cottage-cheese': [
    { food: 'Cottage cheese', role: 'protein', share: 1 },
    { food: 'Walnuts', role: 'fat', share: 1 },
  ],
  'snack-hard-boiled-eggs': [
    { food: 'Eggs', role: 'protein', share: 1 },
    { food: 'Avocado', role: 'fat', share: 1 },
  ],
  'snack-protein-shake-style': [
    { food: 'Turkey', role: 'protein', share: 1 },
    { food: 'Cheese', role: 'fat', share: 1 },
  ],
  'snack-tuna-cucumber': [
    { food: 'Tuna', role: 'protein', share: 1 },
    { food: 'Olive oil', role: 'fat', share: 1 },
  ],
};

export function getRecipeTemplate(recipeId: string): RecipeTemplateIngredient[] {
  return RECIPE_TEMPLATES[recipeId] ?? [];
}
