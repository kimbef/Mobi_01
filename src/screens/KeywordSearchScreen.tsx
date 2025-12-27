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
  const { loading, error, lastResult, history, favorites, searchKeyword, toggleFavorite, exportResult } =
    useKeywordContext();
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
        <KeywordInput value={seed} onChange={setSeed} onSubmit={() => runSearch()} />

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
    backgroundColor: '#f1f5f9',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  loading: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  loadingText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
  },
  pill: {
    backgroundColor: '#e0f2fe',
    padding: 10,
    borderRadius: 10,
  },
  pillText: {
    color: '#0f172a',
  },
});
