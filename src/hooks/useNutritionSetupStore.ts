import { create } from 'zustand';
import type { NutritionProfile, MealsPerDay } from '@/src/types/database';

type NutritionSetupStore = {
  profile: NutritionProfile;
  hydrated: boolean;
  updateProfile: (partial: Partial<NutritionProfile>) => void;
  reset: () => void;
  hydrate: (profile: NutritionProfile) => void;
  markHydrated: () => void;
};

const emptyProfile: NutritionProfile = {
  protein_foods: [],
  carb_foods: [],
  fat_foods: [],
};

function mergeProfiles(current: NutritionProfile, incoming: NutritionProfile): NutritionProfile {
  return {
    ...emptyProfile,
    ...incoming,
    current_weight_lb: current.current_weight_lb ?? incoming.current_weight_lb,
    goal_weight_lb: current.goal_weight_lb ?? incoming.goal_weight_lb,
    diet_style: current.diet_style ?? incoming.diet_style,
    meals_per_day: current.meals_per_day ?? incoming.meals_per_day,
    day_start_time: current.day_start_time ?? incoming.day_start_time,
    protein_foods: (current.protein_foods?.length ? current.protein_foods : incoming.protein_foods) ?? [],
    carb_foods: (current.carb_foods?.length ? current.carb_foods : incoming.carb_foods) ?? [],
    fat_foods: (current.fat_foods?.length ? current.fat_foods : incoming.fat_foods) ?? [],
    meal_selections: { ...(incoming.meal_selections ?? {}), ...(current.meal_selections ?? {}) },
    setup_completed: current.setup_completed ?? incoming.setup_completed,
  };
}

export const useNutritionSetupStore = create<NutritionSetupStore>((set) => ({
  profile: { ...emptyProfile },
  hydrated: false,
  updateProfile: (partial) =>
    set((state) => ({
      profile: { ...state.profile, ...partial },
    })),
  reset: () => set({ profile: { ...emptyProfile }, hydrated: false }),
  hydrate: (incoming) =>
    set((state) => ({
      profile: mergeProfiles(state.profile, incoming),
      hydrated: true,
    })),
  markHydrated: () => set({ hydrated: true }),
}));

export function isSetupProfileValid(profile: NutritionProfile): boolean {
  return Boolean(
    profile.current_weight_lb &&
      profile.goal_weight_lb &&
      profile.meals_per_day &&
      profile.day_start_time &&
      profile.diet_style &&
      (profile.protein_foods?.length ?? 0) > 0 &&
      (profile.carb_foods?.length ?? 0) > 0 &&
      (profile.fat_foods?.length ?? 0) > 0
  );
}

export type { MealsPerDay };
