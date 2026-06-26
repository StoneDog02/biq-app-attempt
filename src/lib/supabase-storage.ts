import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Supabase auth storage via AsyncStorage (Expo Go compatible).
 * SecureStore is avoided — Supabase sessions often exceed iOS SecureStore's 2048-byte limit,
 * which can hang sign-in indefinitely.
 */
export const supabaseStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};
