import { StyleSheet, Text, View } from 'react-native';
import { MealLogRow } from '@/src/components/nutrition/MealLogRow';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { FoodLog } from '@/src/types/database';

type MealLogListProps = {
  meals: FoodLog[];
};

export function MealLogList({ meals }: MealLogListProps) {
  if (meals.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today&apos;s meals</Text>
      <View style={styles.container}>
        {meals.map((meal, index) => (
          <MealLogRow key={meal.id} meal={meal} isLast={index === meals.length - 1} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  container: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.15)',
    overflow: 'hidden',
  },
});
