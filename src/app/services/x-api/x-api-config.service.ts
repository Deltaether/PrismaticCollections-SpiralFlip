import { Injectable, signal, computed } from '@angular/core';
import { XApiConfig } from './interfaces/x-api.interfaces';

/**
 * X API Configuration Service
 *
 * Centralized configuration management for X API V2 integration
 * with environment-aware settings and runtime configuration updates.
 *
 * Features:
 * - Environment-based configuration
 * - Runtime configuration updates
 * - Validation of configuration values
 * - Default configuration management
 * - Configuration change notifications
 *
 * @see https://docs.x.com/x-api/getting-started/about-x-api
 */

export interface XApiEnvironmentConfig {
  /** Environment name */
  environment: 'development' | 'staging' | 'production';

  /** X API Bearer Token */
  bearerToken: string;

  /** X API base URL (optional override) */
  baseUrl?: string;

  /** Enable debug logging */
  enableLogging?: boolean;

  /** Additional environment-specific settings */
  customSettings?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class XApiConfigService {
  // Default configuration
  private defaultConfig: XApiConfig = {
    bearerToken: '',
    baseUrl: 'https://api.x.com/2',
    enableLogging: false,
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    rateLimiting: {
      enabled: true,
      warningThreshold: 0.2, // Warning at 20% remaining
      criticalThreshold: 0.1  // Critical at 10% remaining
    },
    retry: {
      maxRetries: 3,
      baseDelay: 1000,   // 1 second base delay
      maxDelay: 30000    // 30 second max delay
    }
  };

  // Current configuration state
  private configSignal = signal<XApiConfig>(this.defaultConfig);

  // Computed properties for easy access
  readonly config = this.configSignal.asReadonly();
  readonly isConfigured = computed(() => this.config().bearerToken.length > 0);
  readonly isLoggingEnabled = computed(() => this.config().enableLogging || false);
  readonly baseUrl = computed(() => this.config().baseUrl || this.defaultConfig.baseUrl!);
  readonly cacheDuration = computed(() => this.config().cacheDuration || this.defaultConfig.cacheDuration!);

  // Configuration validation state
  private validationSignal = signal<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>({
    isValid: false,
    errors: ['Bearer token is required'],
    warnings: []
  });

  readonly validation = this.validationSignal.asReadonly();

  constructor() {
    // Initialize validation
    this.validateConfiguration();
    console.log('⚙️ X API Config Service initialized');
  }

  /**
   * Configure X API with environment settings
   */
  configureFromEnvironment(envConfig: XApiEnvironmentConfig): void {
    const config: XApiConfig = {
      ...this.defaultConfig,
      bearerToken: envConfig.bearerToken,
      enableLogging: this.shouldEnableLogging(envConfig),
      baseUrl: envConfig.baseUrl || this.defaultConfig.baseUrl!
    };

    // Apply environment-specific overrides
    if (envConfig.environment === 'development') {
      config.enableLogging = true;
      config.cacheDuration = 60 * 1000; // Shorter cache in dev (1 minute)
      config.retry!.maxRetries = 1; // Fewer retries in dev
    } else if (envConfig.environment === 'production') {
      config.enableLogging = false;
      config.cacheDuration = 15 * 60 * 1000; // Longer cache in prod (15 minutes)
      config.retry!.maxRetries = 5; // More retries in prod
    }

    this.updateConfiguration(config);

    if (config.enableLogging) {
      console.log(`⚙️ X API configured for ${envConfig.environment} environment`);
      console.log('📊 Configuration:', this.getSafeConfigForLogging(config));
    }
  }

  /**
   * Update configuration at runtime
   */
  updateConfiguration(partialConfig: Partial<XApiConfig>): void {
    const currentConfig = this.configSignal();
    const newConfig = { ...currentConfig, ...partialConfig };

    // Deep merge nested objects
    if (partialConfig.rateLimiting) {
      newConfig.rateLimiting = { ...currentConfig.rateLimiting, ...partialConfig.rateLimiting };
    }
    if (partialConfig.retry) {
      newConfig.retry = { ...currentConfig.retry, ...partialConfig.retry };
    }

    this.configSignal.set(newConfig);
    this.validateConfiguration();

    if (newConfig.enableLogging) {
      console.log('⚙️ X API configuration updated');
    }
  }

  /**
   * Update only the Bearer Token
   */
  setBearerToken(bearerToken: string): void {
    this.updateConfiguration({ bearerToken });
  }

  /**
   * Enable or disable debug logging
   */
  setLogging(enabled: boolean): void {
    this.updateConfiguration({ enableLogging: enabled });
  }

  /**
   * Update rate limiting settings
   */
  updateRateLimiting(rateLimitConfig: Partial<XApiConfig['rateLimiting']>): void {
    const currentRateLimiting = this.configSignal().rateLimiting || this.defaultConfig.rateLimiting!;
    this.updateConfiguration({
      rateLimiting: { ...currentRateLimiting, ...rateLimitConfig }
    });
  }

  /**
   * Update retry settings
   */
  updateRetrySettings(retryConfig: Partial<XApiConfig['retry']>): void {
    const currentRetry = this.configSignal().retry || this.defaultConfig.retry!;
    this.updateConfiguration({
      retry: { ...currentRetry, ...retryConfig }
    });
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.configSignal.set({ ...this.defaultConfig });
    this.validateConfiguration();
    console.log('⚙️ X API configuration reset to defaults');
  }

  /**
   * Get current configuration (safe copy)
   */
  getCurrentConfig(): XApiConfig {
    return { ...this.configSignal() };
  }

  /**
   * Get safe configuration for logging (without sensitive data)
   */
  getSafeConfigForLogging(config?: XApiConfig): any {
    const configToLog = config || this.configSignal();
    return {
      baseUrl: configToLog.baseUrl,
      enableLogging: configToLog.enableLogging,
      cacheDuration: configToLog.cacheDuration,
      rateLimiting: configToLog.rateLimiting,
      retry: configToLog.retry,
      bearerToken: configToLog.bearerToken ?
        `${configToLog.bearerToken.substring(0, 10)}...` :
        '[NOT SET]'
    };
  }

  /**
   * Validate current configuration
   */
  private validateConfiguration(): void {
    const config = this.configSignal();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!config.bearerToken || config.bearerToken.trim().length === 0) {
      errors.push('Bearer token is required');
    } else if (config.bearerToken.length < 20) {
      warnings.push('Bearer token appears to be too short');
    }

    // Base URL validation
    if (config.baseUrl && !this.isValidUrl(config.baseUrl)) {
      errors.push('Invalid base URL format');
    }

    // Cache duration validation
    if (config.cacheDuration && config.cacheDuration < 0) {
      errors.push('Cache duration must be positive');
    } else if (config.cacheDuration && config.cacheDuration < 60000) {
      warnings.push('Cache duration is very short (< 1 minute)');
    }

    // Rate limiting validation
    if (config.rateLimiting) {
      if (config.rateLimiting.warningThreshold < 0 || config.rateLimiting.warningThreshold > 1) {
        errors.push('Warning threshold must be between 0 and 1');
      }
      if (config.rateLimiting.criticalThreshold < 0 || config.rateLimiting.criticalThreshold > 1) {
        errors.push('Critical threshold must be between 0 and 1');
      }
      if (config.rateLimiting.criticalThreshold > config.rateLimiting.warningThreshold) {
        warnings.push('Critical threshold should be lower than warning threshold');
      }
    }

    // Retry settings validation
    if (config.retry) {
      if (config.retry.maxRetries < 0) {
        errors.push('Max retries cannot be negative');
      } else if (config.retry.maxRetries > 10) {
        warnings.push('High number of retries may cause delays');
      }

      if (config.retry.baseDelay < 0) {
        errors.push('Base delay cannot be negative');
      }

      if (config.retry.maxDelay < config.retry.baseDelay) {
        errors.push('Max delay cannot be less than base delay');
      }
    }

    this.validationSignal.set({
      isValid: errors.length === 0,
      errors,
      warnings
    });

    // Log validation results
    if (errors.length > 0 && config.enableLogging) {
      console.error('❌ X API Configuration Errors:', errors);
    }
    if (warnings.length > 0 && config.enableLogging) {
      console.warn('⚠️ X API Configuration Warnings:', warnings);
    }
  }

