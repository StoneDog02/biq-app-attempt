import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type CardProps = ViewProps & {
  title?: string;
  subtitle?: string;
  subtitleNumberOfLines?: number;
};

export function Card({ title, subtitle, subtitleNumberOfLines, children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={subtitleNumberOfLines}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.15)',
  },
  title: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
});
