import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '@/src/hooks/useAuth';
import {
  getDailyCheckin,
  getFoodLogsForDate,
  logMeal,
  saveDailyCheckin,
  getTodayPlanWithNutrition,
  CHECKIN_LABELS,
} from '@/src/services/nutrition';
import type { CheckinStatus, FoodLog, FoodLogSource, MealType } from '@/src/types/database';

function nutritionKeys(userId?: string) {
  return {
    logs: ['foodLogs', userId] as const,
    checkin: ['dailyCheckin', userId] as const,
    todayNutrition: ['todayNutrition', userId] as const,
  };
}

function todayDate() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function useTodayFoodLogs() {
  const { user } = useAuth();
  const keys = nutritionKeys(user?.id);

  return useQuery({
    queryKey: keys.logs,
    queryFn: () => getFoodLogsForDate(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useDailyCheckin() {
  const { user } = useAuth();
  const keys = nutritionKeys(user?.id);

  return useQuery({
    queryKey: keys.checkin,
    queryFn: () => getDailyCheckin(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useTodayNutrition() {
  const { user } = useAuth();
  const keys = nutritionKeys(user?.id);

  return useQuery({
    queryKey: keys.todayNutrition,
    queryFn: () => getTodayPlanWithNutrition(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSaveDailyCheckin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = nutritionKeys(user?.id);

  return useMutation({
    mutationFn: (status: CheckinStatus) => saveDailyCheckin(user!.id, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: keys.checkin });
      await queryClient.cancelQueries({ queryKey: keys.logs });

      const previousCheckin = queryClient.getQueryData<FoodLog | null>(keys.checkin);
      const previousLogs = queryClient.getQueryData<FoodLog[]>(keys.logs);
      const logDate = todayDate();

      const optimisticCheckin: FoodLog = {
        id: previousCheckin?.id ?? `optimistic-checkin-${status}`,
        user_id: user!.id,
        log_date: logDate,
        checkin_status: status,
        meal_type: null,
        name: CHECKIN_LABELS[status],
        calories: null,
        protein_g: null,
        carbs_g: null,
        fat_g: null,
        source: 'manual',
        completed_checkin: true,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(keys.checkin, optimisticCheckin);

      queryClient.setQueryData<FoodLog[]>(keys.logs, (old) => {
        const logs = old ?? [];
        const withoutCheckin = logs.filter((l) => !l.checkin_status);
        return [optimisticCheckin, ...withoutCheckin];
      });

      return { previousCheckin, previousLogs };
    },
    onError: (_error, _status, context) => {
      queryClient.setQueryData(keys.checkin, context?.previousCheckin ?? null);
      if (context?.previousLogs) {
        queryClient.setQueryData(keys.logs, context.previousLogs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.checkin });
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayNutrition });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
    },
  });
}

export function useLogMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = nutritionKeys(user?.id);

  return useMutation({
    mutationFn: (meal: {
      meal_type: MealType;
      name: string;
      calories?: number | null;
      protein_g?: number | null;
      carbs_g?: number | null;
      fat_g?: number | null;
      source?: FoodLogSource;
    }) => logMeal(user!.id, meal),
    onMutate: async (meal) => {
      await queryClient.cancelQueries({ queryKey: keys.logs });

      const previousLogs = queryClient.getQueryData<FoodLog[]>(keys.logs);
      const logDate = todayDate();

      const optimisticMeal: FoodLog = {
        id: `optimistic-meal-${Date.now()}`,
        user_id: user!.id,
        log_date: logDate,
        meal_type: meal.meal_type,
        checkin_status: null,
        name: meal.name,
        calories: meal.calories ?? null,
        protein_g: meal.protein_g ?? null,
        carbs_g: meal.carbs_g ?? null,
        fat_g: meal.fat_g ?? null,
        source: meal.source ?? 'manual',
        completed_checkin: true,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<FoodLog[]>(keys.logs, (old) => [...(old ?? []), optimisticMeal]);

      return { previousLogs };
    },
    onError: (_error, _meal, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData(keys.logs, context.previousLogs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayNutrition });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
    },
  });
}

export function invalidateNutritionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  userId?: string
) {
  const keys = nutritionKeys(userId);
  queryClient.invalidateQueries({ queryKey: keys.logs });
  queryClient.invalidateQueries({ queryKey: keys.checkin });
  queryClient.invalidateQueries({ queryKey: keys.todayNutrition });
  queryClient.invalidateQueries({ queryKey: ['todayPlan', userId] });
  queryClient.invalidateQueries({ queryKey: ['nutritionProfile', userId] });
}
