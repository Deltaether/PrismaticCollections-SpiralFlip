import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { XApiError } from './interfaces/x-api.interfaces';

/**
 * X API Error Handling Service
 *
 * Centralized error handling for X API V2 with proper error categorization,
 * user-friendly messages, and recovery strategies.
 *
 * Features:
 * - Comprehensive error categorization
 * - User-friendly error messages
 * - Error recovery suggestions
 * - Error logging and analytics
 * - Rate limit specific handling
 * - Authentication error handling
 *
 * @see https://docs.x.com/x-api/troubleshooting/error-codes
 */

export enum XApiErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate_limit',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN = 'unknown'
}

export interface ProcessedXApiError {
  /** Original error object */
  originalError: any;

  /** Error category for handling */
  category: XApiErrorCategory;

  /** HTTP status code */
  statusCode: number;

  /** User-friendly error message */
  userMessage: string;

  /** Technical error message for developers */
  technicalMessage: string;

  /** Suggested recovery actions */
  recoveryActions: string[];

  /** Whether error is retryable */
  retryable: boolean;

  /** Recommended retry delay in milliseconds */
  retryDelayMs?: number;

  /** X API specific error details */
  apiErrors?: XApiError[];

  /** Rate limit information if applicable */
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    resetTime: Date;
  };

  /** Context information */
  context: {
    endpoint: string;
    method: string;
    timestamp: Date;
  };
}

