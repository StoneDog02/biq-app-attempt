import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import { useAuth } from '@/src/hooks/useAuth';
import { useEffect } from 'react';
import { loadIntakeProgress } from '@/src/services/profile';
import { useOnboardingStore } from '@/src/hooks/useOnboardingStore';
import { ONBOARDING_STEPS } from '@/src/types/onboarding';

export default function WelcomeScreen() {
  const { user, profile } = useAuth();
  const { setStepIndex, updateData } = useOnboardingStore();

  useEffect(() => {
    if (!user) return;

    if (profile?.engagement_tier || profile?.reminder_preset) {
      updateData({
        ...(profile.engagement_tier ? { engagement_tier: profile.engagement_tier } : {}),
        ...(profile.reminder_preset ? { reminder_preset: profile.reminder_preset } : {}),
      });
    }

    loadIntakeProgress(user.id).then((saved) => {
      if (!saved) return;
      if (saved.current_step) setStepIndex(Math.min(saved.current_step, ONBOARDING_STEPS.length - 1));
      updateData({
        goals: saved.goals as never,
        health_history: saved.health_history as never,
        dietary_prefs: saved.dietary_prefs as never,
        food_likes: saved.food_likes as never,
        nutrition_profile: saved.nutrition_profile as never,
        lifestyle: saved.lifestyle as never,
        activity: saved.activity as never,
      });
    });
  }, [user, profile, setStepIndex, updateData]);

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.brand}>Welcome to BODYiQ</Text>
        <Text style={styles.lead}>
          This intake takes <Text style={styles.emphasis}>15+ minutes</Text>. The details you share
          build your personalized wellness profile and daily plan.
        </Text>
        <Text style={styles.body}>
          You can pause and come back anytime — your progress is saved automatically.
        </Text>
        <Button
          title="Begin Intake"
          onPress={() => {
            const { currentStepIndex } = useOnboardingStore.getState();
            if (currentStepIndex < 1) {
              setStepIndex(1);
            }
            router.push('/(onboarding)/steps');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  lead: {
    color: colors.gray[100],
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  emphasis: {
    color: colors.copper.base,
    fontWeight: '700',
  },
  body: {
    color: colors.gray[500],
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
});
