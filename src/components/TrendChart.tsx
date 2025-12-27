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
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    width: '75%',
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  label: {
    marginTop: 0,
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
});
