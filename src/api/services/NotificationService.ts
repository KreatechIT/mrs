import { toast } from 'sonner';

/**
 * Notification types for different kinds of messages
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading'
}

/**
 * Configuration options for notifications
 */
export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
}

/**
 * API operation result for notification handling
 */
export interface APIOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * NotificationService provides centralized notification management
 * for API operations and user feedback
 */
export class NotificationService {
  private static instance: NotificationService;
  private defaultOptions: NotificationOptions = {
    duration: 4000,
    position: 'top-right',
    dismissible: true
  };

  private constructor() {}

  /**
   * Get singleton instance of NotificationService
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Show success notification
   */
  public success(message: string, options?: NotificationOptions): string | number {
    const config = { ...this.defaultOptions, ...options };
    
    return toast.success(message, {
      duration: config.duration,
      dismissible: config.dismissible,
      description: config.description,
      action: config.action
    });
  }

  /**
   * Show error notification with user-friendly formatting
   */
  public error(message: string, options?: NotificationOptions): string | number {
    const config = { ...this.defaultOptions, ...options };
    
    // Format error message to be user-friendly
    const formattedMessage = this.formatErrorMessage(message);
    
    return toast.error(formattedMessage, {
      duration: config.duration || 6000, // Longer duration for errors
      dismissible: config.dismissible,
      description: config.description,
      action: config.action
    });
  }

  /**
   * Show warning notification
   */
  public warning(message: string, options?: NotificationOptions): string | number {
    const config = { ...this.defaultOptions, ...options };
    
    return toast.warning(message, {
      duration: config.duration,
      dismissible: config.dismissible,
      description: config.description,
      action: config.action
    });
  }

  /**
   * Show info notification
   */
  public info(message: string, options?: NotificationOptions): string | number {
    const config = { ...this.defaultOptions, ...options };
    
    return toast.info(message, {
      duration: config.duration,
      dismissible: config.dismissible,
      description: config.description,
      action: config.action
    });
  }

  /**
   * Show loading notification
   */
  public loading(message: string, options?: NotificationOptions): string | number {
    const config = { ...this.defaultOptions, ...options };
    
    return toast.loading(message, {
      duration: config.duration || Infinity, // Loading toasts persist until dismissed
      dismissible: config.dismissible,
      description: config.description
    });
  }

  /**
   * Dismiss a specific notification
   */
  public dismiss(toastId: string | number): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all notifications
   */
  public dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Handle API operation results with appropriate notifications
   */
  public handleAPIResult<T>(
    result: APIOperationResult<T>,
    successMessage?: string,
    options?: NotificationOptions
  ): void {
    if (result.success) {
      const message = successMessage || result.message || 'Operation completed successfully';
      this.success(message, options);
    } else {
      const message = result.error || result.message || 'Operation failed';
      this.error(message, options);
    }
  }

  /**
   * Handle API operation with loading state
   */
  public async handleAPIOperation<T>(
    operation: () => Promise<APIOperationResult<T>>,
    loadingMessage: string,
    successMessage?: string,
    options?: NotificationOptions
  ): Promise<APIOperationResult<T>> {
    const loadingToast = this.loading(loadingMessage);
    
    try {
      const result = await operation();
      this.dismiss(loadingToast);
      this.handleAPIResult(result, successMessage, options);
      return result;
    } catch (error) {
      this.dismiss(loadingToast);
      this.error('An unexpected error occurred', options);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Format error messages to be user-friendly
   */
  private formatErrorMessage(message: string): string {
    // Common error message transformations
    const errorMappings: Record<string, string> = {
      'Network Error': 'Unable to connect to the server. Please check your internet connection.',
      'timeout': 'The request took too long to complete. Please try again.',
      'Unauthorized': 'Your session has expired. Please log in again.',
      'Forbidden': 'You do not have permission to perform this action.',
      'Not Found': 'The requested resource was not found.',
      'Internal Server Error': 'A server error occurred. Please try again later.',
      'Bad Request': 'Invalid request. Please check your input and try again.',
      'Conflict': 'This action conflicts with existing data. Please refresh and try again.'
    };

    // Check for exact matches first
    if (errorMappings[message]) {
      return errorMappings[message];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMappings)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // If no mapping found, return the original message but capitalize first letter
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  /**
   * Show notification for successful API operations
   */
  public apiSuccess(operation: string, options?: NotificationOptions): string | number {
    const messages: Record<string, string> = {
      'login': 'Successfully logged in',
      'logout': 'Successfully logged out',
      'create': 'Item created successfully',
      'update': 'Item updated successfully',
      'delete': 'Item deleted successfully',
      'archive': 'Item archived successfully',
      'spin': 'Spin completed successfully',
      'refresh': 'Data refreshed successfully'
    };

    const message = messages[operation] || `${operation} completed successfully`;
    return this.success(message, options);
  }

  /**
   * Show notification for failed API operations
   */
  public apiError(operation: string, error?: string, options?: NotificationOptions): string | number {
    const baseMessages: Record<string, string> = {
      'login': 'Failed to log in',
      'logout': 'Failed to log out',
      'create': 'Failed to create item',
      'update': 'Failed to update item',
      'delete': 'Failed to delete item',
      'archive': 'Failed to archive item',
      'spin': 'Failed to complete spin',
      'refresh': 'Failed to refresh data'
    };

    const baseMessage = baseMessages[operation] || `${operation} failed`;
    const fullMessage = error ? `${baseMessage}: ${error}` : baseMessage;
    
    return this.error(fullMessage, options);
  }
}

// Export singleton instance for easy access
export const notificationService = NotificationService.getInstance();

// Export convenience functions
export const showSuccess = (message: string, options?: NotificationOptions) => 
  notificationService.success(message, options);

export const showError = (message: string, options?: NotificationOptions) => 
  notificationService.error(message, options);

export const showWarning = (message: string, options?: NotificationOptions) => 
  notificationService.warning(message, options);

export const showInfo = (message: string, options?: NotificationOptions) => 
  notificationService.info(message, options);

export const showLoading = (message: string, options?: NotificationOptions) => 
  notificationService.loading(message, options);