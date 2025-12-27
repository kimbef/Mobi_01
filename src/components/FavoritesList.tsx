import { KeywordAnalysis } from '../types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  favorites: KeywordAnalysis[];
  onSelect: (analysis: KeywordAnalysis) => void;
  onToggle: (analysis: KeywordAnalysis) => void;
};

export default function FavoritesList({ favorites, onSelect, onToggle }: Props) {
  if (!favorites.length) return <Text style={styles.empty}>Save keywords to see them here.</Text>;
  return (
    <View style={styles.container}>
      {favorites.map((fav) => (
        <View key={fav.metrics.keyword} style={styles.row}>
          <Pressable onPress={() => onSelect(fav)} style={styles.info}>
            <Text style={styles.keyword}>{fav.metrics.keyword}</Text>
            <Text style={styles.meta}>
              Vol {fav.metrics.searchVolume} · Diff {fav.metrics.difficulty} · {fav.metrics.competition}
            </Text>
          </Pressable>
          <Pressable onPress={() => onToggle(fav)}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  info: {
    marginBottom: 8,
  },
  keyword: {
    fontWeight: '700',
    color: '#e2e8f0',
    fontSize: 15,
  },
  meta: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  remove: {
    color: '#ff6b6b',
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
