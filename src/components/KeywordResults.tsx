// Keyword Analysis Results Component

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KeywordAnalysis } from '../types';

interface KeywordResultsProps {
  analysis: KeywordAnalysis;
}

export const KeywordResults: React.FC<KeywordResultsProps> = ({ analysis }) => {
  const { data, trends, suggestions } = analysis;

  const getCompetitionColor = (competition: string) => {
    switch (competition.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return '#4CAF50';
    if (difficulty < 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Main Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Search Volume</Text>
            <Text style={styles.metricValue}>
              {data.searchVolume.toLocaleString()}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Competition</Text>
            <Text
              style={[
                styles.metricValue,
                { color: getCompetitionColor(data.competition) },
              ]}
            >
              {data.competition}
            </Text>
          </View>

          {data.cpc && (
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>CPC</Text>
              <Text style={styles.metricValue}>${data.cpc}</Text>
            </View>
          )}

          {data.difficulty !== undefined && (
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Difficulty</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: getDifficultyColor(data.difficulty) },
                ]}
              >
                {data.difficulty}/100
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Trend Chart */}
      {trends.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>30-Day Trend</Text>
          <View style={styles.trendContainer}>
            <View style={styles.trendChart}>
              {trends.map((point, index) => {
                const height = (point.value / 100) * 150;
                return (
                  <View key={index} style={styles.trendBar}>
                    <View
                      style={[
                        styles.trendBarFill,
                        { height, backgroundColor: '#007AFF' },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
            <View style={styles.trendLabels}>
              <Text style={styles.trendLabel}>
                {trends[0]?.date}
              </Text>
              <Text style={styles.trendLabel}>
                {trends[Math.floor(trends.length / 2)]?.date}
              </Text>
              <Text style={styles.trendLabel}>
                {trends[trends.length - 1]?.date}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Keyword Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Keywords</Text>
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Related Keywords */}
      {data.relatedKeywords && data.relatedKeywords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variations</Text>
          <View style={styles.suggestionsContainer}>
            {data.relatedKeywords.map((keyword, index) => (
              <View key={index} style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  trendContainer: {
    marginTop: 8,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    gap: 2,
  },
  trendBar: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 2,
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  trendLabel: {
    fontSize: 10,
    color: '#999',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1976d2',
  },
});
