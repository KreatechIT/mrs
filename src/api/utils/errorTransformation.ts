/**
 * Error transformation utilities for consistent error handling
 */

import type {
  APIError,
  ErrorResponse,
  AuthenticationError,
  ValidationErrorDetailed,
  NetworkErrorDetailed,
  ServerErrorDetailed,
  BusinessErrorDetailed,
  LoggableError,
  ErrorSeverity,
  ErrorHandlerResponse,
  ValidationFieldError
} from '../types';

// Transform generic error to APIError
export function transformToAPIError(error: any): APIError {
  if (error.response) {
    return {
      status: error.response.status || 500,
      message: error.response.data?.message || error.response.data?.error || error.message || 'API Error',
      code: error.response.data?.code || error.code,
      details: error.response.data
    };
  }

  return {
    status: error.status || 0,
    message: error.message || 'Unknown error occurred',
    code: error.code,
    details: error
  };
}

// Transform to Authentication Error
export function transformToAuthenticationError(error: any): AuthenticationError {
  const baseError = transformToAPIError(error);
  let subType: AuthenticationError['subType'] = 'TOKEN_INVALID';

  if (error.response?.status === 401) {
    if (error.response.data?.code === 'token_expired') {
      subType = 'TOKEN_EXPIRED';
    } else if (error.response.data?.code === 'invalid_credentials') {
      subType = 'INVALID_CREDENTIALS';
    } else if (error.response.data?.code === 'refresh_failed') {
      subType = 'REFRESH_FAILED';
    }
  }

  return {
    ...baseError,
    type: 'AUTH_ERROR',
    subType,
    requiresLogin: subType === 'INVALID_CREDENTIALS' || subType === 'REFRESH_FAILED'
  };
}

// Transform to Validation Error
export function transformToValidationError(error: any): ValidationErrorDetailed {
  const baseError = transformToAPIError(error);
  const fieldErrors: ValidationFieldError[] = [];

  // Extract field errors from different response formats
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    if (typeof errors === 'object') {
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message: string) => {
            fieldErrors.push({ field, message });
          });
        } else if (typeof messages === 'string') {
          fieldErrors.push({ field, message: messages });
        }
      });
    }
  }

  // Handle Django REST Framework style errors
  if (error.response?.data && typeof error.response.data === 'object') {
    Object.entries(error.response.data).forEach(([field, messages]) => {
      if (Array.isArray(messages) && field !== 'detail' && field !== 'message') {
        messages.forEach((message: string) => {
          fieldErrors.push({ field, message });
        });
      }
    });
  }

  return {
    ...baseError,
    type: 'VALIDATION_ERROR',
    fieldErrors
  };
}

// Transform to Network Error
export function transformToNetworkError(error: any): NetworkErrorDetailed {
  const baseError = transformToAPIError(error);
  let subType: NetworkErrorDetailed['subType'] = 'CONNECTION_FAILED';
  let retryable = true;

  if (error.code === 'ENOTFOUND') {
    subType = 'DNS_ERROR';
    retryable = false;
  } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    subType = 'TIMEOUT';
  } else if (!navigator.onLine) {
    subType = 'OFFLINE';
  }

  return {
    ...baseError,
    name: error.name || 'NetworkError',
    type: 'NETWORK_ERROR',
    subType,
    retryable
  };
}

// Transform to Server Error
export function transformToServerError(error: any): ServerErrorDetailed {
  const baseError = transformToAPIError(error);
  let subType: ServerErrorDetailed['subType'] = 'INTERNAL_ERROR';
  let retryable = true;

  const status = error.response?.status || error.status;
  
  switch (status) {
    case 502:
      subType = 'BAD_GATEWAY';
      break;
    case 503:
      subType = 'SERVICE_UNAVAILABLE';
      break;
    case 504:
      subType = 'GATEWAY_TIMEOUT';
      break;
    case 500:
    default:
      subType = 'INTERNAL_ERROR';
      retryable = false; // Don't retry 500 errors by default
      break;
  }

  return {
    ...baseError,
    type: 'SERVER_ERROR',
    subType,
    retryable,
    timestamp: new Date().toISOString()
  };
}

// Transform to Business Error
export function transformToBusinessError(error: any): BusinessErrorDetailed {
  const baseError = transformToAPIError(error);
  let subType: BusinessErrorDetailed['subType'] = 'OPERATION_NOT_ALLOWED';

  const status = error.response?.status || error.status;
  const code = error.response?.data?.code || error.code;

  if (status === 403) {
    subType = 'INSUFFICIENT_PERMISSIONS';
  } else if (status === 404) {
    subType = 'RESOURCE_NOT_FOUND';
  } else if (code === 'quota_exceeded' || code === 'rate_limit_exceeded') {
    subType = 'QUOTA_EXCEEDED';
  }

  return {
    ...baseError,
    type: 'BUSINESS_ERROR',
    subType,
    errorCode: code,
    context: error.response?.data?.context || {}
  };
}

