import { StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { MacroFoodsForm } from '@/src/components/nutrition/setup/NutritionSetupForms';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';
import { useNutritionSetupContinue } from '@/src/hooks/useNutritionSetupContinue';
import { spacing } from '@/src/theme/tokens';

export default function NutritionSetupFoodsScreen() {
  const { profile, updateProfile } = useNutritionSetupStore();
  const { continueTo, saving } = useNutritionSetupContinue();

  const canContinue =
    (profile.protein_foods?.length ?? 0) > 0 &&
    (profile.carb_foods?.length ?? 0) > 0 &&
    (profile.fat_foods?.length ?? 0) > 0;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MacroFoodsForm profile={profile} onChange={updateProfile} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!canContinue}
          loading={saving}
          onPress={() => continueTo('/nutrition/setup/diet-style')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  footer: {
    padding: spacing.md,
  },
});
