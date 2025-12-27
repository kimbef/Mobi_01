// Mock API Service for development and testing

import { BaseApiService } from './BaseApiService';
import { Keyword, KeywordAnalysis, TrendData } from '../types';

export class MockApiService extends BaseApiService {
  constructor() {
    super(undefined, undefined, 'mock');
  }

  async searchKeyword(keyword: string): Promise<KeywordAnalysis> {
    // Check cache first
    const cacheKey = `keyword:${keyword}`;
    const cached = await this.getCached<KeywordAnalysis>(cacheKey);
    if (cached) {
      return cached;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const data: Keyword = {
      keyword,
      searchVolume: Math.floor(Math.random() * 100000) + 1000,
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      cpc: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      difficulty: Math.floor(Math.random() * 100),
      relatedKeywords: this.generateRelatedKeywords(keyword),
    };

    const trends = await this.getTrends(keyword);
    const suggestions = await this.getSuggestions(keyword);

    const analysis: KeywordAnalysis = {
      keyword,
      data,
      trends,
      suggestions,
      timestamp: Date.now(),
    };

    // Cache the result
    await this.setCache(cacheKey, analysis);

    return analysis;
  }

  async getTrends(keyword: string, days: number = 30): Promise<TrendData[]> {
    const trends: TrendData[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    let value = 50 + Math.random() * 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * dayMs);
      value = Math.max(10, Math.min(100, value + (Math.random() - 0.5) * 20));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        keyword,
      });
    }

    return trends;
  }

  async getSuggestions(keyword: string): Promise<string[]> {
    const prefixes = ['best', 'how to', 'top', 'free', 'online'];
    const suffixes = ['2024', 'guide', 'tips', 'tools', 'services', 'near me'];
    
    const suggestions = [
      ...prefixes.map(p => `${p} ${keyword}`),
      ...suffixes.map(s => `${keyword} ${s}`),
    ];

    return suggestions.slice(0, 10);
  }

  private generateRelatedKeywords(keyword: string): string[] {
    const variations = [
      `${keyword} alternative`,
      `${keyword} vs`,
      `${keyword} comparison`,
      `${keyword} review`,
      `best ${keyword}`,
    ];
    return variations;
  }

  async generateAiKeywords(seed: string, count: number = 10): Promise<string[]> {
    // Simulate AI generation with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));

    const patterns = [
      `${seed} optimization`,
      `${seed} strategy`,
      `${seed} techniques`,
      `${seed} best practices`,
      `${seed} tools`,
      `advanced ${seed}`,
      `${seed} for beginners`,
      `${seed} case study`,
      `${seed} trends`,
      `${seed} analytics`,
    ];

    return patterns.slice(0, count);
  }
}
