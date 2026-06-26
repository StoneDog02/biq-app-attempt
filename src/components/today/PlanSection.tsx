import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Card } from '@/src/components/ui/Card';
import { DomainStatusBadge } from '@/src/components/today/DomainStatusBadge';
import type { DomainSectionStatus } from '@/src/services/planSectionOrder';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { PlanItem } from '@/src/types/database';
import type { PlanSectionKey } from '@/src/services/profile';

type ActionLink = { label: string; href: string };

type PlanSectionProps = {
  title: string;
  items: PlanItem[];
  status: DomainSectionStatus;
  section: PlanSectionKey;
  onToggle: (section: PlanSectionKey, itemId: string, completed: boolean) => void;
  actionLink?: ActionLink;
  embedded?: boolean;
};

export function PlanSection({
  title,
  items,
  status,
  section,
  onToggle,
  actionLink,
  embedded = false,
}: PlanSectionProps) {
  if (!items?.length && !actionLink) return null;

  return (
    <View style={[styles.section, embedded && styles.sectionEmbedded]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionHeaderRight}>
          <DomainStatusBadge status={status} actionLink={actionLink} />
        </View>
      </View>
      {items.map((item) => (
        <Pressable key={item.id} onPress={() => onToggle(section, item.id, !item.completed)}>
          <Card
            title={item.title}
            subtitle={item.description}
            subtitleNumberOfLines={2}
            style={[styles.card, item.completed && styles.cardDone]}
          >
            {item.completed ? (
              <View style={styles.completedRow}>
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  tintColor={colors.copper.base}
                  size={20}
                />
                <Text style={styles.completedText}>Done</Text>
              </View>
            ) : null}
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionEmbedded: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardDone: {
    opacity: 0.85,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  completedText: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
