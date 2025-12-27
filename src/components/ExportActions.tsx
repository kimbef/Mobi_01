import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onExport: (format: 'json' | 'csv') => Promise<void>;
};

export default function ExportActions({ onExport }: Props) {
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await onExport(format);
      Alert.alert('Export ready', `${format.toUpperCase()} data copied to your clipboard.`);
    } catch (error) {
      Alert.alert('Unable to export', (error as Error).message);
    }
  };

  return (
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => handleExport('json')}>
        <Text style={styles.text}>Export JSON</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => handleExport('csv')}>
        <Text style={styles.secondaryText}>Export CSV</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
  secondary: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
