import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import KeywordSearchScreen from '../screens/KeywordSearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

export type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function FavoritesButton() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Pressable onPress={() => navigation.navigate('Favorites')}>
      <Text style={{ color: '#00d9ff', fontWeight: '600', fontSize: 15 }}>Favorites</Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          borderBottomWidth: 1,
        },
        headerTintColor: '#00d9ff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#e2e8f0',
          letterSpacing: 0.2,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={KeywordSearchScreen}
        options={{
          title: 'Keyword Research',
          headerRight: () => <FavoritesButton />,
        }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Saved Keywords' }}
      />
    </Stack.Navigator>
  );
}
