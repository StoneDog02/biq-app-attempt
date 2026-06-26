import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

const MUSCLE_REGIONS = [
  { id: 'chest', label: 'Chest', level: 'low' },
  { id: 'shoulders', label: 'Shoulders', level: 'moderate' },
  { id: 'back', label: 'Back', level: 'low' },
  { id: 'core', label: 'Core', level: 'moderate' },
  { id: 'quads', label: 'Quads', level: 'high' },
  { id: 'hamstrings', label: 'Hamstrings', level: 'moderate' },
  { id: 'glutes', label: 'Glutes', level: 'low' },
  { id: 'calves', label: 'Calves', level: 'low' },
];

function levelColor(level: string) {
  if (level === 'high') return 'rgba(195, 118, 99, 0.85)';
  if (level === 'moderate') return 'rgba(195, 118, 99, 0.45)';
  return 'rgba(195, 118, 99, 0.15)';
}

export default function RecoveryScreen() {
  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Recovery heat map — placeholder data. Apple Health and Google Fit sync coming in a future update.
        </Text>

        <Card title="Muscle recovery map" subtitle="Mock view based on typical training load">
          <View style={styles.grid}>
            {MUSCLE_REGIONS.map((region) => (
              <View
                key={region.id}
                style={[styles.region, { backgroundColor: levelColor(region.level) }]}
              >
                <Text style={styles.regionLabel}>{region.label}</Text>
                <Text style={styles.regionLevel}>{region.level} load</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="Connect your data">
          <Text style={styles.body}>
            When HealthKit / Google Fit integration ships, this screen will reflect steps, sleep, and workout
            load to help you recover smarter — not harder.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  intro: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  region: {
    width: '47%',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.25)',
  },
  regionLabel: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  regionLevel: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textTransform: 'capitalize',
  },
  body: {
    color: colors.gray[100],
    lineHeight: 22,
  },
});
