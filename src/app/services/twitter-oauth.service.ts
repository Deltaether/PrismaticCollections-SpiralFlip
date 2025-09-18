import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

/**
 * Twitter OAuth 1.0a Authentication Service
 *
 * Implements proper OAuth 1.0a signature generation for Twitter API v2
 * Based on Twitter's OAuth 1.0a documentation and RFC 5849
 *
 * Key Features:
 * - OAuth 1.0a signature generation (HMAC-SHA1)
 * - Proper parameter encoding and sorting
 * - Base string construction following OAuth spec
 * - Authorization header generation
 * - Nonce and timestamp generation
 *
 * IMPORTANT: This service contains API credentials and should only be used
 * in secure server-side environments. For client-side usage, implement a proxy
 * server to avoid exposing credentials.
 *
 * Rate Limits:
 * - Free Tier: 100 API calls per month
 * - User Context (OAuth 1.0a): 900 requests per 15-minute window
 *
 * API Documentation:
 * - Authentication: https://docs.x.com/fundamentals/authentication/overview
 * - User Lookup: https://docs.x.com/x-api/users/get-user-by-username
 * - User Timeline: https://docs.x.com/x-api/posts/timelines/integrate
 */

export interface TwitterOAuthCredentials {
  apiKey: string;           // Consumer Key
  apiSecret: string;        // Consumer Secret
  accessToken: string;      // User Access Token
  accessTokenSecret: string; // User Access Token Secret
}

export interface TwitterOAuthParams {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_token: string;
  oauth_version: string;
  oauth_signature?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterOAuthService {

  // Twitter API v2 Base URLs
  private readonly API_BASE_URL = 'https://api.x.com/2';

  // OAuth 1.0a Configuration
  private readonly OAUTH_VERSION = '1.0';
  private readonly SIGNATURE_METHOD = 'HMAC-SHA1';

  constructor(private http: HttpClient) {}

  /**
   * Generate OAuth 1.0a authorization header for Twitter API v2
   *
   * @param httpMethod - HTTP method (GET, POST, etc.)
   * @param url - Full API endpoint URL
   * @param queryParams - Query parameters as key-value pairs
   * @param credentials - OAuth credentials
   * @returns Authorization header value
   */
  generateAuthorizationHeader(
    httpMethod: string,
    url: string,
    queryParams: Record<string, string> = {},
    credentials: TwitterOAuthCredentials
  ): string {
    // Generate OAuth parameters
    const oauthParams: TwitterOAuthParams = {
      oauth_consumer_key: credentials.apiKey,
      oauth_nonce: this.generateNonce(),
      oauth_signature_method: this.SIGNATURE_METHOD,
      oauth_timestamp: this.generateTimestamp(),
      oauth_token: credentials.accessToken,
      oauth_version: this.OAUTH_VERSION
    };

    // Generate signature
    const signature = this.generateSignature(
      httpMethod,
      url,
      { ...queryParams, ...oauthParams },
      credentials
    );

    // Add signature to OAuth parameters
    oauthParams.oauth_signature = signature;

    // Build authorization header
    return this.buildAuthorizationHeader(oauthParams);
  }

  /**
   * Generate OAuth 1.0a signature following RFC 5849
   *
   * @param httpMethod - HTTP method
   * @param url - Base URL (without query parameters)
   * @param params - All parameters (query + OAuth)
   * @param credentials - OAuth credentials
   * @returns Base64-encoded signature
   */
  private generateSignature(
    httpMethod: string,
    url: string,
    params: Record<string, string>,
    credentials: TwitterOAuthCredentials
  ): string {
    // Step 1: Create parameter string
    const parameterString = this.createParameterString(params);

    // Step 2: Create signature base string
    const signatureBaseString = this.createSignatureBaseString(
      httpMethod,
      url,
      parameterString
    );

    // Step 3: Create signing key
    const signingKey = this.createSigningKey(
      credentials.apiSecret,
      credentials.accessTokenSecret
    );

    // Step 4: Generate signature using HMAC-SHA1
    const signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey);

    // Step 5: Return base64-encoded signature
    return CryptoJS.enc.Base64.stringify(signature);
  }

  /**
   * Create OAuth parameter string (sorted and encoded)
   *
   * @param params - All parameters
   * @returns Encoded parameter string
   */
  private createParameterString(params: Record<string, string>): string {
    // Sort parameters by key
    const sortedKeys = Object.keys(params).sort();

    // Create encoded key=value pairs
    const encodedParams = sortedKeys.map(key => {
      const encodedKey = this.percentEncode(key);
      const encodedValue = this.percentEncode(params[key]);
      return `${encodedKey}=${encodedValue}`;
    });

    // Join with &
    return encodedParams.join('&');
  }

  /**
   * Create OAuth signature base string
   *
   * @param httpMethod - HTTP method (uppercase)
   * @param url - Base URL
   * @param parameterString - Encoded parameter string
   * @returns Signature base string
   */
  private createSignatureBaseString(
    httpMethod: string,
    url: string,
    parameterString: string
  ): string {
    const method = httpMethod.toUpperCase();
    const encodedUrl = this.percentEncode(url);
    const encodedParams = this.percentEncode(parameterString);

    return `${method}&${encodedUrl}&${encodedParams}`;
  }

