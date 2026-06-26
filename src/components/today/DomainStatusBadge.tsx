import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { DomainSectionStatus } from '@/src/services/planSectionOrder';

type ActionLink = { label: string; href: string };

type DomainStatusBadgeProps = {
  status: DomainSectionStatus;
  actionLink?: ActionLink;
};

function ProgressDots({ total, completedCount }: { total: number; completedCount: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i < completedCount ? styles.dotFilled : styles.dotEmpty]}
        />
      ))}
    </View>
  );
}

function BadgeContent({
  status,
  actionLink,
}: {
  status: DomainSectionStatus;
  actionLink?: ActionLink;
}) {
  const { completedCount, total, done, detailLabel } = status;

  return (
    <View style={[styles.chip, done ? styles.chipDone : styles.chipDefault]}>
      {actionLink ? <Text style={styles.logLabel}>{actionLink.label}</Text> : null}

      <ProgressDots total={total} completedCount={completedCount} />

      {done ? (
        <View style={styles.doneRow}>
          <SymbolView
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            tintColor={colors.copper.base}
            size={12}
          />
          <Text style={styles.fractionDone}>
            {detailLabel && completedCount < total ? detailLabel : 'All set'}
          </Text>
        </View>
      ) : completedCount > 0 ? (
        <Text style={styles.fraction}>{`${completedCount} of ${total}`}</Text>
      ) : null}
    </View>
  );
}

export function DomainStatusBadge({ status, actionLink }: DomainStatusBadgeProps) {
  if (actionLink) {
    return (
      <Link href={actionLink.href as '/(tabs)/habits'} asChild>
        <Pressable style={styles.pressable} hitSlop={4}>
          <BadgeContent status={status} actionLink={actionLink} />
        </Pressable>
      </Link>
    );
  }

  return <BadgeContent status={status} />;
}

const styles = StyleSheet.create({
  pressable: {
    flexShrink: 0,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: 4,
    minWidth: 72,
  },
  chipDefault: {
    backgroundColor: 'rgba(195, 118, 99, 0.08)',
    borderWidth: 1,
    borderColor: colors.copper.base,
  },
  chipDone: {
    backgroundColor: 'rgba(195, 118, 99, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.35)',
  },
  logLabel: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '600',
    lineHeight: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotFilled: {
    backgroundColor: colors.copper.base,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[500],
  },
  fraction: {
    color: colors.copper.light,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fractionDone: {
    color: colors.copper.light,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
});
