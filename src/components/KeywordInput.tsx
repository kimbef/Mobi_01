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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  accessory: {
    marginTop: 4,
  },
});
