import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeywordAnalysis, SearchHistoryEntry } from '../types';

const HISTORY_KEY = 'keyword_history';
const FAVORITES_KEY = 'keyword_favorites';
export const HISTORY_LIMIT = 20;
export const FAVORITES_LIMIT = 25;

export async function loadHistory(): Promise<SearchHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SearchHistoryEntry[];
  } catch (error) {
    console.warn('Failed to parse search history cache', error);
    await AsyncStorage.removeItem(HISTORY_KEY);
    return [];
  }
}

export async function loadFavorites(): Promise<KeywordAnalysis[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as KeywordAnalysis[];
  } catch (error) {
    console.warn('Failed to parse favorites cache', error);
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return [];
  }
}

export async function persistHistory(entry: SearchHistoryEntry): Promise<SearchHistoryEntry[]> {
  const current = await loadHistory();
  const existingIndex = current.findIndex((item) => item.keyword === entry.keyword);
  let next = existingIndex >= 0 ? current.filter((item) => item.keyword !== entry.keyword) : current;
  next = [entry, ...next].slice(0, HISTORY_LIMIT);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export async function persistFavorites(favorites: KeywordAnalysis[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, FAVORITES_LIMIT)));
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function clearFavorites() {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
