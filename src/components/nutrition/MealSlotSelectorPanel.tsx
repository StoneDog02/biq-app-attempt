import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/src/theme/tokens';
import type { MealSlotPlan } from '@/src/services/mealRecipeEngine';

type MealSlotSelectorPanelProps = {
  slots: MealSlotPlan[];
  savingSlotKey: string | null;
  onSelectRecipe: (slotKey: string, recipeId: string) => void;
};

export function MealSlotSelectorPanel({
  slots,
  savingSlotKey,
  onSelectRecipe,
}: MealSlotSelectorPanelProps) {
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  if (!slots.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your plan for today</Text>
      <Text style={styles.sectionHint}>Tap a meal to swap in another option that fits this time of day.</Text>

      {slots.map((slot, index) => {
        const isExpanded = expandedSlot === slot.slotKey;
        const isSaving = savingSlotKey === slot.slotKey;
        const alternates = slot.options.filter((option) => option.id !== slot.recipeId);

        return (
          <View key={slot.slotKey} style={[styles.slotCard, index < slots.length - 1 && styles.slotGap]}>
            <Pressable
              onPress={() => setExpandedSlot(isExpanded ? null : slot.slotKey)}
              style={styles.slotHeader}
            >
              <View style={styles.slotHeaderText}>
                <View style={styles.titleRow}>
                  {slot.time ? <Text style={styles.time}>{slot.time}</Text> : null}
                  <Text style={styles.slotTitle}>{slot.title}</Text>
                </View>
                <Text style={styles.recipeName}>{slot.recipeName}</Text>
                <View style={styles.ingredientList}>
                  {slot.ingredientLines.map((line) => (
                    <Text key={line} style={styles.ingredientLine}>
                      • {line}
                    </Text>
                  ))}
                </View>
                <Text style={styles.macros}>{slot.macros}</Text>
              </View>
              {isSaving ? (
                <ActivityIndicator color={colors.copper.base} />
              ) : (
                <Text style={styles.swapHint}>{isExpanded ? 'Close' : 'Swap'}</Text>
              )}
            </Pressable>

            {isExpanded && alternates.length > 0 ? (
              <View style={styles.optionsBlock}>
                <Text style={styles.optionsLabel}>Other {slot.title.toLowerCase()} options</Text>
                {alternates.map((option) => (
                  <Pressable
                    key={option.id}
                    onPress={() => onSelectRecipe(slot.slotKey, option.id)}
                    style={styles.optionRow}
                  >
                    <Text style={styles.optionName}>{option.name}</Text>
                    <Text style={styles.optionDescription} numberOfLines={2}>
                      {option.description}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionHint: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  slotCard: {
    backgroundColor: colors.gray[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 118, 99, 0.15)',
    overflow: 'hidden',
  },
  slotGap: {
    marginBottom: spacing.sm,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
  },
  slotHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  time: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  slotTitle: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipeName: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  ingredientList: {
    gap: 2,
    marginBottom: spacing.xs,
  },
  ingredientLine: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  macros: {
    color: colors.copper.light,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  swapHint: {
    color: colors.copper.base,
    fontSize: fontSize.sm,
    fontWeight: '700',
    paddingTop: 2,
  },
  optionsBlock: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 118, 99, 0.12)',
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  optionsLabel: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  optionRow: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 12,
    padding: spacing.sm,
    backgroundColor: colors.black,
  },
  optionName: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDescription: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});
