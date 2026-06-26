import { Stack } from 'expo-router';
import { colors } from '@/src/theme/tokens';
import { NutritionSetupHydrator } from '@/src/components/nutrition/setup/NutritionSetupHydrator';

export default function NutritionSetupLayout() {
  return (
    <>
      <NutritionSetupHydrator />
      <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.black },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Body metrics' }} />
      <Stack.Screen name="foods" options={{ title: 'Favorite foods' }} />
      <Stack.Screen name="diet-style" options={{ title: 'Diet style' }} />
      <Stack.Screen name="schedule" options={{ title: 'Meal schedule' }} />
      <Stack.Screen name="review" options={{ title: 'Review plan' }} />
    </Stack>
    </>
  );
}
