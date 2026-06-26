import type { DailyPlan, PlanItem, TrackingLevel } from '@/src/types/database';

function allPlanItems(plan: DailyPlan): PlanItem[] {
  return [
    ...(plan.habits as PlanItem[]),
    ...(plan.workouts as PlanItem[]),
    ...(plan.meals as PlanItem[]),
    ...(plan.supplements as PlanItem[]),
  ];
}

export type DayProgressSummary = {
  completed: number;
  total: number;
  fraction: number;
  label: string;
  subtitle?: string;
};

export function getDayProgressSummary(
  plan: DailyPlan,
  trackingLevel: TrackingLevel,
  engagementTier: 'light' | 'moderate' | 'high_touch' = 'moderate'
): DayProgressSummary {
  const items = allPlanItems(plan);
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  const fraction = total > 0 ? completed / total : 0;

  return {
    completed,
    total,
    fraction,
    label: `${completed} of ${total} done`,
    subtitle:
      trackingLevel <= 1 && engagementTier === 'light'
        ? 'Tap any section to check in — no pressure.'
        : undefined,
  };
}
