import { StyleSheet, View } from 'react-native';
import { NutritionCheckinRow } from '@/src/components/nutrition/NutritionCheckinRow';
import { CHECKIN_OPTIONS } from '@/src/services/nutritionProgress';
import { colors } from '@/src/theme/tokens';
import type { CheckinStatus } from '@/src/types/database';

type NutritionCheckinPanelProps = {
  selectedStatus: CheckinStatus | null | undefined;
  savingStatus: CheckinStatus | null;
  onSelect: (status: CheckinStatus) => void;
};

export function NutritionCheckinPanel({
  selectedStatus,
  savingStatus,
  onSelect,
}: NutritionCheckinPanelProps) {
  return (
    <View style={styles.container}>
      {CHECKIN_OPTIONS.map((option, index) => (
        <NutritionCheckinRow
          key={option.value}
          option={option}
          selected={selectedStatus === option.value}
          isSaving={savingStatus === option.value}
          isLast={index === CHECKIN_OPTIONS.length - 1}
          onSelect={() => onSelect(option.value)}
        />
      ))}
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
