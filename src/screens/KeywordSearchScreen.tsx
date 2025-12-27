// Main Keyword Research Screen

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { KeywordSearchInput } from '../components/KeywordSearchInput';
import { KeywordResults } from '../components/KeywordResults';
import { ApiSelector } from '../components/ApiSelector';

export const KeywordSearchScreen: React.FC = () => {
  const {
    currentAnalysis,
    loading,
    error,
    selectedApi,
    searchKeyword,
    setSelectedApi,
    loadSearchHistory,
    exportToCSV,
    clearError,
    searches,
  } = useAppStore();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (error) {
      if (Platform.OS === 'web') {
        alert(error);
      } else {
        Alert.alert('Error', error);
      }
      clearError();
    }
  }, [error]);

  const handleExport = async () => {
    try {
      const csv = await exportToCSV();
      
      if (Platform.OS === 'web') {
        // Create download link for web
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keyword-research-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('CSV exported successfully!');
      } else {
        // For mobile, we'd need to use a file system library
        // For now, just show the data
        Alert.alert('CSV Export', csv, [{ text: 'OK' }]);
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert(error.message || 'Failed to export');
      } else {
        Alert.alert('Export Error', error.message || 'Failed to export');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SEO Keyword Research</Text>
          <Text style={styles.subtitle}>
            Analyze search volume, competition, and trends
          </Text>
        </View>

        {/* API Selector */}
        <ApiSelector
          selectedApi={selectedApi}
          onSelect={setSelectedApi}
        />

        {/* Search Input */}
        <KeywordSearchInput
          onSearch={searchKeyword}
          loading={loading}
        />

        {/* Export Button */}
        {searches.length > 0 && (
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Text style={styles.exportButtonText}>
              Export History to CSV ({searches.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* Loading State */}
        {loading && !currentAnalysis && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing keyword...</Text>
          </View>
        )}

        {/* Results */}
        {currentAnalysis && !loading && (
          <KeywordResults analysis={currentAnalysis} />
        )}

        {/* Empty State */}
        {!currentAnalysis && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Start Your Research
            </Text>
            <Text style={styles.emptyStateText}>
              Enter a keyword above to analyze its search volume, competition,
              and trends. Get AI-powered suggestions for related keywords.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>
                • Real-time search volume data
              </Text>
              <Text style={styles.featureItem}>
                • Competition analysis
              </Text>
              <Text style={styles.featureItem}>
                • 30-day trend visualization
              </Text>
              <Text style={styles.featureItem}>
                • Related keyword suggestions
              </Text>
              <Text style={styles.featureItem}>
                • CSV export for reports
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
