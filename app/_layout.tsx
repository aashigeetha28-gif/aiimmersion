import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LangProvider } from './context';

export default function RootLayout() {
  return (
    <LangProvider>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="crop" options={{ headerShown: false }} />
        <Stack.Screen name="disease" options={{ headerShown: false }} />
        <Stack.Screen name="market" options={{ headerShown: false }} />
        <Stack.Screen name="voice" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </LangProvider>
  );
}