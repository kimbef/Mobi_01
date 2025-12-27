import { SearchHistoryEntry } from '../types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  entries: SearchHistoryEntry[];
  onSelect: (keyword: string) => void;
};

export default function HistoryList({ entries, onSelect }: Props) {
  if (!entries.length) return <Text style={styles.empty}>No searches yet.</Text>;
  return (
    <View style={styles.container}>
      {entries.map((entry) => (
        <Pressable key={entry.keyword} style={styles.row} onPress={() => onSelect(entry.keyword)}>
          <View>
            <Text style={styles.keyword}>{entry.keyword}</Text>
            <Text style={styles.meta}>
              Vol {entry.volume} · Difficulty {entry.difficulty}
            </Text>
          </View>
          <Text style={styles.cta}>Analyze</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
  cta: {
    color: '#00d9ff',
    fontWeight: '600',
    fontSize: 14,
  },
  empty: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
