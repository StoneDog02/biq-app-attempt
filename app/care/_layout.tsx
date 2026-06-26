import { Stack, router } from 'expo-router';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors, fontSize } from '@/src/theme/tokens';

function CareBackButton() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        tintColor={colors.copper.base}
        size={22}
      />
      <Text style={styles.backLabel}>Care</Text>
    </Pressable>
  );
}

export default function CareLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.black },
        headerBackVisible: false,
        headerLeft: () => <CareBackButton />,
      }}
    >
      <Stack.Screen name="shop" options={{ title: 'Shop' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Product detail' }} />
      <Stack.Screen name="portal" options={{ title: 'Patient portal' }} />
      <Stack.Screen name="telehealth" options={{ title: 'Telehealth' }} />
      <Stack.Screen name="labs" options={{ title: 'Longevity reports' }} />
      <Stack.Screen name="lab/[id]" options={{ title: 'Report detail' }} />
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
