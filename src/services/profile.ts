import { format } from 'date-fns';
import { supabase } from '@/src/lib/supabase';
import { seedDailyPlanFromIntake } from '@/src/services/planRefresh';
import type { DailyPlan, HabitLog, PlanItem, Profile, NutritionProfile } from '@/src/types/database';
import type { EngagementTier, ReminderPreset } from '@/src/types/database';
import type { OnboardingStepData } from '@/src/types/onboarding';
import { ONBOARDING_STEPS } from '@/src/types/onboarding';
import type { IntakeResponses } from '@/src/types/database';

export async function saveIntakeProgress(
  userId: string,
  data: OnboardingStepData,
  currentStep: number,
  completed = false
) {
  const payload = {
    user_id: userId,
    goals: data.goals ?? {},
    health_history: data.health_history ?? {},
    dietary_prefs: data.dietary_prefs ?? {},
    food_likes: data.food_likes ?? {},
    nutrition_profile: data.nutrition_profile ?? {},
    lifestyle: data.lifestyle ?? {},
    activity: data.activity ?? {},
    current_step: currentStep,
    completed,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('intake_responses').upsert(payload, {
    onConflict: 'user_id',
  });

  if (error) throw error;

  if (data.engagement_tier || data.reminder_preset) {
    await supabase
      .from('profiles')
      .update({
        ...(data.engagement_tier ? { engagement_tier: data.engagement_tier } : {}),
        ...(data.reminder_preset ? { reminder_preset: data.reminder_preset } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  }
}

export async function completeOnboarding(
  userId: string,
  data: OnboardingStepData,
  engagementTier: EngagementTier,
  reminderPreset: ReminderPreset
) {
  await saveIntakeProgress(userId, data, ONBOARDING_STEPS.length - 1, true);

  const { data: intakeRow } = await supabase
    .from('intake_responses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      engagement_tier: engagementTier,
      reminder_preset: reminderPreset,
      intake_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  await seedDailyPlanFromIntake(userId, data, engagementTier, intakeRow);
  await upsertReminderSettings(userId, reminderPreset);
}

export async function seedDailyPlan(
  userId: string,
  data: OnboardingStepData,
  tier: EngagementTier = 'moderate',
  intakeRow: IntakeResponses | null = null
) {
  await seedDailyPlanFromIntake(userId, data, tier, intakeRow);
}

export async function upsertReminderSettings(userId: string, preset: ReminderPreset) {
  const { error } = await supabase.from('reminder_settings').upsert(
    {
      user_id: userId,
      channel: 'push',
      frequency: preset,
      enabled: true,
      quiet_hours_start: 22,
      quiet_hours_end: 7,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

export async function getTodayPlan(userId: string): Promise<DailyPlan | null> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data, error } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .maybeSingle();

  if (error) throw error;
  return data as DailyPlan | null;
}

export async function getHabitLogs(userId: string, days = 7): Promise<HabitLog[]> {
  const start = format(new Date(Date.now() - days * 86400000), 'yyyy-MM-dd');
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', start)
    .order('log_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as HabitLog[];
}

export async function upsertHabitLog(
  userId: string,
  habitType: HabitLog['habit_type'],
  value: number,
  completed: boolean
) {
  const logDate = format(new Date(), 'yyyy-MM-dd');
  const { error } = await supabase.from('habit_logs').upsert(
    {
      user_id: userId,
      habit_type: habitType,
      log_date: logDate,
      value,
      completed,
    },
    { onConflict: 'user_id,habit_type,log_date' }
  );
  if (error) throw error;
}

export async function updateProfileSettings(
  userId: string,
  updates: Partial<Pick<Profile, 'engagement_tier' | 'reminder_preset' | 'tracking_level'>>
) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;

  if (updates.reminder_preset) {
    await upsertReminderSettings(userId, updates.reminder_preset);
  }
}

export async function loadIntakeProgress(userId: string): Promise<IntakeResponses | null> {
  const { data, error } = await supabase
    .from('intake_responses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as IntakeResponses | null;
}

export type PlanSectionKey = 'habits' | 'workouts' | 'meals' | 'supplements';

export async function updatePlanItemCompletion(
  userId: string,
  section: PlanSectionKey,
  itemId: string,
  completed: boolean
) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: plan, error: fetchError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!plan) throw new Error('No plan found for today');

  const items = (plan[section] as PlanItem[]).map((item) =>
    item.id === itemId ? { ...item, completed } : item
  );

  const { error } = await supabase.from('daily_plans').update({ [section]: items }).eq('id', plan.id);
  if (error) throw error;
}

export async function saveNutritionProfile(userId: string, nutritionProfile: NutritionProfile) {
  await upsertNutritionProfile(userId, nutritionProfile, { complete: true });
}

export async function saveNutritionProfileDraft(userId: string, nutritionProfile: NutritionProfile) {
  await upsertNutritionProfile(userId, nutritionProfile);
}

async function upsertNutritionProfile(
  userId: string,
  nutritionProfile: NutritionProfile,
  options: { complete?: boolean } = {}
) {
  const { data: existing, error: fetchError } = await supabase
    .from('intake_responses')
    .select('nutrition_profile')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const merged: NutritionProfile = {
    ...(existing?.nutrition_profile as NutritionProfile | undefined),
    ...nutritionProfile,
    ...(options.complete ? { setup_completed: true } : {}),
  };

  if (existing) {
    const { error } = await supabase
      .from('intake_responses')
      .update({ nutrition_profile: merged, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('intake_responses').insert({
    user_id: userId,
    goals: {},
    health_history: {},
    dietary_prefs: {},
    food_likes: {},
    nutrition_profile: merged,
    lifestyle: {},
    activity: {},
    current_step: 0,
    completed: false,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function saveMealSelection(userId: string, slotKey: string, recipeId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from('intake_responses')
    .select('nutrition_profile')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const profile = (existing?.nutrition_profile as NutritionProfile | undefined) ?? {};
  const meal_selections = {
    ...(profile.meal_selections ?? {}),
    [slotKey]: recipeId,
  };

  await upsertNutritionProfile(userId, { ...profile, meal_selections });
  await regenerateTodayMeals(userId);
}

export async function regenerateTodayMeals(userId: string) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: intake, error: intakeError } = await supabase
    .from('intake_responses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (intakeError) throw intakeError;
  if (!intake) throw new Error('No intake found');

  const { buildPersonalizedMealsFromIntake } = await import('@/src/services/mealPlanner');
  const meals = buildPersonalizedMealsFromIntake(intake as IntakeResponses);

  const { data: plan, error: planError } = await supabase
    .from('daily_plans')
    .select('id, meals')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .maybeSingle();

  if (planError) throw planError;

  const existingMeals = (plan?.meals as PlanItem[] | undefined) ?? [];
  const mergedMeals = meals.map((item, index) => ({
    ...item,
    completed: existingMeals[index]?.completed ?? false,
    scheduled_time: item.scheduled_time ?? existingMeals[index]?.scheduled_time,
  }));

  if (plan) {
    const { error } = await supabase
      .from('daily_plans')
      .update({ meals: mergedMeals })
      .eq('id', plan.id);
    if (error) throw error;
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { buildDailyPlanPayload } = await import('@/src/services/planRefresh');
    const payload = buildDailyPlanPayload(userId, intake as IntakeResponses, profile as Profile, today);
    payload.meals = mergedMeals;

    const { error } = await supabase.from('daily_plans').upsert(payload, {
      onConflict: 'user_id,plan_date',
    });
    if (error) throw error;
  }
}
