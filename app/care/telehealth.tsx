import { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function TelehealthScreen() {
  const [message, setMessage] = useState<string | null>(null);

  const handleStartVisit = () => {
    setMessage('CareValidate integration coming soon — your care team will notify you when visits are available.');
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Talk to a licensed clinician from home — for wellness questions, medication reviews, and
          eligibility for programs like GLP-1 when clinically appropriate.
        </Text>

        <Card title="When to use telehealth" style={styles.card}>
          <Text style={styles.bullet}>• Questions about your supplement or medication plan</Text>
          <Text style={styles.bullet}>• Discussing lab results with your care team</Text>
          <Text style={styles.bullet}>• Exploring GLP-1 or peptide programs with a clinician</Text>
          <Text style={styles.bullet}>• Annual wellness check-ins</Text>
        </Card>

        <Card title="What to expect" style={styles.card}>
          <Text style={styles.body}>
            Visits are typically 15–20 minutes by video. You'll review your intake, current plan,
            and any labs. Recommendations follow the truth-and-light principle — only what's right
            for you.
          </Text>
        </Card>

        <View style={styles.actions}>
          <Link href="/care/shop" asChild>
            <Pressable style={styles.linkChip}>
              <Text style={styles.linkText}>Browse GLP-1 & peptide options</Text>
            </Pressable>
          </Link>

          <Button title="Start a visit" onPress={handleStartVisit} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
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
  intro: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  card: {
    marginBottom: spacing.sm,
  },
  bullet: {
    color: colors.gray[100],
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  body: {
    color: colors.gray[100],
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  linkChip: {
    alignSelf: 'flex-start',
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
  message: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
