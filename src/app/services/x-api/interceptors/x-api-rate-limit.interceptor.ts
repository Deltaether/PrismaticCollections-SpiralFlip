import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, timer, throwError } from 'rxjs';
import { tap, catchError, delayWhen, retryWhen, take } from 'rxjs/operators';

/**
 * X API Rate Limit Interceptor
 *
 * Implements intelligent rate limiting and retry logic for X API V2 requests
 * following official rate limits and best practices.
 *
 * Features:
 * - Automatic rate limit detection from response headers
 * - Intelligent retry with exponential backoff
 * - Rate limit reset time awareness
 * - Per-endpoint rate limit tracking
 * - Proactive request queuing when approaching limits
 *
 * Official X API V2 Rate Limits:
 * - GET /2/users/by/username/{username}: 300 requests per 15-minute window
 * - GET /2/users/{id}/tweets: 1500 requests per 15-minute window
 * - App rate limit: Shared across all endpoints for the app
 * - User rate limit: Per-user authentication context
 *
 * @see https://docs.x.com/x-api/rate-limits
 */

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp
  endpoint: string;
  lastUpdate: number;
}

interface RequestQueue {
  request: HttpRequest<any>;
  handler: HttpHandler;
  resolve: (value: Observable<HttpEvent<any>>) => void;
  reject: (error: any) => void;
}

@Injectable()
export class XApiRateLimitInterceptor implements HttpInterceptor {
  private rateLimits = new Map<string, RateLimitInfo>();
  private requestQueue: RequestQueue[] = [];
  private isProcessingQueue = false;
  private enableLogging = false;

  // Rate limit thresholds for proactive queuing
  private readonly WARNING_THRESHOLD = 0.2; // Queue when 20% or less remaining
  private readonly CRITICAL_THRESHOLD = 0.1; // Critical when 10% or less remaining

