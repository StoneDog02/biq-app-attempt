import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { MEAL_TYPE_OPTIONS } from '@/src/services/nutritionProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MealType } from '@/src/types/database';

type MealLogPanelProps = {
  mealType: MealType;
  mealName: string;
  calories: string;
  isSaving: boolean;
  onMealTypeChange: (type: MealType) => void;
  onMealNameChange: (name: string) => void;
  onCaloriesChange: (calories: string) => void;
  onSubmit: () => void;
};

export function MealLogPanel({
  mealType,
  mealName,
  calories,
  isSaving,
  onMealTypeChange,
  onMealNameChange,
  onCaloriesChange,
  onSubmit,
}: MealLogPanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.panelTitle}>Quick meal log</Text>
      <View style={styles.mealTypeRow}>
        {MEAL_TYPE_OPTIONS.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => onMealTypeChange(type.value)}
            style={[styles.chip, mealType === type.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, mealType === type.value && styles.chipTextActive]}>
              {type.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Input
        label="What did you eat?"
        value={mealName}
        onChangeText={onMealNameChange}
        placeholder="Grilled chicken salad"
        style={styles.input}
      />
      <Input
        label="Calories (optional)"
        value={calories}
        onChangeText={onCaloriesChange}
        keyboardType="numeric"
        placeholder="450"
        style={styles.inputLast}
      />
      <Button title="Add meal" onPress={onSubmit} loading={isSaving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.15)',
    padding: spacing.md,
  },
  panelTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  mealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
  input: {
    marginBottom: spacing.sm,
  },
  inputLast: {
    marginBottom: spacing.md,
  },
});
