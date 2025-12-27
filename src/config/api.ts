// API Configuration - Easy switching between different APIs

import { ApiConfig } from '../types';

export const API_CONFIGS: Record<string, ApiConfig> = {
  mock: {
    name: 'Mock API',
    type: 'mock',
    enabled: true,
  },
  googleTrends: {
    name: 'Google Trends',
    type: 'google-trends',
    baseUrl: 'https://trends.google.com/trends/api',
    enabled: true,
  },
  keywordPlanner: {
    name: 'Google Keyword Planner',
    type: 'keyword-planner',
    apiKey: process.env.GOOGLE_ADS_API_KEY,
    baseUrl: 'https://googleads.googleapis.com',
    enabled: false,
  },
  semrush: {
    name: 'SEMrush',
    type: 'semrush',
    apiKey: process.env.SEMRUSH_API_KEY,
    baseUrl: 'https://api.semrush.com',
    enabled: false,
  },
  ahrefs: {
    name: 'Ahrefs',
    type: 'ahrefs',
    apiKey: process.env.AHREFS_API_KEY,
    baseUrl: 'https://apiv2.ahrefs.com',
    enabled: false,
  },
};

export const DEFAULT_API = 'mock';

export const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
export const RATE_LIMIT_DELAY = 1000; // 1 second between requests
export const MAX_REQUESTS_PER_MINUTE = 60;
