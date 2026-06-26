import { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/src/components/ui/Screen';
import { DayProgressBar } from '@/src/components/ui/DayProgressBar';
import { NutritionCheckinPanel } from '@/src/components/nutrition/NutritionCheckinPanel';
import { MealLogPanel } from '@/src/components/nutrition/MealLogPanel';
import { MealLogList } from '@/src/components/nutrition/MealLogList';
import { MacroSummaryCard } from '@/src/components/nutrition/MacroSummaryCard';
import { MealSlotSelectorPanel } from '@/src/components/nutrition/MealSlotSelectorPanel';
import { NutritionSetupBanner } from '@/src/components/nutrition/NutritionSetupBanner';
import { useAuth } from '@/src/hooks/useAuth';
import { useNutritionProfile } from '@/src/hooks/useNutritionProfile';
import { useSaveMealSelection } from '@/src/hooks/useSaveMealSelection';
import {
  useDailyCheckin,
  useLogMeal,
  useSaveDailyCheckin,
  useTodayFoodLogs,
  invalidateNutritionQueries,
} from '@/src/hooks/useNutrition';
import { getNutritionDayProgress } from '@/src/services/nutritionProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { CheckinStatus, MealType, TrackingLevel } from '@/src/types/database';

export default function NutritionScreen() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const trackingLevel = (profile?.tracking_level ?? 1) as TrackingLevel;
  const { data: nutritionProfile, isLoading: profileLoading } = useNutritionProfile();
  const saveMealSelection = useSaveMealSelection();
  const { data: checkin, isLoading: checkinLoading } = useDailyCheckin();
  const { data: logs, isLoading: logsLoading, refetch, isRefetching } = useTodayFoodLogs();
  const saveCheckin = useSaveDailyCheckin();
  const logMeal = useLogMeal();

  const [mealType, setMealType] = useState<MealType>('lunch');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const mealLogs = useMemo(() => logs?.filter((l) => l.meal_type) ?? [], [logs]);
  const isLoading = checkinLoading || logsLoading || profileLoading;
  const isLevel1 = trackingLevel <= 1;
  const setupComplete = nutritionProfile?.setupComplete ?? false;

  const progress = useMemo(
    () => getNutritionDayProgress(checkin, mealLogs, trackingLevel),
    [checkin, mealLogs, trackingLevel]
  );

  const savingCheckinStatus =
    saveCheckin.isPending && saveCheckin.variables ? saveCheckin.variables : null;

  const invalidateQueries = useCallback(() => {
    invalidateNutritionQueries(queryClient, user?.id);
    queryClient.invalidateQueries({ queryKey: ['nutritionProfile', user?.id] });
  }, [queryClient, user?.id]);

  useFocusEffect(
    useCallback(() => {
      invalidateQueries();
    }, [invalidateQueries])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    invalidateQueries();
    await refetch();
    setRefreshing(false);
  };

  const handleCheckin = (status: CheckinStatus) => {
    setMessage(null);
    saveCheckin.mutate(status, {
      onSuccess: () => setMessage('Saved for today.'),
      onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not save check-in'),
    });
  };

  const handleLogMeal = () => {
    if (!mealName.trim()) {
      setMessage('Add a meal name to log.');
      return;
    }
    setMessage(null);
    logMeal.mutate(
      {
        meal_type: mealType,
        name: mealName.trim(),
        calories: calories ? Number(calories) : null,
      },
      {
        onSuccess: () => {
          setMealName('');
          setCalories('');
          setMessage('Meal logged.');
        },
        onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not log meal'),
      }
    );
  };

  return (
    <Screen padded={false}>
      <View style={styles.page}>
        <View style={styles.pinnedHeader}>
          <Text style={styles.label}>Nutrition</Text>
          <Text style={styles.title}>Today&apos;s meals</Text>
          <DayProgressBar
            fraction={progress.fraction}
            label={progress.label}
            subtitle={progress.subtitle}
          />
          {!progress.subtitle ? (
            <Text style={styles.subtitle}>
              {isLevel1
                ? 'One quick check-in is enough. No numbers required.'
                : 'Log meals in seconds — calories optional.'}
            </Text>
          ) : null}

          <View style={styles.links}>
            {setupComplete ? (
              <Link href="/nutrition/meal-plan" asChild>
                <Pressable style={styles.linkChip}>
                  <Text style={styles.linkText}>View full week</Text>
                </Pressable>
              </Link>
            ) : null}
            <Link href="/nutrition/meal-plan?tab=guides" asChild>
              <Pressable style={styles.linkChip}>
                <Text style={styles.linkText}>Eating out guide</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.copper.base}
            />
          }
        >
          {isLoading ? (
            <ActivityIndicator color={colors.copper.base} />
          ) : (
            <>
              {!setupComplete ? <NutritionSetupBanner /> : null}

              {setupComplete && nutritionProfile?.macroTargets ? (
                <MacroSummaryCard targets={nutritionProfile.macroTargets} />
              ) : null}

              {setupComplete && nutritionProfile?.mealSlots?.length ? (
                <MealSlotSelectorPanel
                  slots={nutritionProfile.mealSlots}
                  savingSlotKey={
                    saveMealSelection.isPending ? saveMealSelection.variables?.slotKey ?? null : null
                  }
                  onSelectRecipe={(slotKey, recipeId) => {
                    saveMealSelection.mutate({ slotKey, recipeId });
                  }}
                />
              ) : null}

              {isLevel1 ? (
                <NutritionCheckinPanel
                  selectedStatus={checkin?.checkin_status}
                  savingStatus={savingCheckinStatus}
                  onSelect={handleCheckin}
                />
              ) : (
                <>
                  <View style={styles.quickActions}>
                    {trackingLevel >= 2 ? (
                      <Link href="/nutrition/scan" asChild>
                        <Pressable style={styles.linkChip}>
                          <Text style={styles.linkText}>Scan barcode</Text>
                        </Pressable>
                      </Link>
                    ) : null}
                    {trackingLevel >= 3 ? (
                      <>
                        <Link href="/nutrition/photo-log" asChild>
                          <Pressable style={styles.linkChip}>
                            <Text style={styles.linkText}>Photo log</Text>
                          </Pressable>
                        </Link>
                        <Link href="/nutrition/voice-log" asChild>
                          <Pressable style={styles.linkChip}>
                            <Text style={styles.linkText}>Voice log</Text>
                          </Pressable>
                        </Link>
                      </>
                    ) : null}
                  </View>

                  <MealLogPanel
                    mealType={mealType}
                    mealName={mealName}
                    calories={calories}
                    isSaving={logMeal.isPending}
                    onMealTypeChange={setMealType}
                    onMealNameChange={setMealName}
                    onCaloriesChange={setCalories}
                    onSubmit={handleLogMeal}
                  />

                  <MealLogList meals={mealLogs} />
                </>
              )}
            </>
          )}

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  pinnedHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  label: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  linkChip: {
    borderWidth: 1,
    borderColor: colors.copper.base,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  linkText: {
    color: colors.copper.base,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  message: {
    color: colors.copper.light,
    marginTop: spacing.md,
    fontSize: fontSize.sm,
  },
});
