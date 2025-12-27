'use strict';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { KeywordProvider } from './src/context/KeywordContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeywordProvider>
          <NavigationContainer theme={{
            dark: true,
            colors: {
              primary: '#00d9ff',
              background: '#0f172a',
              card: 'rgba(255, 255, 255, 0.08)',
              text: '#e2e8f0',
              border: 'rgba(255, 255, 255, 0.15)',
              notification: '#ff6b6b',
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '700' },
              heavy: { fontFamily: 'System', fontWeight: '800' },
            },
          }}>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </KeywordProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
