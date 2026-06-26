import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import type { ReminderPreset } from '@/src/types/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const PRESET_SCHEDULES: Record<ReminderPreset, { hour: number; minute: number }[]> = {
  minimal: [{ hour: 9, minute: 0 }],
  balanced: [
    { hour: 8, minute: 0 },
    { hour: 18, minute: 0 },
  ],
  active: [
    { hour: 7, minute: 30 },
    { hour: 12, minute: 0 },
    { hour: 18, minute: 30 },
  ],
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getExpoProjectId(): string | null {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (typeof projectId === 'string' && UUID_RE.test(projectId)) {
    return projectId;
  }
  return null;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice && Platform.OS !== 'ios') {
    return null;
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    console.warn(
      'Push token skipped: set a valid EAS projectId in app.config.ts (run `eas init`).'
    );
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'BODYiQ Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
  } catch (err) {
    console.warn('Expo push token unavailable:', err);
    return null;
  }
}

export async function savePushToken(userId: string, token: string) {
  await supabase
    .from('reminder_settings')
    .upsert(
      {
        user_id: userId,
        push_token: token,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
}

export async function scheduleReminders(preset: ReminderPreset, quietStart = 22, quietEnd = 7) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const schedules = PRESET_SCHEDULES[preset];

  for (const slot of schedules) {
    if (slot.hour >= quietStart || slot.hour < quietEnd) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Today's Plan",
        body: 'Your daily wellness check-in is ready. Tap to see your plan.',
        data: { screen: 'today' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: slot.hour,
        minute: slot.minute,
      },
    });
  }
}

/** Best-effort: never blocks onboarding if push/EAS is not configured yet. */
export async function setupUserNotifications(userId: string, preset: ReminderPreset) {
  try {
    const token = await registerForPushNotifications();
    if (token) {
      await savePushToken(userId, token);
    }
  } catch (err) {
    console.warn('Push token setup failed:', err);
  }

  try {
    await scheduleReminders(preset);
  } catch (err) {
    console.warn('Local reminder scheduling failed:', err);
  }
}
