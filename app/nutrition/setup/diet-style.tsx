import { StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { DietStyleForm } from '@/src/components/nutrition/setup/NutritionSetupForms';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';
import { useNutritionSetupContinue } from '@/src/hooks/useNutritionSetupContinue';
import { spacing } from '@/src/theme/tokens';

export default function NutritionSetupDietStyleScreen() {
  const { profile, updateProfile } = useNutritionSetupStore();
  const { continueTo, saving } = useNutritionSetupContinue();

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DietStyleForm profile={profile} onChange={updateProfile} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!profile.diet_style}
          loading={saving}
          onPress={() => continueTo('/nutrition/setup/schedule')}
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
