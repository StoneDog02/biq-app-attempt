import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { getExerciseById } from '@/src/data/exercises';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = getExerciseById(String(id));

  if (!exercise) {
    return (
      <Screen>
        <Card title="Exercise not found" subtitle="Try another movement from the library." />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.muscleGroups.join(' · ')} · {exercise.equipment}
        </Text>

        <Card title="Demo video" style={styles.card}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>Demo video coming soon</Text>
            <Text style={styles.videoSub}>Real-person technique demos are on the roadmap.</Text>
          </View>
        </Card>

        <Card title="Technique cues">
          {exercise.technique.map((cue) => (
            <Text key={cue} style={styles.cue}>
              • {cue}
            </Text>
          ))}
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
  name: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  meta: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  videoPlaceholder: {
    backgroundColor: colors.gray[900],
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.2)',
  },
  videoText: {
    color: colors.copper.light,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  videoSub: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  cue: {
    color: colors.gray[100],
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
});
