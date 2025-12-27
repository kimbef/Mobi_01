import { KeywordMetrics } from '../types';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  metrics: KeywordMetrics;
};

const tiles: Array<{ label: string; accessor: keyof KeywordMetrics; unit?: string }> = [
  { label: 'Search Volume', accessor: 'searchVolume' },
  { label: 'Competition', accessor: 'competition' },
  { label: 'Difficulty', accessor: 'difficulty' },
  { label: 'CPC', accessor: 'cpc', unit: '$' },
];

export default function MetricsGrid({ metrics }: Props) {
  return (
    <View style={styles.grid}>
      {tiles.map((tile) => {
        const raw = metrics[tile.accessor];
        const display =
          typeof raw === 'number' ? `${tile.unit ?? ''}${Math.round(raw)}` : typeof raw === 'string' ? raw : '—';
        return (
          <View key={tile.label} style={styles.tile}>
            <Text style={styles.label}>{tile.label}</Text>
            <Text style={styles.value}>{display}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    flexBasis: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  label: {
    color: '#475569',
    marginBottom: 6,
  },
  value: {
    fontWeight: '800',
    fontSize: 18,
    color: '#0f172a',
  },
});
