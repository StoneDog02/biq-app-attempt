import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/hooks/useAuth';
import {
  getSupplementDailyCheckin,
  getSupplementLogsForDate,
  logSupplement,
  saveSupplementDailyCheckin,
  getTodayPlanWithCare,
  getLabReports,
  getLabReportById,
  seedMockLabReportIfEmpty,
} from '@/src/services/care';
import type { CheckinStatus, SupplementLogSource } from '@/src/types/database';

function careKeys(userId?: string) {
  return {
    logs: ['supplementLogs', userId] as const,
    checkin: ['supplementCheckin', userId] as const,
    todayCare: ['todayCare', userId] as const,
    labReports: ['labReports', userId] as const,
    labReport: (id: string) => ['labReport', userId, id] as const,
  };
}

export function useTodaySupplementLogs() {
  const { user } = useAuth();
  const keys = careKeys(user?.id);

  return useQuery({
    queryKey: keys.logs,
    queryFn: () => getSupplementLogsForDate(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSupplementDailyCheckin() {
  const { user } = useAuth();
  const keys = careKeys(user?.id);

  return useQuery({
    queryKey: keys.checkin,
    queryFn: () => getSupplementDailyCheckin(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useTodayCare() {
  const { user } = useAuth();
  const keys = careKeys(user?.id);

  return useQuery({
    queryKey: keys.todayCare,
    queryFn: () => getTodayPlanWithCare(user!.id),
    enabled: Boolean(user?.id),
  });
}

export function useSaveSupplementDailyCheckin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = careKeys(user?.id);

  return useMutation({
    mutationFn: (status: CheckinStatus) => saveSupplementDailyCheckin(user!.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.checkin });
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayCare });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
    },
  });
}

export function useLogSupplement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const keys = careKeys(user?.id);

  return useMutation({
    mutationFn: (supplement: {
      title: string;
      product_id?: string | null;
      notes?: string | null;
      source?: SupplementLogSource;
    }) => logSupplement(user!.id, supplement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.logs });
      queryClient.invalidateQueries({ queryKey: keys.todayCare });
    },
  });
}

export function useLabReports() {
  const { user } = useAuth();
  const keys = careKeys(user?.id);

  return useQuery({
    queryKey: keys.labReports,
    queryFn: async () => {
      await seedMockLabReportIfEmpty(user!.id);
      return getLabReports(user!.id);
    },
    enabled: Boolean(user?.id),
  });
}

export function useLabReport(reportId: string) {
  const { user } = useAuth();
  const keys = careKeys(user?.id);

  return useQuery({
    queryKey: keys.labReport(reportId),
    queryFn: () => getLabReportById(user!.id, reportId),
    enabled: Boolean(user?.id && reportId),
  });
}
