// Core types for the SEO Keyword Research App

export interface Keyword {
  keyword: string;
  searchVolume: number;
  competition: string;
  cpc?: number;
  trend?: number[];
  difficulty?: number;
  relatedKeywords?: string[];
}

export interface KeywordAnalysis {
  keyword: string;
  data: Keyword;
  trends: TrendData[];
  suggestions: string[];
  timestamp: number;
}

export interface TrendData {
  date: string;
  value: number;
  keyword: string;
}

export interface SearchHistory {
  id: string;
  keyword: string;
  timestamp: number;
  results: KeywordAnalysis;
}

export interface ApiConfig {
  name: string;
  type: 'google-trends' | 'keyword-planner' | 'semrush' | 'ahrefs' | 'mock';
  apiKey?: string;
  baseUrl?: string;
  enabled: boolean;
}

export interface AppState {
  searches: SearchHistory[];
  currentAnalysis: KeywordAnalysis | null;
  loading: boolean;
  error: string | null;
  selectedApi: string;
}
