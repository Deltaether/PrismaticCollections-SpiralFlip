/**
 * X API V2 Integration - Barrel Exports
 *
 * Complete Angular implementation for official X API V2 integration
 * following https://docs.x.com/x-api/introduction exactly.
 *
 * This implementation replaces all proxy services, workarounds, and
 * unofficial methods with proper OAuth 2.0 Bearer Token authentication
 * and official X API V2 endpoints.
 *
 * Usage:
 * ```typescript
 * import { XApiService, XApiConfig } from './services/x-api';
 *
 * // In component or service
 * constructor(private xApiService: XApiService) {}
 *
 * ngOnInit() {
 *   // Initialize with Bearer Token
 *   this.xApiService.initialize('your-bearer-token');
 *
 *   // Get user profile
 *   this.xApiService.getUserProfile('username').subscribe(user => {
 *     console.log(user);
 *   });
 * }
 * ```
 */

// Main service exports
export { XApiService } from './x-api.service';
export { XApiCoreService } from './x-api-core.service';
export { XApiConfigService } from './x-api-config.service';
export { XApiErrorService } from './x-api-error.service';

// Interceptor exports
export { XApiAuthInterceptor } from './interceptors/x-api-auth.interceptor';
export { XApiRateLimitInterceptor } from './interceptors/x-api-rate-limit.interceptor';

// Interface and type exports
export {
  // Core data objects
  XApiUser,
  XApiTweet,
  XApiMedia,
  XApiPoll,
  XApiPlace,
  XApiResponse,
  XApiError,

  // Field types
  UserFields,
  TweetFields,
  MediaFields,
  PollFields,
  PlaceFields,
  Expansions,
  TweetExcludes,

  // Configuration interfaces
  XApiConfig,
  XApiServiceState,
  RateLimitInfo,

  // Parameter interfaces
  UserLookupParams,
  TweetsParams,
  UserTweetsResponse
} from './interfaces/x-api.interfaces';

// Error handling exports
export {
  XApiErrorCategory,
  ProcessedXApiError,
  ErrorStats
} from './x-api-error.service';

// Configuration exports
export {
  XApiEnvironmentConfig
} from './x-api-config.service';

/**
 * Provider configuration for Angular modules
 *
 * Add to your app.config.ts or module providers:
 * ```typescript
 * import { provideXApi } from './services/x-api';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... other providers
 *     ...provideXApi()
 *   ]
 * };
 * ```
 */
export function provideXApi() {
  return [
    XApiService,
    XApiCoreService,
    XApiConfigService,
    XApiErrorService
  ];
}

/**
 * HTTP Interceptor providers for X API
 *
 * Add to your app.config.ts:
 * ```typescript
 * import { provideXApiInterceptors } from './services/x-api';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... other providers
 *     provideHttpClient(
 *       ...provideXApiInterceptors()
 *     )
 *   ]
 * };
 * ```
 */
export function provideXApiInterceptors() {
  return [
    { provide: 'HTTP_INTERCEPTORS', useClass: XApiAuthInterceptor, multi: true },
    { provide: 'HTTP_INTERCEPTORS', useClass: XApiRateLimitInterceptor, multi: true }
  ];
}

/**
 * Environment configuration helper
 *
 * Use this to configure X API for different environments:
 * ```typescript
 * import { createXApiEnvironmentConfig } from './services/x-api';
 *
 * const config = createXApiEnvironmentConfig('production', {
 *   bearerToken: 'your-production-token',
 *   enableLogging: false
 * });
 * ```
 */
export function createXApiEnvironmentConfig(
  environment: 'development' | 'staging' | 'production',
  overrides: {
    bearerToken: string;
    enableLogging?: boolean;
    baseUrl?: string;
    customSettings?: Record<string, any>;
  }
) {
  return {
    environment,
    bearerToken: overrides.bearerToken,
    baseUrl: overrides.baseUrl,
    enableLogging: overrides.enableLogging,
    customSettings: overrides.customSettings
  };
}

/**
 * Quick setup function for simple use cases
 *
 * ```typescript
 * import { setupXApi } from './services/x-api';
 *
 * // In your component or service
 * const xApiService = setupXApi('your-bearer-token', {
 *   environment: 'development',
 *   enableLogging: true
 * });
 * ```
 */
export function setupXApi(
  bearerToken: string,
  options?: {
    environment?: 'development' | 'staging' | 'production';
    enableLogging?: boolean;
  }
): XApiService {
  const xApiService = new XApiService();
  xApiService.initialize(bearerToken, options);
  return xApiService;
}