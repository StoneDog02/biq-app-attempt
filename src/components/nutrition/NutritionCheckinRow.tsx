import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { CheckinOption } from '@/src/services/nutritionProgress';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type NutritionCheckinRowProps = {
  option: CheckinOption;
  selected: boolean;
  isSaving: boolean;
  isLast: boolean;
  onSelect: () => void;
};

function ToggleButton({
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

export function NutritionCheckinRow({
  option,
  selected,
  isSaving,
  isLast,
  onSelect,
}: NutritionCheckinRowProps) {
  const rowInner = (
    <View style={[styles.row, selected && styles.rowDone, !isLast && styles.rowBorder]}>
      {selected ? <View style={styles.doneAccent} /> : null}
      <View style={[styles.iconWrap, selected && styles.iconWrapDone]}>
        <SymbolView
          name={option.icon}
          tintColor={selected ? colors.copper.base : colors.gray[500]}
          size={20}
        />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.label, selected && styles.labelDone]}>{option.label}</Text>
        <Text style={[styles.status, selected && styles.statusDone]}>{option.hint}</Text>
      </View>
      <View style={styles.rightAction}>
        {isSaving ? (
          <ActivityIndicator color={colors.copper.base} size="small" />
        ) : (
          <ToggleButton isDone={selected} disabled={isSaving} onPress={onSelect} />
        )}
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onSelect}
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
    minWidth: 32,
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
