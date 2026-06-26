import type { DietStyle } from '@/src/types/database';

export type MealSlotKind = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MealRecipe = {
  id: string;
  name: string;
  slot: MealSlotKind;
  description: string;
  proteins: string[];
  carbs: string[];
  fats: string[];
  /** Omit or empty = fits all diet styles */
  excludeForDiets?: DietStyle[];
};

export const MEAL_RECIPES: MealRecipe[] = [
  // Breakfast
  {
    id: 'bfast-yogurt-bowl',
    name: 'Greek yogurt power bowl',
    slot: 'breakfast',
    description: 'Greek yogurt with fruit, almonds, and a drizzle of honey',
    proteins: ['Greek yogurt'],
    carbs: ['Fruit'],
    fats: ['Almonds'],
    excludeForDiets: ['carnivore'],
  },
  {
    id: 'bfast-eggs-avocado',
    name: 'Eggs & avocado plate',
    slot: 'breakfast',
    description: 'Scrambled eggs with sliced avocado and whole wheat toast',
    proteins: ['Eggs'],
    carbs: ['Whole wheat bread'],
    fats: ['Avocado'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'bfast-oatmeal-pb',
    name: 'Protein oatmeal',
    slot: 'breakfast',
    description: 'Oats cooked with peanut butter, chia seeds, and berries',
    proteins: ['Greek yogurt'],
    carbs: ['Oats', 'Fruit'],
    fats: ['Peanut butter', 'Chia seeds'],
    excludeForDiets: ['keto', 'carnivore', 'paleo'],
  },
  {
    id: 'bfast-cottage-fruit',
    name: 'Cottage cheese & fruit',
    slot: 'breakfast',
    description: 'Cottage cheese bowl topped with fruit and walnuts',
    proteins: ['Cottage cheese'],
    carbs: ['Fruit'],
    fats: ['Walnuts'],
    excludeForDiets: ['carnivore'],
  },
  {
    id: 'bfast-egg-wrap',
    name: 'Egg & turkey breakfast wrap',
    slot: 'breakfast',
    description: 'Eggs and turkey in a warm tortilla with salsa',
    proteins: ['Eggs', 'Turkey'],
    carbs: ['Corn tortillas'],
    fats: ['Avocado'],
    excludeForDiets: ['keto', 'carnivore', 'paleo'],
  },
  {
    id: 'bfast-keto-eggs',
    name: 'Keto egg scramble',
    slot: 'breakfast',
    description: 'Eggs scrambled with cheese, avocado, and turkey',
    proteins: ['Eggs', 'Turkey'],
    carbs: [],
    fats: ['Avocado', 'Cheese'],
  },

  // Lunch
  {
    id: 'lunch-chicken-rice',
    name: 'Chicken & rice bowl',
    slot: 'lunch',
    description: 'Grilled chicken breast over brown rice with olive oil and veggies',
    proteins: ['Chicken breast'],
    carbs: ['Brown rice'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'lunch-salmon-salad',
    name: 'Salmon salad plate',
    slot: 'lunch',
    description: 'Salmon over mixed greens with quinoa and lemon olive oil dressing',
    proteins: ['Salmon'],
    carbs: ['Quinoa'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'lunch-turkey-wrap',
    name: 'Turkey & avocado wrap',
    slot: 'lunch',
    description: 'Sliced turkey, avocado, and greens in a whole wheat wrap',
    proteins: ['Turkey'],
    carbs: ['Whole wheat bread'],
    fats: ['Avocado'],
    excludeForDiets: ['keto', 'carnivore', 'paleo'],
  },
  {
    id: 'lunch-tofu-bowl',
    name: 'Tofu quinoa bowl',
    slot: 'lunch',
    description: 'Marinated tofu with quinoa, black beans, and roasted sweet potato',
    proteins: ['Tofu'],
    carbs: ['Quinoa', 'Sweet potato', 'Black beans'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore', 'paleo'],
  },
  {
    id: 'lunch-tuna-salad',
    name: 'Tuna salad lunch',
    slot: 'lunch',
    description: 'Tuna mixed with Greek yogurt over greens with whole grain crackers',
    proteins: ['Tuna', 'Greek yogurt'],
    carbs: ['Whole wheat bread'],
    fats: ['Olive oil'],
    excludeForDiets: ['carnivore'],
  },
  {
    id: 'lunch-keto-burger',
    name: 'Low-carb burger bowl',
    slot: 'lunch',
    description: 'Lean beef patty with cheese, avocado, and leafy greens — no bun',
    proteins: ['Lean beef'],
    carbs: [],
    fats: ['Cheese', 'Avocado'],
  },

  // Dinner
  {
    id: 'dinner-salmon-sweet-potato',
    name: 'Salmon & roasted sweet potato',
    slot: 'dinner',
    description: 'Baked salmon with roasted sweet potato and steamed broccoli',
    proteins: ['Salmon'],
    carbs: ['Sweet potato'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'dinner-chicken-pasta',
    name: 'Chicken pasta primavera',
    slot: 'dinner',
    description: 'Chicken breast with whole wheat pasta and olive oil vegetables',
    proteins: ['Chicken breast'],
    carbs: ['Pasta'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore', 'paleo'],
  },
  {
    id: 'dinner-steak-potatoes',
    name: 'Steak & roasted potatoes',
    slot: 'dinner',
    description: 'Lean beef with herb roasted potatoes and side salad',
    proteins: ['Lean beef'],
    carbs: ['Potatoes'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'dinner-shrimp-rice',
    name: 'Shrimp stir-fry bowl',
    slot: 'dinner',
    description: 'Shrimp stir-fried with brown rice, peppers, and coconut oil',
    proteins: ['Shrimp'],
    carbs: ['Brown rice'],
    fats: ['Coconut oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'dinner-turkey-sheet',
    name: 'Sheet-pan turkey dinner',
    slot: 'dinner',
    description: 'Roasted turkey with potatoes, carrots, and olive oil',
    proteins: ['Turkey'],
    carbs: ['Potatoes'],
    fats: ['Olive oil'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'dinner-keto-steak',
    name: 'Steak & buttered greens',
    slot: 'dinner',
    description: 'Pan-seared lean beef with buttered spinach and avocado',
    proteins: ['Lean beef'],
    carbs: [],
    fats: ['Avocado', 'Cheese'],
  },

  // Snacks
  {
    id: 'snack-yogurt-nuts',
    name: 'Yogurt & almond snack',
    slot: 'snack',
    description: 'Greek yogurt with a handful of almonds',
    proteins: ['Greek yogurt'],
    carbs: [],
    fats: ['Almonds'],
    excludeForDiets: ['carnivore'],
  },
  {
    id: 'snack-apple-pb',
    name: 'Apple & peanut butter',
    slot: 'snack',
    description: 'Sliced fruit with peanut butter',
    proteins: [],
    carbs: ['Fruit'],
    fats: ['Peanut butter'],
    excludeForDiets: ['keto', 'carnivore'],
  },
  {
    id: 'snack-cottage-cheese',
    name: 'Cottage cheese cup',
    slot: 'snack',
    description: 'Cottage cheese with a few walnuts',
    proteins: ['Cottage cheese'],
    carbs: [],
    fats: ['Walnuts'],
    excludeForDiets: ['carnivore'],
  },
  {
    id: 'snack-hard-boiled-eggs',
    name: 'Hard-boiled eggs',
    slot: 'snack',
    description: 'Two hard-boiled eggs with avocado slices',
    proteins: ['Eggs'],
    carbs: [],
    fats: ['Avocado'],
  },
  {
    id: 'snack-protein-shake-style',
    name: 'Protein snack plate',
    slot: 'snack',
    description: 'Turkey roll-ups with cheese',
    proteins: ['Turkey'],
    carbs: [],
    fats: ['Cheese'],
  },
  {
    id: 'snack-tuna-cucumber',
    name: 'Tuna cucumber bites',
    slot: 'snack',
    description: 'Tuna on cucumber rounds with olive oil drizzle',
    proteins: ['Tuna'],
    carbs: [],
    fats: ['Olive oil'],
    excludeForDiets: ['carnivore'],
  },
];

export function slotTitleToKind(title: string): MealSlotKind {
  const lower = title.toLowerCase();
  if (lower.includes('breakfast')) return 'breakfast';
  if (lower.includes('lunch')) return 'lunch';
  if (lower.includes('dinner')) return 'dinner';
  return 'snack';
}

export function getRecipeById(id: string): MealRecipe | undefined {
  return MEAL_RECIPES.find((recipe) => recipe.id === id);
}
