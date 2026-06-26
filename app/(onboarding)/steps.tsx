import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ProgressStepper } from '@/src/components/ui/ProgressStepper';
import { useOnboardingStore } from '@/src/hooks/useOnboardingStore';
import { useAuth } from '@/src/hooks/useAuth';
import { saveIntakeProgress } from '@/src/services/profile';
import { ONBOARDING_STEPS } from '@/src/types/onboarding';
import {
  BodyMetricsForm,
  MacroFoodsForm,
  DietStyleForm,
  MealScheduleForm,
} from '@/src/components/nutrition/setup/NutritionSetupForms';
import type { NutritionProfile } from '@/src/types/database';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

const ENGAGEMENT_OPTIONS = [
  { value: 'light' as const, label: 'Light', desc: 'Weekly check-ins, minimal nudges' },
  { value: 'moderate' as const, label: 'Moderate', desc: 'Daily plan summary + reminders' },
  { value: 'high_touch' as const, label: 'High-touch', desc: 'More frequent accountability' },
];

const REMINDER_OPTIONS = [
  { value: 'minimal' as const, label: 'Minimal', desc: 'Once daily' },
  { value: 'balanced' as const, label: 'Balanced', desc: 'Morning + evening' },
  { value: 'active' as const, label: 'Active', desc: 'Three touchpoints daily' },
];

function OptionCard({
  label,
  desc,
  selected,
  onPress,
}: {
  label: string;
  desc: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.optionDesc}>{desc}</Text>
    </Pressable>
  );
}