export interface ErrorStats {
  totalErrors: number;
  errorsByCategory: Record<XApiErrorCategory, number>;
  errorsByEndpoint: Record<string, number>;
  recentErrors: ProcessedXApiError[];
  averageErrorRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class XApiErrorService {
  private errorLog: ProcessedXApiError[] = [];
  private readonly MAX_ERROR_LOG_SIZE = 100;

  // Reactive error statistics
  private errorStatsSignal = signal<ErrorStats>({
    totalErrors: 0,
    errorsByCategory: {} as Record<XApiErrorCategory, number>,
    errorsByEndpoint: {},
    recentErrors: [],
    averageErrorRate: 0
  });

  readonly errorStats = this.errorStatsSignal.asReadonly();

  /**
   * Process and categorize an error from X API
   */
  processError(
    error: any,
    context: { endpoint: string; method: string }
  ): ProcessedXApiError {
    const processedError = this.createProcessedError(error, context);
    this.logError(processedError);
    this.updateErrorStats();
    return processedError;
  }

  /**
   * Handle error and return appropriate Observable
   */
  handleError(
    error: any,
    context: { endpoint: string; method: string }
  ): Observable<never> {
    const processedError = this.processError(error, context);

    // Log based on severity
    if (processedError.category === XApiErrorCategory.SERVER_ERROR) {
      console.error('🚨 X API Server Error:', processedError);
    } else if (processedError.category === XApiErrorCategory.RATE_LIMIT) {
      console.warn('⏱️ X API Rate Limit:', processedError.userMessage);
    } else if (processedError.retryable) {
      console.warn('🔄 X API Retryable Error:', processedError.userMessage);
    } else {
      console.error('❌ X API Error:', processedError.userMessage);
    }

    return throwError(() => processedError);
  }

  /**
   * Get user-friendly error message for display
   */
  getUserMessage(error: any): string {
    if (error.userMessage) {
      return error.userMessage;
    }

    // Fallback processing for raw errors
    const processed = this.createProcessedError(error, { endpoint: 'unknown', method: 'unknown' });
    return processed.userMessage;
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: any): boolean {
    if (error.retryable !== undefined) {
      return error.retryable;
    }

    const processed = this.createProcessedError(error, { endpoint: 'unknown', method: 'unknown' });
    return processed.retryable;
  }

  /**
   * Get recommended retry delay
   */
  getRetryDelay(error: any): number {
    if (error.retryDelayMs) {
      return error.retryDelayMs;
    }

    const processed = this.createProcessedError(error, { endpoint: 'unknown', method: 'unknown' });
    return processed.retryDelayMs || 1000;
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
    this.updateErrorStats();
    console.log('🗑️ Error log cleared');
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): ProcessedXApiError[] {
    return this.errorLog.slice(-limit);
  }

  private createProcessedError(
    error: any,
    context: { endpoint: string; method: string }
  ): ProcessedXApiError {
    const statusCode = error.status || error.statusCode || 0;
    const timestamp = new Date();

    // Extract X API specific errors
    const apiErrors: XApiError[] = error.error?.errors || [];

    // Determine category and create appropriate response
    const category = this.categorizeError(statusCode, apiErrors, error);
    const messages = this.createErrorMessages(category, statusCode, apiErrors, error);
    const retryInfo = this.getRetryInfo(category, statusCode, error);
    const rateLimitInfo = this.extractRateLimitInfo(error);

    return {
      originalError: error,
      category,
      statusCode,
      userMessage: messages.userMessage,
      technicalMessage: messages.technicalMessage,
      recoveryActions: messages.recoveryActions,
      retryable: retryInfo.retryable,
      retryDelayMs: retryInfo.delayMs,
      apiErrors: apiErrors.length > 0 ? apiErrors : undefined,
      rateLimitInfo,
      context: {
        ...context,
        timestamp
      }
    };
  }

  private categorizeError(
    statusCode: number,
    apiErrors: XApiError[],
    error: any
  ): XApiErrorCategory {
    // Network errors
    if (statusCode === 0 || error.name === 'NetworkError') {
      return XApiErrorCategory.NETWORK_ERROR;
    }

    // HTTP status code based categorization
    switch (statusCode) {
      case 401:
        return XApiErrorCategory.AUTHENTICATION;
      case 403:
        return XApiErrorCategory.AUTHORIZATION;
      case 404:
        return XApiErrorCategory.NOT_FOUND;
      case 422:
        return XApiErrorCategory.VALIDATION;
      case 429:
        return XApiErrorCategory.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
      case 504:
        return XApiErrorCategory.SERVER_ERROR;
      default:
        // Check API errors for more specific categorization
        if (apiErrors.length > 0) {
          const errorTypes = apiErrors.map(e => e.type);
          if (errorTypes.includes('authentication')) {
            return XApiErrorCategory.AUTHENTICATION;
          }
          if (errorTypes.includes('authorization')) {
            return XApiErrorCategory.AUTHORIZATION;
          }
          if (errorTypes.includes('validation')) {
            return XApiErrorCategory.VALIDATION;
          }
        }
        return XApiErrorCategory.UNKNOWN;
    }
  }

  private createErrorMessages(
    category: XApiErrorCategory,
    statusCode: number,
    apiErrors: XApiError[],
    error: any
  ): { userMessage: string; technicalMessage: string; recoveryActions: string[] } {
    let userMessage = 'An error occurred while connecting to X (Twitter)';
    let technicalMessage = `HTTP ${statusCode}`;
    let recoveryActions: string[] = [];

    // Use API error details if available
    if (apiErrors.length > 0) {
      userMessage = apiErrors[0].detail;
      technicalMessage = apiErrors.map(e => `${e.title}: ${e.detail}`).join('; ');
    }

    switch (category) {
      case XApiErrorCategory.AUTHENTICATION:
        userMessage = 'Authentication failed. Please check your X API credentials.';
        recoveryActions = [
          'Verify your Bearer Token is correct',
          'Check if your API credentials have expired',
          'Ensure your app has the required permissions'
        ];
        break;

      case XApiErrorCategory.AUTHORIZATION:
        userMessage = 'Access denied. You don\'t have permission to access this resource.';
        recoveryActions = [
          'Check if your app has the required scopes',
          'Verify the user has given permission',
          'Contact X API support if you believe this is an error'
        ];
        break;

      case XApiErrorCategory.RATE_LIMIT:
        const resetTime = this.extractRateLimitInfo(error)?.resetTime;
        userMessage = `Rate limit exceeded. ${resetTime ? `Try again after ${resetTime.toLocaleTimeString()}` : 'Please try again later.'}`;
        recoveryActions = [
          'Wait for the rate limit to reset',
          'Implement request queuing in your application',
          'Consider upgrading your API plan for higher limits'
        ];
        break;

      case XApiErrorCategory.NOT_FOUND:
        userMessage = 'The requested resource was not found.';
        recoveryActions = [
          'Check if the username or ID is correct',
          'Verify the resource still exists',
          'Ensure you have permission to access this resource'
        ];
        break;

      case XApiErrorCategory.VALIDATION:
        userMessage = 'Invalid request parameters.';
        if (apiErrors.length > 0) {
          userMessage = apiErrors.map(e => e.detail).join('; ');
        }
        recoveryActions = [
          'Check your request parameters',
          'Refer to the X API documentation for valid values',
          'Ensure all required fields are provided'
        ];
        break;

      case XApiErrorCategory.SERVER_ERROR:
        userMessage = 'X API is experiencing issues. Please try again later.';
        recoveryActions = [
          'Try again in a few minutes',
          'Check X API status page for known issues',
          'Implement retry logic with exponential backoff'
        ];
        break;

      case XApiErrorCategory.NETWORK_ERROR:
        userMessage = 'Network connection failed. Please check your internet connection.';
        recoveryActions = [
          'Check your internet connection',
          'Verify firewall settings',
          'Try again in a moment'
        ];
        break;

      default:
        userMessage = 'An unexpected error occurred with the X API.';
        recoveryActions = [
          'Try again later',
          'Check the X API status page',
          'Contact support if the issue persists'
        ];
    }

    return { userMessage, technicalMessage, recoveryActions };
  }

  private getRetryInfo(
    category: XApiErrorCategory,
    statusCode: number,
    error: any
  ): { retryable: boolean; delayMs?: number } {
    switch (category) {
      case XApiErrorCategory.RATE_LIMIT:
        const rateLimitInfo = this.extractRateLimitInfo(error);
        return {
          retryable: true,
          delayMs: rateLimitInfo ?
            Math.max(rateLimitInfo.resetTime.getTime() - Date.now(), 1000) :
            60000 // Default 1 minute
        };

      case XApiErrorCategory.SERVER_ERROR:
        return {
          retryable: true,
          delayMs: Math.min(1000 * Math.pow(2, 3), 30000) // Exponential backoff, max 30s
        };

      case XApiErrorCategory.NETWORK_ERROR:
        return {
          retryable: true,
          delayMs: 5000 // 5 second delay for network issues
        };

      case XApiErrorCategory.AUTHENTICATION:
      case XApiErrorCategory.AUTHORIZATION:
      case XApiErrorCategory.NOT_FOUND:
      case XApiErrorCategory.VALIDATION:
        return { retryable: false };

      default:
        return {
          retryable: statusCode >= 500,
          delayMs: 2000
        };
    }
  }

  private extractRateLimitInfo(error: any): {
    limit: number;
    remaining: number;
    resetTime: Date;
  } | undefined {
    const headers = error.headers;
    if (!headers) return undefined;

    const limit = headers.get('x-rate-limit-limit');
    const remaining = headers.get('x-rate-limit-remaining');
    const reset = headers.get('x-rate-limit-reset');

    if (limit && remaining && reset) {
      return {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        resetTime: new Date(parseInt(reset) * 1000)
      };
    }

    return undefined;
  }

  private logError(error: ProcessedXApiError): void {
    this.errorLog.push(error);

    // Maintain log size limit
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(-this.MAX_ERROR_LOG_SIZE);
    }
  }

  private updateErrorStats(): void {
    const stats: ErrorStats = {
      totalErrors: this.errorLog.length,
      errorsByCategory: {} as Record<XApiErrorCategory, number>,
      errorsByEndpoint: {},
      recentErrors: this.errorLog.slice(-10),
      averageErrorRate: 0
    };

    // Initialize category counters
    Object.values(XApiErrorCategory).forEach(category => {
      stats.errorsByCategory[category] = 0;
    });

    // Count errors by category and endpoint
    this.errorLog.forEach(error => {
      stats.errorsByCategory[error.category]++;

      const endpoint = error.context.endpoint;
      stats.errorsByEndpoint[endpoint] = (stats.errorsByEndpoint[endpoint] || 0) + 1;
    });

    // Calculate error rate (errors per minute for last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentErrors = this.errorLog.filter(
      error => error.context.timestamp > oneHourAgo
    );
    stats.averageErrorRate = recentErrors.length / 60; // errors per minute

    this.errorStatsSignal.set(stats);
  }
}