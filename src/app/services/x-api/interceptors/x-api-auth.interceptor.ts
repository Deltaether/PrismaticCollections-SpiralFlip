import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * X API Authentication Interceptor
 *
 * Automatically adds Bearer Token authentication to X API requests
 * and handles authentication errors consistently across the application.
 *
 * Features:
 * - Automatic Bearer Token injection for X API requests
 * - Centralized authentication error handling
 * - Request/response logging for debugging
 * - CORS header management for X API
 *
 * @see https://docs.x.com/x-api/authentication/overview
 */

export interface XApiConfig {
  bearerToken: string;
  enableLogging?: boolean;
}

@Injectable()
export class XApiAuthInterceptor implements HttpInterceptor {
  private bearerToken: string | null = null;
  private enableLogging = false;

  /**
   * Configure the interceptor with authentication details
   */
  configure(config: XApiConfig): void {
    this.bearerToken = config.bearerToken;
    this.enableLogging = config.enableLogging || false;

    if (this.enableLogging) {
      console.log('🔑 X API Auth Interceptor configured');
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept X API requests
    if (!this.isXApiRequest(req.url)) {
      return next.handle(req);
    }

    // Check if Bearer Token is available
    if (!this.bearerToken) {
      const error = new Error('X API Bearer Token not configured. Call XApiAuthInterceptor.configure() first.');
      console.error('❌', error.message);
      return throwError(() => error);
    }

    // Clone request and add authentication headers
    const authenticatedReq = this.addAuthHeaders(req);

    if (this.enableLogging) {
      console.log(`🌐 X API Request: ${req.method} ${req.url}`);
      console.log('📋 Headers:', authenticatedReq.headers.keys().map(key => `${key}: ${authenticatedReq.headers.get(key)}`));
    }

    return next.handle(authenticatedReq).pipe(
      tap(event => {
        if (this.enableLogging && event.type === 4) { // HttpEventType.Response
          console.log(`✅ X API Response: ${req.method} ${req.url}`);
        }
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error, req))
    );
  }

  private isXApiRequest(url: string): boolean {
    return url.includes('api.x.com') || url.includes('api.twitter.com');
  }

  private addAuthHeaders(req: HttpRequest<any>): HttpRequest<any> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    };

    // Add CORS headers if needed for browser requests
    if (this.isBrowserEnvironment()) {
      headers['Access-Control-Allow-Origin'] = '*';
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    return req.clone({
      setHeaders: headers
    });
  }

  private handleAuthError(error: HttpErrorResponse, req: HttpRequest<any>): Observable<never> {
    let errorMessage = 'X API request failed';
    let errorCode = 'UNKNOWN_ERROR';

    switch (error.status) {
      case 401:
        errorMessage = 'X API authentication failed. Bearer Token may be invalid or expired.';
        errorCode = 'AUTH_FAILED';
        console.error('🔐 Authentication Error:', errorMessage);
        break;

      case 403:
        errorMessage = 'X API access forbidden. Check account permissions and rate limits.';
        errorCode = 'ACCESS_FORBIDDEN';
        console.error('🚫 Authorization Error:', errorMessage);
        break;

      case 429:
        errorMessage = 'X API rate limit exceeded. Retry after reset time.';
        errorCode = 'RATE_LIMITED';
        const resetTime = error.headers.get('x-rate-limit-reset');
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000);
          errorMessage += ` Reset at: ${resetDate.toISOString()}`;
        }
        console.warn('⏱️ Rate Limit Error:', errorMessage);
        break;

      case 404:
        errorMessage = 'X API resource not found.';
        errorCode = 'NOT_FOUND';
        console.warn('🔍 Not Found Error:', errorMessage);
        break;

      case 0:
        errorMessage = 'X API request failed. Check network connection and CORS policy.';
        errorCode = 'NETWORK_ERROR';
        console.error('🌐 Network Error:', errorMessage);
        break;

      default:
        if (error.error?.errors) {
          errorMessage = error.error.errors.map((e: any) => e.detail || e.message).join('; ');
          errorCode = 'API_ERROR';
        }
        console.error('❌ X API Error:', errorMessage, error);
    }

    // Enhance error with additional context
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).code = errorCode;
    (enhancedError as any).status = error.status;
    (enhancedError as any).originalError = error;
    (enhancedError as any).request = {
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    };

    // Add rate limit info if available
    if (error.headers) {
      const rateLimitInfo = {
        limit: error.headers.get('x-rate-limit-limit'),
        remaining: error.headers.get('x-rate-limit-remaining'),
        reset: error.headers.get('x-rate-limit-reset')
      };

      if (rateLimitInfo.limit) {
        (enhancedError as any).rateLimit = rateLimitInfo;
      }
    }

    return throwError(() => enhancedError);
  }

  private isBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  /**
   * Get current Bearer Token (for debugging)
   */
  getCurrentToken(): string | null {
    return this.bearerToken;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.bearerToken = null;
    if (this.enableLogging) {
      console.log('🔑 Bearer Token cleared');
    }
  }
}