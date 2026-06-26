import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { updateProfileSettings } from '@/src/services/profile';
import { setupUserNotifications } from '@/src/services/notifications';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { EngagementTier, ReminderPreset, TrackingLevel } from '@/src/types/database';

const ENGAGEMENT_OPTIONS: { value: EngagementTier; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high_touch', label: 'High-touch' },
];

const REMINDER_OPTIONS: { value: ReminderPreset; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'active', label: 'Active' },
];

const TRACKING_OPTIONS: { value: TrackingLevel; label: string; description: string }[] = [
  { value: 1, label: 'Simple check-in', description: 'One daily question — no numbers' },
  { value: 2, label: 'Quick meal log', description: 'Log meals with optional calories' },
  { value: 3, label: 'Photo & voice', description: 'Scan, photo estimates, voice notes' },
  { value: 4, label: 'Full macros', description: 'Daily macro targets and grid' },
  { value: 5, label: 'Detailed nutrients', description: 'Power-user nutrient breakdown' },
];

export default function ProfileScreen() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [engagement, setEngagement] = useState<EngagementTier>(
    profile?.engagement_tier ?? 'moderate'
  );
  const [reminder, setReminder] = useState<ReminderPreset>(
    profile?.reminder_preset ?? 'balanced'
  );
  const [trackingLevel, setTrackingLevel] = useState<TrackingLevel>(
    profile?.tracking_level ?? 1
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateProfileSettings(user.id, {
        engagement_tier: engagement,
        reminder_preset: reminder,
        tracking_level: trackingLevel,
      });
      await setupUserNotifications(user.id, reminder);
      await refreshProfile();
      setMessage('Settings saved. Reminders updated.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{profile?.full_name ?? 'Profile'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Card title="Care & wellness" subtitle="Shop, portal, telehealth, and supplement check-in">
          <View style={styles.careLinks}>
            <Link href="/(tabs)/care" asChild>
              <Pressable style={styles.linkChip}>
                <Text style={styles.linkText}>Supplements check-in</Text>
              </Pressable>
            </Link>
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
        </Card>

        <Card title="Nutrition setup" subtitle="Weight, favorite foods, and meal schedule for your plan">
          <Link href="/nutrition/setup" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Update meal plan</Text>
            </Pressable>
          </Link>
        </Card>

        <Card title="Engagement level" subtitle="How involved should BODYiQ be?">
          <View style={styles.options}>
            {ENGAGEMENT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setEngagement(opt.value)}
                style={[styles.chip, engagement === opt.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, engagement === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card title="Reminder frequency" subtitle="Quiet hours: 10pm – 7am">
          <View style={styles.options}>
            {REMINDER_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setReminder(opt.value)}
                style={[styles.chip, reminder === opt.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, reminder === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card title="Food tracking detail" subtitle="Choose how much detail you want — you can change anytime.">
          <View style={styles.trackingList}>
            {TRACKING_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setTrackingLevel(opt.value)}
                style={[styles.trackingRow, trackingLevel === opt.value && styles.trackingRowActive]}
              >
                <Text style={[styles.trackingLabel, trackingLevel === opt.value && styles.trackingLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.trackingDescription}>{opt.description}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Button title="Save Settings" onPress={handleSave} loading={saving} />
        <View style={styles.spacer} />
        <Button title="Sign Out" variant="secondary" onPress={signOut} />
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
  },
  email: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
  },
  careLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.copper.base,
    fontWeight: '600',
  },
  trackingList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  trackingRow: {
    borderWidth: 1,
    borderColor: colors.gray[900],
    borderRadius: 12,
    padding: spacing.md,
  },
  trackingRowActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.1)',
  },
  trackingLabel: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackingLabelActive: {
    color: colors.copper.base,
  },
  trackingDescription: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
  },
  message: {
    color: colors.copper.light,
    marginVertical: spacing.md,
  },
  spacer: {
    height: spacing.md,
  },
});
