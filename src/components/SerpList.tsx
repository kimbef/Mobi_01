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
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  rank: {
    fontWeight: '800',
    color: '#00d9ff',
    fontSize: 14,
  },
  title: {
    fontWeight: '700',
    flexShrink: 1,
    color: '#e2e8f0',
    fontSize: 15,
  },
  url: {
    color: '#64748b',
    marginBottom: 6,
    fontSize: 12,
  },
  snippet: {
    color: '#cbd5e1',
    marginBottom: 8,
    lineHeight: 18,
    fontSize: 13,
  },
  feature: {
    color: '#00d9ff',
    fontWeight: '600',
    fontSize: 12,
  },
});
