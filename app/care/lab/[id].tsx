import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { useLabReport } from '@/src/hooks/useCare';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type Biomarker = {
  name: string;
  value: string;
  status: string;
  note: string;
};

export default function LabDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: report, isLoading } = useLabReport(String(id));

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.copper.base} />
      </Screen>
    );
  }

  if (!report) {
    return (
      <Screen>
        <Card title="Report not found" subtitle="Head back and pick another report." />
      </Screen>
    );
  }

  const summary = report.summary_json as {
    coachNote?: string;
    biomarkers?: Biomarker[];
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{report.title}</Text>
        <Text style={styles.meta}>
          {report.report_date} · {report.status}
        </Text>

        {summary.coachNote ? (
          <Card title="Coach note" style={styles.card}>
            <Text style={styles.body}>{summary.coachNote}</Text>
          </Card>
        ) : null}

        <Text style={styles.sectionTitle}>Biomarkers</Text>
        {(summary.biomarkers ?? []).map((marker) => (
          <Card key={marker.name} title={marker.name} subtitle={marker.value} style={styles.card}>
            <View style={styles.statusRow}>
              <Text style={styles.status}>{marker.status}</Text>
            </View>
            <Text style={styles.note}>{marker.note}</Text>
          </Card>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Clinician review and PDF viewing coming soon.
          </Text>
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
  meta: {
    color: colors.copper.light,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.gray[100],
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  statusRow: {
    marginTop: spacing.xs,
  },
  status: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  note: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[900],
  },
  footerText: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
