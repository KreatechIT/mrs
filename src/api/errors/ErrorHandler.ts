/**
 * ErrorHandler - Centralized error handling system
 * Processes different error types and provides user-friendly messages
 */

import type { 
  APIError, 
  NetworkError, 
  AuthError, 
  ValidationError, 
  ServerError, 
  BusinessError,
  ErrorResponse 
} from '../types';
import { errorSettings, featureFlags } from '../config/settings';

export type ErrorType = 'NETWORK_ERROR' | 'AUTH_ERROR' | 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'BUSINESS_ERROR' | 'UNKNOWN_ERROR';

export interface ProcessedError {
  type: ErrorType;
  message: string;
  userMessage: string;
  code?: string;
  status?: number;
  details?: any;
  retryable: boolean;
  requiresAuth: boolean;
}

export class ErrorHandler {
  private errorListeners: Array<(error: ProcessedError) => void> = [];

  /**
   * Process any error and return standardized error object
   */
  processError(error: any): ProcessedError {
    // Determine error type and process accordingly
    if (this.isNetworkError(error)) {
      return this.handleNetworkError(error);
    }
    
    if (this.isAuthError(error)) {
      return this.handleAuthError(error);
    }
    
    if (this.isValidationError(error)) {
      return this.handleValidationError(error);
    }
    
    if (this.isServerError(error)) {
      return this.handleServerError(error);
    }
    
    if (this.isBusinessError(error)) {
      return this.handleBusinessError(error);
    }

    // Default to unknown error
    return this.handleUnknownError(error);
  }

