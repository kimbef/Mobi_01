// Storage utilities for local data persistence

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistory } from '../types';

const STORAGE_KEYS = {
  SEARCH_HISTORY: '@keyword_research:search_history',
  SELECTED_API: '@keyword_research:selected_api',
  CACHE: '@keyword_research:cache',
};

export const storage = {
  // Search History
  async getSearchHistory(): Promise<SearchHistory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  },

  async saveSearchHistory(history: SearchHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SEARCH_HISTORY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  },

  async addToSearchHistory(item: SearchHistory): Promise<void> {
    const history = await this.getSearchHistory();
    const newHistory = [item, ...history.slice(0, 49)]; // Keep last 50
    await this.saveSearchHistory(newHistory);
  },

  // Selected API
  async getSelectedApi(): Promise<string> {
    try {
      const api = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_API);
      return api || 'mock';
    } catch (error) {
      console.error('Error loading selected API:', error);
      return 'mock';
    }
  },

  async setSelectedApi(api: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_API, api);
    } catch (error) {
      console.error('Error saving selected API:', error);
    }
  },

  // Cache
  async getCache(key: string): Promise<any> {
    try {
      const cache = await AsyncStorage.getItem(`${STORAGE_KEYS.CACHE}:${key}`);
      if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        const now = Date.now();
        // Cache valid for 1 hour
        if (now - timestamp < 3600000) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading cache:', error);
      return null;
    }
  },

  async setCache(key: string, data: any): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.CACHE}:${key}`,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  },

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
