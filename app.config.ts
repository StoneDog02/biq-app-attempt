import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BODYiQ',
  slug: 'bodyiq-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'bodyiq',
  userInterfaceStyle: 'dark',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bodyiq.app',
    infoPlist: {
      NSCameraUsageDescription: 'BODYiQ uses the camera to scan barcodes and log meals from photos.',
      NSMicrophoneUsageDescription: 'BODYiQ uses the microphone for voice meal logging.',
      NSSpeechRecognitionUsageDescription: 'BODYiQ uses speech recognition to transcribe what you ate.',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0A0A0A',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    package: 'com.bodyiq.app',
    predictiveBackGestureEnabled: false,
    permissions: ['CAMERA', 'RECORD_AUDIO'],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow BODYiQ to use your camera for barcode and meal photo logging.',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0A0A0A',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#C37663',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'YOUR_EAS_PROJECT_ID',
    },
  },
});
