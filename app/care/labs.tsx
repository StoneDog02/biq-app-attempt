import { useState } from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useLabReports } from '@/src/hooks/useCare';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function LabsScreen() {
  const { data: reports, isLoading } = useLabReports();
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = () => {
    setMessage('Upload storage coming soon — you will be able to add PDF lab results here.');
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Longevity reports from your lab panels — upload results and review biomarkers with your
          care team.
        </Text>

        <Button title="Upload lab PDF" onPress={handleUpload} />
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Text style={styles.sectionTitle}>Your reports</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} />
        ) : reports && reports.length > 0 ? (
          reports.map((report) => (
            <Link key={report.id} href={`/care/lab/${report.id}`} asChild>
              <Pressable>
                <Card
                  title={report.title}
                  subtitle={`${report.report_date} · ${report.status}`}
                  style={styles.card}
                />
              </Pressable>
            </Link>
          ))
        ) : (
          <Card
            title="No reports yet"
            subtitle="Upload a lab PDF or ask your care team about the Longevity panel."
          />
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
  message: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
});