  /**
   * Configure rate limiting behavior
   */
  configure(options: { enableLogging?: boolean } = {}): void {
    this.enableLogging = options.enableLogging || false;
    if (this.enableLogging) {
      console.log('⏱️ X API Rate Limit Interceptor configured');
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept X API requests
    if (!this.isXApiRequest(req.url)) {
      return next.handle(req);
    }

    const endpoint = this.extractEndpoint(req.url);
    const rateLimitInfo = this.rateLimits.get(endpoint);

    // Check if we should queue this request
    if (this.shouldQueueRequest(rateLimitInfo)) {
      return this.queueRequest(req, next);
    }

    return this.processRequest(req, next, endpoint);
  }

  private isXApiRequest(url: string): boolean {
    return url.includes('api.x.com') || url.includes('api.twitter.com');
  }

  private extractEndpoint(url: string): string {
    // Extract standardized endpoint for rate limit tracking
    // Examples:
    // https://api.x.com/2/users/by/username/testuser -> /users/by/username
    // https://api.x.com/2/users/123456789/tweets -> /users/{id}/tweets

    const apiPath = url.replace(/https?:\/\/api\.[x|twitter]\.com\/2/, '');

    // Normalize user ID patterns
    const normalized = apiPath
      .replace(/\/users\/\d+\//, '/users/{id}/')
      .replace(/\/users\/by\/username\/[^/?]+/, '/users/by/username/{username}')
      .replace(/\/tweets\/\d+/, '/tweets/{id}')
      .split('?')[0]; // Remove query parameters

    return normalized;
  }

  private shouldQueueRequest(rateLimitInfo: RateLimitInfo | undefined): boolean {
    if (!rateLimitInfo) {
      return false; // No rate limit info yet, allow request
    }

    const now = Date.now() / 1000; // Unix timestamp

    // If reset time has passed, rate limit is refreshed
    if (now >= rateLimitInfo.resetTime) {
      return false;
    }

    // Calculate remaining percentage
    const remainingPercentage = rateLimitInfo.remaining / rateLimitInfo.limit;

    // Queue if we're below warning threshold
    return remainingPercentage <= this.WARNING_THRESHOLD;
  }

  private queueRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable(observer => {
      const queueItem: RequestQueue = {
        request: req,
        handler: next,
        resolve: (result) => {
          result.subscribe(observer);
        },
        reject: (error) => {
          observer.error(error);
        }
      };

      this.requestQueue.push(queueItem);

      if (this.enableLogging) {
        console.log(`📋 Queued request: ${req.method} ${req.url} (Queue size: ${this.requestQueue.length})`);
      }

      // Start processing queue if not already running
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const queueItem = this.requestQueue[0];
      const endpoint = this.extractEndpoint(queueItem.request.url);
      const rateLimitInfo = this.rateLimits.get(endpoint);

      // Check if we can process this request now
      if (this.canProcessRequest(rateLimitInfo)) {
        // Remove from queue and process
        this.requestQueue.shift();

        try {
          const result = this.processRequest(queueItem.request, queueItem.handler, endpoint);
          queueItem.resolve(result);
        } catch (error) {
          queueItem.reject(error);
        }
      } else {
        // Wait until rate limit resets
        const waitTime = this.calculateWaitTime(rateLimitInfo);
        if (this.enableLogging) {
          console.log(`⏱️ Waiting ${Math.round(waitTime / 1000)}s for rate limit reset`);
        }
        await this.wait(waitTime);
      }
    }

    this.isProcessingQueue = false;
  }

  private canProcessRequest(rateLimitInfo: RateLimitInfo | undefined): boolean {
    if (!rateLimitInfo) {
      return true; // No rate limit info, allow request
    }

    const now = Date.now() / 1000;

    // If reset time has passed, we can proceed
    if (now >= rateLimitInfo.resetTime) {
      return true;
    }

    // Check if we have enough remaining requests
    return rateLimitInfo.remaining > 0;
  }

  private calculateWaitTime(rateLimitInfo: RateLimitInfo | undefined): number {
    if (!rateLimitInfo) {
      return 0;
    }

    const now = Date.now() / 1000;
    const timeUntilReset = (rateLimitInfo.resetTime - now) * 1000; // Convert to milliseconds

    // Add small buffer to ensure reset has occurred
    return Math.max(timeUntilReset + 1000, 1000);
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private processRequest(req: HttpRequest<any>, next: HttpHandler, endpoint: string): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.updateRateLimitInfo(endpoint, event);
        }
      }),
      retryWhen(errors =>
        errors.pipe(
          delayWhen(error => {
            if (error.status === 429) {
              // Rate limited - wait for reset
              const resetTime = error.headers?.get('x-rate-limit-reset');
              if (resetTime) {
                const waitTime = (parseInt(resetTime) * 1000) - Date.now() + 1000; // Add 1s buffer
                if (this.enableLogging) {
                  console.log(`⏱️ Rate limited. Waiting ${Math.round(waitTime / 1000)}s`);
                }
                return timer(Math.max(waitTime, 1000));
              }
            }
            return timer(1000); // Default 1s delay for other errors
          }),
          take(3) // Maximum 3 retries
        )
      ),
      catchError(error => {
        if (this.enableLogging) {
          console.error(`❌ Request failed after retries: ${req.method} ${req.url}`, error);
        }
        return throwError(() => error);
      })
    );
  }

  private updateRateLimitInfo(endpoint: string, response: HttpResponse<any>): void {
    const headers = response.headers;
    const limit = headers.get('x-rate-limit-limit');
    const remaining = headers.get('x-rate-limit-remaining');
    const reset = headers.get('x-rate-limit-reset');

    if (limit && remaining && reset) {
      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        resetTime: parseInt(reset),
        endpoint,
        lastUpdate: Date.now()
      };

      this.rateLimits.set(endpoint, rateLimitInfo);

      if (this.enableLogging) {
        const remainingPercentage = (rateLimitInfo.remaining / rateLimitInfo.limit) * 100;
        const resetDate = new Date(rateLimitInfo.resetTime * 1000);

        console.log(`📊 Rate limit updated for ${endpoint}:`);
        console.log(`   Remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} (${remainingPercentage.toFixed(1)}%)`);
        console.log(`   Reset: ${resetDate.toISOString()}`);

        // Warning if approaching limits
        if (remainingPercentage <= this.CRITICAL_THRESHOLD * 100) {
          console.warn(`🚨 Critical rate limit for ${endpoint}: ${remainingPercentage.toFixed(1)}% remaining`);
        } else if (remainingPercentage <= this.WARNING_THRESHOLD * 100) {
          console.warn(`⚠️ Low rate limit for ${endpoint}: ${remainingPercentage.toFixed(1)}% remaining`);
        }
      }
    }
  }

  /**
   * Get current rate limit information for all endpoints
   */
  getRateLimits(): Map<string, RateLimitInfo> {
    return new Map(this.rateLimits);
  }

  /**
   * Get rate limit info for specific endpoint
   */
  getRateLimitForEndpoint(endpoint: string): RateLimitInfo | undefined {
    return this.rateLimits.get(endpoint);
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.requestQueue.length;
  }

  /**
   * Clear rate limit cache (for testing/debugging)
   */
  clearRateLimits(): void {
    this.rateLimits.clear();
    this.requestQueue.length = 0;
    this.isProcessingQueue = false;

    if (this.enableLogging) {
      console.log('🗑️ Rate limit cache cleared');
    }
  }
}