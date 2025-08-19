/**
 * API Settings Configuration
 * Environment-specific settings and feature flags
 */

// Environment Detection
export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';
export const isTest = import.meta.env.MODE === 'test';

// API Client Configuration
export const apiClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://staging-api.menangsininow.com',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3', 10),
  enableLogging: isDevelopment || import.meta.env.VITE_API_ENABLE_LOGGING === 'true',
};

// Authentication Settings
export const authSettings = {
  tokenStorageKey: 'mrs_auth_tokens',
  refreshTokenKey: 'mrs_refresh_token',
  tokenExpirationBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
  maxRefreshAttempts: 3,
  autoRefreshEnabled: true,
};

// Request Settings
export const requestSettings = {
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  multipartHeaders: {
    'Accept': 'application/json',
    // Content-Type will be set automatically for multipart/form-data
  },
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryDelayMultiplier: 2,
};

// Error Handling Settings
export const errorSettings = {
  showDetailedErrors: isDevelopment,
  logErrors: true,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  authErrorCodes: [401, 403],
  validationErrorCodes: [400, 422],
};

// Feature Flags
export const featureFlags = {
  enableRequestLogging: isDevelopment,
  enableResponseLogging: isDevelopment,
  enableErrorReporting: isProduction,
  enableOfflineMode: false,
  enableRequestCaching: true,
  enableAutoRetry: true,
  enableTokenRefresh: true,
};