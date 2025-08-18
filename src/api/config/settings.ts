/**
 * API Settings Configuration
 * Environment-specific settings and feature flags
 */

import type { APIClientConfig } from '../types';

// Environment Detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// API Client Configuration
export const apiClientConfig: APIClientConfig = {
  baseURL: process.env.VITE_API_BASE_URL || 'https://mrs-staging.onrender.com/api',
  timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000', 10),
  retryAttempts: parseInt(process.env.VITE_API_RETRY_ATTEMPTS || '3', 10),
  enableLogging: isDevelopment || process.env.VITE_API_ENABLE_LOGGING === 'true',
};

// Authentication Settings
export const authSettings = {
  tokenStorageKey: 'mrs_auth_tokens',
  refreshTokenKey: 'mrs_refresh_token',
  tokenExpirationBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
  maxRefreshAttempts: 3,
  autoRefreshEnabled: true,
} as const;

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
} as const;

// Error Handling Settings
export const errorSettings = {
  showDetailedErrors: isDevelopment,
  logErrors: true,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  authErrorCodes: [401, 403],
  validationErrorCodes: [400, 422],
} as const;

// Cache Settings
export const cacheSettings = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  cacheableEndpoints: [
    '/lucky-spin-items/',
    '/lucky-spin-sequences/',
    '/members/',
  ],
} as const;

// Feature Flags
export const featureFlags = {
  enableRequestLogging: isDevelopment,
  enableResponseLogging: isDevelopment,
  enableErrorReporting: isProduction,
  enableOfflineMode: false,
  enableRequestCaching: true,
  enableAutoRetry: true,
  enableTokenRefresh: true,
} as const;

// Development Settings
export const devSettings = {
  mockApiResponses: false,
  simulateNetworkDelay: false,
  networkDelayMs: 1000,
  simulateErrors: false,
  errorRate: 0.1, // 10% error rate for testing
} as const;