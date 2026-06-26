import { useCallback, useState } from 'react';
import { router, type Href } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';
import { saveNutritionProfileDraft } from '@/src/services/profile';

export function useNutritionSetupContinue() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const continueTo = useCallback(
    async (href: Href) => {
      if (!user) return;
      setSaving(true);
      try {
        const profile = useNutritionSetupStore.getState().profile;
        await saveNutritionProfileDraft(user.id, profile);
        router.push(href);
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  return { continueTo, saving };
}
