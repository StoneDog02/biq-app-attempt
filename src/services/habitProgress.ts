import { format } from 'date-fns';
import type { HabitLog } from '@/src/types/database';

export const HABITS = [
  {
    type: 'water' as const,
    label: 'Water',
    unit: 'glasses',
    defaultValue: 8,
    hint: '8 glasses',
    icon: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' },
  },
  {
    type: 'steps' as const,
    label: 'Steps',
    unit: 'steps',
    defaultValue: 0,
    hint: 'Tap when you moved today',
    icon: { ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' },
  },
  {
    type: 'stretching' as const,
    label: 'Stretching',
    unit: 'minutes',
    defaultValue: 5,
    hint: '5 minutes',
    icon: { ios: 'figure.flexibility', android: 'self_improvement', web: 'self_improvement' },
  },
] as const;

export type HabitConfig = (typeof HABITS)[number];

export type HabitDayProgress = {
  completed: number;
  total: number;
  fraction: number;
  label: string;
  done: boolean;
  subtitle?: string;
};

export function todayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getTodayHabitLogs(logs: HabitLog[]): Partial<Record<HabitLog['habit_type'], HabitLog>> {
  const key = todayKey();
  const map: Partial<Record<HabitLog['habit_type'], HabitLog>> = {};
  logs.forEach((log) => {
    if (log.log_date === key) {
      map[log.habit_type] = log;
    }
  });
  return map;
}

export function getHabitDayProgress(
  logs: HabitLog[],
  engagementTier: 'light' | 'moderate' | 'high_touch' = 'moderate'
): HabitDayProgress {
  const todayLogs = getTodayHabitLogs(logs);
  const total = HABITS.length;
  const completed = HABITS.filter((h) => todayLogs[h.type]?.completed).length;
  const fraction = total > 0 ? completed / total : 0;

  return {
    completed,
    total,
    fraction,
    label: `${completed} of ${total} done`,
    done: completed === total,
    subtitle:
      engagementTier === 'light'
        ? 'Tap any habit when it works for you — no pressure.'
        : undefined,
  };
}

export function getHabitHistoryByDate(logs: HabitLog[]): { date: string; logs: HabitLog[] }[] {
  const grouped: Record<string, HabitLog[]> = {};
  logs.forEach((log) => {
    grouped[log.log_date] = grouped[log.log_date] ?? [];
    grouped[log.log_date].push(log);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, dayLogs]) => ({ date, logs: dayLogs }));
}

export function getDayHabitCompletionDots(dayLogs: HabitLog[]): boolean[] {
  const byType = new Map(dayLogs.map((l) => [l.habit_type, l]));
  return HABITS.map((h) => Boolean(byType.get(h.type)?.completed));
}

export function getHabitStatusLabel(
  habit: HabitConfig,
  log: HabitLog | undefined,
  isDone: boolean
): string {
  if (isDone) {
    if (habit.type === 'water' && log?.value) {
      return `${log.value} ${habit.unit}`;
    }
    if (habit.type === 'stretching') {
      return `${log?.value ?? habit.defaultValue} min`;
    }
    return 'Done';
  }
  return habit.hint;
}

export function usesWaterStepper(habit: HabitConfig, isLightTier: boolean): boolean {
  return habit.type === 'water' && !isLightTier;
}
