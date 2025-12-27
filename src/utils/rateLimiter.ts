// Rate limiter utility for API requests

class RateLimiter {
  private queue: Array<() => void> = [];
  private processing = false;
  private lastRequestTime = 0;
  private requestsInLastMinute: number[] = [];
  private delay: number;
  private maxRequestsPerMinute: number;

  constructor(delay: number = 1000, maxRequestsPerMinute: number = 60) {
    this.delay = delay;
    this.maxRequestsPerMinute = maxRequestsPerMinute;
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Clean up old requests from the minute counter
      const now = Date.now();
      this.requestsInLastMinute = this.requestsInLastMinute.filter(
        time => now - time < 60000
      );

      // Check if we've hit the rate limit
      if (this.requestsInLastMinute.length >= this.maxRequestsPerMinute) {
        const oldestRequest = this.requestsInLastMinute[0];
        const waitTime = 60000 - (now - oldestRequest);
        await this.sleep(waitTime);
        continue;
      }

      // Wait for the delay between requests
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.delay) {
        await this.sleep(this.delay - timeSinceLastRequest);
      }

      const task = this.queue.shift();
      if (task) {
        this.lastRequestTime = Date.now();
        this.requestsInLastMinute.push(this.lastRequestTime);
        await task();
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const rateLimiter = new RateLimiter(1000, 60);
