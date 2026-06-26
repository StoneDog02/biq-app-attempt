import { useMemo } from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { filterPrograms } from '@/src/data/programs';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function ProgramsScreen() {
  const { user } = useAuth();
  const { data: intake, isLoading } = useQuery({
    queryKey: ['intake', user?.id],
    queryFn: () => loadIntakeProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const programs = useMemo(() => filterPrograms(intake ?? null), [intake]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Programs matched to your activity level and goals — templates to explore, not strict prescriptions.
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} />
        ) : (
          programs.map((program) => (
            <Link key={program.id} href={`/fitness/program/${program.id}`} asChild>
              <Pressable>
                <Card
                  title={program.name}
                  subtitle={`${program.durationWeeks} weeks · ${program.daysPerWeek} days/week`}
                  style={styles.card}
                >
                  <Text style={styles.tagline}>{program.tagline}</Text>
                </Card>
              </Pressable>
            </Link>
          ))
        )}
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
  card: {
    marginBottom: spacing.sm,
  },
  tagline: {
    color: colors.gray[100],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
