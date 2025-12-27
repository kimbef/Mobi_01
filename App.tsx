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
