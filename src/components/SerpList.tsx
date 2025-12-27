import { SerpResult } from '../types';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  results: SerpResult[];
};

export default function SerpList({ results }: Props) {
  return (
    <View style={styles.container}>
      {results.map((result) => (
        <Pressable key={result.url} onPress={() => Linking.openURL(result.url)} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rank}>#{result.rank}</Text>
            <Text style={styles.title}>{result.title}</Text>
          </View>
          <Text style={styles.url}>{result.url}</Text>
          <Text style={styles.snippet}>{result.snippet}</Text>
          {result.features?.length ? <Text style={styles.feature}>{result.features.join(' • ')}</Text> : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  rank: {
    fontWeight: '800',
    color: '#2563eb',
  },
  title: {
    fontWeight: '700',
    flexShrink: 1,
    color: '#0f172a',
  },
  url: {
    color: '#0ea5e9',
    marginBottom: 4,
  },
  snippet: {
    color: '#334155',
    marginBottom: 6,
  },
  feature: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
