/**
 * NotificationService - Handle user notifications and toast messages
 */

export const NotificationType = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  LOADING: 'LOADING',
};

export class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  /**
   * Initialize the service
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
  }

  /**
   * Show success notification
   */
  showSuccess(message, options) {
    const notification = {
      type: NotificationType.SUCCESS,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.addNotification(notification);
  }

  /**
   * Show error notification
   */
  showError(message, options) {
    const notification = {
      type: NotificationType.ERROR,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.addNotification(notification);
  }

  /**
   * Show warning notification
   */
  showWarning(message, options) {
    const notification = {
      type: NotificationType.WARNING,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.addNotification(notification);
  }

  /**
   * Show info notification
   */
  showInfo(message, options) {
    const notification = {
      type: NotificationType.INFO,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.addNotification(notification);
  }

  /**
   * Show loading notification
   */
  showLoading(message, options) {
    const notification = {
      type: NotificationType.LOADING,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.addNotification(notification);
  }

  /**
   * Show API error notification
   */
  apiError(operation, message, options) {
    const errorMessage = `${operation}: ${message}`;
    this.showError(errorMessage, {
      category: 'api',
      operation,
      ...options
    });
  }

  /**
   * Show API success notification
   */
  apiSuccess(operation, message, options) {
    const successMessage = message || `${operation} completed successfully`;
    this.showSuccess(successMessage, {
      category: 'api',
      operation,
      ...options
    });
  }

  /**
   * Add notification to the list
   */
  addNotification(notification) {
    this.notifications.push(notification);
    this.notifyListeners(notification);
  }

  /**
   * Remove notification
   */
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications = [];
  }

  /**
   * Add notification listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove notification listener
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(notification) {
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export convenience methods
export const showSuccess = (message, options) => notificationService.showSuccess(message, options);
export const showError = (message, options) => notificationService.showError(message, options);
export const showWarning = (message, options) => notificationService.showWarning(message, options);
export const showInfo = (message, options) => notificationService.showInfo(message, options);
export const showLoading = (message, options) => notificationService.showLoading(message, options);
