import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { colors } from '@/src/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.gray[900],
        },
        tabBarActiveTintColor: colors.copper.base,
        tabBarInactiveTintColor: colors.gray[500],
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today's Plan",
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="fitness"
        options={{
          title: 'Fitness',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'figure.strengthtraining.traditional', android: 'fitness_center', web: 'fitness_center' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          href: null,
          title: 'Care',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
