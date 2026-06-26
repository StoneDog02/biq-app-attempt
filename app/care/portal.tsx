import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { getPortalData } from '@/src/data/portal';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function PortalScreen() {
  const portal = getPortalData();

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Your care overview — prescriptions, subscriptions, and visit history in one place.
        </Text>

        <Card title="Current plan" style={styles.card}>
          <Text style={styles.body}>{portal.planSummary}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Prescriptions</Text>
        {portal.prescriptions.map((rx) => (
          <Card
            key={rx.id}
            title={rx.name}
            subtitle={rx.dosage}
            style={styles.card}
          >
            <Text style={styles.meta}>
              {rx.refillsRemaining} refill{rx.refillsRemaining !== 1 ? 's' : ''} left · Next:{' '}
              {rx.nextRefillDate}
            </Text>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Subscriptions</Text>
        {portal.subscriptions.map((sub) => (
          <Card
            key={sub.id}
            title={sub.name}
            subtitle={`${sub.priceDisplay} · ${sub.status}`}
            style={styles.card}
          >
            <Text style={styles.meta}>Next shipment: {sub.nextShipment}</Text>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Service history</Text>
        {portal.serviceHistory.map((item) => (
          <Card
            key={item.id}
            title={item.type}
            subtitle={item.date}
            style={styles.card}
          >
            <Text style={styles.body}>{item.summary}</Text>
          </Card>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Connected to your care team — live data coming soon.
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
  intro: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.gray[100],
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[900],
  },
  footerText: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
