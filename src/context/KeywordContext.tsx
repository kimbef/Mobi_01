import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import { KeywordAnalysis, SearchHistoryEntry } from '../types';
import { formatKeywordExport, getKeywordAnalysis } from '../services/keywordService';
import {
  clearFavorites,
  clearHistory,
  FAVORITES_LIMIT,
  DEFAULT_QUOTA,
  loadFavorites,
  loadHistory,
  loadQuota,
  persistFavorites,
  persistHistory,
  persistQuota,
} from '../storage/localStore';

type KeywordContextState = {
  loading: boolean;
  error?: string | null;
  lastResult?: KeywordAnalysis | null;
  history: SearchHistoryEntry[];
  favorites: KeywordAnalysis[];
  searchesRemaining: number;
  adLoading: boolean;
  adError?: string | null;
  searchKeyword: (seed: string) => Promise<void>;
  requestRewarded: () => Promise<void>;
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
  const [searchesRemaining, setSearchesRemaining] = useState<number>(DEFAULT_QUOTA);
  const [adLoading, setAdLoading] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const quotaRef = useRef(DEFAULT_QUOTA);
  const adReadyRef = useRef(false);

  const setQuota = useCallback(async (next: number) => {
    const safe = Math.max(0, next);
    quotaRef.current = safe;
    setSearchesRemaining(safe);
    await persistQuota(safe);
  }, []);

  useEffect(() => {
    (async () => {
      await setTestDeviceIDAsync('EMULATOR');
      const storedHistory = await loadHistory();
      const storedFavorites = await loadFavorites();
      const storedQuota = await loadQuota();
      setHistory(storedHistory);
      setFavorites(storedFavorites);
      await setQuota(storedQuota);
    })();
  }, [setQuota]);

  const rewardedUnitId = __DEV__
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';

  const loadRewardedAd = useCallback(async () => {
    if (adLoading || adReadyRef.current) return;
    setAdLoading(true);
    setAdError(null);
    try {
      await AdMobRewarded.setAdUnitID(rewardedUnitId);
      await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
      adReadyRef.current = true;
    } catch (err) {
      adReadyRef.current = false;
      setAdError(err instanceof Error ? err.message : 'Unable to load ad.');
    } finally {
      setAdLoading(false);
    }
  }, [adLoading, rewardedUnitId]);

  useEffect(() => {
    loadRewardedAd();
  }, [loadRewardedAd]);

  const showRewardedAndAwaitReward = useCallback(async () => {
    await loadRewardedAd();
    return new Promise<boolean>((resolve, reject) => {
      let rewarded = false;
      let failSub: { remove: () => void } | undefined;

      const cleanup = () => {
        rewardSub.remove();
        closeSub.remove();
        failSub?.remove();
      };

      const rewardSub = AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', () => {
        rewarded = true;
      });

      const closeSub = AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
        cleanup();
        adReadyRef.current = false;
        loadRewardedAd();
        resolve(rewarded);
      });

      failSub = AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (event) => {
        cleanup();
        adReadyRef.current = false;
        setAdError('Ad failed to load');
        reject(event);
      });

      AdMobRewarded.showAdAsync().catch((err) => {
        cleanup();
        adReadyRef.current = false;
        setAdError(err instanceof Error ? err.message : 'Unable to show ad');
        reject(err);
      });
    });
  }, [loadRewardedAd]);

  const ensureQuotaOrReward = useCallback(async () => {
    if (quotaRef.current > 0) {
      await setQuota(quotaRef.current - 1);
      return;
    }

    const rewarded = await showRewardedAndAwaitReward();
    if (!rewarded) {
      throw new Error('Please watch a short ad to continue searching.');
    }

    await setQuota(DEFAULT_QUOTA - 1);
  }, [setQuota, showRewardedAndAwaitReward]);

  const searchKeyword = useCallback(async (seed: string) => {
    await ensureQuotaOrReward();
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
  }, [ensureQuotaOrReward]);

  const requestRewarded = useCallback(async () => {
    const rewarded = await showRewardedAndAwaitReward();
    if (rewarded) {
      await setQuota(DEFAULT_QUOTA);
    }
  }, [setQuota, showRewardedAndAwaitReward]);

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
    await Promise.all([clearHistory(), clearFavorites(), setQuota(DEFAULT_QUOTA)]);
  }, [setQuota]);

  const value = useMemo(
    () => ({
      loading,
      error,
      lastResult,
      history,
      favorites,
      searchesRemaining,
      adLoading,
      adError,
      searchKeyword,
      requestRewarded,
      toggleFavorite,
      selectResult,
      exportResult,
      resetData,
    }),
    [
      loading,
      error,
      lastResult,
      history,
      favorites,
      searchesRemaining,
      adLoading,
      adError,
      searchKeyword,
      requestRewarded,
      toggleFavorite,
      selectResult,
      exportResult,
      resetData,
    ],
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
