import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type HabitStepperProps = {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function HabitStepper({
  value,
  min = 0,
  max = 20,
  unit,
  disabled,
  onChange,
}: HabitStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={decrement}
        disabled={disabled || value <= min}
        style={({ pressed }) => [
          styles.stepButton,
          (disabled || value <= min) && styles.stepButtonDisabled,
          pressed && styles.stepButtonPressed,
        ]}
        hitSlop={4}
      >
        <Text style={styles.stepButtonText}>−</Text>
      </Pressable>
      <View style={styles.valueBlock}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <Pressable
        onPress={increment}
        disabled={disabled || value >= max}
        style={({ pressed }) => [
          styles.stepButton,
          (disabled || value >= max) && styles.stepButtonDisabled,
          pressed && styles.stepButtonPressed,
        ]}
        hitSlop={4}
      >
        <Text style={styles.stepButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.copper.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(195, 118, 99, 0.08)',
  },
  stepButtonDisabled: {
    opacity: 0.35,
  },
  stepButtonPressed: {
    opacity: 0.7,
  },
  stepButtonText: {
    color: colors.copper.base,
    fontSize: fontSize.lg,
    fontWeight: '600',
    lineHeight: 22,
  },
  valueBlock: {
    alignItems: 'center',
    minWidth: 36,
  },
  value: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '700',
    lineHeight: 20,
  },
  unit: {
    color: colors.gray[500],
    fontSize: 10,
    lineHeight: 12,
  },
});
