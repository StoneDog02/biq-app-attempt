import { format } from 'date-fns';
import { supabase } from '@/src/lib/supabase';
import { buildPersonalizedMealsFromIntake } from '@/src/services/mealPlanner';
import { buildPersonalizedWorkoutsFromIntake } from '@/src/services/workoutPlanner';
import { buildPersonalizedSupplementsFromIntake } from '@/src/services/supplementPlanner';
import { buildDailyCoachMessage } from '@/src/services/planCoach';
import type { DailyPlan, IntakeResponses, PlanItem, Profile } from '@/src/types/database';
import type { EngagementTier } from '@/src/types/database';
import type { OnboardingStepData } from '@/src/types/onboarding';

function todayDate() {
  return format(new Date(), 'yyyy-MM-dd');
}

function defaultHabits(): PlanItem[] {
  return [
    { id: 'h1', title: 'Drink water', description: '8 glasses today', completed: false },
    { id: 'h2', title: 'Take a walk', description: 'Track your steps', completed: false },
    { id: 'h3', title: 'Stretch', description: '5 minutes of mobility', completed: false },
  ];
}

function withFreshCompletion(items: PlanItem[]): PlanItem[] {
  return items.map((item) => ({ ...item, completed: false }));
}

export function buildDailyPlanPayload(
  userId: string,
  intake: IntakeResponses | null,
  profile: Profile | null,
  planDate = todayDate()
) {
  const workouts = withFreshCompletion(buildPersonalizedWorkoutsFromIntake(intake));
  const meals = withFreshCompletion(buildPersonalizedMealsFromIntake(intake));
  const supplements = withFreshCompletion(buildPersonalizedSupplementsFromIntake(intake));

  return {
    user_id: userId,
    plan_date: planDate,
    habits: defaultHabits(),
    workouts,
    meals,
    supplements,
    coach_message: buildDailyCoachMessage(intake, profile),
  };
}

export async function ensureTodayPlan(userId: string): Promise<DailyPlan | null> {
  const today = todayDate();

  const { data: existing, error: fetchError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing as DailyPlan;

  const [intakeResult, profileResult] = await Promise.all([
    supabase.from('intake_responses').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
  ]);

  if (intakeResult.error) throw intakeResult.error;
  if (profileResult.error) throw profileResult.error;

  const intake = intakeResult.data as IntakeResponses | null;
  const profile = profileResult.data as Profile | null;

  if (!profile?.intake_completed) return null;

  const payload = buildDailyPlanPayload(userId, intake, profile, today);

  const { data, error } = await supabase
    .from('daily_plans')
    .upsert(payload, { onConflict: 'user_id,plan_date' })
    .select('*')
    .single();

  if (error) throw error;
  return data as DailyPlan;
}

export async function seedDailyPlanFromIntake(
  userId: string,
  data: OnboardingStepData,
  tier: EngagementTier = 'moderate',
  intakeRow: IntakeResponses | null = null
) {
  const profile: Profile = {
    id: userId,
    full_name: null,
    engagement_tier: tier,
    reminder_preset: data.reminder_preset ?? 'balanced',
    tracking_level: 1,
    intake_completed: true,
    locale: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const payload = buildDailyPlanPayload(userId, intakeRow, profile);

  const { error } = await supabase.from('daily_plans').upsert(payload, {
    onConflict: 'user_id,plan_date',
  });

  if (error) throw error;
}
