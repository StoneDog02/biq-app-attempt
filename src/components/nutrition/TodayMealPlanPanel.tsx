import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export type MealPlanRowData = {
  title: string;
  description: string;
  time?: string;
  macros?: string;
};

type MealPlanRowProps = {
  meal: MealPlanRowData;
  isLast: boolean;
};

export function MealPlanRow({ meal, isLast }: MealPlanRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          {meal.time ? <Text style={styles.time}>{meal.time}</Text> : null}
          <Text style={styles.label}>{meal.title}</Text>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {meal.description}
        </Text>
      </View>
    </View>
  );
}

type TodayMealPlanPanelProps = {
  meals: MealPlanRowData[];
};

export function TodayMealPlanPanel({ meals }: TodayMealPlanPanelProps) {
  if (!meals.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your plan for today</Text>
      <View style={styles.container}>
        {meals.map((meal, index) => (
          <MealPlanRow key={`${meal.title}-${index}`} meal={meal} isLast={index === meals.length - 1} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
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
  row: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 118, 99, 0.12)',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  time: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  label: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  description: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});
