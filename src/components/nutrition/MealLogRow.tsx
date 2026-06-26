import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { getMealTypeIcon } from '@/src/services/nutritionProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { FoodLog } from '@/src/types/database';

type MealLogRowProps = {
  meal: FoodLog;
  isLast: boolean;
};

export function MealLogRow({ meal, isLast }: MealLogRowProps) {
  const mealType = meal.meal_type ?? 'lunch';
  const subtitle = [
    mealType.charAt(0).toUpperCase() + mealType.slice(1),
    meal.calories ? `${meal.calories} cal` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.iconWrap}>
        <SymbolView name={getMealTypeIcon(mealType)} tintColor={colors.copper.base} size={18} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label} numberOfLines={1}>
          {meal.name ?? 'Meal'}
        </Text>
        <Text style={styles.status}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    width: '100%',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 118, 99, 0.12)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  status: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
