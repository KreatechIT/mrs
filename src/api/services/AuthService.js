/**
 * AuthService - Authentication service implementation
 * Handles admin login, token refresh, verification, and logout functionality
 */

import { apiClient } from '../client/APIClient.js';
import { authManager } from '../auth/AuthManager.js';
import { AUTH_ENDPOINTS } from '../config/endpoints.js';
import { featureFlags } from '../config/settings.js';
import { notificationService } from './NotificationService.js';

export class AuthService {
  /**
   * Admin login with credential validation
   */
  async login(credentials) {
    try {
      // Basic validation
      if (!credentials.username?.trim() || !credentials.password) {
        const error = new Error('Username and password are required');
        notificationService.apiError('login', error.message);
        throw error;
      }

      const response = await apiClient.post(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (!response.data?.access || !response.data?.refresh) {
        const error = new Error('Invalid login response');
        notificationService.apiError('login', error.message);
        throw error;
      }

      // Store tokens
      authManager.storeTokens({
        access: response.data.access,
        refresh: response.data.refresh,
      });

      // Show success notification
      notificationService.apiSuccess('login');

      return response.data;
    } catch (error) {
      // Handle and show error notification
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      notificationService.apiError('login', errorMessage);
      throw error;
    }
  }

  /**
   * Automatic token refresh using refresh token
   */
  async refreshToken() {
    const refreshToken = authManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post(
      AUTH_ENDPOINTS.REFRESH,
      { refresh: refreshToken }
    );

    if (!response.data?.access) {
      authManager.clearTokens();
      throw new Error('Token refresh failed');
    }

    // Update tokens
    authManager.storeTokens({
      access: response.data.access,
      refresh: response.data.refresh || refreshToken,
    });

    return response.data.access;
  }

  /**
   * Token verification for security validation
   */
  async verifyToken(token) {
    const accessToken = token || authManager.getAccessToken();
    if (!accessToken) return false;

    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.VERIFY,
        { token: accessToken }
      );
      // API returns 200 status with empty body if token is valid
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Logout with token invalidation
   */
  async logout() {
    try {
      const refreshToken = authManager.getRefreshToken();
      
      if (featureFlags.enableRequestLogging) {
        console.log('🚪 Logging out admin user');
      }

      // Attempt to invalidate refresh token on server
      if (refreshToken) {
        try {
          const logoutRequest = {
            refresh: refreshToken,
          };

          await apiClient.post(AUTH_ENDPOINTS.LOGOUT, logoutRequest);

          if (featureFlags.enableRequestLogging) {
            console.log('✅ Server-side logout successful');
          }
        } catch (error) {
          // Log error but don't fail logout process
          if (featureFlags.enableRequestLogging) {
            console.warn('⚠️ Server-side logout failed, continuing with local cleanup:', error);
          }
        }
      }

      // Always clear local authentication state
      this.clearLocalAuthState();

      // Show success notification
      notificationService.apiSuccess('logout');

      if (featureFlags.enableRequestLogging) {
        console.log('✅ Logout completed successfully');
      }
    } catch (error) {
      // Ensure local state is cleared even if server logout fails
      this.clearLocalAuthState();
      
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Logout error (local state cleared):', error);
      }
      
      // Show error notification
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      notificationService.apiError('logout', errorMessage);
      
      throw this.handleAuthError(error, 'Logout failed');
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return authManager.isAuthenticated();
  }

  /**
   * Get current authentication tokens
   */
  getTokens() {
    return authManager.getTokens();
  }

  /**
   * Get current access token
   */
  getAccessToken() {
    return authManager.getAccessToken();
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken() {
    return authManager.getValidAccessToken();
  }

  /**
   * Clear local authentication state and stored tokens
   */
  clearLocalAuthState() {
    // Clear tokens from AuthManager
    authManager.clearTokens();
    
    // Clear auth token from API client
    apiClient.clearAuthToken();

    if (featureFlags.enableRequestLogging) {
      console.log('🧹 Local authentication state cleared');
    }
  }

  /**
   * Handle authentication errors with proper error transformation
   */
  handleAuthError(error, defaultMessage) {
    if (error instanceof Error) {
      return error;
    }

    // Handle API error responses
    if (error?.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.message) {
        return new Error(errorData.message);
      }
      
      if (errorData.error) {
        return new Error(errorData.error);
      }
      
      if (errorData.detail) {
        return new Error(errorData.detail);
      }
    }

    // Handle HTTP status codes
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return new Error('Invalid credentials provided');
        case 401:
          return new Error('Authentication failed - invalid username or password');
        case 403:
          return new Error('Access denied - insufficient permissions');
        case 429:
          return new Error('Too many login attempts - please try again later');
        case 500:
          return new Error('Server error - please try again later');
        default:
          return new Error(`Authentication error (${error.response.status})`);
      }
    }

    return new Error(defaultMessage);
  }
}

// Export singleton instance
export const authService = new AuthService();