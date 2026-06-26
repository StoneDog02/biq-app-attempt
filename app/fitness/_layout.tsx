import { Stack, router } from 'expo-router';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors, fontSize } from '@/src/theme/tokens';

function FitnessBackButton() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/fitness');
    }
  };

  return (
    <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        tintColor={colors.copper.base}
        size={22}
      />
      <Text style={styles.backLabel}>Fitness</Text>
    </Pressable>
  );
}

export default function FitnessLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.black },
        headerBackVisible: false,
        headerLeft: () => <FitnessBackButton />,
      }}
    >
      <Stack.Screen name="programs" options={{ title: 'Programs' }} />
      <Stack.Screen name="program/[id]" options={{ title: 'Program detail' }} />
      <Stack.Screen name="exercises" options={{ title: 'Exercise library' }} />
      <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise detail' }} />
      <Stack.Screen name="recovery" options={{ title: 'Recovery' }} />
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
