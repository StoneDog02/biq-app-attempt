import { Stack, router } from 'expo-router';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors, fontSize } from '@/src/theme/tokens';

function NutritionBackButton() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/nutrition');
    }
  };

  return (
    <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        tintColor={colors.copper.base}
        size={22}
      />
      <Text style={styles.backLabel}>Nutrition</Text>
    </Pressable>
  );
}

export default function NutritionLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.black },
        headerBackVisible: false,
        headerLeft: () => <NutritionBackButton />,
      }}
    >
      <Stack.Screen name="scan" options={{ title: 'Scan barcode' }} />
      <Stack.Screen name="meal-plan" options={{ title: 'Meal planning' }} />
      <Stack.Screen name="photo-log" options={{ title: 'Photo log' }} />
      <Stack.Screen name="voice-log" options={{ title: 'Voice log' }} />
      <Stack.Screen name="setup" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  backLabel: {
    color: colors.copper.base,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: 2,
  },
});
