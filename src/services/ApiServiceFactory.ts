// API Service Factory - Easy switching between different APIs

import { BaseApiService } from './BaseApiService';
import { MockApiService } from './MockApiService';
import { API_CONFIGS } from '../config/api';

export class ApiServiceFactory {
  private static instances: Map<string, BaseApiService> = new Map();

  static getService(apiType: string = 'mock'): BaseApiService {
    if (!this.instances.has(apiType)) {
      const config = API_CONFIGS[apiType];
      
      if (!config || !config.enabled) {
        console.warn(`API ${apiType} not available, falling back to mock`);
        return this.getService('mock');
      }

      let service: BaseApiService;

      switch (config.type) {
        case 'mock':
          service = new MockApiService();
          break;
        
        // Placeholder for other API implementations
        case 'google-trends':
          // For now, use mock. In production, implement GoogleTrendsService
          console.warn('Google Trends API not yet implemented, using mock');
          service = new MockApiService();
          break;

        case 'keyword-planner':
          console.warn('Google Keyword Planner API not yet implemented, using mock');
          service = new MockApiService();
          break;

        case 'semrush':
          console.warn('SEMrush API not yet implemented, using mock');
          service = new MockApiService();
          break;

        case 'ahrefs':
          console.warn('Ahrefs API not yet implemented, using mock');
          service = new MockApiService();
          break;

        default:
          service = new MockApiService();
      }

      this.instances.set(apiType, service);
    }

    return this.instances.get(apiType)!;
  }

  static clearInstances(): void {
    this.instances.clear();
  }
}

export const getApiService = (apiType?: string) => {
  return ApiServiceFactory.getService(apiType);
};
