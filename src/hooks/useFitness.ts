import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/hooks/useAuth';
import {
  getWorkoutDailyCheckin,
  getWorkoutLogsForDate,
  logWorkout,
  saveWorkoutDailyCheckin,
  getTodayPlanWithFitness,
} from '@/src/services/fitness';
import type { CheckinStatus, WorkoutLogSource, WorkoutType } from '@/src/types/database';

function fitnessKeys(userId?: string) {
  return {
    logs: ['workoutLogs', userId] as const,
    checkin: ['workoutCheckin', userId] as const,
    todayFitness: ['todayFitness', userId] as const,
  };
}

export function useTodayWorkoutLogs() {
  const { user } = useAuth();
  const keys = fitnessKeys(user?.id);

  return useQuery({
    queryKey: keys.logs,
    queryFn: () => getWorkoutLogsForDate(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useWorkoutDailyCheckin() {
  const { user } = useAuth();
  const keys = fitnessKeys(user?.id);

  return useQuery({
    queryKey: keys.checkin,
    queryFn: () => getWorkoutDailyCheckin(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useTodayFitness() {
  const { user } = useAuth();
  const keys = fitnessKeys(user?.id);

  return useQuery({
    queryKey: keys.todayFitness,
    queryFn: () => getTodayPlanWithFitness(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSaveWorkoutDailyCheckin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = fitnessKeys(user?.id);

  return useMutation({
    mutationFn: (status: CheckinStatus) => saveWorkoutDailyCheckin(user!.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.checkin });
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayFitness });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
    },
  });
}

export function useLogWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = fitnessKeys(user?.id);

  return useMutation({
    mutationFn: (workout: {
      workout_type: WorkoutType;
      title: string;
      duration_minutes?: number | null;
      notes?: string | null;
      source?: WorkoutLogSource;
    }) => logWorkout(user!.id, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayFitness });
    },
  });
}
