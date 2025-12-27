import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import KeywordInput from '../components/KeywordInput';
import Section from '../components/Section';
import MetricsGrid from '../components/MetricsGrid';
import SuggestionChips from '../components/SuggestionChips';
import SerpList from '../components/SerpList';
import TrendChart from '../components/TrendChart';
import HistoryList from '../components/HistoryList';
import ExportActions from '../components/ExportActions';
import { useKeywordContext } from '../context/KeywordContext';

export default function KeywordSearchScreen() {
  const {
    loading,
    error,
    lastResult,
    history,
    favorites,
    searchesRemaining,
    adLoading,
    searchKeyword,
    toggleFavorite,
    exportResult,
    requestRewarded,
  } = useKeywordContext();
  const [seed, setSeed] = useState('seo keyword research');
  const [bootstrapped, setBootstrapped] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (bootstrapped) return;
    searchKeyword(seed);
    setBootstrapped(true);
  }, [bootstrapped, searchKeyword, seed]);

  const runSearch = async (keyword?: string) => {
    const target = keyword ?? seed;
    await searchKeyword(target);
    if (keyword) {
      setSeed(keyword);
    }
  };

  const onRefresh = async () => {
    if (!seed) return;
    setRefreshing(true);
    await runSearch(seed);
    setRefreshing(false);
  };

  const onToggleFavorite = async () => {
    if (!lastResult) return;
    await toggleFavorite(lastResult);
  };

  const isFavorited = lastResult ? favorites.some((fav) => fav.metrics.keyword === lastResult.metrics.keyword) : false;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <KeywordInput
          value={seed}
          onChange={setSeed}
          onSubmit={() => runSearch()}
          accessory={
            <View style={styles.quotaRow}>
              <View style={styles.quotaPill}>
                <Text style={styles.quotaText}>{searchesRemaining} searches left</Text>
              </View>
              {searchesRemaining === 0 ? (
                <Text style={styles.watchAd} onPress={requestRewarded}>
                  {adLoading ? 'Loading ad…' : 'Watch a short ad to unlock 2 more'}
                </Text>
              ) : null}
            </View>
          }
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Analyzing SERPs and trends…</Text>
          </View>
        ) : null}

        {lastResult ? (
          <View style={styles.card}>
            <Section
              title={`Results for "${lastResult.metrics.keyword}"`}
              subtitle={`Provider: ${lastResult.provider} · Cached & rate-limited`}
            >
              <MetricsGrid metrics={lastResult.metrics} />
            </Section>

            <Section title="Trend (monthly)">
              <TrendChart trend={lastResult.metrics.trend} />
            </Section>

            <Section
              title="Keyword suggestions"
              subtitle="Related, long-tail, and question-based ideas you can re-run quickly."
            >
              <SuggestionChips
                suggestions={[
                  ...lastResult.suggestions,
                  ...lastResult.longTail.slice(0, 3),
                  ...lastResult.questions.slice(0, 3),
                ]}
                onSelect={runSearch}
              />
            </Section>

            <Section title="SERP overview" subtitle="Top ranking pages and visible SERP features.">
              <SerpList results={lastResult.serp} />
            </Section>

            <Section title="Actions">
              <View style={styles.actions}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>
                    {isFavorited ? 'Saved to favorites' : 'Not saved · tap below to favorite'}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <Text style={styles.link} onPress={onToggleFavorite}>
                    {isFavorited ? 'Remove favorite' : 'Save favorite'}
                  </Text>
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Alert.alert('API ready', 'Swap in your provider inside services/keywordService.ts for live data.')
                    }
                  >
                    Configure provider
                  </Text>
                </View>
                <ExportActions onExport={(format) => exportResult(format).then(() => undefined)} />
              </View>
            </Section>
          </View>
        ) : null}

        <Section
          title="Search history"
          subtitle="Cached locally to avoid repeat API calls and respect rate limits."
        >
          <HistoryList entries={history} onSelect={runSearch} />
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 16,
    backgroundColor: '#0f172a',
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  loading: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  loadingText: {
    color: '#e2e8f0',
    fontWeight: '500',
    fontSize: 15,
  },
  error: {
    color: '#ff6b6b',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  actions: {
    gap: 14,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  link: {
    color: '#00d9ff',
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pill: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 255, 0.3)',
  },
  pillText: {
    color: '#00d9ff',
    fontSize: 13,
    fontWeight: '500',
  },
  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  quotaPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  quotaText: {
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: 13,
  },
  watchAd: {
    color: '#00d9ff',
    fontWeight: '600',
    fontSize: 12,
    flexShrink: 1,
  },
});
