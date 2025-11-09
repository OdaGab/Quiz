import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// For development: prefer the local backend when running the app in DEV mode.
// This sets global.USE_LOCAL_BACKEND = true so `QuizFlow` will use
// http://10.0.2.2:3000 on Android emulator or http://localhost:3000 on iOS simulator.
if (typeof global !== 'undefined' && typeof __DEV__ !== 'undefined' && __DEV__) {
  // Only set if not already defined by dev environment
  if ((global as any).USE_LOCAL_BACKEND === undefined) {
    // Default: do NOT force the app to call the local backend during development.
    // This makes the app call the EmailJS REST endpoint by default in DEV.
    // If you want to use the local backend (SendGrid) set this to true.
    // For devices, prefer setting `global.BACKEND_URL = 'http://192.168.x.y:3000'`.
    (global as any).USE_LOCAL_BACKEND = false;
    console.debug('DEV: USE_LOCAL_BACKEND defaulted to false (forcing EmailJS REST)');
  }
  // EmailJS dev credentials (placeholders) - replace these locally and do NOT commit
  // You can override these by setting globals before app init, e.g. via metro config
  if (!(global as any).EMAILJS_SERVICE_ID) {
    // Use the working Service ID (confirmed via EmailJS "Test It")
    (global as any).EMAILJS_SERVICE_ID = 'service_0kv85wv';
  }
  if (!(global as any).EMAILJS_TEMPLATE_ID) {
    (global as any).EMAILJS_TEMPLATE_ID = 'template_lvmrwhq';
  }
  if (!(global as any).EMAILJS_PUBLIC_KEY) {
    (global as any).EMAILJS_PUBLIC_KEY = 'kke6uYfRHwLkoAkNY';
  }
  // Small DEV-time confirmation log (public key partially masked)
  try {
    const svc = (global as any).EMAILJS_SERVICE_ID || '<missing>';
    const tpl = (global as any).EMAILJS_TEMPLATE_ID || '<missing>';
    const pk = (global as any).EMAILJS_PUBLIC_KEY || '';
    const pkMasked = pk.length > 4 ? '***' + pk.slice(-4) : pk || '<missing>';
    console.debug(`DEV: EMAILJS globals set - service=${svc}, template=${tpl}, publicKey=${pkMasked}`);
  } catch (e) {
    // ignore logging errors in exotic environments
  }
}

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
