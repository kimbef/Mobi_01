import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { KeywordAnalysis, SearchHistoryEntry } from '../types';
import { formatKeywordExport, getKeywordAnalysis } from '../services/keywordService';
import {
  clearFavorites,
  clearHistory,
  FAVORITES_LIMIT,
  loadFavorites,
  loadHistory,
  persistFavorites,
  persistHistory,
} from '../storage/localStore';

type KeywordContextState = {
  loading: boolean;
  error?: string | null;
  lastResult?: KeywordAnalysis | null;
  history: SearchHistoryEntry[];
  favorites: KeywordAnalysis[];
  searchKeyword: (seed: string) => Promise<void>;
  toggleFavorite: (analysis: KeywordAnalysis) => Promise<void>;
  selectResult: (analysis: KeywordAnalysis) => void;
  exportResult: (format: 'json' | 'csv') => Promise<string>;
  resetData: () => Promise<void>;
};

const KeywordContext = createContext<KeywordContextState | undefined>(undefined);

export function KeywordProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<KeywordAnalysis | null>(null);
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<KeywordAnalysis[]>([]);

  useEffect(() => {
    (async () => {
      const storedHistory = await loadHistory();
      const storedFavorites = await loadFavorites();
      setHistory(storedHistory);
      setFavorites(storedFavorites);
    })();
  }, []);

  const searchKeyword = useCallback(async (seed: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getKeywordAnalysis(seed);
      setLastResult(result);
      const entry: SearchHistoryEntry = {
        keyword: result.metrics.keyword,
        timestamp: Date.now(),
        volume: result.metrics.searchVolume,
        difficulty: result.metrics.difficulty,
      };
      const updatedHistory = await persistHistory(entry);
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch keyword insights.');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (analysis: KeywordAnalysis) => {
      const exists = favorites.some((fav) => fav.metrics.keyword === analysis.metrics.keyword);
      const nextFavorites = exists
        ? favorites.filter((fav) => fav.metrics.keyword !== analysis.metrics.keyword)
        : [analysis, ...favorites].slice(0, FAVORITES_LIMIT);
      setFavorites(nextFavorites);
      await persistFavorites(nextFavorites);
    },
    [favorites],
  );

  const selectResult = useCallback((analysis: KeywordAnalysis) => {
    setLastResult(analysis);
  }, []);

  const exportResult = useCallback(
    async (format: 'json' | 'csv') => {
      if (!lastResult) {
        throw new Error('Run a keyword analysis first.');
      }
      const payload = formatKeywordExport(lastResult, format);
      await Clipboard.setStringAsync(payload);
      return payload;
    },
    [lastResult],
  );

  const resetData = useCallback(async () => {
    setHistory([]);
    setFavorites([]);
    setLastResult(null);
    await Promise.all([clearHistory(), clearFavorites()]);
  }, []);

  const value = useMemo(
    () => ({
      loading,
      error,
      lastResult,
      history,
      favorites,
      searchKeyword,
      toggleFavorite,
      selectResult,
      exportResult,
      resetData,
    }),
    [loading, error, lastResult, history, favorites, searchKeyword, toggleFavorite, selectResult, exportResult, resetData],
  );

  return <KeywordContext.Provider value={value}>{children}</KeywordContext.Provider>;
}

export function useKeywordContext() {
  const ctx = useContext(KeywordContext);
  if (!ctx) {
    throw new Error('useKeywordContext must be used within a KeywordProvider');
  }
  return ctx;
}
