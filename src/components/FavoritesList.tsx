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
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  info: {
    marginBottom: 6,
  },
  keyword: {
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    color: '#475569',
  },
  remove: {
    color: '#ef4444',
    fontWeight: '700',
  },
  empty: {
    color: '#475569',
  },
});
