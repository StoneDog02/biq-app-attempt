import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '@/src/hooks/useAuth';
import { getHabitLogs, upsertHabitLog, updatePlanItemCompletion } from '@/src/services/profile';
import { ensureTodayPlan } from '@/src/services/planRefresh';
import type { PlanSectionKey } from '@/src/services/profile';
import type { HabitLog } from '@/src/types/database';

export function useTodayPlan() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['todayPlan', user?.id],
    queryFn: () => ensureTodayPlan(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 0,
  });
}

export function useHabitLogs(days = 7) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['habitLogs', user?.id, days],
    queryFn: () => getHabitLogs(user!.id, days),
    enabled: Boolean(user?.id),
  });
}

export function useLogHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitType,
      value,
      completed,
    }: {
      habitType: HabitLog['habit_type'];
      value: number;
      completed: boolean;
    }) => upsertHabitLog(user!.id, habitType, value, completed),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['habitLogs', user?.id] });

      const logDate = format(new Date(), 'yyyy-MM-dd');
      const snapshots = queryClient.getQueriesData<HabitLog[]>({
        queryKey: ['habitLogs', user?.id],
      });

      queryClient.setQueriesData<HabitLog[]>(
        { queryKey: ['habitLogs', user?.id] },
        (old) => {
          if (!old) return old;

          const existing = old.find(
            (log) => log.habit_type === variables.habitType && log.log_date === logDate
          );

          if (existing) {
            return old.map((log) =>
              log.habit_type === variables.habitType && log.log_date === logDate
                ? { ...log, value: variables.value, completed: variables.completed }
                : log
            );
          }

          return [
            {
              id: `optimistic-${variables.habitType}`,
              user_id: user!.id,
              habit_type: variables.habitType,
              log_date: logDate,
              value: variables.value,
              completed: variables.completed,
              created_at: new Date().toISOString(),
            },
            ...old,
          ];
        }
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLogs', user?.id] });
    },
  });
}

export function useTogglePlanItem() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      section,
      itemId,
      completed,
    }: {
      section: PlanSectionKey;
      itemId: string;
      completed: boolean;
    }) => updatePlanItemCompletion(user!.id, section, itemId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
    },
  });
}