export default function OnboardingStepsScreen() {
  const { user } = useAuth();
  const { currentStepIndex, data, updateData, nextStep, prevStep, setStepIndex } =
    useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const step = ONBOARDING_STEPS[currentStepIndex];
  const totalSteps = ONBOARDING_STEPS.length - 1; // exclude welcome from counter display

  const persist = async (nextIndex: number) => {
    if (!user) return;
    setSaving(true);
    try {
      const latestData = useOnboardingStore.getState().data;
      await saveIntakeProgress(user.id, latestData, nextIndex);
    } catch (e) {
      console.warn('Save intake progress failed', e);
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    setError(null);

    if (step === 'engagement' && !data.engagement_tier) {
      setError('Choose your engagement level');
      return;
    }
    if (step === 'reminders' && !data.reminder_preset) {
      setError('Choose your reminder frequency');
      return;
    }
    if (step === 'goals' && !data.goals?.primary_goal?.trim()) {
      setError('Tell us your primary goal');
      return;
    }
    if (step === 'diet' && !data.dietary_prefs?.diet_type?.trim()) {
      setError('Share your dietary preferences');
      return;
    }
    if (step === 'food' && !data.food_likes?.likes?.trim()) {
      setError('Share a few foods you enjoy');
      return;
    }
    if (step === 'body_metrics') {
      const np = data.nutrition_profile;
      if (!np?.current_weight_lb || !np?.goal_weight_lb) {
        setError('Enter your current and goal weight');
        return;
      }
    }
    if (step === 'macro_foods') {
      const np = data.nutrition_profile;
      if (
        !(np?.protein_foods?.length ?? 0) ||
        !(np?.carb_foods?.length ?? 0) ||
        !(np?.fat_foods?.length ?? 0)
      ) {
        setError('Pick at least one food in each category');
        return;
      }
    }
    if (step === 'diet_style' && !data.nutrition_profile?.diet_style) {
      setError('Choose a diet style for your meal plan');
      return;
    }
    if (step === 'meal_schedule') {
      const np = data.nutrition_profile;
      if (!np?.meals_per_day) {
        setError('Choose how many meals you want per day');
        return;
      }
      if (!np?.day_start_time) {
        setError('Choose when your day typically starts');
        return;
      }
    }
    if (step === 'lifestyle' && !data.lifestyle?.sleep_hours?.trim()) {
      setError('Tell us about your sleep');
      return;
    }
    if (step === 'activity' && !data.activity?.activity_level) {
      setError('Select your activity level');
      return;
    }

    if (step === 'activity') {
      await persist(currentStepIndex + 1);
      router.push('/(onboarding)/summary');
      return;
    }

    if (step === 'summary') {
      router.push('/(onboarding)/summary');
      return;
    }

    const nextIndex = currentStepIndex + 1;
    nextStep();
    await persist(nextIndex);
  };

  const goBack = () => {
    if (currentStepIndex <= 1) {
      router.back();
      return;
    }
    prevStep();
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <ProgressStepper
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              label="Building your profile"
            />

            {step === 'engagement' && (
              <>
                <Text style={styles.title}>How involved should we be?</Text>
                <Text style={styles.subtitle}>You control the intensity — change this anytime.</Text>
                {ENGAGEMENT_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={data.engagement_tier === opt.value}
                    onPress={() => updateData({ engagement_tier: opt.value })}
                  />
                ))}
              </>
            )}

            {step === 'reminders' && (
              <>
                <Text style={styles.title}>Reminder frequency</Text>
                <Text style={styles.subtitle}>No notification fatigue — you set the pace.</Text>
                {REMINDER_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={data.reminder_preset === opt.value}
                    onPress={() => updateData({ reminder_preset: opt.value })}
                  />
                ))}
              </>
            )}

            {step === 'goals' && (
              <>
                <Text style={styles.title}>Your goals</Text>
                <Input
                  label="Primary goal"
                  value={data.goals?.primary_goal ?? ''}
                  onChangeText={(primary_goal) =>
                    updateData({ goals: { ...data.goals, primary_goal } as never })
                  }
                  placeholder="e.g. Lose weight sustainably, improve energy"
                />
                <Input
                  label="Other goals (optional)"
                  value={data.goals?.secondary_goals ?? ''}
                  onChangeText={(secondary_goals) =>
                    updateData({ goals: { ...data.goals, secondary_goals } as never })
                  }
                  placeholder="Anything else you're working toward"
                />
              </>
            )}

            {step === 'health' && (
              <>
                <Text style={styles.title}>Health history</Text>
                <Input
                  label="Conditions (optional)"
                  value={data.health_history?.conditions ?? ''}
                  onChangeText={(conditions) =>
                    updateData({ health_history: { ...data.health_history, conditions } as never })
                  }
                  placeholder="Any relevant conditions"
                />
                <Input
                  label="Medications (optional)"
                  value={data.health_history?.medications ?? ''}
                  onChangeText={(medications) =>
                    updateData({ health_history: { ...data.health_history, medications } as never })
                  }
                />
                <Input
                  label="Allergies (optional)"
                  value={data.health_history?.allergies ?? ''}
                  onChangeText={(allergies) =>
                    updateData({ health_history: { ...data.health_history, allergies } as never })
                  }
                />
              </>
            )}

            {step === 'diet' && (
              <>
                <Text style={styles.title}>Dietary preferences</Text>
                <Input
                  label="How do you typically eat?"
                  value={data.dietary_prefs?.diet_type ?? ''}
                  onChangeText={(diet_type) =>
                    updateData({ dietary_prefs: { ...data.dietary_prefs, diet_type } as never })
                  }
                  placeholder="e.g. Mostly whole foods, low carb, vegetarian"
                />
                <Input
                  label="Restrictions (optional)"
                  value={data.dietary_prefs?.restrictions ?? ''}
                  onChangeText={(restrictions) =>
                    updateData({ dietary_prefs: { ...data.dietary_prefs, restrictions } as never })
                  }
                />
              </>
            )}

            {step === 'food' && (
              <>
                <Text style={styles.title}>Food likes & dislikes</Text>
                <Input
                  label="Foods you enjoy"
                  value={data.food_likes?.likes ?? ''}
                  onChangeText={(likes) =>
                    updateData({ food_likes: { ...data.food_likes, likes } as never })
                  }
                  placeholder="Common favorites help us personalize meals"
                />
                <Input
                  label="Foods you avoid (optional)"
                  value={data.food_likes?.dislikes ?? ''}
                  onChangeText={(dislikes) =>
                    updateData({ food_likes: { ...data.food_likes, dislikes } as never })
                  }
                />
              </>
            )}

            {step === 'body_metrics' && (
              <BodyMetricsForm
                profile={data.nutrition_profile ?? {}}
                onChange={(partial) =>
                  updateData({
                    nutrition_profile: {
                      ...(data.nutrition_profile ?? {}),
                      ...partial,
                    } as NutritionProfile,
                  })
                }
              />
            )}

            {step === 'macro_foods' && (
              <MacroFoodsForm
                profile={data.nutrition_profile ?? {}}
                onChange={(partial) =>
                  updateData({
                    nutrition_profile: {
                      ...(data.nutrition_profile ?? {}),
                      ...partial,
                    } as NutritionProfile,
                  })
                }
              />
            )}

            {step === 'diet_style' && (
              <DietStyleForm
                profile={data.nutrition_profile ?? {}}
                onChange={(partial) =>
                  updateData({
                    nutrition_profile: {
                      ...(data.nutrition_profile ?? {}),
                      ...partial,
                    } as NutritionProfile,
                  })
                }
              />
            )}

            {step === 'meal_schedule' && (
              <MealScheduleForm
                profile={data.nutrition_profile ?? {}}
                onChange={(partial) =>
                  updateData({
                    nutrition_profile: {
                      ...(data.nutrition_profile ?? {}),
                      ...partial,
                    } as NutritionProfile,
                  })
                }
              />
            )}

            {step === 'lifestyle' && (
              <>
                <Text style={styles.title}>Lifestyle</Text>
                <Input
                  label="Average sleep (hours)"
                  value={data.lifestyle?.sleep_hours ?? ''}
                  onChangeText={(sleep_hours) =>
                    updateData({ lifestyle: { ...data.lifestyle, sleep_hours } as never })
                  }
                  placeholder="e.g. 7"
                  keyboardType="numeric"
                />
                <Text style={styles.fieldLabel}>Stress level</Text>
                {(['low', 'moderate', 'high'] as const).map((level) => (
                  <OptionCard
                    key={level}
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                    desc=""
                    selected={data.lifestyle?.stress_level === level}
                    onPress={() =>
                      updateData({
                        lifestyle: { ...data.lifestyle, stress_level: level, sleep_hours: data.lifestyle?.sleep_hours ?? '' } as never,
                      })
                    }
                  />
                ))}
              </>
            )}

            {step === 'activity' && (
              <>
                <Text style={styles.title}>Activity level</Text>
                {(
                  [
                    ['sedentary', 'Mostly sitting'],
                    ['light', 'Light movement most days'],
                    ['moderate', 'Regular exercise 3–4x/week'],
                    ['active', 'Active 5+ days/week'],
                    ['very_active', 'Training or athletics daily'],
                  ] as const
                ).map(([value, desc]) => (
                  <OptionCard
                    key={value}
                    label={value.replace('_', ' ')}
                    desc={desc}
                    selected={data.activity?.activity_level === value}
                    onPress={() =>
                      updateData({ activity: { activity_level: value } as never })
                    }
                  />
                ))}
              </>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <Button title="Back" variant="ghost" onPress={goBack} />
              <Button
                title={step === 'activity' ? 'Review Summary' : 'Continue'}
                onPress={goNext}
                loading={saving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.base,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    color: colors.white,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.gray[900],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.gray[900],
  },
  optionSelected: {
    borderColor: colors.copper.base,
  },
  optionLabel: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  optionDesc: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  error: {
    color: '#ef4444',
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