// Create loggable error with metadata
export function createLoggableError(
  error: APIError,
  severity: ErrorSeverity = 'MEDIUM',
  context?: Record<string, any>
): LoggableError {
  return {
    ...error,
    severity,
    timestamp: new Date().toISOString(),
    requestId: context?.requestId,
    userId: context?.userId,
    context,
    stackTrace: context?.stackTrace || (error as any).stack
  };
}

// Get user-friendly error message
export function getUserFriendlyMessage(error: APIError): string {
  // Authentication errors
  if ('type' in error && error.type === 'AUTH_ERROR') {
    const authError = error as AuthenticationError;
    switch (authError.subType) {
      case 'INVALID_CREDENTIALS':
        return 'Invalid username or password. Please try again.';
      case 'TOKEN_EXPIRED':
        return 'Your session has expired. Please log in again.';
      case 'TOKEN_INVALID':
        return 'Authentication failed. Please log in again.';
      case 'REFRESH_FAILED':
        return 'Unable to refresh your session. Please log in again.';
      default:
        return 'Authentication failed. Please log in again.';
    }
  }

  // Validation errors
  if ('type' in error && error.type === 'VALIDATION_ERROR') {
    const validationError = error as ValidationErrorDetailed;
    if (validationError.fieldErrors.length > 0) {
      return `Please check the following fields: ${validationError.fieldErrors.map(e => e.field).join(', ')}`;
    }
    return 'Please check your input and try again.';
  }

  // Network errors
  if ('type' in error && error.type === 'NETWORK_ERROR') {
    const networkError = error as NetworkErrorDetailed;
    switch (networkError.subType) {
      case 'OFFLINE':
        return 'You appear to be offline. Please check your internet connection.';
      case 'TIMEOUT':
        return 'The request timed out. Please try again.';
      case 'DNS_ERROR':
        return 'Unable to connect to the server. Please try again later.';
      default:
        return 'Network error occurred. Please check your connection and try again.';
    }
  }

  // Server errors
  if ('type' in error && error.type === 'SERVER_ERROR') {
    const serverError = error as ServerErrorDetailed;
    switch (serverError.subType) {
      case 'SERVICE_UNAVAILABLE':
        return 'The service is temporarily unavailable. Please try again later.';
      case 'BAD_GATEWAY':
      case 'GATEWAY_TIMEOUT':
        return 'Server is experiencing issues. Please try again later.';
      default:
        return 'A server error occurred. Please try again later.';
    }
  }

  // Business errors
  if ('type' in error && error.type === 'BUSINESS_ERROR') {
    const businessError = error as BusinessErrorDetailed;
    switch (businessError.subType) {
      case 'INSUFFICIENT_PERMISSIONS':
        return 'You do not have permission to perform this action.';
      case 'RESOURCE_NOT_FOUND':
        return 'The requested resource was not found.';
      case 'QUOTA_EXCEEDED':
        return 'You have exceeded your usage limit. Please try again later.';
      default:
        return 'This operation is not allowed at this time.';
    }
  }

  // Fallback to original message or generic message
  return error.message || 'An unexpected error occurred. Please try again.';
}

// Determine if error should be retried
export function shouldRetryError(error: APIError): boolean {
  if ('retryable' in error) {
    return error.retryable as boolean;
  }

  // Default retry logic based on status
  const status = error.status;
  
  // Retry on network errors and some server errors
  if (status === 0 || status >= 500) {
    return true;
  }

  // Don't retry client errors (4xx)
  if (status >= 400 && status < 500) {
    return false;
  }

  return false;
}

// Get retry delay in milliseconds
export function getRetryDelay(attemptNumber: number, error?: APIError): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  const baseDelay = 1000;
  const maxDelay = 30000; // 30 seconds max
  
  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  
  return delay + jitter;
}

// Create error handler response
export function createErrorHandlerResponse(
  error: APIError,
  handled: boolean = true
): ErrorHandlerResponse {
  return {
    handled,
    userMessage: getUserFriendlyMessage(error),
    shouldRetry: shouldRetryError(error),
    retryAfter: shouldRetryError(error) ? getRetryDelay(1, error) : undefined,
    logError: error.status >= 500 || error.status === 0
  };
}