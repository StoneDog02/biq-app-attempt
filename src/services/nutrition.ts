import { format } from 'date-fns';
import { supabase } from '@/src/lib/supabase';
import type {
  CheckinStatus,
  DailyPlan,
  FoodLog,
  FoodLogSource,
  MealType,
  PlanItem,
} from '@/src/types/database';

function todayDate() {
  return format(new Date(), 'yyyy-MM-dd');
}

export const CHECKIN_LABELS: Record<CheckinStatus, string> = {
  on_plan: 'On plan',
  mostly: 'Mostly on plan',
  off_plan: 'Off plan',
};

export async function getFoodLogsForDate(userId: string, date = todayDate()): Promise<FoodLog[]> {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as FoodLog[];
}

export async function getDailyCheckin(userId: string, date = todayDate()): Promise<FoodLog | null> {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .not('checkin_status', 'is', null)
    .maybeSingle();

  if (error) throw error;
  return data as FoodLog | null;
}

export async function saveDailyCheckin(userId: string, status: CheckinStatus): Promise<FoodLog> {
  const logDate = todayDate();
  const existing = await getDailyCheckin(userId, logDate);

  const payload = {
    user_id: userId,
    log_date: logDate,
    checkin_status: status,
    completed_checkin: true,
    source: 'manual' as FoodLogSource,
    name: CHECKIN_LABELS[status],
  };

  if (existing) {
    const { data, error } = await supabase
      .from('food_logs')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    await markPlanMealsComplete(userId, logDate);
    return data as FoodLog;
  }

  const { data, error } = await supabase.from('food_logs').insert(payload).select('*').single();
  if (error) throw error;
  await markPlanMealsComplete(userId, logDate);
  return data as FoodLog;
}

export async function logMeal(
  userId: string,
  meal: {
    meal_type: MealType;
    name: string;
    calories?: number | null;
    protein_g?: number | null;
    carbs_g?: number | null;
    fat_g?: number | null;
    source?: FoodLogSource;
  }
): Promise<FoodLog> {
  const payload = {
    user_id: userId,
    log_date: todayDate(),
    meal_type: meal.meal_type,
    name: meal.name,
    calories: meal.calories ?? null,
    protein_g: meal.protein_g ?? null,
    carbs_g: meal.carbs_g ?? null,
    fat_g: meal.fat_g ?? null,
    source: meal.source ?? 'manual',
    completed_checkin: true,
  };

  const { data, error } = await supabase.from('food_logs').insert(payload).select('*').single();
  if (error) throw error;
  return data as FoodLog;
}

export async function markPlanMealsComplete(userId: string, planDate = todayDate()) {
  const { data: plan, error: fetchError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', planDate)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!plan) return;

  const meals = (plan.meals as PlanItem[]).map((item) => ({ ...item, completed: true }));

  const { error } = await supabase
    .from('daily_plans')
    .update({ meals })
    .eq('id', plan.id);

  if (error) throw error;
}

export function getNutritionStatusSummary(
  checkin: FoodLog | null,
  meals: FoodLog[],
  trackingLevel: number
): { label: string; logged: boolean } {
  if (trackingLevel >= 2) {
    const mealLogs = meals.filter((m) => m.meal_type);
    if (mealLogs.length === 0) return { label: 'Not yet', logged: false };
    const totalCal = mealLogs.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
    const calPart = totalCal > 0 ? ` · ${totalCal} cal` : '';
    return { label: `${mealLogs.length} meal${mealLogs.length > 1 ? 's' : ''} logged${calPart}`, logged: true };
  }

  if (!checkin?.checkin_status) return { label: 'Not yet', logged: false };
  return { label: CHECKIN_LABELS[checkin.checkin_status], logged: true };
}

export function sumMealCalories(meals: FoodLog[]): number {
  return meals
    .filter((m) => m.meal_type)
    .reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
}

export async function getTodayPlanWithNutrition(userId: string): Promise<{
  plan: DailyPlan | null;
  checkin: FoodLog | null;
  meals: FoodLog[];
}> {
  const today = todayDate();
  const [planResult, logs] = await Promise.all([
    supabase.from('daily_plans').select('*').eq('user_id', userId).eq('plan_date', today).maybeSingle(),
    getFoodLogsForDate(userId, today),
  ]);

  if (planResult.error) throw planResult.error;

  const checkin = logs.find((l) => l.checkin_status) ?? null;
  const meals = logs.filter((l) => l.meal_type);

  return {
    plan: planResult.data as DailyPlan | null,
    checkin,
    meals,
  };
}
