import { Injectable, signal, computed, inject, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, timer, retry, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Twitter Error Boundary Service
 *
 * Provides comprehensive error handling, retry logic, and fallback strategies
 * for the Twitter integration system. Designed for production-grade resilience.
 *
 * Features:
 * - Exponential backoff retry strategies
 * - Circuit breaker pattern for API failures
 * - Graceful degradation modes
 * - Error reporting and analytics
 * - User-friendly error messages
 * - Recovery mechanisms
 */

export interface TwitterError {
  readonly code: string;
  readonly message: string;
  readonly details?: string;
  readonly timestamp: Date;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly recoverable: boolean;
  readonly userMessage: string;
  readonly suggestedAction?: string;
}

export interface ErrorBoundaryState {
  readonly hasErrors: boolean;
  readonly lastError: TwitterError | null;
  readonly errorCount: number;
  readonly isCircuitOpen: boolean;
  readonly degradedMode: boolean;
  readonly retryAttempts: number;
  readonly nextRetryTime: Date | null;
}

export interface RetryConfig {
  readonly maxAttempts: number;
  readonly baseDelay: number;
  readonly maxDelay: number;
  readonly backoffMultiplier: number;
  readonly jitter: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterErrorBoundaryService {
  private readonly router = inject(Router);

  // Default retry configuration
  private readonly defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true
  };

  // Circuit breaker configuration
  private readonly circuitBreakerConfig = {
    failureThreshold: 5,
    timeout: 60000, // 1 minute
    monitoringPeriod: 300000 // 5 minutes
  };

  // Error boundary state
  private readonly stateSignal = signal<ErrorBoundaryState>({
    hasErrors: false,
    lastError: null,
    errorCount: 0,
    isCircuitOpen: false,
    degradedMode: false,
    retryAttempts: 0,
    nextRetryTime: null
  });

  // Public reactive state
  readonly state = computed(() => this.stateSignal());
  readonly hasErrors = computed(() => this.state().hasErrors);
  readonly isCircuitOpen = computed(() => this.state().isCircuitOpen);
  readonly degradedMode = computed(() => this.state().degradedMode);
  readonly canRetry = computed(() => {
    const state = this.state();
    return !state.isCircuitOpen &&
           state.retryAttempts < this.defaultRetryConfig.maxAttempts &&
           (!state.nextRetryTime || Date.now() >= state.nextRetryTime.getTime());
  });

  // Error tracking
  private errorHistory: TwitterError[] = [];
  private circuitBreakerTimer: any = null;

  constructor() {
    // Set up circuit breaker monitoring
    this.initializeCircuitBreaker();
  }

  /**
   * Wrap an operation with comprehensive error handling
   */
  wrapOperation<T>(
    operation: () => Observable<T>,
    context: string,
    retryConfig?: Partial<RetryConfig>
  ): Observable<T> {
    const config = { ...this.defaultRetryConfig, ...retryConfig };

    // Check circuit breaker state
    if (this.state().isCircuitOpen) {
      return this.handleCircuitOpen<T>(context);
    }

    return operation().pipe(
      retry({
        count: config.maxAttempts,
        delay: (error, retryCount) => this.calculateRetryDelay(retryCount, config)
      }),
      catchError(error => this.handleError<T>(error, context, config))
    );
  }

  /**
   * Handle Twitter API errors with specific logic
   */
  handleTwitterApiError(error: any, endpoint: string): TwitterError {
    const twitterError = this.createTwitterError(error, endpoint);

    // Update error boundary state
    this.updateErrorState(twitterError);

    // Log error for monitoring
    this.logError(twitterError);

    // Check if circuit breaker should trip
    this.evaluateCircuitBreaker();

    return twitterError;
  }

  /**
   * Handle Twitter embed widget errors
   */
  handleEmbedError(error: any, containerId: string): TwitterError {
    const embedError: TwitterError = {
      code: 'EMBED_FAILED',
      message: 'Twitter embed widget failed to load',
      details: error.message || 'Unknown embed error',
      timestamp: new Date(),
      severity: 'medium',
      recoverable: true,
      userMessage: 'Twitter feed temporarily unavailable. Using fallback content.',
      suggestedAction: 'Try refreshing the page or check your internet connection.'
    };

    this.updateErrorState(embedError);
    this.logError(embedError);

    return embedError;
  }

  /**
   * Attempt to recover from errors
   */
  attemptRecovery(): Observable<boolean> {
    const state = this.state();

    if (!state.lastError?.recoverable || state.isCircuitOpen) {
      return of(false);
    }

    return this.performRecovery().pipe(
      catchError(() => of(false))
    );
  }

  /**
   * Clear all errors and reset state
   */
  clearErrors(): void {
    this.stateSignal.set({
      hasErrors: false,
      lastError: null,
      errorCount: 0,
      isCircuitOpen: false,
      degradedMode: false,
      retryAttempts: 0,
      nextRetryTime: null
    });

    this.errorHistory = [];

    if (this.circuitBreakerTimer) {
      clearTimeout(this.circuitBreakerTimer);
      this.circuitBreakerTimer = null;
    }
  }

  /**
   * Enable degraded mode with limited functionality
   */
  enableDegradedMode(reason: string): void {
    const degradedError: TwitterError = {
      code: 'DEGRADED_MODE',
      message: `Twitter integration running in degraded mode: ${reason}`,
      details: reason,
      timestamp: new Date(),
      severity: 'medium',
      recoverable: true,
      userMessage: 'Twitter feed is running with limited functionality.',
      suggestedAction: 'Some features may be unavailable. Try again later.'
    };

    this.updateErrorState(degradedError);

    this.stateSignal.update(state => ({
      ...state,
      degradedMode: true
    }));

    console.warn('🔧 Twitter integration entered degraded mode:', reason);
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error?: TwitterError): string {
    const currentError = error || this.state().lastError;

    if (!currentError) {
      return 'Twitter feed is currently unavailable.';
    }

    if (this.state().isCircuitOpen) {
      return 'Twitter feed is temporarily disabled due to repeated errors. Please try again later.';
    }

    if (this.state().degradedMode) {
      return 'Twitter feed is running with limited functionality.';
    }

    return currentError.userMessage;
  }

  /**
   * Get suggested action for users
   */
  getSuggestedAction(error?: TwitterError): string | null {
    const currentError = error || this.state().lastError;
    return currentError?.suggestedAction || null;
  }

  /**
   * Get error statistics for monitoring
   */
  getErrorStats() {
    const recentErrors = this.errorHistory.filter(
      error => Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const errorsBySeverity = recentErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors: this.errorHistory.length,
      recentErrors: recentErrors.length,
      errorsBySeverity,
      circuitBreakerTrips: this.getCircuitBreakerTrips(),
      degradedModeActivations: this.getDegradedModeActivations(),
      currentState: this.state()
    };
  }

  /**
   * Private helper methods
   */

  private createTwitterError(error: any, context: string): TwitterError {
    // Determine error type and create appropriate TwitterError
    if (error.status === 401) {
      return {
        code: 'AUTH_FAILED',
        message: 'Twitter API authentication failed',
        details: error.message,
        timestamp: new Date(),
        severity: 'high',
        recoverable: false,
        userMessage: 'Twitter authentication issue. Please contact support.',
        suggestedAction: 'Check API credentials configuration.'
      };
    }

    if (error.status === 429) {
      return {
        code: 'RATE_LIMITED',
        message: 'Twitter API rate limit exceeded',
        details: `Rate limit hit for ${context}`,
        timestamp: new Date(),
        severity: 'medium',
        recoverable: true,
        userMessage: 'Twitter feed temporarily unavailable due to rate limiting.',
        suggestedAction: 'Please wait a few minutes before trying again.'
      };
    }

    if (error.status === 0 || error.name === 'NetworkError') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connectivity issue',
        details: 'Unable to reach Twitter services',
        timestamp: new Date(),
        severity: 'medium',
        recoverable: true,
        userMessage: 'Connection to Twitter is unavailable.',
        suggestedAction: 'Check your internet connection and try again.'
      };
    }

    // Generic error
    return {
      code: 'UNKNOWN_ERROR',
      message: `Unexpected error in ${context}`,
      details: error.message || 'Unknown error occurred',
      timestamp: new Date(),
      severity: 'medium',
      recoverable: true,
      userMessage: 'Twitter feed is temporarily unavailable.',
      suggestedAction: 'Please try refreshing the page.'
    };
  }

  private updateErrorState(error: TwitterError): void {
    this.errorHistory.push(error);

    this.stateSignal.update(state => ({
      ...state,
      hasErrors: true,
      lastError: error,
      errorCount: state.errorCount + 1,
      retryAttempts: error.recoverable ? state.retryAttempts + 1 : state.retryAttempts
    }));
  }

  private calculateRetryDelay(retryCount: number, config: RetryConfig): Observable<number> {
    let delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, retryCount - 1),
      config.maxDelay
    );

    // Add jitter to prevent thundering herd
    if (config.jitter) {
      delay += Math.random() * 1000;
    }

    const nextRetryTime = new Date(Date.now() + delay);
    this.stateSignal.update(state => ({ ...state, nextRetryTime }));

    return timer(delay);
  }

  private handleError<T>(error: any, context: string, config: RetryConfig): Observable<T> {
    const twitterError = this.handleTwitterApiError(error, context);

    // If not recoverable, don't retry
    if (!twitterError.recoverable) {
      return throwError(() => twitterError);
    }

    // If max retries exceeded, enable degraded mode
    if (this.state().retryAttempts >= config.maxAttempts) {
      this.enableDegradedMode(`Max retries exceeded for ${context}`);
    }

    return throwError(() => twitterError);
  }

  private handleCircuitOpen<T>(context: string): Observable<T> {
    const circuitError: TwitterError = {
      code: 'CIRCUIT_OPEN',
      message: 'Circuit breaker is open',
      details: `All ${context} operations are currently blocked`,
      timestamp: new Date(),
      severity: 'high',
      recoverable: true,
      userMessage: 'Twitter feed is temporarily disabled due to repeated errors.',
      suggestedAction: 'Please try again in a few minutes.'
    };

    return throwError(() => circuitError);
  }

  private initializeCircuitBreaker(): void {
    // Monitor error patterns every minute
    timer(0, 60000).subscribe(() => {
      this.evaluateCircuitBreaker();
    });
  }

  private evaluateCircuitBreaker(): void {
    const recentErrors = this.getRecentErrors();
    const currentState = this.state();

    // Open circuit if too many failures
    if (recentErrors.length >= this.circuitBreakerConfig.failureThreshold && !currentState.isCircuitOpen) {
      this.openCircuit();
    }

    // Close circuit after timeout
    if (currentState.isCircuitOpen && this.canCloseCircuit()) {
      this.closeCircuit();
    }
  }

  private openCircuit(): void {
    this.stateSignal.update(state => ({ ...state, isCircuitOpen: true }));

    this.circuitBreakerTimer = setTimeout(() => {
      this.closeCircuit();
    }, this.circuitBreakerConfig.timeout);

    console.warn('⚡ Twitter circuit breaker opened due to repeated failures');
  }

  private closeCircuit(): void {
    this.stateSignal.update(state => ({
      ...state,
      isCircuitOpen: false,
      retryAttempts: 0
    }));

    if (this.circuitBreakerTimer) {
      clearTimeout(this.circuitBreakerTimer);
      this.circuitBreakerTimer = null;
    }

    console.log('✅ Twitter circuit breaker closed - normal operation resumed');
  }

  private canCloseCircuit(): boolean {
    const lastError = this.state().lastError;
    if (!lastError) return true;

    const timeSinceLastError = Date.now() - lastError.timestamp.getTime();
    return timeSinceLastError >= this.circuitBreakerConfig.timeout;
  }

  private getRecentErrors(): TwitterError[] {
    const cutoff = Date.now() - this.circuitBreakerConfig.monitoringPeriod;
    return this.errorHistory.filter(error => error.timestamp.getTime() > cutoff);
  }

  private performRecovery(): Observable<boolean> {
    // Attempt to clear errors and reset state
    return timer(1000).pipe(
      map(() => {
        this.clearErrors();
        console.log('🔄 Twitter error boundary recovery attempted');
        return true;
      })
    );
  }

  private logError(error: TwitterError): void {
    if (environment.debug.enableLogging) {
      console.error('🐦 Twitter Error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        severity: error.severity,
        timestamp: error.timestamp.toISOString()
      });
    }

    // In production, send to error reporting service
    if (environment.production && error.severity === 'critical') {
      // Example: Send to error reporting service
      // this.sendErrorReport(error);
    }
  }

  private getCircuitBreakerTrips(): number {
    return this.errorHistory.filter(error => error.code === 'CIRCUIT_OPEN').length;
  }

  private getDegradedModeActivations(): number {
    return this.errorHistory.filter(error => error.code === 'DEGRADED_MODE').length;
  }
}