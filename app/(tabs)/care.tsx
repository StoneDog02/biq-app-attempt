import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { useTodayPlan } from '@/src/hooks/usePlan';
import {
  useLogSupplement,
  useSaveSupplementDailyCheckin,
  useSupplementDailyCheckin,
  useTodaySupplementLogs,
} from '@/src/hooks/useCare';
import { CHECKIN_LABELS } from '@/src/services/nutrition';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { CheckinStatus, PlanItem, TrackingLevel } from '@/src/types/database';

const CHECKIN_OPTIONS: { value: CheckinStatus; label: string }[] = [
  { value: 'on_plan', label: 'On plan' },
  { value: 'mostly', label: 'Mostly' },
  { value: 'off_plan', label: 'Off plan' },
];

export default function CareScreen() {
  const { profile } = useAuth();
  const trackingLevel = (profile?.tracking_level ?? 1) as TrackingLevel;
  const { data: checkin, isLoading: checkinLoading } = useSupplementDailyCheckin();
  const { data: logs, isLoading: logsLoading } = useTodaySupplementLogs();
  const { data: plan } = useTodayPlan();
  const saveCheckin = useSaveSupplementDailyCheckin();
  const logSupplement = useLogSupplement();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const planSupplements = (plan?.supplements as PlanItem[] | undefined) ?? [];
  const itemLogs = logs?.filter((l) => l.title && !l.checkin_status) ?? [];
  const isLoading = checkinLoading || logsLoading;

  const handleCheckin = (status: CheckinStatus) => {
    setMessage(null);
    saveCheckin.mutate(status, {
      onSuccess: () => setMessage('Saved for today.'),
      onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not save check-in'),
    });
  };

  const handleLogFromPlan = (item: PlanItem) => {
    setMessage(null);
    logSupplement.mutate(
      { title: item.title, source: 'plan' },
      {
        onSuccess: () => setMessage(`${item.title} logged.`),
        onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not log supplement'),
      }
    );
  };

  const handleLogCustom = () => {
    if (!title.trim()) {
      setMessage('Add a supplement name to log.');
      return;
    }
    setMessage(null);
    logSupplement.mutate(
      { title: title.trim(), notes: notes.trim() || null },
      {
        onSuccess: () => {
          setTitle('');
          setNotes('');
          setMessage('Supplement logged.');
        },
        onError: (e) => setMessage(e instanceof Error ? e.message : 'Could not log supplement'),
      }
    );
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}
          style={styles.backRow}
          hitSlop={8}
        >
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={colors.copper.base}
            size={20}
          />
          <Text style={styles.backLabel}>Profile</Text>
        </Pressable>

        <Text style={styles.title}>Care</Text>
        <Text style={styles.subtitle}>
          {trackingLevel <= 1
            ? 'One quick check-in on supplements is enough.'
            : 'Log what you took today — tap from your plan or add your own.'}
        </Text>

        <View style={styles.links}>
          <Link href="/care/shop" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Browse products</Text>
            </Pressable>
          </Link>
          <Link href="/care/portal" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Patient portal</Text>
            </Pressable>
          </Link>
          <Link href="/care/telehealth" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Telehealth</Text>
            </Pressable>
          </Link>
          {trackingLevel >= 2 ? (
            <Link href="/care/labs" asChild>
              <Pressable style={styles.linkChip}>
                <Text style={styles.linkText}>Longevity reports</Text>
              </Pressable>
            </Link>
          ) : null}
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} style={styles.loader} />
        ) : trackingLevel <= 1 ? (
          <Card title="How did supplements go today?" subtitle="Honest check-ins help your care team support you.">
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
            {planSupplements.length > 0 ? (
              <Card title="From today's plan" subtitle="Tap to log">
                <View style={styles.planList}>
                  {planSupplements.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => handleLogFromPlan(item)}
                      style={styles.planItem}
                      disabled={logSupplement.isPending}
                    >
                      <Text style={styles.planTitle}>{item.title}</Text>
                      {item.description ? (
                        <Text style={styles.planDesc}>{item.description}</Text>
                      ) : null}
                    </Pressable>
                  ))}
                </View>
              </Card>
            ) : null}

            <Card title="Quick supplement log">
              <Input
                label="What did you take?"
                value={title}
                onChangeText={setTitle}
                placeholder="Omega-3"
              />
              <Input
                label="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                placeholder="With lunch"
              />
              <Button
                title="Log supplement"
                onPress={handleLogCustom}
                loading={logSupplement.isPending}
              />
            </Card>

            {itemLogs.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Logged today</Text>
                {itemLogs.map((log) => (
                  <Card
                    key={log.id}
                    title={log.title ?? 'Supplement'}
                    subtitle={log.notes ?? undefined}
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backLabel: {
    color: colors.copper.base,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: 2,
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
  planList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  planItem: {
    borderWidth: 1,
    borderColor: colors.gray[900],
    borderRadius: 8,
    padding: spacing.sm,
  },
  planTitle: {
    color: colors.white,
    fontWeight: '600',
  },
  planDesc: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: 2,
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
