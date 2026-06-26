import { useMemo, useState } from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator, Pressable, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { filterProducts, matchesPlan, PRODUCT_CATEGORY_LABELS } from '@/src/data/products';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { ProductCategory } from '@/src/types/database';

const CATEGORIES: (ProductCategory | 'all')[] = ['all', 'supplements', 'tests', 'glp1', 'peptides'];

export default function ShopScreen() {
  const { user } = useAuth();
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');

  const { data: intake, isLoading } = useQuery({
    queryKey: ['intake', user?.id],
    queryFn: () => loadIntakeProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const products = useMemo(
    () => filterProducts(intake ?? null, category),
    [intake, category]
  );

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Products matched to your plan when relevant — browse freely, no pressure to buy.
        </Text>

        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, category === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat === 'all' ? 'All' : PRODUCT_CATEGORY_LABELS[cat]}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} />
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/care/product/${product.id}`} asChild>
              <Pressable>
                <Card
                  title={product.title}
                  subtitle={`${PRODUCT_CATEGORY_LABELS[product.category]} · ${product.priceDisplay}`}
                  style={styles.card}
                >
                  <Text style={styles.description}>{product.description}</Text>
                  {matchesPlan(product, intake ?? null) ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Matches your plan</Text>
                    </View>
                  ) : null}
                </Card>
              </Pressable>
            </Link>
          ))
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  card: {
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.gray[100],
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(195, 118, 99, 0.2)',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
