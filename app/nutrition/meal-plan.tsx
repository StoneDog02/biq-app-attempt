import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { loadIntakeProgress } from '@/src/services/profile';
import { buildWeeklyMealSuggestions, getFilteredGuides } from '@/src/services/mealPlanner';
import { colors, fontSize, spacing } from '@/src/theme/tokens';

type Tab = 'ideas' | 'guides';

export default function MealPlanScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const initialTab: Tab = tab === 'guides' ? 'guides' : 'ideas';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const { user } = useAuth();

  const { data: intake, isLoading } = useQuery({
    queryKey: ['intake', user?.id],
    queryFn: () => loadIntakeProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const suggestions = useMemo(() => buildWeeklyMealSuggestions(intake ?? null), [intake]);
  const guides = useMemo(() => getFilteredGuides(intake ?? null), [intake]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setActiveTab('ideas')}
            style={[styles.tab, activeTab === 'ideas' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'ideas' && styles.tabTextActive]}>Meal ideas</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('guides')}
            style={[styles.tab, activeTab === 'guides' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'guides' && styles.tabTextActive]}>Eating out</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.copper.base} />
        ) : activeTab === 'ideas' ? (
          <>
            <Text style={styles.intro}>
              Weekly meals based on your intake — suggestions tied to your macro targets when set up.
            </Text>
            {suggestions.map((day) => (
              <Card key={day.id} title={day.dayLabel} style={styles.card}>
                {day.dailyMacros ? (
                  <Text style={styles.dailyMacros}>{day.dailyMacros}</Text>
                ) : null}
                {day.meals.map((meal) => (
                  <View key={`${meal.title}-${meal.time ?? ''}`} style={styles.mealBlock}>
                    <Text style={styles.mealLine}>
                      {meal.time ? `${meal.time} · ${meal.title}` : meal.title}: {meal.recipeName}
                    </Text>
                    {(meal.ingredientLines ?? []).map((line) => (
                      <Text key={line} style={styles.mealIngredient}>
                        • {line}
                      </Text>
                    ))}
                    <Text style={styles.mealMacros}>{meal.macros}</Text>
                  </View>
                ))}
                <Text style={styles.note}>{day.note}</Text>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.intro}>
              Chain picks filtered by your preferences. Calories are estimates — check menus when ordering.
            </Text>
            {guides.map((guide) => (
              <View key={guide.id} style={styles.guideSection}>
                <Text style={styles.guideTitle}>{guide.name}</Text>
                <Text style={styles.guideTagline}>{guide.tagline}</Text>
                {guide.items.map((item) => (
                  <Card
                    key={item.id}
                    title={item.name}
                    subtitle={`${item.calories} cal · ${item.protein}g protein`}
                    style={styles.card}
                  />
                ))}
              </View>
            ))}
          </>
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
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[900],
    alignItems: 'center',
  },
  tabActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.12)',
  },
  tabText: {
    color: colors.gray[500],
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.copper.base,
  },
  intro: {
    color: colors.gray[500],
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  card: {
    marginBottom: spacing.md,
  },
  dailyMacros: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  mealBlock: {
    marginBottom: spacing.xs,
  },
  mealLine: {
    color: colors.gray[100],
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
  },
  mealIngredient: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
    paddingLeft: spacing.sm,
  },
  mealMacros: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    marginTop: 2,
    paddingLeft: spacing.sm,
  },
  note: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  guideSection: {
    marginBottom: spacing.lg,
  },
  guideTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  guideTagline: {
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
});
