/**
 * Base TypeScript interfaces for API responses and errors
 * These interfaces provide consistent structure for all API interactions
 */

// Base API Response Structure
export interface APIResponse<T = any> {
  data?: T;
  status: number;
  message?: string;
}

// Paginated Response Structure
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  count: number;
  next: string | null;
  previous: string | null;
}

// Base Error Response Structure
export interface APIError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

// Error Response from API
export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  details?: Record<string, any>;
}

// Network Error Interface
export interface NetworkError extends Error {
  code?: string;
  status?: number;
  response?: any;
}

// Authentication Error Interface
export interface AuthError extends APIError {
  type: 'AUTH_ERROR';
  requiresLogin?: boolean;
}

// Validation Error Interface
export interface ValidationError extends APIError {
  type: 'VALIDATION_ERROR';
  fieldErrors?: Record<string, string[]>;
}

// Server Error Interface
export interface ServerError extends APIError {
  type: 'SERVER_ERROR';
  timestamp?: string;
}

// Business Logic Error Interface
export interface BusinessError extends APIError {
  type: 'BUSINESS_ERROR';
  errorCode?: string;
}

// Generic API Client Configuration
export interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  enableLogging?: boolean;
}

// Request Configuration Interface
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

// HTTP Methods
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Request Interface
export interface APIRequest {
  method: HTTPMethod;
  url: string;
  data?: any;
  config?: RequestConfig;
}