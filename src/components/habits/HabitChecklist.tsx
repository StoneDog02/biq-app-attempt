import { StyleSheet, View } from 'react-native';
import { HabitRow } from '@/src/components/habits/HabitRow';
import { HABITS } from '@/src/services/habitProgress';
import { colors } from '@/src/theme/tokens';
import type { HabitLog } from '@/src/types/database';

type HabitChecklistProps = {
  todayLogs: Partial<Record<HabitLog['habit_type'], HabitLog>>;
  isLightTier: boolean;
  savingType: HabitLog['habit_type'] | null;
  onToggle: (type: HabitLog['habit_type'], defaultValue: number) => void;
  onAdjustWater: (value: number) => void;
};

export function HabitChecklist({
  todayLogs,
  isLightTier,
  savingType,
  onToggle,
  onAdjustWater,
}: HabitChecklistProps) {
  return (
    <View style={styles.container}>
      {HABITS.map((habit, index) => {
        const log = todayLogs[habit.type];
        const isDone = Boolean(log?.completed);

        return (
          <HabitRow
            key={habit.type}
            habit={habit}
            log={log}
            isDone={isDone}
            isSaving={savingType === habit.type}
            isLightTier={isLightTier}
            isLast={index === HABITS.length - 1}
            onToggle={() => onToggle(habit.type, habit.defaultValue)}
            onAdjustValue={habit.type === 'water' ? onAdjustWater : undefined}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.15)',
    overflow: 'hidden',
  },
});
