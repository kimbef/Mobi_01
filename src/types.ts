export type TrendPoint = {
  label: string;
  value: number;
};

export type KeywordMetrics = {
  keyword: string;
  searchVolume: number;
  competition: 'Low' | 'Medium' | 'High';
  difficulty: number;
  cpc?: number;
  region?: string;
  trend: TrendPoint[];
};

export type SerpResult = {
  title: string;
  url: string;
  snippet: string;
  rank: number;
  features?: string[];
};

export type KeywordAnalysis = {
  seedKeyword: string;
  provider: string;
  metrics: KeywordMetrics;
  suggestions: string[];
  longTail: string[];
  questions: string[];
  relatedSearches: string[];
  serp: SerpResult[];
  notes?: string;
};

export type SearchHistoryEntry = {
  keyword: string;
  timestamp: number;
  volume: number;
  difficulty: number;
};
