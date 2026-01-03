import '../global.css';
import 'react-native-url-polyfill/auto';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { client } from '../lib/appwrite';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';

function RootLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="workout/[id]" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: false, // Disable native swipe to dismiss, will implement custom header-only gesture
        }} 
      />
      <Stack.Screen 
        name="workout/select-exercise" 
        options={{ 
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
