import { useMemo, useState } from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { searchExercises } from '@/src/data/exercises';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function ExercisesScreen() {
  const [query, setQuery] = useState('');
  const exercises = useMemo(() => searchExercises(query), [query]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>Technique notes for common movements. Demo videos coming soon.</Text>
        <Input
          label="Search exercises"
          value={query}
          onChangeText={setQuery}
          placeholder="Squat, core, cardio..."
        />
        {exercises.map((exercise) => (
          <Link key={exercise.id} href={`/fitness/exercise/${exercise.id}`} asChild>
            <Pressable>
              <Card
                title={exercise.name}
                subtitle={`${exercise.muscleGroups.join(', ')} · ${exercise.equipment}`}
                style={styles.card}
              />
            </Pressable>
          </Link>
        ))}
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
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  card: {
    marginBottom: spacing.sm,
  },
});
