import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { HabitStepper } from '@/src/components/habits/HabitStepper';
import {
  getHabitStatusLabel,
  usesWaterStepper,
  type HabitConfig,
} from '@/src/services/habitProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { HabitLog } from '@/src/types/database';

type HabitRowProps = {
  habit: HabitConfig;
  log?: HabitLog;
  isDone: boolean;
  isSaving: boolean;
  isLightTier: boolean;
  isLast: boolean;
  onToggle: () => void;
  onAdjustValue?: (value: number) => void;
};

function HabitToggleButton({
  isDone,
  disabled,
  onPress,
}: {
  isDone: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.toggleButton,
        isDone && styles.toggleButtonDone,
        disabled && styles.toggleButtonDisabled,
        pressed && styles.toggleButtonPressed,
      ]}
      hitSlop={4}
    >
      {isDone ? (
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          tintColor={colors.white}
          size={16}
        />
      ) : null}
    </Pressable>
  );
}

export function HabitRow({
  habit,
  log,
  isDone,
  isSaving,
  isLightTier,
  isLast,
  onToggle,
  onAdjustValue,
}: HabitRowProps) {
  const showStepper = usesWaterStepper(habit, isLightTier);
  const statusLabel = getHabitStatusLabel(habit, log, isDone);
  const waterValue = log?.value ?? 0;

  const renderRightAction = () => {
    if (isSaving) {
      return (
        <View style={styles.rightAction}>
          <ActivityIndicator color={colors.copper.base} size="small" />
        </View>
      );
    }

    if (showStepper && onAdjustValue) {
      return (
        <View style={styles.rightAction}>
          <HabitStepper
            value={waterValue}
            unit={habit.unit}
            disabled={isSaving}
            onChange={onAdjustValue}
          />
        </View>
      );
    }

    return (
      <View style={styles.rightAction}>
        <HabitToggleButton isDone={isDone} disabled={isSaving} onPress={onToggle} />
      </View>
    );
  };

  const rowInner = (
    <View style={[styles.row, isDone && styles.rowDone, !isLast && styles.rowBorder]}>
      {isDone ? <View style={styles.doneAccent} /> : null}
      <View style={[styles.iconWrap, isDone && styles.iconWrapDone]}>
        <SymbolView
          name={habit.icon}
          tintColor={isDone ? colors.copper.base : colors.gray[500]}
          size={20}
        />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.label, isDone && styles.labelDone]}>{habit.label}</Text>
        <Text style={[styles.status, isDone && styles.statusDone]}>{statusLabel}</Text>
      </View>
      {renderRightAction()}
    </View>
  );

  if (showStepper) {
    return rowInner;
  }

  return (
    <Pressable
      onPress={onToggle}
      disabled={isSaving}
      style={({ pressed }) => [styles.pressableWrap, pressed && styles.rowPressed]}
    >
      {rowInner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableWrap: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  rowDone: {
    opacity: 0.85,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 118, 99, 0.12)',
  },
  rowPressed: {
    opacity: 0.9,
  },
  doneAccent: {
    position: 'absolute',
    left: 0,
    top: spacing.sm,
    bottom: spacing.sm,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.copper.base,
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
  iconWrapDone: {
    backgroundColor: 'rgba(195, 118, 99, 0.12)',
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
  labelDone: {
    color: colors.gray[100],
  },
  status: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  statusDone: {
    color: colors.copper.light,
  },
  rightAction: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.copper.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(195, 118, 99, 0.08)',
  },
  toggleButtonDone: {
    backgroundColor: colors.copper.base,
    borderColor: colors.copper.base,
  },
  toggleButtonDisabled: {
    opacity: 0.5,
  },
  toggleButtonPressed: {
    opacity: 0.75,
  },
});
