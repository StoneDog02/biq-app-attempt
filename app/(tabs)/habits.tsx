import { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/src/components/ui/Screen';
import { DayProgressBar } from '@/src/components/ui/DayProgressBar';
import { HabitChecklist } from '@/src/components/habits/HabitChecklist';
import { HabitHistoryDots } from '@/src/components/habits/HabitHistoryDots';
import { useHabitLogs, useLogHabit } from '@/src/hooks/usePlan';
import { useAuth } from '@/src/hooks/useAuth';
import {
  getHabitDayProgress,
  getHabitHistoryByDate,
  getDayHabitCompletionDots,
  getTodayHabitLogs,
} from '@/src/services/habitProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { HabitLog } from '@/src/types/database';

export default function HabitsScreen() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const { data: logs, isLoading, refetch, isRefetching } = useHabitLogs(7);
  const logHabit = useLogHabit();
  const [refreshing, setRefreshing] = useState(false);

  const engagementTier = profile?.engagement_tier ?? 'moderate';
  const isLightTier = engagementTier === 'light';

  const todayLogs = useMemo(() => getTodayHabitLogs(logs ?? []), [logs]);
  const progress = useMemo(
    () => getHabitDayProgress(logs ?? [], engagementTier),
    [logs, engagementTier]
  );
  const historyByDate = useMemo(() => getHabitHistoryByDate(logs ?? []), [logs]);

  const savingType =
    logHabit.isPending && logHabit.variables ? logHabit.variables.habitType : null;

  const invalidateHabitQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['habitLogs', user?.id] });
  }, [queryClient, user?.id]);

  useFocusEffect(
    useCallback(() => {
      invalidateHabitQueries();
    }, [invalidateHabitQueries])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    invalidateHabitQueries();
    await refetch();
    setRefreshing(false);
  };

  const handleToggle = (type: HabitLog['habit_type'], defaultValue: number) => {
    const current = todayLogs[type];
    logHabit.mutate({
      habitType: type,
      value: current?.value ?? defaultValue,
      completed: !current?.completed,
    });
  };

  const handleAdjustWater = (value: number) => {
    logHabit.mutate({
      habitType: 'water',
      value,
      completed: value > 0,
    });
  };

  return (
    <Screen padded={false}>
      <View style={styles.page}>
        <View style={styles.pinnedHeader}>
          <Text style={styles.label}>Habits</Text>
          <Text style={styles.title}>Today&apos;s habits</Text>
          <DayProgressBar
            fraction={progress.fraction}
            label={progress.label}
            subtitle={progress.subtitle}
          />
          {!progress.subtitle ? (
            <Text style={styles.subtitle}>
              {isLightTier
                ? 'Simple check-ins — log when it works for you.'
                : 'Track your daily habits. One tap is enough.'}
            </Text>
          ) : null}
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
            <HabitChecklist
              todayLogs={todayLogs}
              isLightTier={isLightTier}
              savingType={savingType}
              onToggle={handleToggle}
              onAdjustWater={handleAdjustWater}
            />
          )}

          <Text style={styles.historyTitle}>Last 7 days</Text>
          {historyByDate.length === 0 ? (
            <Text style={styles.emptyHistory}>No history yet — log your first habit above.</Text>
          ) : (
            historyByDate.map(({ date, logs: dayLogs }) => (
              <View key={date} style={styles.historyRow}>
                <Text style={styles.historyDate}>{format(parseISO(date), 'MMM d')}</Text>
                <HabitHistoryDots completed={getDayHabitCompletionDots(dayLogs)} />
              </View>
            ))
          )}
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
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  historyTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyHistory: {
    color: colors.gray[500],
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[900],
  },
  historyDate: {
    color: colors.white,
  },
});
