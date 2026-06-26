import { format } from 'date-fns';
import { supabase } from '@/src/lib/supabase';
import { CHECKIN_LABELS } from '@/src/services/nutrition';
import type {
  CheckinStatus,
  DailyPlan,
  LabReport,
  PlanItem,
  SupplementLog,
  SupplementLogSource,
} from '@/src/types/database';

function todayDate() {
  return format(new Date(), 'yyyy-MM-dd');
}

export async function getSupplementLogsForDate(
  userId: string,
  date = todayDate()
): Promise<SupplementLog[]> {
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as SupplementLog[];
}

export async function getSupplementDailyCheckin(
  userId: string,
  date = todayDate()
): Promise<SupplementLog | null> {
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .not('checkin_status', 'is', null)
    .maybeSingle();

  if (error) throw error;
  return data as SupplementLog | null;
}

export async function saveSupplementDailyCheckin(
  userId: string,
  status: CheckinStatus
): Promise<SupplementLog> {
  const logDate = todayDate();
  const existing = await getSupplementDailyCheckin(userId, logDate);

  const payload = {
    user_id: userId,
    log_date: logDate,
    checkin_status: status,
    completed_checkin: true,
    source: 'manual' as SupplementLogSource,
    title: CHECKIN_LABELS[status],
  };

  if (existing) {
    const { data, error } = await supabase
      .from('supplement_logs')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    await markPlanSupplementsComplete(userId, logDate);
    return data as SupplementLog;
  }

  const { data, error } = await supabase.from('supplement_logs').insert(payload).select('*').single();
  if (error) throw error;
  await markPlanSupplementsComplete(userId, logDate);
  return data as SupplementLog;
}

export async function logSupplement(
  userId: string,
  supplement: {
    title: string;
    product_id?: string | null;
    notes?: string | null;
    source?: SupplementLogSource;
  }
): Promise<SupplementLog> {
  const payload = {
    user_id: userId,
    log_date: todayDate(),
    title: supplement.title,
    product_id: supplement.product_id ?? null,
    notes: supplement.notes ?? null,
    source: supplement.source ?? 'manual',
    completed_checkin: true,
  };

  const { data, error } = await supabase.from('supplement_logs').insert(payload).select('*').single();
  if (error) throw error;
  return data as SupplementLog;
}

export async function markPlanSupplementsComplete(userId: string, planDate = todayDate()) {
  const { data: plan, error: fetchError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', planDate)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!plan) return;

  const supplements = (plan.supplements as PlanItem[]).map((item) => ({ ...item, completed: true }));

  const { error } = await supabase.from('daily_plans').update({ supplements }).eq('id', plan.id);
  if (error) throw error;
}

export function getCareStatusSummary(
  checkin: SupplementLog | null,
  logs: SupplementLog[],
  trackingLevel: number
): { label: string; logged: boolean } {
  if (trackingLevel >= 2) {
    const itemLogs = logs.filter((l) => l.title && !l.checkin_status);
    if (itemLogs.length === 0) return { label: 'Not yet', logged: false };
    return {
      label: `${itemLogs.length} logged today`,
      logged: true,
    };
  }

  if (!checkin?.checkin_status) return { label: 'Not yet', logged: false };
  return { label: CHECKIN_LABELS[checkin.checkin_status], logged: true };
}

export async function getTodayPlanWithCare(userId: string): Promise<{
  plan: DailyPlan | null;
  checkin: SupplementLog | null;
  logs: SupplementLog[];
}> {
  const today = todayDate();
  const [planResult, logs] = await Promise.all([
    supabase.from('daily_plans').select('*').eq('user_id', userId).eq('plan_date', today).maybeSingle(),
    getSupplementLogsForDate(userId, today),
  ]);

  if (planResult.error) throw planResult.error;

  return {
    plan: planResult.data as DailyPlan | null,
    checkin: logs.find((l) => l.checkin_status) ?? null,
    logs: logs.filter((l) => l.title && !l.checkin_status),
  };
}

export async function getLabReports(userId: string): Promise<LabReport[]> {
  const { data, error } = await supabase
    .from('lab_reports')
    .select('*')
    .eq('user_id', userId)
    .order('report_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as LabReport[];
}

export async function getLabReportById(userId: string, reportId: string): Promise<LabReport | null> {
  const { data, error } = await supabase
    .from('lab_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('id', reportId)
    .maybeSingle();

  if (error) throw error;
  return data as LabReport | null;
}

export async function seedMockLabReportIfEmpty(userId: string): Promise<void> {
  const existing = await getLabReports(userId);
  if (existing.length > 0) return;

  const { error } = await supabase.from('lab_reports').insert({
    user_id: userId,
    report_date: format(new Date(), 'yyyy-MM-dd'),
    title: 'Longevity panel — sample',
    status: 'ready',
    summary_json: {
      coachNote:
        'Sample report for preview. Upload your own labs when storage is connected.',
      biomarkers: [
        { name: 'Vitamin D', value: '42 ng/mL', status: 'optimal', note: 'Within target range' },
        { name: 'ApoB', value: '85 mg/dL', status: 'good', note: 'Cardiovascular risk marker' },
        { name: 'HbA1c', value: '5.4%', status: 'optimal', note: 'Blood sugar average' },
        { name: 'hs-CRP', value: '0.8 mg/L', status: 'good', note: 'Inflammation marker' },
      ],
    },
  });

  if (error) throw error;
}
