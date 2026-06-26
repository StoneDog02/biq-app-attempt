import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Input } from '@/src/components/ui/Input';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { NutritionProfile } from '@/src/types/database';
import {
  PROTEIN_FOOD_OPTIONS,
  CARB_FOOD_OPTIONS,
  FAT_FOOD_OPTIONS,
  MEALS_PER_DAY_OPTIONS,
} from '@/src/data/macroFoodOptions';
import {
  DAY_START_OPTIONS,
  DEFAULT_DAY_START_TIME,
  MEAL_TIMING_FOOTNOTE,
  buildMealTimes,
} from '@/src/data/mealTiming';
import { DIET_STYLE_OPTIONS } from '@/src/data/dietStyles';
import type { DietStyle } from '@/src/types/database';

type BodyMetricsFormProps = {
  profile: NutritionProfile;
  onChange: (partial: Partial<NutritionProfile>) => void;
};

export function BodyMetricsForm({ profile, onChange }: BodyMetricsFormProps) {
  const [currentWeight, setCurrentWeight] = useState(
    profile.current_weight_lb ? String(profile.current_weight_lb) : ''
  );
  const [goalWeight, setGoalWeight] = useState(
    profile.goal_weight_lb ? String(profile.goal_weight_lb) : ''
  );

  useEffect(() => {
    if (profile.current_weight_lb !== undefined) {
      setCurrentWeight(String(profile.current_weight_lb));
    }
  }, [profile.current_weight_lb]);

  useEffect(() => {
    if (profile.goal_weight_lb !== undefined) {
      setGoalWeight(String(profile.goal_weight_lb));
    }
  }, [profile.goal_weight_lb]);

  const commitWeight = (field: 'current_weight_lb' | 'goal_weight_lb', text: string) => {
    const digits = text.replace(/\D/g, '');
    const value = digits ? Number(digits) : undefined;
    onChange({ [field]: value });
  };

  return (
    <View>
      <Text style={styles.title}>Your body metrics</Text>
      <Text style={styles.subtitle}>
        We use this to estimate daily calories and macro targets — not medical advice.
      </Text>
      <Input
        label="Current weight (lb)"
        keyboardType="numeric"
        value={currentWeight}
        onChangeText={(text) => {
          setCurrentWeight(text.replace(/\D/g, ''));
          commitWeight('current_weight_lb', text);
        }}
        placeholder="180"
      />
      <Input
        label="Goal weight (lb)"
        keyboardType="numeric"
        value={goalWeight}
        onChangeText={(text) => {
          setGoalWeight(text.replace(/\D/g, ''));
          commitWeight('goal_weight_lb', text);
        }}
        placeholder="165"
      />
    </View>
  );
}

