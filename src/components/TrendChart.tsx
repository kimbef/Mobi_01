import { TrendPoint } from '../types';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  trend: TrendPoint[];
};

export default function TrendChart({ trend }: Props) {
  if (!trend.length) return null;
  const max = Math.max(...trend.map((p) => p.value));
  const chartHeight = 120;
  return (
    <View style={[styles.container, { height: chartHeight }]}>
      {trend.map((point) => (
        <View key={point.label} style={styles.barWrapper}>
          <View style={[styles.bar, { height: (point.value / max) * chartHeight }]} />
          <Text style={styles.label}>{point.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingVertical: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#475569',
  },
});