  /**
   * Check if logging should be enabled based on environment
   */
  private shouldEnableLogging(envConfig: XApiEnvironmentConfig): boolean {
    // Explicit setting takes precedence
    if (envConfig.enableLogging !== undefined) {
      return envConfig.enableLogging;
    }

    // Default based on environment
    return envConfig.environment === 'development';
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get environment-specific defaults
   */
  getEnvironmentDefaults(environment: 'development' | 'staging' | 'production'): Partial<XApiConfig> {
    const baseDefaults = {
      baseUrl: 'https://api.x.com/2'
    };

    switch (environment) {
      case 'development':
        return {
          ...baseDefaults,
          enableLogging: true,
          cacheDuration: 60 * 1000, // 1 minute
          rateLimiting: {
            enabled: true,
            warningThreshold: 0.3, // More conservative in dev
            criticalThreshold: 0.2
          },
          retry: {
            maxRetries: 1,
            baseDelay: 500,
            maxDelay: 5000
          }
        };

      case 'staging':
        return {
          ...baseDefaults,
          enableLogging: true,
          cacheDuration: 5 * 60 * 1000, // 5 minutes
          rateLimiting: {
            enabled: true,
            warningThreshold: 0.2,
            criticalThreshold: 0.1
          },
          retry: {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 15000
          }
        };

      case 'production':
        return {
          ...baseDefaults,
          enableLogging: false,
          cacheDuration: 15 * 60 * 1000, // 15 minutes
          rateLimiting: {
            enabled: true,
            warningThreshold: 0.15, // More aggressive in prod
            criticalThreshold: 0.05
          },
          retry: {
            maxRetries: 5,
            baseDelay: 1000,
            maxDelay: 30000
          }
        };

      default:
        return baseDefaults;
    }
  }

  /**
   * Export configuration for backup/restore
   */
  exportConfiguration(): string {
    const config = this.getSafeConfigForLogging();
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from backup
   */
  importConfiguration(configJson: string): void {
    try {
      const config = JSON.parse(configJson) as Partial<XApiConfig>;

      // Validate required fields exist
      if (!config.bearerToken) {
        throw new Error('Bearer token is required in imported configuration');
      }

      this.updateConfiguration(config);
      console.log('⚙️ Configuration imported successfully');
    } catch (error) {
      console.error('❌ Failed to import configuration:', error);
      throw new Error(`Invalid configuration format: ${error}`);
    }
  }
}