/**
 * AuthManager - Authentication token management
 * Handles token storage, retrieval, refresh, and validation
 */

import type { 
  AuthTokens, 
  RefreshTokenRequest, 
  RefreshTokenResponse, 
  TokenVerificationResponse 
} from '../types';
import { authSettings, featureFlags } from '../config/settings';
import { AUTH_ENDPOINTS } from '../config/endpoints';

export class AuthManager {
  private refreshPromise: Promise<string> | null = null;
  private refreshAttempts: number = 0;

  /**
   * Store authentication tokens securely
   */
  storeTokens(tokens: AuthTokens): void {
    try {
      const tokenData = {
        ...tokens,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(authSettings.tokenStorageKey, JSON.stringify(tokenData));
      
      if (featureFlags.enableRequestLogging) {
        console.log('🔐 Tokens stored successfully');
      }
    } catch (error) {
      console.error('Failed to store authentication tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Retrieve stored authentication tokens
   */
  getTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem(authSettings.tokenStorageKey);
      if (!stored) {
        return null;
      }

      const tokenData = JSON.parse(stored);
      return {
        access: tokenData.access,
        refresh: tokenData.refresh,
      };
    } catch (error) {
      console.error('Failed to retrieve authentication tokens:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.access || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refresh || null;
  }

  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(authSettings.tokenStorageKey);
      localStorage.removeItem(authSettings.refreshTokenKey);
      
      if (featureFlags.enableRequestLogging) {
        console.log('🔐 Tokens cleared');
      }
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if access token is expired or about to expire
   */
  isTokenExpired(token?: string): boolean {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return true;
    }

    try {
      // Decode JWT token to check expiration
      const payload = this.decodeJWTPayload(accessToken);
      if (!payload || !payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      const bufferTime = Math.floor(authSettings.tokenExpirationBuffer / 1000);

      // Consider token expired if it expires within the buffer time
      return (expirationTime - bufferTime) <= currentTime;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true;
    }
  }

  /**
   * Decode JWT payload without verification
   */
  private decodeJWTPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode JWT payload:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check if we've exceeded max refresh attempts
    if (this.refreshAttempts >= authSettings.maxRefreshAttempts) {
      this.clearTokens();
      throw new Error('Maximum refresh attempts exceeded');
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      this.refreshAttempts = 0; // Reset attempts on success
      return newAccessToken;
    } catch (error) {
      this.refreshAttempts++;
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh API call
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${process.env.VITE_API_BASE_URL || 'https://mrs-staging.onrender.com/api'}${AUTH_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken } as RefreshTokenRequest),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token is invalid or expired
          this.clearTokens();
          throw new Error('Refresh token expired');
        }
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data: RefreshTokenResponse = await response.json();
      
      if (!data.access) {
        throw new Error('Invalid refresh response');
      }

      // Update stored tokens
      const currentTokens = this.getTokens();
      const newTokens: AuthTokens = {
        access: data.access,
        refresh: data.refresh || currentTokens?.refresh || refreshToken,
      };

      this.storeTokens(newTokens);

      if (featureFlags.enableRequestLogging) {
        console.log('🔄 Access token refreshed successfully');
      }

      return data.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear tokens on refresh failure
      if (error instanceof Error && error.message.includes('expired')) {
        this.clearTokens();
      }
      
      throw error;
    }
  }

  /**
   * Verify token with the API
   */
  async verifyToken(token?: string): Promise<boolean> {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      const response = await fetch(`${process.env.VITE_API_BASE_URL || 'https://mrs-staging.onrender.com/api'}${AUTH_ENDPOINTS.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data: TokenVerificationResponse = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    if (!authSettings.autoRefreshEnabled) {
      return this.getAccessToken();
    }

    const currentToken = this.getAccessToken();
    
    if (!currentToken) {
      return null;
    }

    // Check if token is expired or about to expire
    if (this.isTokenExpired(currentToken)) {
      try {
        const newToken = await this.refreshAccessToken();
        return newToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return currentToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    if (!tokens || !tokens.access || !tokens.refresh) {
      return false;
    }

    // Check if access token is not expired
    return !this.isTokenExpired(tokens.access);
  }

  /**
   * Handle authentication error (401/403)
   */
  async handleAuthError(): Promise<boolean> {
    if (!authSettings.autoRefreshEnabled) {
      this.clearTokens();
      return false;
    }

    try {
      await this.refreshAccessToken();
      return true;
    } catch (error) {
      console.error('Failed to handle auth error:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token?: string): Date | null {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return null;
    }

    try {
      const payload = this.decodeJWTPayload(accessToken);
      if (!payload || !payload.exp) {
        return null;
      }

      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Failed to get token expiration:', error);
      return null;
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token?: string): number | null {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return null;
    }

    return expiration.getTime() - Date.now();
  }

  /**
   * Schedule automatic token refresh
   */
  scheduleTokenRefresh(): void {
    if (!authSettings.autoRefreshEnabled) {
      return;
    }

    const timeUntilExpiration = this.getTimeUntilExpiration();
    if (!timeUntilExpiration || timeUntilExpiration <= 0) {
      return;
    }

    // Schedule refresh before expiration (with buffer)
    const refreshTime = timeUntilExpiration - authSettings.tokenExpirationBuffer;
    
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          await this.refreshAccessToken();
          this.scheduleTokenRefresh(); // Schedule next refresh
        } catch (error) {
          console.error('Scheduled token refresh failed:', error);
        }
      }, refreshTime);

      if (featureFlags.enableRequestLogging) {
        console.log(`🕒 Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
      }
    }
  }

  /**
   * Initialize auth manager
   */
  initialize(): void {
    // Schedule token refresh if user is authenticated
    if (this.isAuthenticated()) {
      this.scheduleTokenRefresh();
    }

    if (featureFlags.enableRequestLogging) {
      console.log('🔐 AuthManager initialized');
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager();