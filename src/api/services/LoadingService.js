/**
 * LoadingService - Manage loading states across the application
 */

export const LOADING_OPERATIONS = {
  AUTHENTICATION: 'AUTHENTICATION',
  DATA_FETCH: 'DATA_FETCH',
  API_REQUEST: 'API_REQUEST',
  FILE_UPLOAD: 'FILE_UPLOAD',
};

export class LoadingService {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = [];
    this.globalLoadingCount = 0;
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
   * Start loading for an operation
   */
  startLoading(operationId, details) {
    const loadingState = {
      operationId,
      isLoading: true,
      startTime: Date.now(),
      ...details
    };

    this.loadingStates.set(operationId, loadingState);
    this.globalLoadingCount++;
    this.notifyListeners();
  }

  /**
   * Stop loading for an operation
   */
  stopLoading(operationId) {
    if (this.loadingStates.has(operationId)) {
      this.loadingStates.delete(operationId);
      this.globalLoadingCount = Math.max(0, this.globalLoadingCount - 1);
      this.notifyListeners();
    }
  }

  /**
   * Update loading progress
   */
  updateProgress(operationId, progress, message) {
    const loadingState = this.loadingStates.get(operationId);
    if (loadingState) {
      const updatedState = {
        ...loadingState,
        progress: Math.min(100, Math.max(0, progress)),
        message
      };

      this.loadingStates.set(operationId, updatedState);
      this.notifyListeners();
    }
  }

  /**
   * Check if operation is loading
   */
  isLoading(operationId) {
    return this.loadingStates.has(operationId);
  }

  /**
   * Get current loading state
   */
  getLoadingState() {
    return Array.from(this.loadingStates.values());
  }

  /**
   * Check if any operation is loading
   */
  isGlobalLoading() {
    return this.globalLoadingCount > 0;
  }

  /**
   * Clear all loading states
   */
  clearAll() {
    this.loadingStates.clear();
    this.globalLoadingCount = 0;
    this.notifyListeners();
  }

  /**
   * Add loading listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove loading listener
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getLoadingState());
      } catch (error) {
        console.error('Error in loading listener:', error);
      }
    });
  }
}

// Export singleton instance
export const loadingService = new LoadingService();