  /**
   * Create OAuth signing key
   *
   * @param consumerSecret - API Secret (Consumer Secret)
   * @param tokenSecret - Access Token Secret
   * @returns Signing key
   */
  private createSigningKey(consumerSecret: string, tokenSecret: string): string {
    const encodedConsumerSecret = this.percentEncode(consumerSecret);
    const encodedTokenSecret = this.percentEncode(tokenSecret);

    return `${encodedConsumerSecret}&${encodedTokenSecret}`;
  }

  /**
   * Build authorization header from OAuth parameters
   *
   * @param oauthParams - OAuth parameters with signature
   * @returns Authorization header value
   */
  private buildAuthorizationHeader(oauthParams: TwitterOAuthParams): string {
    const headerParts: string[] = [];

    // Add each OAuth parameter to header
    for (const [key, value] of Object.entries(oauthParams)) {
      if (value !== undefined) {
        const encodedKey = this.percentEncode(key);
        const encodedValue = this.percentEncode(value);
        headerParts.push(`${encodedKey}="${encodedValue}"`);
      }
    }

    return `OAuth ${headerParts.join(', ')}`;
  }

  /**
   * Generate cryptographically secure nonce
   *
   * @returns Base64-encoded nonce
   */
  private generateNonce(): string {
    // Generate 32 random bytes
    const randomBytes = CryptoJS.lib.WordArray.random(32);

    // Convert to base64 and remove non-alphanumeric characters
    return CryptoJS.enc.Base64.stringify(randomBytes)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
  }

  /**
   * Generate current timestamp
   *
   * @returns Unix timestamp as string
   */
  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  /**
   * Percent-encode string according to RFC 3986
   *
   * @param str - String to encode
   * @returns Percent-encoded string
   */
  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  }

  /**
   * Create HTTP headers with OAuth authorization
   *
   * @param httpMethod - HTTP method
   * @param url - API endpoint URL
   * @param queryParams - Query parameters
   * @param credentials - OAuth credentials
   * @returns HttpHeaders with authorization
   */
  createAuthenticatedHeaders(
    httpMethod: string,
    url: string,
    queryParams: Record<string, string> = {},
    credentials: TwitterOAuthCredentials
  ): HttpHeaders {
    const authHeader = this.generateAuthorizationHeader(
      httpMethod,
      url,
      queryParams,
      credentials
    );

    return new HttpHeaders({
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Validate OAuth credentials format
   *
   * @param credentials - Credentials to validate
   * @returns Validation result with errors
   */
  validateCredentials(credentials: TwitterOAuthCredentials): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!credentials.apiKey || credentials.apiKey.trim().length === 0) {
      errors.push('API Key (Consumer Key) is required');
    }

    if (!credentials.apiSecret || credentials.apiSecret.trim().length === 0) {
      errors.push('API Secret (Consumer Secret) is required');
    }

    if (!credentials.accessToken || credentials.accessToken.trim().length === 0) {
      errors.push('Access Token is required');
    }

    if (!credentials.accessTokenSecret || credentials.accessTokenSecret.trim().length === 0) {
      errors.push('Access Token Secret is required');
    }

    // Basic format validation
    if (credentials.apiKey && !credentials.apiKey.match(/^[a-zA-Z0-9]{25}$/)) {
      errors.push('API Key format appears invalid (should be 25 alphanumeric characters)');
    }

    if (credentials.accessToken && !credentials.accessToken.match(/^\d+-[a-zA-Z0-9]+$/)) {
      errors.push('Access Token format appears invalid (should be numeric-alphanumeric)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Test OAuth credentials by making a simple API call
   *
   * @param credentials - Credentials to test
   * @returns Promise resolving to test result
   */
  async testCredentials(credentials: TwitterOAuthCredentials): Promise<{
    success: boolean;
    error?: string;
    rateLimitRemaining?: number;
  }> {
    try {
      // Test with a simple user lookup (minimal API usage)
      const url = `${this.API_BASE_URL}/users/me`;
      const headers = this.createAuthenticatedHeaders('GET', url, {}, credentials);

      const response = await this.http.get(url, {
        headers,
        observe: 'response'
      }).toPromise();

      // Check rate limit headers
      const rateLimitRemaining = response?.headers.get('x-rate-limit-remaining');

      return {
        success: true,
        rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : undefined
      };

    } catch (error: any) {
      let errorMessage = 'Unknown error';

      if (error.status === 401) {
        errorMessage = 'Authentication failed - invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden - check permissions';
      } else if (error.status === 429) {
        errorMessage = 'Rate limit exceeded';
      } else if (error.error?.errors) {
        errorMessage = error.error.errors.map((e: any) => e.detail).join(', ');
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get API endpoints for common operations
   */
  getApiEndpoints() {
    return {
      userByUsername: (username: string) => `${this.API_BASE_URL}/users/by/username/${username}`,
      userTweets: (userId: string) => `${this.API_BASE_URL}/users/${userId}/tweets`,
      userInfo: () => `${this.API_BASE_URL}/users/me`,
      tweet: (tweetId: string) => `${this.API_BASE_URL}/tweets/${tweetId}`
    };
  }
}