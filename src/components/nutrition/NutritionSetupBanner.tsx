import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export function NutritionSetupBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Set up your meal plan</Text>
      <Text style={styles.subtitle}>
        Add your weight, favorite foods, and meal schedule to get personalized daily targets and meals.
      </Text>
      <Link href="/nutrition/setup" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.copper.base,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.copper.base,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
