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

// Specific Error Types
export interface AuthenticationError extends AuthError {
  subType: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'REFRESH_FAILED';
}

export interface ValidationFieldError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationErrorDetailed extends Omit<ValidationError, 'fieldErrors'> {
  fieldErrors: ValidationFieldError[];
}

export interface NetworkErrorDetailed extends NetworkError {
  type: 'NETWORK_ERROR';
  subType: 'TIMEOUT' | 'CONNECTION_FAILED' | 'DNS_ERROR' | 'OFFLINE';
  retryable: boolean;
}

export interface ServerErrorDetailed extends ServerError {
  subType: 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE' | 'BAD_GATEWAY' | 'GATEWAY_TIMEOUT';
  retryable: boolean;
}

export interface BusinessErrorDetailed extends BusinessError {
  subType: 'INSUFFICIENT_PERMISSIONS' | 'RESOURCE_NOT_FOUND' | 'OPERATION_NOT_ALLOWED' | 'QUOTA_EXCEEDED';
  context?: Record<string, any>;
}

// Error Severity Levels
export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Enhanced Error Interface with Logging
export interface LoggableError extends APIError {
  severity: ErrorSeverity;
  timestamp: string;
  requestId?: string;
  userId?: string;
  context?: Record<string, any>;
  stackTrace?: string;
}

// Error Category Union Type
export type APIErrorType = 
  | AuthenticationError 
  | ValidationErrorDetailed 
  | NetworkErrorDetailed 
  | ServerErrorDetailed 
  | BusinessErrorDetailed;

// Error Handler Response
export interface ErrorHandlerResponse {
  handled: boolean;
  userMessage: string;
  shouldRetry: boolean;
  retryAfter?: number;
  logError: boolean;
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

// Pagination Parameters Interface
export interface PaginationParams {
  page?: number;
  page_size?: number;
  limit?: number;
  offset?: number;
}

// Filtering Parameters Interface
export interface FilterParams {
  search?: string;
  ordering?: string;
  [key: string]: any;
}

// Query Parameters Interface
export interface QueryParams extends PaginationParams, FilterParams {}

// API List Request Interface
export interface ListRequest {
  params?: QueryParams;
  config?: RequestConfig;
}

// API Detail Request Interface
export interface DetailRequest {
  id: string | number;
  config?: RequestConfig;
}

// API Create Request Interface
export interface CreateRequest<T = any> {
  data: T;
  config?: RequestConfig;
}

// API Update Request Interface
export interface UpdateRequest<T = any> {
  id: string | number;
  data: Partial<T>;
  config?: RequestConfig;
}

// API Delete Request Interface
export interface DeleteRequest {
  id: string | number;
  config?: RequestConfig;
}

// File Upload Interface
export interface FileUpload {
  file: File;
  fieldName?: string;
  fileName?: string;
}

// Multipart Form Data Interface
export interface MultipartFormData {
  [key: string]: string | number | boolean | File | FileUpload;
}