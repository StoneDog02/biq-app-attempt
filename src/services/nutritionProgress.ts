import { CHECKIN_LABELS, sumMealCalories } from '@/src/services/nutrition';
import type { CheckinStatus, FoodLog, TrackingLevel } from '@/src/types/database';

export const CHECKIN_OPTIONS = [
  {
    value: 'on_plan' as const,
    label: 'On plan',
    hint: 'Stayed close to your plan today',
    icon: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  },
  {
    value: 'mostly' as const,
    label: 'Mostly',
    hint: 'Mostly aligned with your goals',
    icon: { ios: 'hand.thumbsup.fill', android: 'thumb_up', web: 'thumb_up' },
  },
  {
    value: 'off_plan' as const,
    label: 'Off plan',
    hint: 'Honest check-in — no judgment',
    icon: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  },
] as const;

export type CheckinOption = (typeof CHECKIN_OPTIONS)[number];

export const MEAL_TYPE_OPTIONS = [
  {
    value: 'breakfast' as const,
    label: 'Breakfast',
    icon: { ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' },
  },
  {
    value: 'lunch' as const,
    label: 'Lunch',
    icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  },
  {
    value: 'dinner' as const,
    label: 'Dinner',
    icon: { ios: 'moon.fill', android: 'nightlight', web: 'nightlight' },
  },
  {
    value: 'snack' as const,
    label: 'Snack',
    icon: { ios: 'carrot.fill', android: 'eco', web: 'eco' },
  },
] as const;

export type MealTypeOption = (typeof MEAL_TYPE_OPTIONS)[number];

export type NutritionDayProgress = {
  completed: number;
  total: number;
  fraction: number;
  label: string;
  done: boolean;
  subtitle?: string;
};

export function getMealTypeIcon(mealType: string) {
  return (
    MEAL_TYPE_OPTIONS.find((m) => m.value === mealType)?.icon ??
    MEAL_TYPE_OPTIONS[1].icon
  );
}

export function getNutritionDayProgress(
  checkin: FoodLog | null | undefined,
  meals: FoodLog[],
  trackingLevel: TrackingLevel
): NutritionDayProgress {
  if (trackingLevel <= 1) {
    const done = Boolean(checkin?.checkin_status);
    return {
      completed: done ? 1 : 0,
      total: 1,
      fraction: done ? 1 : 0,
      label: done ? '1 of 1 done' : '0 of 1 done',
      done,
      subtitle: done ? undefined : 'One quick check-in is enough. No numbers required.',
    };
  }

  const mealLogs = meals.filter((m) => m.meal_type);
  const totalCal = sumMealCalories(meals);
  const done = mealLogs.length > 0;

  if (!done) {
    return {
      completed: 0,
      total: 1,
      fraction: 0,
      label: '0 of 1 done',
      done: false,
      subtitle: 'Log meals in seconds — calories optional.',
    };
  }

  const calPart = totalCal > 0 ? ` · ${totalCal} cal` : '';
  return {
    completed: mealLogs.length,
    total: Math.max(mealLogs.length, 1),
    fraction: 1,
    label: `${mealLogs.length} meal${mealLogs.length > 1 ? 's' : ''} logged${calPart}`,
    done: true,
  };
}

export function getCheckinStatusLabel(status: CheckinStatus): string {
  return CHECKIN_LABELS[status];
}
