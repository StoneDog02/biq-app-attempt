import { StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme/tokens';

type HabitHistoryDotsProps = {
  completed: boolean[];
};

export function HabitHistoryDots({ completed }: HabitHistoryDotsProps) {
  return (
    <View style={styles.dots}>
      {completed.map((done, i) => (
        <View key={i} style={[styles.dot, done ? styles.dotFilled : styles.dotEmpty]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotFilled: {
    backgroundColor: colors.copper.base,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[500],
  },
});
