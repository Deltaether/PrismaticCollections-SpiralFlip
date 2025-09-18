import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Twitter Proxy Service - CORS Bypass Solution
 *
 * This service provides multiple strategies to bypass CORS restrictions:
 * 1. Local proxy server (if available)
 * 2. Public CORS proxy services
 * 3. Direct API with JSONP (limited)
 * 4. Fallback to embed widget data extraction
 */

export interface ProxyConfig {
  enabled: boolean;
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface TwitterApiResponse {
  data?: any;
  includes?: any;
  meta?: any;
  errors?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TwitterProxyService {

  private readonly proxyConfigs: ProxyConfig[] = [
    // Local development proxy (if user sets one up)
    {
      enabled: false, // Disabled by default - user must set up local proxy
      baseUrl: 'http://localhost:3001/api/twitter',
      timeout: 10000,
      retries: 1
    },
    // AllOrigins (more reliable for JSON data)
    {
      enabled: environment.features.debugMode,
      baseUrl: 'https://api.allorigins.win/get?url=',
      timeout: 20000,
      retries: 1
    },
    // CORS.lol (backup option)
    {
      enabled: false, // Disabled due to rate limiting issues
      baseUrl: 'https://cors.lol/',
      timeout: 15000,
      retries: 1
    },
    // CorsProxy.io (limited to 1MB, but better authentication)
    {
      enabled: false, // Disabled due to 401 authentication issues
      baseUrl: 'https://corsproxy.io/?',
      timeout: 15000,
      retries: 1
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Attempt to fetch user data through available proxies
   */
  getUserByUsername(username: string, authHeaders: HttpHeaders): Observable<TwitterApiResponse> {
    const url = `https://api.x.com/2/users/by/username/${username}`;
    const params = {
      'user.fields': 'id,name,username,description,profile_image_url,public_metrics,verified'
    };

    return this.tryProxies('GET', url, { headers: authHeaders, params });
  }

  /**
   * Attempt to fetch user tweets through available proxies
   */
  getUserTweets(userId: string, authHeaders: HttpHeaders): Observable<TwitterApiResponse> {
    const url = `https://api.x.com/2/users/${userId}/tweets`;
    const params = {
      'tweet.fields': 'id,text,created_at,author_id,public_metrics,attachments',
      'expansions': 'author_id,attachments.media_keys',
      'media.fields': 'url,preview_image_url,type',
      'user.fields': 'id,name,username,profile_image_url',
      'max_results': '10'
    };

    return this.tryProxies('GET', url, { headers: authHeaders, params });
  }

  /**
   * Try multiple proxy strategies in order of preference
   */
  private tryProxies(
    method: string,
    targetUrl: string,
    options: any
  ): Observable<TwitterApiResponse> {

    const enabledProxies = this.proxyConfigs.filter(config => config.enabled);

    if (enabledProxies.length === 0) {
      console.warn('🚫 No proxy services enabled, falling back to direct request');
      return this.attemptDirectRequest(targetUrl, options);
    }

    // Try each proxy in sequence
    return this.tryProxySequence(enabledProxies, 0, method, targetUrl, options);
  }

  /**
   * Recursively try proxy services until one succeeds
   */
  private tryProxySequence(
    proxies: ProxyConfig[],
    index: number,
    method: string,
    targetUrl: string,
    options: any
  ): Observable<TwitterApiResponse> {

    if (index >= proxies.length) {
      console.warn('🚫 All proxy attempts failed, trying direct request');
      return this.attemptDirectRequest(targetUrl, options);
    }

    const proxy = proxies[index];
    console.log(`🔄 Trying proxy ${index + 1}/${proxies.length}: ${proxy.baseUrl}`);

    return this.makeProxyRequest(proxy, method, targetUrl, options).pipe(
      catchError(error => {
        console.warn(`❌ Proxy ${index + 1} failed:`, error.message);
        // Try next proxy
        return this.tryProxySequence(proxies, index + 1, method, targetUrl, options);
      })
    );
  }

  /**
   * Make request through specific proxy
   */
  private makeProxyRequest(
    proxy: ProxyConfig,
    method: string,
    targetUrl: string,
    options: any
  ): Observable<TwitterApiResponse> {

    let proxyUrl: string;
    let requestOptions: any = { ...options };

    if (proxy.baseUrl.includes('localhost:3001')) {
      // Local proxy - pass through as-is
      proxyUrl = `${proxy.baseUrl}${targetUrl.replace('https://api.x.com/2', '')}`;
    } else if (proxy.baseUrl.includes('allorigins.win')) {
      // AllOrigins proxy
      const fullUrl = this.buildUrlWithParams(targetUrl, options.params);
      proxyUrl = `${proxy.baseUrl}${encodeURIComponent(fullUrl)}`;
      requestOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    } else if (proxy.baseUrl.includes('corsproxy.io')) {
      // CORS Proxy
      const fullUrl = this.buildUrlWithParams(targetUrl, options.params);
      proxyUrl = `${proxy.baseUrl}${encodeURIComponent(fullUrl)}`;
      requestOptions = { ...options };
    } else {
      // Generic proxy
      proxyUrl = `${proxy.baseUrl}${targetUrl}`;
    }

    return this.http.get<any>(proxyUrl, requestOptions).pipe(
      timeout(proxy.timeout),
      map(response => this.normalizeProxyResponse(response, proxy)),
      catchError(error => {
        throw new Error(`Proxy request failed: ${error.message}`);
      })
    );
  }

  /**
   * Attempt direct request (will likely fail due to CORS)
   */
  private attemptDirectRequest(targetUrl: string, options: any): Observable<TwitterApiResponse> {
    console.log('🔄 Attempting direct request (expected to fail due to CORS - using for diagnostic purposes)');

    const fullUrl = this.buildUrlWithParams(targetUrl, options.params);

    return this.http.get<TwitterApiResponse>(fullUrl, {
      headers: options.headers
    }).pipe(
      timeout(10000),
      catchError(error => {
        if (error.status === 0 || error.message.includes('CORS')) {
          console.warn('⚠️ CORS error confirmed - this is expected for browser-based requests');
          console.info('💡 Recommendation: Use Twitter embed widgets instead of direct API calls from browser');
          return throwError(() => new Error('CORS_ERROR: Browser blocks direct Twitter API access. Use embed widgets or server-side proxy.'));
        }
        if (error.status === 401) {
          console.error('❌ Authentication failed - check OAuth credentials');
          return throwError(() => new Error('AUTH_ERROR: Invalid Twitter API credentials'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Build URL with query parameters
   */
  private buildUrlWithParams(baseUrl: string, params?: any): string {
    if (!params) return baseUrl;

    const urlParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key].toString());
      }
    });

    const paramString = urlParams.toString();
    return paramString ? `${baseUrl}?${paramString}` : baseUrl;
  }

  /**
   * Normalize response from different proxy services
   */
  private normalizeProxyResponse(response: any, proxy: ProxyConfig): TwitterApiResponse {
    if (proxy.baseUrl.includes('allorigins.win')) {
      // AllOrigins wraps response in { contents: "..." }
      try {
        const contents = response.contents;
        return typeof contents === 'string' ? JSON.parse(contents) : contents;
      } catch (e) {
        throw new Error('Failed to parse AllOrigins response');
      }
    } else if (proxy.baseUrl.includes('localhost:3001')) {
      // Local proxy should return data directly
      return response;
    } else {
      // Direct or other proxy response
      return response;
    }
  }

  /**
   * Check if any proxy is available
   */
  async checkProxyAvailability(): Promise<{
    available: ProxyConfig[];
    unavailable: ProxyConfig[];
  }> {
    const results = await Promise.allSettled(
      this.proxyConfigs
        .filter(config => config.enabled)
        .map(config => this.testProxy(config))
    );

    const available: ProxyConfig[] = [];
    const unavailable: ProxyConfig[] = [];

    results.forEach((result, index) => {
      const config = this.proxyConfigs.filter(c => c.enabled)[index];
      if (result.status === 'fulfilled') {
        available.push(config);
      } else {
        unavailable.push(config);
      }
    });

    return { available, unavailable };
  }

  /**
   * Test if a proxy is responsive
   */
  private testProxy(config: ProxyConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const testUrl = config.baseUrl.includes('localhost')
        ? `${config.baseUrl}/health`
        : `${config.baseUrl}${encodeURIComponent('https://httpbin.org/get')}`;

      this.http.get(testUrl).pipe(
        timeout(5000),
        catchError(() => of(null))
      ).subscribe({
        next: (response) => {
          if (response) {
            resolve(true);
          } else {
            reject(new Error('No response'));
          }
        },
        error: () => reject(new Error('Request failed'))
      });
    });
  }

  /**
   * Get proxy configuration for debugging
   */
  getProxyConfig() {
    return {
      configs: this.proxyConfigs,
      enabled: this.proxyConfigs.filter(c => c.enabled).length,
      total: this.proxyConfigs.length
    };
  }

  /**
   * Enable/disable specific proxy by URL
   */
  setProxyEnabled(baseUrl: string, enabled: boolean): void {
    const config = this.proxyConfigs.find(c => c.baseUrl === baseUrl);
    if (config) {
      config.enabled = enabled;
      console.log(`🔧 Proxy ${baseUrl} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}