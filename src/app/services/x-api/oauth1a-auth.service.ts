import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OAuth1aSignatureService, OAuth1aCredentials } from './oauth1a-signature.service';
import { CryptoUtilsService } from './crypto-utils.service';

/**
 * OAuth 1.0a Authentication Service for X API
 *
 * Manages OAuth 1.0a authentication for X API requests, eliminating CORS issues
 * by providing proper authentication headers that X API accepts from browsers.
 *
 * Features:
 * - OAuth 1.0a credential management
 * - Authorization header generation for requests
 * - Credential validation and security checks
 * - Integration with environment configuration
 * - Real-time authentication status tracking
 *
 * This service solves CORS issues by:
 * 1. Using OAuth 1.0a instead of Bearer Token authentication
 * 2. Generating proper OAuth signatures that X API recognizes
 * 3. Creating authorization headers that browsers can send
 * 4. Following X API OAuth 1.0a specification exactly
 *
 * @see https://docs.x.com/x-api/authentication/oauth-1-0a
 */

export interface AuthenticationStatus {
  authenticated: boolean;
  credentialsValid: boolean;
  error: string | null;
  lastUsed: Date | null;
  cryptoImplementation: 'WebCrypto' | 'Fallback';
  securityLevel: 'High' | 'Medium' | 'Low';
}

@Injectable({
  providedIn: 'root'
})
export class OAuth1aAuthService {
  private readonly signatureService = inject(OAuth1aSignatureService);
  private readonly cryptoUtils = inject(CryptoUtilsService);

  // OAuth 1.0a credentials from environment
  private credentials: OAuth1aCredentials | null = null;

  // Reactive authentication status
  private statusSignal = signal<AuthenticationStatus>({
    authenticated: false,
    credentialsValid: false,
    error: null,
    lastUsed: null,
    cryptoImplementation: 'Fallback',
    securityLevel: 'Medium'
  });

