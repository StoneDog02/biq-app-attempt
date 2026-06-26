import { format } from 'date-fns';
import { supabase } from '@/src/lib/supabase';
import { CHECKIN_LABELS } from '@/src/services/nutrition';
import type {
  CheckinStatus,
  DailyPlan,
  PlanItem,
  WorkoutLog,
  WorkoutLogSource,
  WorkoutType,
} from '@/src/types/database';

function todayDate() {
  return format(new Date(), 'yyyy-MM-dd');
}

export async function getWorkoutLogsForDate(userId: string, date = todayDate()): Promise<WorkoutLog[]> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as WorkoutLog[];
}

export async function getWorkoutDailyCheckin(
  userId: string,
  date = todayDate()
): Promise<WorkoutLog | null> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .not('checkin_status', 'is', null)
    .maybeSingle();

  if (error) throw error;
  return data as WorkoutLog | null;
}

export async function saveWorkoutDailyCheckin(
  userId: string,
  status: CheckinStatus
): Promise<WorkoutLog> {
  const logDate = todayDate();
  const existing = await getWorkoutDailyCheckin(userId, logDate);

  const payload = {
    user_id: userId,
    log_date: logDate,
    checkin_status: status,
    completed_checkin: true,
    source: 'manual' as WorkoutLogSource,
    title: CHECKIN_LABELS[status],
  };

  if (existing) {
    const { data, error } = await supabase
      .from('workout_logs')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    await markPlanWorkoutsComplete(userId, logDate);
    return data as WorkoutLog;
  }

  const { data, error } = await supabase.from('workout_logs').insert(payload).select('*').single();
  if (error) throw error;
  await markPlanWorkoutsComplete(userId, logDate);
  return data as WorkoutLog;
}

export async function logWorkout(
  userId: string,
  workout: {
    workout_type: WorkoutType;
    title: string;
    duration_minutes?: number | null;
    notes?: string | null;
    source?: WorkoutLogSource;
  }
): Promise<WorkoutLog> {
  const payload = {
    user_id: userId,
    log_date: todayDate(),
    workout_type: workout.workout_type,
    title: workout.title,
    duration_minutes: workout.duration_minutes ?? null,
    notes: workout.notes ?? null,
    source: workout.source ?? 'manual',
    completed_checkin: true,
  };

  const { data, error } = await supabase.from('workout_logs').insert(payload).select('*').single();
  if (error) throw error;
  return data as WorkoutLog;
}

export async function markPlanWorkoutsComplete(userId: string, planDate = todayDate()) {
  const { data: plan, error: fetchError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', planDate)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!plan) return;

  const workouts = (plan.workouts as PlanItem[]).map((item) => ({ ...item, completed: true }));

  const { error } = await supabase.from('daily_plans').update({ workouts }).eq('id', plan.id);
  if (error) throw error;
}

export function getFitnessStatusSummary(
  checkin: WorkoutLog | null,
  sessions: WorkoutLog[],
  trackingLevel: number
): { label: string; logged: boolean } {
  if (trackingLevel >= 2) {
    const sessionLogs = sessions.filter((s) => s.workout_type);
    if (sessionLogs.length === 0) return { label: 'Not yet', logged: false };
    const totalMin = sessionLogs.reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0);
    const minPart = totalMin > 0 ? ` · ${totalMin} min` : '';
    return {
      label: `${sessionLogs.length} session${sessionLogs.length > 1 ? 's' : ''} logged${minPart}`,
      logged: true,
    };
  }

  if (!checkin?.checkin_status) return { label: 'Not yet', logged: false };
  return { label: CHECKIN_LABELS[checkin.checkin_status], logged: true };
}

export async function getTodayPlanWithFitness(userId: string): Promise<{
  plan: DailyPlan | null;
  checkin: WorkoutLog | null;
  sessions: WorkoutLog[];
}> {
  const today = todayDate();
  const [planResult, logs] = await Promise.all([
    supabase.from('daily_plans').select('*').eq('user_id', userId).eq('plan_date', today).maybeSingle(),
    getWorkoutLogsForDate(userId, today),
  ]);

  if (planResult.error) throw planResult.error;

  return {
    plan: planResult.data as DailyPlan | null,
    checkin: logs.find((l) => l.checkin_status) ?? null,
    sessions: logs.filter((l) => l.workout_type),
  };
}

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  mobility: 'Mobility',
  sport: 'Sport',
  other: 'Other',
};
