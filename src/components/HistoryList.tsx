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
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  keyword: {
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    color: '#475569',
  },
  cta: {
    color: '#2563eb',
    fontWeight: '700',
  },
  empty: {
    color: '#475569',
  },
});
