export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type CheckinStatus = 'on_plan' | 'mostly' | 'off_plan';
export type FoodLogSource = 'manual' | 'barcode' | 'photo' | 'voice';
export type WorkoutType = 'strength' | 'cardio' | 'mobility' | 'sport' | 'other';
export type WorkoutLogSource = 'manual' | 'program' | 'healthkit';
export type SupplementLogSource = 'manual' | 'plan' | 'reminder';
export type LabReportStatus = 'pending' | 'ready';
export type ProductCategory = 'supplements' | 'tests' | 'glp1' | 'peptides';

export type FoodLog = {
  id: string;
  user_id: string;
  log_date: string;
  meal_type: MealType | null;
  checkin_status: CheckinStatus | null;
  name: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  source: FoodLogSource;
  completed_checkin: boolean;
  created_at: string;
};

export type WorkoutLog = {
  id: string;
  user_id: string;
  log_date: string;
  checkin_status: CheckinStatus | null;
  workout_type: WorkoutType | null;
  title: string | null;
  duration_minutes: number | null;
  notes: string | null;
  source: WorkoutLogSource;
  completed_checkin: boolean;
  created_at: string;
};

export type SupplementLog = {
  id: string;
  user_id: string;
  log_date: string;
  checkin_status: CheckinStatus | null;
  product_id: string | null;
  title: string | null;
  notes: string | null;
  source: SupplementLogSource;
  completed_checkin: boolean;
  created_at: string;
};

export type LabReport = {
  id: string;
  user_id: string;
  report_date: string;
  title: string;
  status: LabReportStatus;
  summary_json: Record<string, unknown>;
  file_path: string | null;
  created_at: string;
};

export type EngagementTier = 'light' | 'moderate' | 'high_touch';
export type ReminderPreset = 'minimal' | 'balanced' | 'active';
export type TrackingLevel = 1 | 2 | 3 | 4 | 5;

export type MealsPerDay = 3 | 4 | 5 | 6;

export type DietStyle =
  | 'standard'
  | 'keto'
  | 'paleo'
  | 'low_carb'
  | 'carb_cycle'
  | 'mediterranean'
  | 'carnivore';

export type NutritionProfile = {
  current_weight_lb?: number;
  goal_weight_lb?: number;
  meals_per_day?: MealsPerDay;
  /** 24h time when the user's day begins, e.g. "07:00" */
  day_start_time?: string;
  diet_style?: DietStyle;
  protein_foods?: string[];
  carb_foods?: string[];
  fat_foods?: string[];
  /** User-selected recipe id per slot title, e.g. { Breakfast: "bfast-yogurt-bowl" } */
  meal_selections?: Record<string, string>;
  setup_completed?: boolean;
};

export type Profile = {
  id: string;
  full_name: string | null;
  engagement_tier: EngagementTier;
  reminder_preset: ReminderPreset;
  tracking_level: TrackingLevel;
  intake_completed: boolean;
  locale: string;
  created_at: string;
  updated_at: string;
};

export type IntakeResponses = {
  id: string;
  user_id: string;
  goals: Record<string, unknown>;
  health_history: Record<string, unknown>;
  dietary_prefs: Record<string, unknown>;
  food_likes: Record<string, unknown>;
  nutrition_profile?: NutritionProfile;
  lifestyle: Record<string, unknown>;
  activity: Record<string, unknown>;
  current_step: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyPlan = {
  id: string;
  user_id: string;
  plan_date: string;
  habits: PlanItem[];
  workouts: PlanItem[];
  meals: PlanItem[];
  supplements: PlanItem[];
  coach_message: string | null;
  created_at: string;
};

export type PlanItem = {
  id: string;
  title: string;
  description?: string;
  scheduled_time?: string;
  recipe_id?: string;
  completed?: boolean;
};

export type HabitLog = {
  id: string;
  user_id: string;
  habit_type: 'water' | 'steps' | 'stretching';
  log_date: string;
  value: number;
  completed: boolean;
  created_at: string;
};

export type ReminderSettings = {
  id: string;
  user_id: string;
  channel: 'push';
  frequency: ReminderPreset;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
  enabled: boolean;
  push_token: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      intake_responses: {
        Row: IntakeResponses;
        Insert: Partial<IntakeResponses> & { user_id: string };
        Update: Partial<IntakeResponses>;
      };
      daily_plans: {
        Row: DailyPlan;
        Insert: Partial<DailyPlan> & { user_id: string; plan_date: string };
        Update: Partial<DailyPlan>;
      };
      habit_logs: {
        Row: HabitLog;
        Insert: Partial<HabitLog> & { user_id: string; habit_type: HabitLog['habit_type']; log_date: string };
        Update: Partial<HabitLog>;
      };
      food_logs: {
        Row: FoodLog;
        Insert: Partial<FoodLog> & { user_id: string; log_date: string };
        Update: Partial<FoodLog>;
      };
      workout_logs: {
        Row: WorkoutLog;
        Insert: Partial<WorkoutLog> & { user_id: string; log_date: string };
        Update: Partial<WorkoutLog>;
      };
      supplement_logs: {
        Row: SupplementLog;
        Insert: Partial<SupplementLog> & { user_id: string; log_date: string };
        Update: Partial<SupplementLog>;
      };
      lab_reports: {
        Row: LabReport;
        Insert: Partial<LabReport> & { user_id: string; report_date: string; title: string };
        Update: Partial<LabReport>;
      };
      reminder_settings: {
        Row: ReminderSettings;
        Insert: Partial<ReminderSettings> & { user_id: string };
        Update: Partial<ReminderSettings>;
      };
    };
  };
};
