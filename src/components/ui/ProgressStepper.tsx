import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type ProgressStepperProps = {
  currentStep: number;
  totalSteps: number;
  label?: string;
};

export function ProgressStepper({ currentStep, totalSteps, label }: ProgressStepperProps) {
  const progress = Math.min(currentStep / totalSteps, 1);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  track: {
    height: 4,
    backgroundColor: colors.gray[900],
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.copper.base,
    borderRadius: 2,
  },
  stepText: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
