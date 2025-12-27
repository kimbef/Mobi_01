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
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#00d9ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  text: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  secondary: {
    flex: 1,
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    borderColor: 'rgba(0, 217, 255, 0.3)',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#00d9ff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
