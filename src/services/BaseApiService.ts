// Base API Service with caching and rate limiting

import axios, { AxiosInstance } from 'axios';
import { Keyword, KeywordAnalysis, TrendData } from '../types';
import { storage } from '../utils/storage';
import { rateLimiter } from '../utils/rateLimiter';

export abstract class BaseApiService {
  protected client: AxiosInstance;
  protected apiName: string;

  constructor(baseURL?: string, apiKey?: string, apiName: string = 'api') {
    this.apiName = apiName;
    this.client = axios.create({
      baseURL,
      headers: apiKey
        ? {
            Authorization: `Bearer ${apiKey}`,
          }
        : {},
      timeout: 30000,
    });
  }

  protected async getCached<T>(key: string): Promise<T | null> {
    return await storage.getCache(key);
  }

  protected async setCache<T>(key: string, data: T): Promise<void> {
    await storage.setCache(key, data);
  }

  protected async rateLimitedRequest<T>(
    fn: () => Promise<T>
  ): Promise<T> {
    return rateLimiter.throttle(fn);
  }

  abstract searchKeyword(keyword: string): Promise<KeywordAnalysis>;
  abstract getTrends(keyword: string, days?: number): Promise<TrendData[]>;
  abstract getSuggestions(keyword: string): Promise<string[]>;
}
