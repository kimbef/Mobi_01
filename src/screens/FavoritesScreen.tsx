import { useLayoutEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import FavoritesList from '../components/FavoritesList';
import Section from '../components/Section';
import { useKeywordContext } from '../context/KeywordContext';
import { useNavigation } from '@react-navigation/native';
import { KeywordAnalysis } from '../types';

export default function FavoritesScreen() {
  const { favorites, selectResult, toggleFavorite } = useKeywordContext();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.info} onPress={() => Alert.alert('Cache info', 'Favorites are stored locally for offline use.')}>
          Storage
        </Text>
      ),
    });
  }, [navigation]);

  const onSelect = (analysis: KeywordAnalysis) => {
    selectResult(analysis);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Favorites" subtitle="Saved analyses with cached metrics and SERP snapshots.">
        <FavoritesList favorites={favorites} onSelect={onSelect} onToggle={toggleFavorite} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    flexGrow: 1,
  },
  info: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
