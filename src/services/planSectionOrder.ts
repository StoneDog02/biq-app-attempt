import type { DailyPlan, IntakeResponses, PlanItem, TrackingLevel } from '@/src/types/database';
import type { PlanSectionKey } from '@/src/services/profile';
import { getNutritionStatusSummary } from '@/src/services/nutrition';
import { getFitnessStatusSummary } from '@/src/services/fitness';
import { getCareStatusSummary } from '@/src/services/care';
import type { FoodLog } from '@/src/types/database';
import type { WorkoutLog } from '@/src/types/database';
import type { SupplementLog } from '@/src/types/database';

export type DomainSectionStatus = {
  completedCount: number;
  total: number;
  done: boolean;
  detailLabel?: string;
};

export type DomainSummary = {
  key: PlanSectionKey;
  label: string;
  title: string;
  completedCount: number;
  total: number;
  done: boolean;
  status: DomainSectionStatus;
  actionLink: { label: string; href: string };
};

export const SEGMENT_META: Record<
  PlanSectionKey,
  { label: string; title: string; logLabel: string; href: string }
> = {
  habits: {
    label: 'Habits',
    title: 'Habits',
    logLabel: 'Log habits',
    href: '/(tabs)/habits',
  },
  workouts: {
    label: 'Movement',
    title: 'Workout',
    logLabel: 'Log movement',
    href: '/(tabs)/fitness',
  },
  meals: {
    label: 'Meals',
    title: 'Meals',
    logLabel: 'Log meals',
    href: '/(tabs)/nutrition',
  },
  supplements: {
    label: 'Supplements',
    title: 'Supplements',
    logLabel: 'Log supplements',
    href: '/(tabs)/care',
  },
};

const DEFAULT_ORDER: PlanSectionKey[] = ['habits', 'workouts', 'meals', 'supplements'];

function goalOrder(primaryGoal: string): PlanSectionKey[] {
  const goal = primaryGoal.toLowerCase();

  if (goal.includes('weight') || goal.includes('metabolic')) {
    return ['meals', 'habits', 'workouts', 'supplements'];
  }
  if (
    goal.includes('muscle') ||
    goal.includes('strength') ||
    goal.includes('marathon') ||
    goal.includes('run')
  ) {
    return ['workouts', 'meals', 'habits', 'supplements'];
  }
  if (goal.includes('energy')) {
    return ['habits', 'meals', 'workouts', 'supplements'];
  }
  if (goal.includes('heart') || goal.includes('longevity') || goal.includes('aging')) {
    return ['habits', 'supplements', 'workouts', 'meals'];
  }

  return DEFAULT_ORDER;
}

export function getSegmentOrder(intake: IntakeResponses | null): PlanSectionKey[] {
  const primary = String(intake?.goals?.primary_goal ?? '');
  return goalOrder(primary);
}

function sectionItems(plan: DailyPlan, key: PlanSectionKey): PlanItem[] {
  return plan[key] as PlanItem[];
}

function isDomainDone(
  key: PlanSectionKey,
  items: PlanItem[],
  logged: boolean
): boolean {
  const allItemsDone = items.length > 0 && items.every((item) => item.completed);
  if (key === 'habits') return allItemsDone;
  return allItemsDone || logged;
}

export function getDomainSummaries(
  plan: DailyPlan,
  nutrition: { checkin: FoodLog | null; meals: FoodLog[] } | null,
  fitness: { checkin: WorkoutLog | null; sessions: WorkoutLog[] } | null,
  care: { checkin: SupplementLog | null; logs: SupplementLog[] } | null,
  trackingLevel: TrackingLevel
): Record<PlanSectionKey, DomainSummary> {
  const nutritionStatus = getNutritionStatusSummary(
    nutrition?.checkin ?? null,
    nutrition?.meals ?? [],
    trackingLevel
  );
  const fitnessStatus = getFitnessStatusSummary(
    fitness?.checkin ?? null,
    fitness?.sessions ?? [],
    trackingLevel
  );
  const careStatus = getCareStatusSummary(
    care?.checkin ?? null,
    care?.logs ?? [],
    trackingLevel
  );

  const statusByKey: Record<PlanSectionKey, { label: string; logged: boolean }> = {
    habits: { label: '', logged: false },
    workouts: fitnessStatus,
    meals: nutritionStatus,
    supplements: careStatus,
  };

  const keys: PlanSectionKey[] = ['habits', 'workouts', 'meals', 'supplements'];
  const result = {} as Record<PlanSectionKey, DomainSummary>;

  for (const key of keys) {
    const items = sectionItems(plan, key);
    const meta = SEGMENT_META[key];
    const domainStatus = statusByKey[key];
    const completedCount = items.filter((i) => i.completed).length;
    const total = items.length;
    const logged = domainStatus.logged;
    const done = isDomainDone(key, items, logged);
    const detailLabel =
      key === 'habits'
        ? completedCount > 0 && completedCount < total
          ? `${completedCount} of ${total}`
          : undefined
        : logged
          ? domainStatus.label
          : undefined;

    result[key] = {
      key,
      label: meta.label,
      title: meta.title,
      completedCount,
      total,
      done,
      status: { completedCount, total, done, detailLabel },
      actionLink: { label: meta.logLabel, href: meta.href },
    };
  }

  return result;
}

function timeOfDayPreference(): PlanSectionKey[] {
  const hour = new Date().getHours();
  if (hour < 11) return ['habits', 'supplements'];
  if (hour < 15) return ['meals'];
  return ['workouts'];
}

function pickWithTimeNudge(
  incomplete: PlanSectionKey[],
  order: PlanSectionKey[]
): PlanSectionKey {
  const prefs = timeOfDayPreference();
  for (const pref of prefs) {
    if (incomplete.includes(pref)) return pref;
  }
  return incomplete[0] ?? order[0];
}

export function getInitialSegment(
  order: PlanSectionKey[],
  summaries: Record<PlanSectionKey, DomainSummary>
): PlanSectionKey {
  const incomplete = order.filter((key) => !summaries[key].done);
  if (incomplete.length === 0) return order[0];
  if (incomplete.length === 1) return incomplete[0];
  return pickWithTimeNudge(incomplete, order);
}

export function getNextIncompleteSegment(
  current: PlanSectionKey,
  order: PlanSectionKey[],
  summaries: Record<PlanSectionKey, DomainSummary>
): PlanSectionKey | null {
  const incomplete = order.filter((key) => !summaries[key].done);
  if (incomplete.length === 0) return null;

  const currentIdx = order.indexOf(current);
  for (let i = currentIdx + 1; i < order.length; i++) {
    const key = order[i];
    if (!summaries[key].done) return key;
  }
  for (let i = 0; i < currentIdx; i++) {
    const key = order[i];
    if (!summaries[key].done) return key;
  }
  return null;
}

export function buildSegmentBarSections(
  order: PlanSectionKey[],
  summaries: Record<PlanSectionKey, DomainSummary>
): { key: PlanSectionKey; label: string; done: boolean }[] {
  return order.map((key) => ({
    key,
    label: summaries[key].label,
    done: summaries[key].done,
  }));
}
