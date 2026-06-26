import type { DietStyle } from '@/src/types/database';

export type DietStyleOption = {
  id: DietStyle;
  label: string;
  description: string;
  macroHint: string;
  /** Share of remaining calories (after protein) allocated to carbs */
  carbShare: number;
  /** Share of remaining calories (after protein) allocated to fat */
  fatShare: number;
  maxCarbsG?: number;
  excludedCarbs: readonly string[];
  excludedFats: readonly string[];
  excludedProteins?: readonly string[];
};

export const DIET_STYLE_OPTIONS: DietStyleOption[] = [
  {
    id: 'standard',
    label: 'Standard / Balanced',
    description: 'Even mix of protein, carbs, and fats — flexible and sustainable.',
    macroHint: '~40% carbs · ~30% fat',
    carbShare: 0.55,
    fatShare: 0.45,
    excludedCarbs: [],
    excludedFats: [],
  },
  {
    id: 'keto',
    label: 'Keto',
    description: 'Very low carb, higher fat — keeps net carbs tight for ketosis.',
    macroHint: '~5–10% carbs · ~65–70% fat',
    carbShare: 0.08,
    fatShare: 0.92,
    maxCarbsG: 50,
    excludedCarbs: [
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
    ],
    excludedFats: [],
  },
  {
    id: 'carnivore',
    label: 'Carnivore',
    description: 'Animal-based foods only — minimal to zero carbs from plants.',
    macroHint: '~0–5% carbs · high protein & fat',
    carbShare: 0.02,
    fatShare: 0.98,
    maxCarbsG: 20,
    excludedCarbs: [
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
    ],
    excludedFats: [
      'Avocado',
      'Olive oil',
      'Almonds',
      'Peanut butter',
      'Walnuts',
      'Chia seeds',
      'Dark chocolate',
      'Flaxseed',
      'Coconut oil',
    ],
    excludedProteins: ['Tofu'],
  },
  {
    id: 'low_carb',
    label: 'Low carb',
    description: 'Moderate carbs with emphasis on protein and healthy fats.',
    macroHint: '~20% carbs · ~45% fat',
    carbShare: 0.25,
    fatShare: 0.75,
    excludedCarbs: ['Brown rice', 'Oats', 'Pasta', 'Whole wheat bread', 'Potatoes'],
    excludedFats: [],
  },
  {
    id: 'paleo',
    label: 'Paleo',
    description: 'Whole foods — no grains, legumes, or processed carbs.',
    macroHint: '~35% carbs · ~35% fat',
    carbShare: 0.5,
    fatShare: 0.5,
    excludedCarbs: [
      'Brown rice',
      'Oats',
      'Quinoa',
      'Whole wheat bread',
      'Pasta',
      'Black beans',
      'Corn tortillas',
    ],
    excludedFats: ['Cheese'],
  },
  {
    id: 'carb_cycle',
    label: 'Carb cycling',
    description: 'Alternates lower- and higher-carb days to match training rhythm.',
    macroHint: 'Low / high carb days rotate through the week',
    carbShare: 0.4,
    fatShare: 0.6,
    excludedCarbs: [],
    excludedFats: [],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    description: 'Plant-forward with olive oil, fish, and moderate whole grains.',
    macroHint: '~45% carbs · ~30% fat',
    carbShare: 0.6,
    fatShare: 0.4,
    excludedCarbs: [],
    excludedFats: ['Coconut oil', 'Peanut butter'],
  },
];

export function getDietStyleOption(style: DietStyle | undefined): DietStyleOption {
  return DIET_STYLE_OPTIONS.find((opt) => opt.id === style) ?? DIET_STYLE_OPTIONS[0];
}

export function isCarbCycleHighDay(dayIndex: number): boolean {
  return dayIndex % 2 === 0;
}

export function getCarbCycleShares(dayIndex: number): { carbShare: number; fatShare: number } {
  if (isCarbCycleHighDay(dayIndex)) {
    return { carbShare: 0.65, fatShare: 0.35 };
  }
  return { carbShare: 0.2, fatShare: 0.8 };
}

export function filterFoodsForDiet(
  foods: string[],
  excluded: readonly string[]
): string[] {
  if (!excluded.length) return foods;
  const blocked = new Set(excluded.map((f) => f.toLowerCase()));
  const filtered = foods.filter((food) => !blocked.has(food.toLowerCase()));
  return filtered.length > 0 ? filtered : foods;
}
