import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  suggestions: string[];
  onSelect: (keyword: string) => void;
};

export default function SuggestionChips({ suggestions, onSelect }: Props) {
  if (!suggestions.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {suggestions.map((suggestion) => (
        <Pressable key={suggestion} style={styles.chip} onPress={() => onSelect(suggestion)}>
          <Text style={styles.text}>{suggestion}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    borderColor: 'rgba(0, 217, 255, 0.3)',
    borderWidth: 1.5,
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  text: {
    color: '#00d9ff',
    fontWeight: '600',
    fontSize: 14,
  },
});
