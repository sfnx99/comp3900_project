import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const navigation = useNavigation();

  // Function to handle deep linking
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [navigation, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // Default: hide the header for all screens
        }}
      >
        {/* Hide header for (tabs) and (auth) screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}

        {/* Show header for index and any other screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Handle not-found screens */}
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />

        {/* Access screen */}
        <Stack.Screen name="access" options={{ headerShown: false }} />

        {/* Verify screen */}
        <Stack.Screen name="verify" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}
