import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MacroTargets } from '@/src/services/macroCalculator';

type MacroSummaryCardProps = {
  targets: MacroTargets;
};

export function MacroSummaryCard({ targets }: MacroSummaryCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Daily targets{targets.dietLabel ? ` · ${targets.dietLabel}` : ''}
      </Text>
      <Text style={styles.calories}>{targets.calories} cal</Text>
      <View style={styles.macroRow}>
        <MacroPill label="Protein" value={`${targets.protein_g}g`} />
        <MacroPill label="Carbs" value={`${targets.carbs_g}g`} />
        <MacroPill label="Fat" value={`${targets.fat_g}g`} />
      </View>
    </View>
  );
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
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
    marginBottom: spacing.md,
  },
  label: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  calories: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    backgroundColor: colors.black,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  pillValue: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  pillLabel: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
