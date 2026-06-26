import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { getProductById, PRODUCT_CATEGORY_LABELS } from '@/src/data/products';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(String(id));

  if (!product) {
    return (
      <Screen>
        <Card title="Product not found" subtitle="Head back and pick another product." />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{product.title}</Text>
        <Text style={styles.category}>
          {PRODUCT_CATEGORY_LABELS[product.category]} · {product.priceDisplay}
        </Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.ingredients ? (
          <Card title="Ingredients / details" style={styles.card}>
            <Text style={styles.ingredients}>{product.ingredients}</Text>
          </Card>
        ) : null}

        <View style={styles.stubBox}>
          <Button title="Checkout coming soon" onPress={() => undefined} />
          <Text style={styles.stubNote}>
            Shopify checkout will connect here — browse and learn about products for now.
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
  category: {
    color: colors.copper.light,
    marginBottom: spacing.md,
  },
  description: {
    color: colors.gray[100],
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  ingredients: {
    color: colors.gray[100],
    lineHeight: 22,
  },
  stubBox: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  stubNote: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
