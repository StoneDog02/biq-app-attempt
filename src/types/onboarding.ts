import type { NutritionProfile } from '@/src/types/database';
import { z } from 'zod';

export const engagementTierSchema = z.enum(['light', 'moderate', 'high_touch']);
export const reminderPresetSchema = z.enum(['minimal', 'balanced', 'active']);

export const welcomeSchema = z.object({});
export const engagementSchema = z.object({
  engagement_tier: engagementTierSchema,
});
export const reminderSchema = z.object({
  reminder_preset: reminderPresetSchema,
});
export const goalsSchema = z.object({
  primary_goal: z.string().min(1, 'Select or describe your primary goal'),
  secondary_goals: z.string().optional(),
});
export const healthHistorySchema = z.object({
  conditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
});
export const dietaryPrefsSchema = z.object({
  diet_type: z.string().min(1, 'Tell us about your diet preferences'),
  restrictions: z.string().optional(),
});
export const foodLikesSchema = z.object({
  likes: z.string().min(1, 'Share a few foods you enjoy'),
  dislikes: z.string().optional(),
});
export const lifestyleSchema = z.object({
  sleep_hours: z.string().min(1),
  stress_level: z.enum(['low', 'moderate', 'high']),
  work_schedule: z.string().optional(),
});
export const activitySchema = z.object({
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  preferred_activities: z.string().optional(),
});

export const dietStyleSchema = z.enum([
  'standard',
  'keto',
  'paleo',
  'low_carb',
  'carb_cycle',
  'mediterranean',
  'carnivore',
]);

export const nutritionProfileSchema = z.object({
  current_weight_lb: z.number().positive().optional(),
  goal_weight_lb: z.number().positive().optional(),
  meals_per_day: z.union([z.literal(3), z.literal(4), z.literal(5), z.literal(6)]).optional(),
  day_start_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Use a valid time like 07:00')
    .optional(),
  diet_style: dietStyleSchema.optional(),
  protein_foods: z.array(z.string()).optional(),
  carb_foods: z.array(z.string()).optional(),
  fat_foods: z.array(z.string()).optional(),
  meal_selections: z.record(z.string()).optional(),
  setup_completed: z.boolean().optional(),
});

export const authSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Enter your name').optional(),
});

export type OnboardingStepData = {
  engagement_tier?: z.infer<typeof engagementTierSchema>;
  reminder_preset?: z.infer<typeof reminderPresetSchema>;
  goals?: z.infer<typeof goalsSchema>;
  health_history?: z.infer<typeof healthHistorySchema>;
  dietary_prefs?: z.infer<typeof dietaryPrefsSchema>;
  food_likes?: z.infer<typeof foodLikesSchema>;
  nutrition_profile?: NutritionProfile;
  lifestyle?: z.infer<typeof lifestyleSchema>;
  activity?: z.infer<typeof activitySchema>;
};

export const ONBOARDING_STEPS = [
  'welcome',
  'engagement',
  'reminders',
  'goals',
  'health',
  'diet',
  'food',
  'body_metrics',
  'macro_foods',
  'diet_style',
  'meal_schedule',
  'lifestyle',
  'activity',
  'summary',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
