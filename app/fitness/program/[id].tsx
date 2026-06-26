import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { getProgramById } from '@/src/data/programs';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = getProgramById(String(id));

  if (!program) {
    return (
      <Screen>
        <Card title="Program not found" subtitle="Head back and pick another program." />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{program.name}</Text>
        <Text style={styles.tagline}>{program.tagline}</Text>
        <Text style={styles.meta}>
          {program.durationWeeks} weeks · {program.daysPerWeek} days per week
        </Text>

        <Card title="Sample week" style={styles.card}>
          {program.sampleWeek.map((line) => (
            <Text key={line} style={styles.weekLine}>
              {line}
            </Text>
          ))}
        </Card>

        <View style={styles.stubBox}>
          <Button title="Start program" onPress={() => undefined} />
          <Text style={styles.stubNote}>Program enrollment coming soon — explore the sample week for now.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  name: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.gray[500],
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  meta: {
    color: colors.copper.light,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  weekLine: {
    color: colors.gray[100],
    marginBottom: spacing.xs,
  },
  stubBox: {
    gap: spacing.sm,
  },
  stubNote: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
