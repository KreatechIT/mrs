/**
 * AuthService - Authentication service implementation
 * Handles admin login, token refresh, verification, and logout functionality
 */

import type { 
  LoginCredentials, 
  AuthResponse, 
  AuthTokens,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenVerificationResponse,
  LogoutRequest,
  APIResponse 
} from '../types';
import { apiClient } from '../client/APIClient';
import { authManager } from '../auth/AuthManager';
import { AUTH_ENDPOINTS } from '../config/endpoints';
import { featureFlags } from '../config/settings';
import { notificationService } from './NotificationService';

export class AuthService {
  /**
   * Admin login with credential validation
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Basic validation
      if (!credentials.username?.trim() || !credentials.password) {
        const error = new Error('Username and password are required');
        notificationService.apiError('login', error.message);
        throw error;
      }

      const response: APIResponse<AuthResponse> = await apiClient.post(
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
  async refreshToken(): Promise<string> {
    const refreshToken = authManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response: APIResponse<RefreshTokenResponse> = await apiClient.post(
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
  async verifyToken(token?: string): Promise<boolean> {
    const accessToken = token || authManager.getAccessToken();
    if (!accessToken) return false;

    try {
      const response: APIResponse<TokenVerificationResponse> = await apiClient.post(
        AUTH_ENDPOINTS.VERIFY,
        {},
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      return response.data?.valid === true;
    } catch {
      return false;
    }
  }

  /**
   * Logout with token invalidation
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = authManager.getRefreshToken();
      
      if (featureFlags.enableRequestLogging) {
        console.log('🚪 Logging out admin user');
      }

      // Attempt to invalidate refresh token on server
      if (refreshToken) {
        try {
          const logoutRequest: LogoutRequest = {
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
  isAuthenticated(): boolean {
    return authManager.isAuthenticated();
  }

  /**
   * Get current authentication tokens
   */
  getTokens(): AuthTokens | null {
    return authManager.getTokens();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return authManager.getAccessToken();
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    return authManager.getValidAccessToken();
  }

  /**
   * Handle token expiration with automatic renewal
   */
  async handleTokenExpiration(): Promise<boolean> {
    try {
      await this.refreshToken();
      return true;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to handle token expiration:', error);
      }
      return false;
    }
  }

  /**
   * Check if access token is expired or about to expire
   */
  isTokenExpired(token?: string): boolean {
    return authManager.isTokenExpired(token);
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token?: string): Date | null {
    return authManager.getTokenExpiration(token);
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token?: string): number | null {
    return authManager.getTimeUntilExpiration(token);
  }

  /**
   * Schedule automatic token refresh
   */
  scheduleTokenRefresh(): void {
    authManager.scheduleTokenRefresh();
  }

  /**
   * Initialize authentication service
   */
  initialize(): void {
    authManager.initialize();
    
    if (featureFlags.enableRequestLogging) {
      console.log('🔐 AuthService initialized');
    }
  }

  /**
   * Validate login credentials
   */
  private validateLoginCredentials(credentials: LoginCredentials): void {
    if (!credentials.username || typeof credentials.username !== 'string') {
      throw new Error('Username is required and must be a string');
    }

    if (!credentials.password || typeof credentials.password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    if (credentials.username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    if (credentials.password.length === 0) {
      throw new Error('Password cannot be empty');
    }

    // Basic validation for username format
    if (credentials.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  /**
   * Transform login response data
   */
  private transformLoginResponse(data: AuthResponse): AuthResponse {
    // Validate required fields
    if (!data.access || !data.refresh) {
      throw new Error('Invalid authentication response: missing tokens');
    }

    if (!data.username || !data.id) {
      throw new Error('Invalid authentication response: missing user data');
    }

    // Return normalized response
    return {
      id: data.id,
      username: data.username,
      access: data.access,
      refresh: data.refresh,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      role: data.role || 'admin',
    };
  }

  /**
   * Clear local authentication state and stored tokens
   */
  private clearLocalAuthState(): void {
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
  private handleAuthError(error: any, defaultMessage: string): Error {
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