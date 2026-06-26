import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import {
  useLogWorkout,
  useSaveWorkoutDailyCheckin,
  useTodayWorkoutLogs,
  useWorkoutDailyCheckin,
} from '@/src/hooks/useFitness';
import { CHECKIN_LABELS } from '@/src/services/nutrition';
import { WORKOUT_TYPE_LABELS } from '@/src/services/fitness';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { CheckinStatus, TrackingLevel, WorkoutType } from '@/src/types/database';

const CHECKIN_OPTIONS: { value: CheckinStatus; label: string }[] = [
  { value: 'on_plan', label: 'On plan' },
  { value: 'mostly', label: 'Mostly' },
  { value: 'off_plan', label: 'Off plan' },
];

const WORKOUT_TYPES: { value: WorkoutType; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'sport', label: 'Sport' },
  { value: 'other', label: 'Other' },
];

export default function FitnessScreen() {
  const { profile } = useAuth();
  const trackingLevel = (profile?.tracking_level ?? 1) as TrackingLevel;
  const { data: checkin, isLoading: checkinLoading } = useWorkoutDailyCheckin();
  const { data: logs, isLoading: logsLoading } = useTodayWorkoutLogs();
  const saveCheckin = useSaveWorkoutDailyCheckin();
  const logWorkout = useLogWorkout();

  const [workoutType, setWorkoutType] = useState<WorkoutType>('strength');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const sessionLogs = logs?.filter((l) => l.workout_type) ?? [];
  const totalMinutes = sessionLogs.reduce((sum, l) => sum + (Number(l.duration_minutes) || 0), 0);
  const isLoading = checkinLoading || logsLoading;

  const handleCheckin = (status: CheckinStatus) => {
    setMessage(null);
    saveCheckin.mutate(status, {
      onSuccess: () => setMessage('Saved for today.'),
      onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not save check-in'),
    });
  };

  const handleLogWorkout = () => {
    if (!title.trim()) {
      setMessage('Add a workout name to log.');
      return;
    }
    setMessage(null);
    logWorkout.mutate(
      {
        workout_type: workoutType,
        title: title.trim(),
        duration_minutes: duration ? Number(duration) : null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDuration('');
          setMessage('Workout logged.');
        },
        onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not log workout'),
      }
    );
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Fitness</Text>
        <Text style={styles.subtitle}>
          {trackingLevel <= 1
            ? 'One quick check-in on movement is enough.'
            : 'Log sessions in seconds — duration optional.'}
        </Text>

        <View style={styles.links}>
          <Link href="/fitness/programs" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Browse programs</Text>
            </Pressable>
          </Link>
          <Link href="/fitness/exercises" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Exercise library</Text>
            </Pressable>
          </Link>
          {trackingLevel >= 2 ? (
            <Link href="/fitness/recovery" asChild>
              <Pressable style={styles.linkChip}>
                <Text style={styles.linkText}>Recovery</Text>
              </Pressable>
            </Link>
          ) : null}
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} style={styles.loader} />
        ) : trackingLevel <= 1 ? (
          <Card title="How did movement go today?" subtitle="Honest check-ins help your coach support you.">
            <View style={styles.options}>
              {CHECKIN_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => handleCheckin(opt.value)}
                  style={[styles.chip, checkin?.checkin_status === opt.value && styles.chipActive]}
                  disabled={saveCheckin.isPending}
                >
                  <Text
                    style={[
                      styles.chipText,
                      checkin?.checkin_status === opt.value && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {checkin?.checkin_status ? (
              <Text style={styles.savedLabel}>Today: {CHECKIN_LABELS[checkin.checkin_status]}</Text>
            ) : null}
          </Card>
        ) : (
          <>
            <Card title="Quick workout log">
              <View style={styles.typeRow}>
                {WORKOUT_TYPES.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => setWorkoutType(type.value)}
                    style={[styles.chip, workoutType === type.value && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        workoutType === type.value && styles.chipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Input
                label="What did you do?"
                value={title}
                onChangeText={setTitle}
                placeholder="Upper body strength"
              />
              <Input
                label="Duration in minutes (optional)"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="30"
              />
              <Button title="Log workout" onPress={handleLogWorkout} loading={logWorkout.isPending} />
            </Card>

            {totalMinutes > 0 ? (
              <Text style={styles.total}>Today: {totalMinutes} min logged</Text>
            ) : null}

            {sessionLogs.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's sessions</Text>
                {sessionLogs.map((session) => (
                  <Card
                    key={session.id}
                    title={session.title ?? 'Workout'}
                    subtitle={`${WORKOUT_TYPE_LABELS[session.workout_type!]}${session.duration_minutes ? ` · ${session.duration_minutes} min` : ''}`}
                    style={styles.sessionCard}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.base,
    marginBottom: spacing.md,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  linkChip: {
    borderWidth: 1,
    borderColor: colors.copper.base,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  linkText: {
    color: colors.copper.base,
    fontWeight: '600',
  },
  loader: {
    marginTop: spacing.lg,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.15)',
  },
  chipText: {
    color: colors.gray[500],
  },
  chipTextActive: {
    color: colors.copper.base,
    fontWeight: '600',
  },
  savedLabel: {
    color: colors.copper.light,
    marginTop: spacing.md,
  },
  total: {
    color: colors.copper.light,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  sessionCard: {
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.copper.light,
    marginTop: spacing.md,
  },
});
