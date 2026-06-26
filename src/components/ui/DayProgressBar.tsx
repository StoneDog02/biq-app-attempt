import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type DayProgressBarProps = {
  fraction: number;
  label: string;
  subtitle?: string;
};

export function DayProgressBar({ fraction, label, subtitle }: DayProgressBarProps) {
  return (
    <View style={styles.progressBox}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(fraction * 100)}%` }]} />
      </View>
      {subtitle ? <Text style={styles.progressSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  progressBox: {
    marginBottom: spacing.sm,
  },
  progressLabel: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.gray[900],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.copper.base,
    borderRadius: 3,
  },
  progressSubtitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
