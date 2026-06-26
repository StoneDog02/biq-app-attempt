import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useOnboardingStore } from '@/src/hooks/useOnboardingStore';
import { useAuth } from '@/src/hooks/useAuth';
import { completeOnboarding, loadIntakeProgress } from '@/src/services/profile';
import { setupUserNotifications } from '@/src/services/notifications';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import { getDietStyleOption } from '@/src/data/dietStyles';
import type { EngagementTier, ReminderPreset } from '@/src/types/database';

export default function SummaryScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { data, reset, updateData } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadIntakeProgress(user.id).then((saved) => {
      updateData({
        ...(profile?.engagement_tier ? { engagement_tier: profile.engagement_tier } : {}),
        ...(profile?.reminder_preset ? { reminder_preset: profile.reminder_preset } : {}),
        ...(saved
          ? {
              goals: saved.goals as never,
              health_history: saved.health_history as never,
              dietary_prefs: saved.dietary_prefs as never,
              food_likes: saved.food_likes as never,
              nutrition_profile: saved.nutrition_profile as never,
              lifestyle: saved.lifestyle as never,
              activity: saved.activity as never,
            }
          : {}),
      });
      setHydrating(false);
    });
  }, [user, profile, updateData]);

  const engagementTier = (data.engagement_tier ?? profile?.engagement_tier) as
    | EngagementTier
    | undefined;
  const reminderPreset = (data.reminder_preset ?? profile?.reminder_preset) as
    | ReminderPreset
    | undefined;

  const mergedData = useMemo(
    () => ({
      ...data,
      engagement_tier: engagementTier,
      reminder_preset: reminderPreset,
    }),
    [data, engagementTier, reminderPreset]
  );

  const handleComplete = async () => {
    if (!user || !engagementTier || !reminderPreset) {
      setError(
        'Missing engagement or reminder settings. Go back to the first steps and select both.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await completeOnboarding(
        user.id,
        {
          ...mergedData,
          nutrition_profile: {
            ...(mergedData.nutrition_profile ?? {}),
            setup_completed: true,
          },
        },
        engagementTier,
        reminderPreset
      );
      await setupUserNotifications(user.id, reminderPreset);
      await refreshProfile();
      reset();
      router.replace('/(tabs)/today');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your profile summary</Text>
        <Text style={styles.subtitle}>Review before we build your Today's Plan.</Text>

        <Card
          title="Engagement"
          subtitle={`${engagementTier?.replace('_', ' ') ?? '—'} · ${reminderPreset ?? '—'} reminders`}
        />
        <View style={styles.gap} />
        <Card title="Primary goal" subtitle={mergedData.goals?.primary_goal ?? '—'} />
        <View style={styles.gap} />
        <Card
          title="Activity"
          subtitle={mergedData.activity?.activity_level?.replace('_', ' ') ?? '—'}
        />
        <View style={styles.gap} />
        <Card title="Diet" subtitle={mergedData.dietary_prefs?.diet_type ?? '—'} />
        <View style={styles.gap} />
        <Card
          title="Nutrition setup"
          subtitle={
            mergedData.nutrition_profile?.current_weight_lb
              ? `${mergedData.nutrition_profile.current_weight_lb} lb → ${mergedData.nutrition_profile.goal_weight_lb} lb · ${getDietStyleOption(mergedData.nutrition_profile.diet_style).label} · ${mergedData.nutrition_profile.meals_per_day} meals/day`
              : '—'
          }
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button title="Back" variant="ghost" onPress={() => router.back()} />
          <Button
            title="Build My Plan"
            onPress={handleComplete}
            loading={loading || hydrating}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.base,
    marginBottom: spacing.lg,
  },
  gap: { height: spacing.sm },
  error: {
    color: '#ef4444',
    marginTop: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
