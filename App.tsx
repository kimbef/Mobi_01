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
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </KeywordProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
import { StatusBar } from 'expo-status-bar';
import { KeywordSearchScreen } from './src/screens/KeywordSearchScreen';

export default function App() {
  return (
    <>
      <KeywordSearchScreen />
      <StatusBar style="auto" />
    </>
  );
}
