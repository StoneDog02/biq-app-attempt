import { StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { BodyMetricsForm } from '@/src/components/nutrition/setup/NutritionSetupForms';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';
import { useNutritionSetupContinue } from '@/src/hooks/useNutritionSetupContinue';
import { spacing } from '@/src/theme/tokens';

export default function NutritionSetupMetricsScreen() {
  const { profile, updateProfile } = useNutritionSetupStore();
  const { continueTo, saving } = useNutritionSetupContinue();

  const canContinue = Boolean(profile.current_weight_lb && profile.goal_weight_lb);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BodyMetricsForm profile={profile} onChange={updateProfile} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!canContinue}
          loading={saving}
          onPress={() => continueTo('/nutrition/setup/foods')}
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