  readonly status = this.statusSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.status().authenticated);
  readonly isReady = computed(() =>
    this.status().authenticated && this.status().credentialsValid && !this.status().error
  );

  constructor() {
    this.initializeFromEnvironment();
    console.log('🔐 OAuth 1.0a Authentication Service initialized');
  }

  /**
   * Initialize OAuth 1.0a authentication from environment configuration
   */
  private initializeFromEnvironment(): void {
    try {
      // Check if OAuth 1.0a is enabled
      if (!environment.xApi?.useOAuth1a) {
        this.updateStatus({
          authenticated: false,
          credentialsValid: false,
          error: 'OAuth 1.0a authentication is disabled in environment configuration'
        });
        return;
      }

      // Load credentials from environment
      const envCredentials = environment.xApi?.oauth;
      if (!envCredentials) {
        this.updateStatus({
          authenticated: false,
          credentialsValid: false,
          error: 'OAuth 1.0a credentials not found in environment configuration'
        });
        return;
      }

      // Validate credentials
      const credentials: OAuth1aCredentials = {
        consumerKey: envCredentials.consumerKey,
        consumerSecret: envCredentials.consumerSecret,
        accessToken: envCredentials.accessToken,
        accessTokenSecret: envCredentials.accessTokenSecret
      };

      const validation = this.signatureService.validateCredentials(credentials);
      if (!validation.isValid) {
        this.updateStatus({
          authenticated: false,
          credentialsValid: false,
          error: `Invalid credentials: ${validation.errors.join(', ')}`
        });
        return;
      }

      // Store valid credentials
      this.credentials = credentials;

      // Get crypto implementation info
      const cryptoInfo = this.cryptoUtils.getCryptoInfo();

      this.updateStatus({
        authenticated: true,
        credentialsValid: true,
        error: null,
        cryptoImplementation: cryptoInfo.implementation,
        securityLevel: cryptoInfo.securityLevel
      });

      console.log('✅ OAuth 1.0a authentication initialized successfully', {
        consumerKey: credentials.consumerKey.substring(0, 8) + '...',
        accessToken: credentials.accessToken.substring(0, 16) + '...',
        cryptoImplementation: cryptoInfo.implementation,
        securityLevel: cryptoInfo.securityLevel
      });

      // Log any crypto recommendations
      if (cryptoInfo.recommendations.length > 0) {
        console.warn('⚠️ Crypto recommendations:', cryptoInfo.recommendations);
      }

    } catch (error: any) {
      this.updateStatus({
        authenticated: false,
        credentialsValid: false,
        error: `Authentication initialization failed: ${error.message}`
      });
      console.error('❌ OAuth 1.0a authentication initialization failed:', error);
    }
  }

  /**
   * Generate authorization header for X API request
   *
   * This is the main method that eliminates CORS issues by providing
   * proper OAuth 1.0a authentication headers.
   *
   * @param method - HTTP method (GET, POST, etc.)
   * @param url - Full URL of the API endpoint
   * @param queryParams - Query parameters (optional)
   * @returns Promise resolving to Authorization header value
   */
  async generateAuthHeader(
    method: string,
    url: string,
    queryParams?: Record<string, string>
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OAuth 1.0a authentication not ready. Check credentials and configuration.');
    }

    if (!this.credentials) {
      throw new Error('OAuth 1.0a credentials not available');
    }

    try {
      const authHeader = await this.signatureService.generateAuthorizationHeader(
        method,
        url,
        this.credentials,
        queryParams
      );

      this.updateStatus({ lastUsed: new Date() });

      console.log(`🔑 OAuth 1.0a auth header generated for ${method} ${url}`);
      return authHeader;

    } catch (error: any) {
      const errorMessage = `Failed to generate OAuth 1.0a authorization header: ${error.message}`;
      this.updateStatus({ error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  /**
   * Validate current credentials by attempting to generate a test signature
   */
  async validateAuthentication(): Promise<{
    valid: boolean;
    error?: string;
    cryptoTest?: boolean;
  }> {
    if (!this.credentials) {
      return {
        valid: false,
        error: 'No credentials available'
      };
    }

    try {
      // Test crypto functionality
      await this.cryptoUtils.testCryptoFunctionality();

      // Test signature generation
      await this.signatureService.testSignatureGeneration();

      // Test with actual credentials
      const testHeader = await this.generateAuthHeader(
        'GET',
        'https://api.x.com/2/users/by/username/test'
      );

      if (!testHeader || !testHeader.startsWith('OAuth ')) {
        return {
          valid: false,
          error: 'Generated authorization header is invalid'
        };
      }

      console.log('✅ OAuth 1.0a authentication validation successful');
      return {
        valid: true,
        cryptoTest: true
      };

    } catch (error: any) {
      console.error('❌ OAuth 1.0a authentication validation failed:', error);
      return {
        valid: false,
        error: error.message,
        cryptoTest: false
      };
    }
  }

  /**
   * Get current credentials (masked for security)
   */
  getCredentialsInfo(): {
    hasCredentials: boolean;
    consumerKey?: string;
    accessToken?: string;
    environment: string;
  } {
    return {
      hasCredentials: !!this.credentials,
      consumerKey: this.credentials?.consumerKey.substring(0, 8) + '...',
      accessToken: this.credentials?.accessToken.substring(0, 16) + '...',
      environment: environment.name
    };
  }

  /**
   * Update credentials at runtime (for testing or dynamic configuration)
   */
  updateCredentials(newCredentials: OAuth1aCredentials): void {
    const validation = this.signatureService.validateCredentials(newCredentials);

    if (!validation.isValid) {
      this.updateStatus({
        authenticated: false,
        credentialsValid: false,
        error: `Invalid credentials: ${validation.errors.join(', ')}`
      });
      throw new Error(`Invalid credentials: ${validation.errors.join(', ')}`);
    }

    this.credentials = newCredentials;
    this.updateStatus({
      authenticated: true,
      credentialsValid: true,
      error: null
    });

    console.log('✅ OAuth 1.0a credentials updated successfully');
  }

  /**
   * Reset authentication state
   */
  reset(): void {
    this.credentials = null;
    this.updateStatus({
      authenticated: false,
      credentialsValid: false,
      error: null,
      lastUsed: null
    });

    console.log('🔄 OAuth 1.0a authentication reset');
  }

  /**
   * Get service diagnostics for debugging
   */
  getDiagnostics(): {
    status: AuthenticationStatus;
    credentials: any;
    environment: any;
    crypto: any;
  } {
    return {
      status: this.status(),
      credentials: this.getCredentialsInfo(),
      environment: {
        name: environment.name,
        useOAuth1a: environment.xApi?.useOAuth1a,
        hasOAuthConfig: !!environment.xApi?.oauth
      },
      crypto: this.cryptoUtils.getCryptoInfo()
    };
  }

  // Private helper methods

  private updateStatus(updates: Partial<AuthenticationStatus>): void {
    const current = this.statusSignal();
    this.statusSignal.set({ ...current, ...updates });
  }
}