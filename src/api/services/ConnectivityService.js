/**
 * ConnectivityService - Handle network connectivity and caching
 */

export const CACHE_KEYS = {
  USER_DATA: 'USER_DATA',
  API_CACHE: 'API_CACHE',
  OFFLINE_QUEUE: 'OFFLINE_QUEUE',
};

export class ConnectivityService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    this.cache = new Map();
  }

  /**
   * Initialize the service
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners({ isOnline: true });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners({ isOnline: false });
    });

    this.isInitialized = true;
  }

  /**
   * Get connectivity state
   */
  getConnectivityState() {
    return {
      isOnline: this.isOnline,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if online
   */
  isConnected() {
    return this.isOnline;
  }

  /**
   * Add cache entry
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Get cache entry
   */
  getCache(key) {
    return this.cache.get(key);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Add connectivity listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove connectivity listener
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(state) {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in connectivity listener:', error);
      }
    });
  }
}

// Export singleton instance
export const connectivityService = new ConnectivityService();