  /**
   * Handle network errors (connection issues, timeouts)
   */
  handleNetworkError(error: NetworkError): ProcessedError {
    const processedError: ProcessedError = {
      type: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred',
      userMessage: this.getUserFriendlyNetworkMessage(error),
      code: error.code,
      status: error.status,
      details: error.response,
      retryable: true,
      requiresAuth: false,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Handle authentication errors (401, 403)
   */
  handleAuthError(error: AuthError | any): ProcessedError {
    const status = error.status || error.response?.status;
    
    const processedError: ProcessedError = {
      type: 'AUTH_ERROR',
      message: error.message || 'Authentication error',
      userMessage: this.getUserFriendlyAuthMessage(status),
      code: error.code,
      status,
      details: error.details || error.response?.data,
      retryable: status === 401, // 401 can be retried after token refresh
      requiresAuth: true,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Handle validation errors (400, 422)
   */
  handleValidationError(error: ValidationError | any): ProcessedError {
    const status = error.status || error.response?.status;
    const details = error.details || error.response?.data;
    
    const processedError: ProcessedError = {
      type: 'VALIDATION_ERROR',
      message: error.message || 'Validation error',
      userMessage: this.getUserFriendlyValidationMessage(details),
      code: error.code,
      status,
      details,
      retryable: false,
      requiresAuth: false,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Handle server errors (5xx)
   */
  handleServerError(error: ServerError | any): ProcessedError {
    const status = error.status || error.response?.status;
    
    const processedError: ProcessedError = {
      type: 'SERVER_ERROR',
      message: error.message || 'Server error',
      userMessage: this.getUserFriendlyServerMessage(status),
      code: error.code,
      status,
      details: error.details || error.response?.data,
      retryable: errorSettings.retryableStatusCodes.includes(status || 0),
      requiresAuth: false,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Handle business logic errors
   */
  handleBusinessError(error: BusinessError | any): ProcessedError {
    const processedError: ProcessedError = {
      type: 'BUSINESS_ERROR',
      message: error.message || 'Business logic error',
      userMessage: error.message || 'An error occurred while processing your request',
      code: error.errorCode || error.code,
      status: error.status,
      details: error.details,
      retryable: false,
      requiresAuth: false,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Handle unknown errors
   */
  handleUnknownError(error: any): ProcessedError {
    const processedError: ProcessedError = {
      type: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      code: error.code,
      status: error.status,
      details: error,
      retryable: false,
      requiresAuth: false,
    };

    this.logError(processedError, error);
    this.notifyListeners(processedError);
    
    return processedError;
  }

  /**
   * Check if error is a network error
   */
  private isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout') ||
      !error.response // No response usually means network issue
    );
  }

  /**
   * Check if error is an authentication error
   */
  private isAuthError(error: any): boolean {
    const status = error.status || error.response?.status;
    return errorSettings.authErrorCodes.includes(status) || error.type === 'AUTH_ERROR';
  }

  /**
   * Check if error is a validation error
   */
  private isValidationError(error: any): boolean {
    const status = error.status || error.response?.status;
    return errorSettings.validationErrorCodes.includes(status) || error.type === 'VALIDATION_ERROR';
  }

  /**
   * Check if error is a server error
   */
  private isServerError(error: any): boolean {
    const status = error.status || error.response?.status;
    return status >= 500 && status < 600;
  }

  /**
   * Check if error is a business logic error
   */
  private isBusinessError(error: any): boolean {
    return error.type === 'BUSINESS_ERROR' || error.errorCode;
  }

  /**
   * Get user-friendly network error message
   */
  private getUserFriendlyNetworkMessage(error: NetworkError): string {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    return 'Network error occurred. Please check your connection and try again.';
  }

  /**
   * Get user-friendly authentication error message
   */
  private getUserFriendlyAuthMessage(status?: number): string {
    switch (status) {
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      default:
        return 'Authentication error. Please log in again.';
    }
  }

  /**
   * Get user-friendly validation error message
   */
  private getUserFriendlyValidationMessage(details?: any): string {
    if (details && typeof details === 'object') {
      // Try to extract field-specific errors
      const fieldErrors = this.extractFieldErrors(details);
      if (fieldErrors.length > 0) {
        return fieldErrors.join(', ');
      }
      
      // Try common error message fields
      if (details.message) return details.message;
      if (details.error) return details.error;
      if (details.detail) return details.detail;
    }
    
    return 'Please check your input and try again.';
  }

  /**
   * Get user-friendly server error message
   */
  private getUserFriendlyServerMessage(status?: number): string {
    switch (status) {
      case 500:
        return 'Internal server error. Please try again later.';
      case 502:
        return 'Server is temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is temporarily unavailable. Please try again later.';
      case 504:
        return 'Server response timed out. Please try again later.';
      default:
        return 'Server error occurred. Please try again later.';
    }
  }

  /**
   * Extract field-specific error messages
   */
  private extractFieldErrors(details: any): string[] {
    const errors: string[] = [];
    
    if (details && typeof details === 'object') {
      Object.entries(details).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            errors.push(`${field}: ${message}`);
          });
        } else if (typeof messages === 'string') {
          errors.push(`${field}: ${messages}`);
        }
      });
    }
    
    return errors;
  }

  /**
   * Log error with appropriate level
   */
  private logError(processedError: ProcessedError, originalError: any): void {
    if (!errorSettings.logErrors) {
      return;
    }

    const logData = {
      type: processedError.type,
      message: processedError.message,
      userMessage: processedError.userMessage,
      status: processedError.status,
      code: processedError.code,
      retryable: processedError.retryable,
      requiresAuth: processedError.requiresAuth,
      timestamp: new Date().toISOString(),
      ...(errorSettings.showDetailedErrors && {
        originalError,
        details: processedError.details,
        stack: originalError?.stack,
      }),
    };

    // Use appropriate console method based on error type
    switch (processedError.type) {
      case 'NETWORK_ERROR':
        console.warn('🌐 Network Error:', logData);
        break;
      case 'AUTH_ERROR':
        console.warn('🔐 Auth Error:', logData);
        break;
      case 'VALIDATION_ERROR':
        console.warn('✅ Validation Error:', logData);
        break;
      case 'SERVER_ERROR':
        console.error('🔥 Server Error:', logData);
        break;
      case 'BUSINESS_ERROR':
        console.warn('💼 Business Error:', logData);
        break;
      default:
        console.error('❓ Unknown Error:', logData);
    }
  }

  /**
   * Notify error listeners
   */
  private notifyListeners(error: ProcessedError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  /**
   * Add error listener
   */
  addErrorListener(listener: (error: ProcessedError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   */
  removeErrorListener(listener: (error: ProcessedError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * Clear all error listeners
   */
  clearErrorListeners(): void {
    this.errorListeners = [];
  }

  /**
   * Check if error should be retried
   */
  shouldRetry(error: ProcessedError, attemptCount: number, maxAttempts: number): boolean {
    if (!featureFlags.enableAutoRetry) {
      return false;
    }

    if (attemptCount >= maxAttempts) {
      return false;
    }

    return error.retryable;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay(attemptCount: number, baseDelay: number = 1000): number {
    return baseDelay * Math.pow(2, attemptCount - 1);
  }

  /**
   * Create user notification for error
   */
  createUserNotification(error: ProcessedError): {
    type: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    action?: string;
  } {
    const baseNotification = {
      message: error.userMessage,
    };

    switch (error.type) {
      case 'NETWORK_ERROR':
        return {
          ...baseNotification,
          type: 'warning' as const,
          title: 'Connection Issue',
          action: error.retryable ? 'Retry' : undefined,
        };
      
      case 'AUTH_ERROR':
        return {
          ...baseNotification,
          type: 'error' as const,
          title: 'Authentication Required',
          action: 'Login',
        };
      
      case 'VALIDATION_ERROR':
        return {
          ...baseNotification,
          type: 'warning' as const,
          title: 'Invalid Input',
        };
      
      case 'SERVER_ERROR':
        return {
          ...baseNotification,
          type: 'error' as const,
          title: 'Server Error',
          action: error.retryable ? 'Retry' : undefined,
        };
      
      case 'BUSINESS_ERROR':
        return {
          ...baseNotification,
          type: 'info' as const,
          title: 'Action Required',
        };
      
      default:
        return {
          ...baseNotification,
          type: 'error' as const,
          title: 'Error',
          action: 'Retry',
        };
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();