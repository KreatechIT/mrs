/**
 * API Constants
 * Common constants used throughout the API layer
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Error Types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  BUSINESS_ERROR: 'BUSINESS_ERROR',
};

// Request Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKENS: 'mrs_auth_tokens',
  REFRESH_TOKEN: 'mrs_refresh_token',
  USER_DATA: 'mrs_user_data',
  API_CACHE: 'mrs_api_cache',
};

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Invalid data provided',
  SERVER_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network connection error',
};

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  DELAY_MULTIPLIER: 2,
  MAX_DELAY: 10000,
};
