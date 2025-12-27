// API Selector Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { API_CONFIGS } from '../config/api';

interface ApiSelectorProps {
  selectedApi: string;
  onSelect: (api: string) => void;
}

export const ApiSelector: React.FC<ApiSelectorProps> = ({
  selectedApi,
  onSelect,
}) => {
  const enabledApis = Object.entries(API_CONFIGS).filter(
    ([_, config]) => config.enabled
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>API Source:</Text>
      <View style={styles.buttonsContainer}>
        {enabledApis.map(([key, config]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              selectedApi === key && styles.buttonSelected,
            ]}
            onPress={() => onSelect(key)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedApi === key && styles.buttonTextSelected,
              ]}
            >
              {config.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  buttonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
  },
  buttonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
