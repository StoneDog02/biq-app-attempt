import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useNutritionSetupStore, isSetupProfileValid } from '@/src/hooks/useNutritionSetupStore';
import { useAuth } from '@/src/hooks/useAuth';
import { saveNutritionProfile, regenerateTodayMeals, loadIntakeProgress } from '@/src/services/profile';
import { buildMacroTargets } from '@/src/services/macroCalculator';
import { formatTime12h } from '@/src/data/mealTiming';
import { getDietStyleOption } from '@/src/data/dietStyles';
import { buildTodaysMealSlots } from '@/src/services/mealRecipeEngine';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { IntakeResponses } from '@/src/types/database';

function buildPreviewIntake(
  intake: IntakeResponses | null,
  profile: IntakeResponses['nutrition_profile']
): IntakeResponses {
  return {
    ...(intake ?? {}),
    goals: intake?.goals ?? {},
    health_history: intake?.health_history ?? {},
    dietary_prefs: intake?.dietary_prefs ?? {},
    food_likes: intake?.food_likes ?? {},
    lifestyle: intake?.lifestyle ?? {},
    activity: intake?.activity ?? {},
    nutrition_profile: { ...profile, setup_completed: true },
    current_step: intake?.current_step ?? 0,
    completed: intake?.completed ?? false,
  } as IntakeResponses;
}

export default function NutritionSetupReviewScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { profile, hydrate } = useNutritionSetupStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intake, setIntake] = useState<IntakeResponses | null>(null);

  useEffect(() => {
    if (!user) return;
    loadIntakeProgress(user.id).then((saved) => {
      if (saved?.nutrition_profile) hydrate(saved.nutrition_profile);
      setIntake(saved);
    });
  }, [user, hydrate]);

  const previewData = useMemo(() => {
    const merged = buildPreviewIntake(intake, profile);
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    return {
      macros: buildMacroTargets(merged, { dayIndex }),
      meals: buildTodaysMealSlots(merged, dayIndex),
    };
  }, [intake, profile]);

  const setupSummary = useMemo(() => {
    const dietLabel = getDietStyleOption(profile.diet_style).label;
    const current = profile.current_weight_lb;
    const goal = profile.goal_weight_lb;
    const meals = profile.meals_per_day;

    if (!current || !goal) {
      return `Missing weight info · ${dietLabel} · ${meals ?? '—'} meals/day`;
    }

    return `${current} lb → ${goal} lb · ${dietLabel} · ${meals} meals/day · starts ${formatTime12h(profile.day_start_time ?? '07:00')}`;
  }, [profile]);

  const macroSubtitle = useMemo(() => {
    if (!profile.current_weight_lb || !profile.goal_weight_lb) {
      return 'Add your current and goal weight on the Body metrics step to calculate targets.';
    }
    if (!previewData.macros) return 'Could not calculate targets — check your setup.';
    return `${getDietStyleOption(profile.diet_style).label} · ${previewData.macros.label}`;
  }, [previewData.macros, profile]);

  const handleComplete = async () => {
    if (!user || !isSetupProfileValid(profile)) return;
    setLoading(true);
    setError(null);
    try {
      await saveNutritionProfile(user.id, profile);
      await regenerateTodayMeals(user.id);
      queryClient.invalidateQueries({ queryKey: ['intake', user.id] });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user.id] });
      queryClient.invalidateQueries({ queryKey: ['nutritionProfile', user.id] });
      router.replace('/(tabs)/nutrition');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save nutrition profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your meal plan</Text>
        <Text style={styles.subtitle}>Review your targets and today&apos;s meals before we build your plan.</Text>

        <Card title="Daily targets" subtitle={macroSubtitle} />

        <Text style={styles.sectionTitle}>Today&apos;s meals</Text>
        {previewData.meals?.length ? (
          previewData.meals.map((meal) => (
            <Card
              key={meal.slotKey}
              title={meal.time ? `${meal.time} · ${meal.title}` : meal.title}
              subtitle={`${meal.recipeName}\n${meal.ingredientLines.map((line) => `• ${line}`).join('\n')}\n${meal.macros}`}
              style={styles.mealCard}
            />
          ))
        ) : (
          <Card
            title="Meals pending"
            subtitle={
              profile.current_weight_lb && profile.goal_weight_lb
                ? 'Complete setup to generate today\'s meals.'
                : 'Add your weights to preview meals.'
            }
            style={styles.mealCard}
          />
        )}

        <Card title="Your setup" subtitle={setupSummary} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Build my meal plan"
          loading={loading}
          disabled={!isSetupProfileValid(profile)}
          onPress={handleComplete}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
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
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  mealCard: {
    marginBottom: spacing.sm,
  },
  error: {
    color: '#ef4444',
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
  },
});
