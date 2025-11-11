import Ionicons from '@expo/vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { showToast } from '@/components/ui/Toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { onDbRecovery } from '@/services/db/dbEvents';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
        });
        console.log('[DEBUG] Fonts loaded successfully');
      } catch (error) {
        console.error('[DEBUG] Error loading fonts:', error);
      }
    };
    loadFonts();

    const unsub = onDbRecovery((info) => {
      try {
        showToast({ message: 'Esses sistema usa banco de dados local!', type: 'warning' });
        console.info('[RootLayout] DB recovery event received:', info);
      } catch {
        // ignore
      }
    });

    return () => unsub();
  }, []);

  // Garantir rota correta após inicialização: forçar /login quando não autenticado
  // e forçar / (tabs) quando autenticado. Isso evita que o estado de navegação
  // (ex.: último caminho) faça abrir sempre em Signup após restart.
  React.useEffect(() => {
    if (!isLoading) {
      try {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (e) {
        // se router não estiver pronto, ignorar — será avaliado novamente
        console.warn('[RootLayout] router.replace falhou:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  console.log('[RootLayout] 📊 Estado:', {
    isLoading,
    isAuthenticated,
    route: isLoading ? 'LOADING' : isAuthenticated ? 'FEED' : 'LOGIN',
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="login" 
        />
        <Stack.Screen 
          name="signup"
        />
        <Stack.Screen 
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="create-post"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="edit-profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="comments"
        />
        <Stack.Screen 
          name="modal" 
          options={{ presentation: 'modal', title: 'Modal' }} 
        />
        <Stack.Screen 
          name="debug" 
          options={{ title: 'Debug' }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
