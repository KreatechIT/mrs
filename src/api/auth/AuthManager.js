/**
 * AuthManager - Authentication token management
 * Handles token storage, retrieval, refresh, and validation
 */

import { authSettings, featureFlags } from '../config/settings.js';
import { AUTH_ENDPOINTS } from '../config/endpoints.js';

export class AuthManager {
  constructor() {
    this.refreshPromise = null;
    this.refreshAttempts = 0;
  }

  /**
   * Store authentication tokens securely
   */
  storeTokens(tokens) {
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
  getTokens() {
    try {
      // First try the default auth tokens
      let stored = localStorage.getItem(authSettings.tokenStorageKey);
      
      // If not found, try member tokens
      if (!stored) {
        stored = localStorage.getItem('memberTokens');
      }
      
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
  getAccessToken() {
    const tokens = this.getTokens();
    return tokens?.access || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    const tokens = this.getTokens();
    return tokens?.refresh || null;
  }

  /**
   * Clear all stored tokens
   */
  clearTokens() {
    try {
      localStorage.removeItem(authSettings.tokenStorageKey);
      localStorage.removeItem(authSettings.refreshTokenKey);
      localStorage.removeItem('memberTokens');
      localStorage.removeItem('memberData');
      
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
  isTokenExpired(token) {
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
  decodeJWTPayload(token) {
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
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken() {
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
  isAuthenticated() {
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
  async handleAuthError() {
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
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
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
  async performTokenRefresh(refreshToken) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://mrs-staging.onrender.com/api'}${AUTH_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token is invalid or expired
          this.clearTokens();
          throw new Error('Refresh token expired');
        }
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.access) {
        throw new Error('Invalid refresh response');
      }

      // Update stored tokens
      const currentTokens = this.getTokens();
      const newTokens = {
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
   * Initialize auth manager
   */
  initialize() {
    if (featureFlags.enableRequestLogging) {
      console.log('🔐 AuthManager initialized');
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager();