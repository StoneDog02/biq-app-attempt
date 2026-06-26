import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';

export function NutritionSetupHydrator() {
  const { user } = useAuth();
  const hydrate = useNutritionSetupStore((state) => state.hydrate);
  const markHydrated = useNutritionSetupStore((state) => state.markHydrated);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    loadIntakeProgress(user.id)
      .then((intake) => {
        if (cancelled) return;
        if (intake?.nutrition_profile) {
          hydrate(intake.nutrition_profile);
        } else {
          markHydrated();
        }
      })
      .catch(() => {
        if (!cancelled) markHydrated();
      });

    return () => {
      cancelled = true;
    };
  }, [user, hydrate, markHydrated]);

  return null;
}
