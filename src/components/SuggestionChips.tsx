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
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  text: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
