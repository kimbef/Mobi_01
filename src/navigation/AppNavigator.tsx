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
      <Text style={{ color: '#2563eb', fontWeight: '600' }}>Favorites</Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
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
