import { StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { MealScheduleForm } from '@/src/components/nutrition/setup/NutritionSetupForms';
import { useNutritionSetupStore } from '@/src/hooks/useNutritionSetupStore';
import { useNutritionSetupContinue } from '@/src/hooks/useNutritionSetupContinue';
import { spacing } from '@/src/theme/tokens';

export default function NutritionSetupScheduleScreen() {
  const { profile, updateProfile } = useNutritionSetupStore();
  const { continueTo, saving } = useNutritionSetupContinue();

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MealScheduleForm profile={profile} onChange={updateProfile} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!profile.meals_per_day || !profile.day_start_time}
          loading={saving}
          onPress={() => continueTo('/nutrition/setup/review')}
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
