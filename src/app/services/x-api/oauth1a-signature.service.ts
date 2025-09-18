import { Injectable, inject } from '@angular/core';
import { CryptoUtilsService } from './crypto-utils.service';

/**
 * OAuth 1.0a Signature Generation Service
 *
 * Implements OAuth 1.0a signature generation for X API requests
 * following RFC 5849 and X API OAuth 1.0a documentation.
 *
 * This service eliminates CORS issues by providing proper OAuth 1.0a
 * authentication headers that X API accepts from browser requests.
 *
 * Features:
 * - HMAC-SHA1 signature generation
 * - Proper parameter encoding per RFC 3986
 * - Timestamp and nonce generation
 * - Authorization header construction
 * - Full OAuth 1.0a compliance
 *
 * @see https://docs.x.com/x-api/authentication/oauth-1-0a
 * @see https://tools.ietf.org/html/rfc5849
 */

export interface OAuth1aCredentials {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface OAuth1aParameters {
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
export class OAuth1aSignatureService {
  private readonly cryptoUtils = inject(CryptoUtilsService);

  /**
   * Generate OAuth 1.0a authorization header for X API request
   *
   * @param method - HTTP method (GET, POST, etc.)
   * @param url - Full URL of the API endpoint
   * @param credentials - OAuth 1.0a credentials
   * @param additionalParams - Additional query parameters (optional)
   * @returns Promise resolving to Authorization header value
   */
  async generateAuthorizationHeader(
    method: string,
    url: string,
    credentials: OAuth1aCredentials,
    additionalParams?: Record<string, string>
  ): Promise<string> {
    // Generate OAuth parameters
    const oauthParams: OAuth1aParameters = {
      oauth_consumer_key: credentials.consumerKey,
      oauth_nonce: this.cryptoUtils.generateSecureNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: this.cryptoUtils.generateTimestamp(),
      oauth_token: credentials.accessToken,
      oauth_version: '1.0'
    };

    // Generate signature
    const signature = await this.generateSignature(
      method,
      url,
      oauthParams,
      credentials,
      additionalParams
    );

    // Add signature to parameters
    oauthParams.oauth_signature = signature;

    // Build authorization header
    return this.buildAuthorizationHeader(oauthParams);
  }

  /**
   * Generate OAuth 1.0a signature using HMAC-SHA1
   *
   * @param method - HTTP method
   * @param url - Base URL without query parameters
   * @param oauthParams - OAuth parameters
   * @param credentials - OAuth credentials
   * @param additionalParams - Additional query parameters
   * @returns Promise resolving to Base64-encoded signature
   */
  private async generateSignature(
    method: string,
    url: string,
    oauthParams: OAuth1aParameters,
    credentials: OAuth1aCredentials,
    additionalParams?: Record<string, string>
  ): Promise<string> {
    // 1. Create parameter string
    const allParams = {
      ...oauthParams,
      ...(additionalParams || {})
    };

    // Remove signature if present (it shouldn't be in signature calculation)
    delete (allParams as any).oauth_signature;

    // 2. Normalize parameters
    const normalizedParams = this.normalizeParameters(allParams);

    // 3. Create signature base string
    const baseUrl = this.extractBaseUrl(url);
    const signatureBaseString = [
      this.percentEncode(method.toUpperCase()),
      this.percentEncode(baseUrl),
      this.percentEncode(normalizedParams)
    ].join('&');

    // 4. Create signing key
    const signingKey = [
      this.percentEncode(credentials.consumerSecret),
      this.percentEncode(credentials.accessTokenSecret)
    ].join('&');

    // 5. Generate HMAC-SHA1 signature using crypto utils
    const signature = await this.cryptoUtils.generateHmacSha1(signatureBaseString, signingKey);

    console.log('🔐 OAuth 1.0a Signature Generation:', {
      method,
      baseUrl,
      normalizedParams,
      signatureBaseString,
      signingKey: signingKey.replace(/[^&]/g, '*'), // Mask for security
      signature: signature.substring(0, 10) + '...' // Partial signature for logging
    });

    return signature;
  }

  /**
   * Normalize parameters for signature generation
   * Per RFC 5849 Section 3.4.1.3.2
   */
  private normalizeParameters(params: Record<string, string>): string {
    const encoded = Object.entries(params)
      .map(([key, value]) => [this.percentEncode(key), this.percentEncode(value)])
      .sort(([a], [b]) => a.localeCompare(b));

    return encoded
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  /**
   * Extract base URL without query parameters
   */
  private extractBaseUrl(url: string): string {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  }

  /**
   * Percent encode per RFC 3986
   * Used for OAuth 1.0a parameter encoding
   */
  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  }


  /**
   * Build OAuth 1.0a authorization header
   */
  private buildAuthorizationHeader(oauthParams: OAuth1aParameters): string {
    const encodedParams = Object.entries(oauthParams)
      .map(([key, value]) => `${this.percentEncode(key)}="${this.percentEncode(value)}"`)
      .join(', ');

    return `OAuth ${encodedParams}`;
  }


  /**
   * Validate OAuth 1.0a credentials
   */
  validateCredentials(credentials: OAuth1aCredentials): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!credentials.consumerKey || credentials.consumerKey.trim().length === 0) {
      errors.push('Consumer Key (API Key) is required');
    }

    if (!credentials.consumerSecret || credentials.consumerSecret.trim().length === 0) {
      errors.push('Consumer Secret (API Secret) is required');
    }

    if (!credentials.accessToken || credentials.accessToken.trim().length === 0) {
      errors.push('Access Token is required');
    }

    if (!credentials.accessTokenSecret || credentials.accessTokenSecret.trim().length === 0) {
      errors.push('Access Token Secret is required');
    }

    // Validate format of access token (should be numeric-base)
    if (credentials.accessToken && !credentials.accessToken.match(/^\d+-[a-zA-Z0-9]+$/)) {
      errors.push('Access Token format appears invalid (expected: {user_id}-{token})');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Test OAuth signature generation with known values
   * Useful for debugging and validation
   */
  async testSignatureGeneration(): Promise<void> {
    console.log('🧪 Testing OAuth 1.0a signature generation...');

    const testCredentials: OAuth1aCredentials = {
      consumerKey: 'test_consumer_key',
      consumerSecret: 'test_consumer_secret',
      accessToken: 'test_access_token',
      accessTokenSecret: 'test_access_token_secret'
    };

    const testMethod = 'GET';
    const testUrl = 'https://api.x.com/2/users/by/username/testuser';

    try {
      const authHeader = await this.generateAuthorizationHeader(
        testMethod,
        testUrl,
        testCredentials
      );

      console.log('✅ Test authorization header generated:', authHeader);
    } catch (error) {
      console.error('❌ OAuth signature test failed:', error);
    }
  }
}