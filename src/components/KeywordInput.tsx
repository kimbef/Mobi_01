import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  accessory?: ReactNode;
};

export default function KeywordInput({ value, onChange, onSubmit, accessory }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter a seed keyword (e.g., SEO tools)"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Analyze</Text>
      </Pressable>
      {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 14,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#00d9ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  accessory: {
    marginTop: 8,
  },
});
