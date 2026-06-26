import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { buildMacroTargets, isNutritionSetupComplete } from '@/src/services/macroCalculator';
import { buildTodaysMealSlots } from '@/src/services/mealRecipeEngine';

export function useNutritionProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['nutritionProfile', user?.id],
    queryFn: async () => {
      const intake = await loadIntakeProgress(user!.id);
      const setupComplete = isNutritionSetupComplete(intake);
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1;
      const macroTargets = setupComplete ? buildMacroTargets(intake, { dayIndex }) : null;
      const mealSlots =
        setupComplete && intake ? buildTodaysMealSlots(intake, dayIndex) : [];

      return {
        intake,
        setupComplete,
        macroTargets,
        mealSlots,
      };
    },
    enabled: Boolean(user?.id),
  });
}
