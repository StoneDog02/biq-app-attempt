import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { DayProgressBar } from '@/src/components/ui/DayProgressBar';
import { DomainSegmentBar } from '@/src/components/today/DomainSegmentBar';
import { PlanSection } from '@/src/components/today/PlanSection';
import { useTodayPlan, useTogglePlanItem } from '@/src/hooks/usePlan';
import { useTodayNutrition } from '@/src/hooks/useNutrition';
import { useTodayFitness } from '@/src/hooks/useFitness';
import { useTodayCare } from '@/src/hooks/useCare';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { getDayProgressSummary } from '@/src/services/planProgress';
import {
  buildSegmentBarSections,
  getDomainSummaries,
  getInitialSegment,
  getNextIncompleteSegment,
  getSegmentOrder,
} from '@/src/services/planSectionOrder';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { PlanItem, TrackingLevel } from '@/src/types/database';
import type { PlanSectionKey } from '@/src/services/profile';

export default function TodayScreen() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const { data: plan, isLoading, error, refetch, isRefetching } = useTodayPlan();
  const { data: nutrition } = useTodayNutrition();
  const { data: fitness } = useTodayFitness();
  const { data: care } = useTodayCare();
  const { data: intake } = useQuery({
    queryKey: ['intake', user?.id],
    queryFn: () => loadIntakeProgress(user!.id),
    enabled: Boolean(user?.id),
  });
  const toggleItem = useTogglePlanItem();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<PlanSectionKey>('habits');
  const [segmentInitialized, setSegmentInitialized] = useState(false);
  const prevDoneRef = useRef<Partial<Record<PlanSectionKey, boolean>>>({});
  const trackingLevel = (profile?.tracking_level ?? 1) as TrackingLevel;
  const engagementTier = profile?.engagement_tier ?? 'moderate';

  const segmentOrder = useMemo(() => getSegmentOrder(intake ?? null), [intake]);

  const domainSummaries = useMemo(() => {
    if (!plan) return null;
    return getDomainSummaries(plan, nutrition ?? null, fitness ?? null, care ?? null, trackingLevel);
  }, [plan, nutrition, fitness, care, trackingLevel]);

  const segmentBarSections = useMemo(() => {
    if (!domainSummaries) return [];
    return buildSegmentBarSections(segmentOrder, domainSummaries);
  }, [segmentOrder, domainSummaries]);

  const activeSummary = domainSummaries?.[activeSegment];

  const progress = plan
    ? getDayProgressSummary(plan, trackingLevel, engagementTier)
    : null;

  useEffect(() => {
    setSegmentInitialized(false);
    prevDoneRef.current = {};
  }, [plan?.plan_date]);

  useEffect(() => {
    if (!plan || !domainSummaries || segmentInitialized) return;
    setActiveSegment(getInitialSegment(segmentOrder, domainSummaries));
    setSegmentInitialized(true);
    prevDoneRef.current = {
      habits: domainSummaries.habits.done,
      workouts: domainSummaries.workouts.done,
      meals: domainSummaries.meals.done,
      supplements: domainSummaries.supplements.done,
    };
  }, [plan, domainSummaries, segmentOrder, segmentInitialized]);

  useEffect(() => {
    if (!domainSummaries || !segmentInitialized) return;

    const wasDone = prevDoneRef.current[activeSegment] ?? false;
    const isDone = domainSummaries[activeSegment].done;

    if (!wasDone && isDone) {
      const next = getNextIncompleteSegment(activeSegment, segmentOrder, domainSummaries);
      if (next) setActiveSegment(next);
    }

    prevDoneRef.current = {
      habits: domainSummaries.habits.done,
      workouts: domainSummaries.workouts.done,
      meals: domainSummaries.meals.done,
      supplements: domainSummaries.supplements.done,
    };
  }, [domainSummaries, activeSegment, segmentOrder, segmentInitialized]);

  const invalidateTodayQueries = useCallback(() => {
    const userId = user?.id;
    queryClient.invalidateQueries({ queryKey: ['todayPlan', userId] });
    queryClient.invalidateQueries({ queryKey: ['todayNutrition', userId] });
    queryClient.invalidateQueries({ queryKey: ['todayFitness', userId] });
    queryClient.invalidateQueries({ queryKey: ['todayCare', userId] });
    queryClient.invalidateQueries({ queryKey: ['foodLogs', userId] });
    queryClient.invalidateQueries({ queryKey: ['foodCheckin', userId] });
    queryClient.invalidateQueries({ queryKey: ['workoutLogs', userId] });
    queryClient.invalidateQueries({ queryKey: ['workoutCheckin', userId] });
    queryClient.invalidateQueries({ queryKey: ['supplementLogs', userId] });
    queryClient.invalidateQueries({ queryKey: ['supplementCheckin', userId] });
  }, [queryClient, user?.id]);

  useFocusEffect(
    useCallback(() => {
      invalidateTodayQueries();
    }, [invalidateTodayQueries])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    invalidateTodayQueries();
    await refetch();
    setRefreshing(false);
  };

  const handleToggle = (section: PlanSectionKey, itemId: string, completed: boolean) => {
    toggleItem.mutate({ section, itemId, completed });
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.copper.base} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Card
            title="Your plan is being built"
            subtitle="Complete your intake or check back shortly — we're putting together your personalized day."
          />
        </View>
      );
    }

    if (!plan || !domainSummaries || !activeSummary) {
      return (
        <View style={styles.centered}>
          <Card
            title="Your plan is being built"
            subtitle="We're using your intake to create today's personalized plan. Check back soon."
          />
        </View>
      );
    }

    return (
      <>
        <View style={styles.pinnedHeader}>
          <Text style={styles.greeting}>Today's Plan</Text>
          <Text style={styles.name}>{profile?.full_name ?? 'there'}</Text>

          {progress ? (
            <DayProgressBar
              fraction={progress.fraction}
              label={progress.label}
              subtitle={progress.subtitle}
            />
          ) : null}

          {plan.coach_message ? (
            <View style={styles.coachBox}>
              <Text style={styles.coachLabel}>Your coach</Text>
              <Text style={styles.coachMessage}>{plan.coach_message}</Text>
            </View>
          ) : null}

          <DomainSegmentBar
            sections={segmentBarSections}
            active={activeSegment}
            onSelect={setActiveSegment}
          />
        </View>

        <ScrollView
          style={styles.sectionScroll}
          contentContainerStyle={styles.sectionScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.copper.base}
            />
          }
        >
          <PlanSection
            title={activeSummary.title}
            items={plan[activeSegment] as PlanItem[]}
            status={activeSummary.status}
            section={activeSegment}
            onToggle={handleToggle}
            actionLink={activeSummary.actionLink}
            embedded
          />
        </ScrollView>
      </>
    );
  };

  return (
    <Screen padded={false}>
      <View style={styles.page}>{renderBody()}</View>
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
  name: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  greeting: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  coachBox: {
    backgroundColor: colors.gray[900],
    borderLeftWidth: 3,
    borderLeftColor: colors.copper.base,
    padding: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  coachLabel: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  coachMessage: {
    color: colors.gray[100],
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  sectionScroll: {
    flex: 1,
  },
  sectionScrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
});
