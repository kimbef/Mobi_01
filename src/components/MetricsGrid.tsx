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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 16,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: {
    color: '#94a3b8',
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontWeight: '800',
    fontSize: 24,
    color: '#00d9ff',
    letterSpacing: -0.5,
  },
});