type FoodChipPickerProps = {
  title: string;
  hint: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export function FoodChipPicker({ title, hint, options, selected, onChange }: FoodChipPickerProps) {
  const [custom, setCustom] = useState('');
  const [extraOptions, setExtraOptions] = useState<string[]>(() =>
    selected.filter((food) => !options.includes(food))
  );

  useEffect(() => {
    const fromSelected = selected.filter((food) => !options.includes(food));
    setExtraOptions((prev) => {
      const next = [...prev];
      for (const food of fromSelected) {
        if (!next.includes(food)) next.push(food);
      }
      return next;
    });
  }, [options, selected]);

  const chipOptions = useMemo(
    () => [...options, ...extraOptions.filter((food) => !options.includes(food))],
    [options, extraOptions]
  );

  const toggle = (food: string) => {
    if (selected.includes(food)) {
      onChange(selected.filter((f) => f !== food));
    } else {
      onChange([...selected, food]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;

    const presetMatch = options.find((food) => food.toLowerCase() === trimmed.toLowerCase());
    const food = presetMatch ?? trimmed;

    if (!presetMatch && !extraOptions.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setExtraOptions((prev) => [...prev, food]);
    }
    if (!selected.includes(food)) {
      onChange([...selected, food]);
    }
    setCustom('');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionHint}>{hint}</Text>
      <View style={styles.chipRow}>
        {chipOptions.map((food) => (
          <Pressable
            key={food}
            onPress={() => toggle(food)}
            style={[styles.chip, selected.includes(food) && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected.includes(food) && styles.chipTextActive]}>
              {food}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.customRow}>
        <Input
          label="Add your own"
          value={custom}
          onChangeText={setCustom}
          placeholder="e.g. Ground turkey"
          style={styles.customInput}
        />
        <Pressable onPress={addCustom} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

type MacroFoodsFormProps = {
  profile: NutritionProfile;
  onChange: (partial: Partial<NutritionProfile>) => void;
};

export function MacroFoodsForm({ profile, onChange }: MacroFoodsFormProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Foods you enjoy</Text>
      <Text style={styles.subtitle}>Pick favorites in each category — we build meals around these.</Text>
      <FoodChipPicker
        title="Proteins"
        hint="Pick at least one"
        options={PROTEIN_FOOD_OPTIONS}
        selected={profile.protein_foods ?? []}
        onChange={(protein_foods) => onChange({ protein_foods })}
      />
      <FoodChipPicker
        title="Carbs"
        hint="Pick at least one"
        options={CARB_FOOD_OPTIONS}
        selected={profile.carb_foods ?? []}
        onChange={(carb_foods) => onChange({ carb_foods })}
      />
      <FoodChipPicker
        title="Fats"
        hint="Pick at least one"
        options={FAT_FOOD_OPTIONS}
        selected={profile.fat_foods ?? []}
        onChange={(fat_foods) => onChange({ fat_foods })}
      />
    </ScrollView>
  );
}

type MealScheduleFormProps = {
  profile: NutritionProfile;
  onChange: (partial: Partial<NutritionProfile>) => void;
};

const MEAL_SLOT_LABELS: Record<number, string[]> = {
  3: ['Breakfast', 'Lunch', 'Dinner'],
  4: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
  5: ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner'],
  6: ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner', 'Snack'],
};

type DietStyleFormProps = {
  profile: NutritionProfile;
  onChange: (partial: Partial<NutritionProfile>) => void;
};

export function DietStyleForm({ profile, onChange }: DietStyleFormProps) {
  return (
    <View>
      <Text style={styles.title}>Your diet style</Text>
      <Text style={styles.subtitle}>
        This shapes your macro targets and how we pair your favorite foods into meals.
      </Text>
      <View style={styles.dietOptions}>
        {DIET_STYLE_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => onChange({ diet_style: option.id as DietStyle })}
            style={[styles.dietOption, profile.diet_style === option.id && styles.dietOptionActive]}
          >
            <Text
              style={[
                styles.dietOptionTitle,
                profile.diet_style === option.id && styles.dietOptionTitleActive,
              ]}
            >
              {option.label}
            </Text>
            <Text style={styles.dietOptionDesc}>{option.description}</Text>
            <Text style={styles.dietOptionHint}>{option.macroHint}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function MealScheduleForm({ profile, onChange }: MealScheduleFormProps) {
  const dayStart = profile.day_start_time ?? DEFAULT_DAY_START_TIME;

  useEffect(() => {
    if (profile.meals_per_day && !profile.day_start_time) {
      onChange({ day_start_time: DEFAULT_DAY_START_TIME });
    }
  }, [profile.meals_per_day, profile.day_start_time, onChange]);

  const timedSlots =
    profile.meals_per_day && dayStart
      ? buildMealTimes(
          { ...profile, day_start_time: dayStart, meals_per_day: profile.meals_per_day },
          MEAL_SLOT_LABELS[profile.meals_per_day] ?? MEAL_SLOT_LABELS[3]
        )
      : [];

  const selectMealsPerDay = (count: (typeof MEALS_PER_DAY_OPTIONS)[number]) => {
    onChange({
      meals_per_day: count,
      day_start_time: profile.day_start_time ?? DEFAULT_DAY_START_TIME,
    });
  };

  return (
    <View>
      <Text style={styles.title}>Meals per day</Text>
      <Text style={styles.subtitle}>How many times do you want to eat each day?</Text>
      <View style={styles.mealOptions}>
        {MEALS_PER_DAY_OPTIONS.map((count) => (
          <Pressable
            key={count}
            onPress={() => selectMealsPerDay(count)}
            style={[styles.mealOption, profile.meals_per_day === count && styles.mealOptionActive]}
          >
            <Text
              style={[
                styles.mealOptionText,
                profile.meals_per_day === count && styles.mealOptionTextActive,
              ]}
            >
              {count} meals
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, styles.scheduleSectionTitle]}>When your day starts</Text>
      <Text style={styles.sectionHint}>
        We use this as your anchor — first meal ~1 hour later, then spaced so your body can digest
        and blood sugar can settle between eating windows.
      </Text>
      <View style={styles.chipRow}>
        {DAY_START_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onChange({ day_start_time: option.value })}
            style={[styles.chip, dayStart === option.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, dayStart === option.value && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {profile.meals_per_day && dayStart ? (
        <View style={styles.timingPreview}>
          <Text style={styles.timingPreviewTitle}>Suggested timing for today</Text>
          {timedSlots.map((slot) => (
            <View key={`${slot.title}-${slot.time24}`} style={styles.timingPreviewRow}>
              <Text style={styles.timingPreviewTime}>{slot.timeLabel}</Text>
              <View style={styles.timingPreviewCopy}>
                <Text style={styles.timingPreviewLabel}>{slot.title}</Text>
                <Text style={styles.timingPreviewNote}>{slot.timingNote}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.timingFootnote}>{MEAL_TIMING_FOOTNOTE}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionHint: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.15)',
  },
  chipText: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
  },
  chipTextActive: {
    color: colors.copper.base,
    fontWeight: '600',
  },
  customRow: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  customInput: {
    marginBottom: 0,
  },
  addButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.copper.base,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    color: colors.copper.base,
    fontWeight: '600',
  },
  mealOptions: {
    gap: spacing.sm,
  },
  mealOption: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 12,
    padding: spacing.md,
  },
  mealOptionActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.12)',
  },
  mealOptionText: {
    color: colors.gray[500],
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  mealOptionTextActive: {
    color: colors.copper.base,
  },
  dietOptions: {
    gap: spacing.sm,
  },
  dietOption: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 12,
    padding: spacing.md,
  },
  dietOptionActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.12)',
  },
  dietOptionTitle: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  dietOptionTitleActive: {
    color: colors.copper.base,
  },
  dietOptionDesc: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  dietOptionHint: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  scheduleSectionTitle: {
    marginTop: spacing.lg,
  },
  timingPreview: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: 'rgba(195, 118, 99, 0.06)',
  },
  timingPreviewTitle: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  timingPreviewRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  timingPreviewTime: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '700',
    width: 72,
  },
  timingPreviewCopy: {
    flex: 1,
  },
  timingPreviewLabel: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  timingPreviewNote: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  timingFootnote: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});
