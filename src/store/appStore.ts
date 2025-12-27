// Global state management with Zustand

import { create } from 'zustand';
import { AppState, KeywordAnalysis, SearchHistory } from '../types';
import { getApiService } from '../services/ApiServiceFactory';
import { storage } from '../utils/storage';
import { API_CONFIGS } from '../config/api';

interface AppStore extends AppState {
  // Actions
  searchKeyword: (keyword: string) => Promise<void>;
  setSelectedApi: (api: string) => Promise<void>;
  loadSearchHistory: () => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  exportToCSV: () => Promise<string>;
  generateAiKeywords: (seed: string) => Promise<string[]>;
  clearError: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  searches: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  selectedApi: 'mock',

  // Actions
  searchKeyword: async (keyword: string) => {
    if (!keyword.trim()) {
      set({ error: 'Please enter a keyword' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const api = getApiService(get().selectedApi);
      const analysis = await api.searchKeyword(keyword);

      // Create search history entry
      const historyItem: SearchHistory = {
        id: `${Date.now()}_${keyword}`,
        keyword,
        timestamp: Date.now(),
        results: analysis,
      };

      // Save to storage
      await storage.addToSearchHistory(historyItem);

      // Update state
      set(state => ({
        currentAnalysis: analysis,
        searches: [historyItem, ...state.searches],
        loading: false,
      }));
    } catch (error: any) {
      console.error('Search error:', error);
      set({
        error: error.message || 'Failed to search keyword',
        loading: false,
      });
    }
  },

  setSelectedApi: async (api: string) => {
    if (!API_CONFIGS[api] || !API_CONFIGS[api].enabled) {
      set({ error: `API ${api} is not available` });
      return;
    }

    await storage.setSelectedApi(api);
    set({ selectedApi: api });
  },

  loadSearchHistory: async () => {
    try {
      const history = await storage.getSearchHistory();
      const selectedApi = await storage.getSelectedApi();
      set({ searches: history, selectedApi });
    } catch (error: any) {
      console.error('Error loading history:', error);
      set({ error: 'Failed to load search history' });
    }
  },

  clearSearchHistory: async () => {
    try {
      await storage.saveSearchHistory([]);
      set({ searches: [], currentAnalysis: null });
    } catch (error: any) {
      console.error('Error clearing history:', error);
      set({ error: 'Failed to clear search history' });
    }
  },

  exportToCSV: async () => {
    try {
      const { searches } = get();
      
      if (searches.length === 0) {
        throw new Error('No data to export');
      }

      // Create CSV content
      const headers = [
        'Keyword',
        'Search Volume',
        'Competition',
        'CPC',
        'Difficulty',
        'Date',
      ];

      const rows = searches.map(search => [
        search.keyword,
        search.results.data.searchVolume,
        search.results.data.competition,
        search.results.data.cpc || '',
        search.results.data.difficulty || '',
        new Date(search.timestamp).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      return csvContent;
    } catch (error: any) {
      console.error('Export error:', error);
      set({ error: 'Failed to export data' });
      throw error;
    }
  },

  generateAiKeywords: async (seed: string) => {
    set({ loading: true, error: null });

    try {
      const api = getApiService(get().selectedApi);
      const keywords = await api.generateAiKeywords(seed, 10);
      set({ loading: false });
      return keywords;
    } catch (error: any) {
      console.error('AI generation error:', error);
      set({
        error: 'Failed to generate keywords',
        loading: false,
      });
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));
