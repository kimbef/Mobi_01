import { KeywordAnalysis, SerpResult, TrendPoint } from '../types';

const CACHE_TTL_MS = 5 * 60 * 1000;
const RATE_LIMIT_MS = 1200;
const TREND_MIN_VALUE = 20;
const TREND_MAX_VALUE = 95;
const TREND_BASE_SCALE = 7;
const TREND_RANDOM_RANGE = 20;
const TREND_WAVE_AMPLITUDE = 15;
const TREND_NOISE_RANGE = 10;
const MIN_VOLUME = 400;
const MAX_VOLUME = 12000;
const VOLUME_SCALE = 320;
const VOLUME_NOISE = 2500;
const MIN_DIFFICULTY = 15;
const MAX_DIFFICULTY = 90;
const DIFFICULTY_SCALE = 4;
const DIFFICULTY_NOISE = 25;
// CPC range assumes affordable niche terms between $0.25 base and an added $6 spread.
const CPC_BASE = 0.25;
const CPC_RANGE = 6;

type CacheEntry = { timestamp: number; data: KeywordAnalysis };

const cache = new Map<string, CacheEntry>();
let lastRequest = 0;

const providerLabel = 'Mock SERP + Trends';

const suggestionPool = [
  'seo tools',
  'keyword finder',
  'backlink checker',
  'long tail keywords',
  'content marketing',
  'blog post ideas',
  'keyword planner alternative',
  'featured snippet ideas',
  'topic cluster',
  'semantic keywords',
  'competitor analysis',
  'search intent',
  'technical seo',
  'site speed',
  'local seo',
  'voice search optimization',
  'ecommerce seo',
  'app store optimization',
  'google trends',
  'search volume',
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTrend(keyword: string): TrendPoint[] {
  const base = Math.max(
    TREND_MIN_VALUE,
    Math.min(TREND_MAX_VALUE, Math.floor(keyword.length * TREND_BASE_SCALE + Math.random() * TREND_RANDOM_RANGE)),
  );
  return Array.from({ length: 12 }, (_, idx) => ({
    label: `M${idx + 1}`,
    value: Math.max(
      10,
      Math.min(
        100,
        Math.floor(base + (Math.sin(idx) * TREND_WAVE_AMPLITUDE + Math.random() * TREND_NOISE_RANGE)),
      ),
    ),
  }));
}

function buildSerp(seed: string): SerpResult[] {
  const hosts = ['example.com', 'site.io', 'blog.dev', 'research.ai', 'guide.net', 'insights.co'];
  return Array.from({ length: 6 }, (_, idx) => ({
    title: `${seed} best practices ${idx + 1}`,
    url: `https://${hosts[idx % hosts.length]}/${seed.replace(/\s+/g, '-')}-${idx + 1}`,
    snippet: `Discover how to improve ${seed} performance with actionable steps and on-page optimizations.`,
    rank: idx + 1,
    features: idx === 0 ? ['Featured snippet'] : idx % 2 === 0 ? ['People Also Ask'] : ['Sitelinks'],
  }));
}

function pickSuggestions(seed: string) {
  const normalized = seed.toLowerCase();
  const seedHead = normalized.split(' ')[0] || 'seo';
  const related = suggestionPool.filter((item) => item.includes(seedHead)).slice(0, 6);
  const longTail = suggestionPool
    .filter((item) => item !== seed && item.length > normalized.length)
    .slice(0, 5)
    .map((item) => `${item} for ${seed}`);
  const questions = ['what', 'how', 'why', 'where', 'when', 'who']
    .slice(0, 4)
    .map((q) => `${q} to improve ${seed}?`);
  const relatedSearches = suggestionPool.filter((item) => item !== seed).slice(0, 6);

  return { related, longTail, questions, relatedSearches };
}

function generateMetrics(seed: string) {
  const baseVolume = Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, seed.length * VOLUME_SCALE + Math.random() * VOLUME_NOISE));
  const difficulty = Math.max(
    MIN_DIFFICULTY,
    Math.min(MAX_DIFFICULTY, Math.round(seed.length * DIFFICULTY_SCALE + Math.random() * DIFFICULTY_NOISE)),
  );
  const competition: 'Low' | 'Medium' | 'High' = difficulty > 65 ? 'High' : difficulty > 40 ? 'Medium' : 'Low';

  return {
    searchVolume: Math.round(baseVolume),
    difficulty,
    competition,
    cpc: parseFloat((Math.random() * CPC_RANGE + CPC_BASE).toFixed(2)),
  };
}

export async function getKeywordAnalysis(seedKeyword: string, provider = providerLabel): Promise<KeywordAnalysis> {
  const keyword = seedKeyword.trim();
  if (!keyword) {
    throw new Error('Please enter a keyword to analyze.');
  }

  const now = Date.now();
  const sinceLast = now - lastRequest;
  if (sinceLast < RATE_LIMIT_MS) {
    await delay(RATE_LIMIT_MS - sinceLast);
  }
  lastRequest = Date.now();

  const cached = cache.get(keyword.toLowerCase());
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const metrics = generateMetrics(keyword);
  const { related, longTail, questions, relatedSearches } = pickSuggestions(keyword);
  const analysis: KeywordAnalysis = {
    seedKeyword: keyword,
    provider,
    metrics: {
      keyword,
      ...metrics,
      region: 'Global',
      trend: buildTrend(keyword),
    },
    suggestions: related,
    longTail,
    questions,
    relatedSearches,
    serp: buildSerp(keyword),
    notes: 'Mock provider with cached responses and rate limiting.',
  };

  cache.set(keyword.toLowerCase(), { timestamp: Date.now(), data: analysis });
  return analysis;
}

export function formatKeywordExport(analysis: KeywordAnalysis, format: 'json' | 'csv'): string {
  if (format === 'json') {
    return JSON.stringify(analysis, null, 2);
  }

  const header = 'keyword,searchVolume,competition,difficulty,cpc,suggestions';
  const row = [
    analysis.metrics.keyword,
    analysis.metrics.searchVolume,
    analysis.metrics.competition,
    analysis.metrics.difficulty,
    analysis.metrics.cpc ?? 0,
    `"${analysis.suggestions.join('; ')}"`,
  ].join(',');
  return `${header}\n${row}`;
}
