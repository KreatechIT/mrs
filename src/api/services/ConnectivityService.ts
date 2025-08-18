/**
 * ConnectivityService - Network connectivity detection and offline handling
 */

export interface ConnectivityState {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  lastOnlineTime?: number;
  lastOfflineTime?: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export type ConnectivityListener = (state: ConnectivityState) => void;

/**
 * ConnectivityService manages network connectivity detection,
 * offline mode handling, and cached data management
 */
export class ConnectivityService {
  private static instance: ConnectivityService;
  private listeners: Set<ConnectivityListener> = new Set();
  private cache: Map<string, CacheEntry> = new Map();
  private state: ConnectivityState;
  private retryQueue: Array<() => Promise<any>> = [];
  private isRetrying = false;

  // Cache configuration
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;
  private readonly RETRY_DELAY = 2000; // 2 seconds


  private constructor() {
    this.state = {
      isOnline: navigator.onLine,
      lastOnlineTime: navigator.onLine ? Date.now() : undefined,
      lastOfflineTime: !navigator.onLine ? Date.now() : undefined
    };

    this.initializeConnectivityMonitoring();
    this.loadCacheFromStorage();
  }

  /**
   * Get singleton instance of ConnectivityService
   */
  public static getInstance(): ConnectivityService {
    if (!ConnectivityService.instance) {
      ConnectivityService.instance = new ConnectivityService();
    }
    return ConnectivityService.instance;
  }

  /**
   * Get current connectivity state
   */
  public getState(): ConnectivityState {
    return { ...this.state };
  }

  /**
   * Check if currently online
   */
  public isOnline(): boolean {
    return this.state.isOnline;
  }

  /**
   * Check if currently offline
   */
  public isOffline(): boolean {
    return !this.state.isOnline;
  }

  /**
   * Subscribe to connectivity state changes
   */
  public subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener(this.getState());
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Cache data with expiration
   */
  public cacheData<T>(key: string, data: T, duration?: number): void {
    const expiresAt = Date.now() + (duration || this.DEFAULT_CACHE_DURATION);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt,
      key
    };

    this.cache.set(key, entry);
    this.cleanupExpiredCache();
    this.saveCacheToStorage();

    // Limit cache size
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      this.evictOldestCacheEntries();
    }
  }

  /**
   * Get cached data
   */
  public getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveCacheToStorage();
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Check if data is cached and valid
   */
  public hasCachedData(key: string): boolean {
    return this.getCachedData(key) !== null;
  }

  /**
   * Clear specific cached data
   */
  public clearCachedData(key: string): void {
    this.cache.delete(key);
    this.saveCacheToStorage();
  }

  /**
   * Clear all cached data
   */
  public clearAllCache(): void {
    this.cache.clear();
    this.saveCacheToStorage();
  }

  /**
   * Execute operation with offline fallback to cached data
   */
  public async withOfflineFallback<T>(
    key: string,
    operation: () => Promise<T>,
    cacheDuration?: number
  ): Promise<T> {
    try {
      // If online, try the operation
      if (this.isOnline()) {
        const result = await operation();
        // Cache the successful result
        this.cacheData(key, result, cacheDuration);
        return result;
      }
    } catch (error) {
      // If operation fails and we're online, still try cache
      console.warn('Operation failed, trying cache fallback:', error);
    }

    // Try to get cached data
    const cachedData = this.getCachedData<T>(key);
    if (cachedData !== null) {
      console.log('Using cached data for:', key);
      return cachedData;
    }

    // No cache available, throw error
    throw new Error('No cached data available and operation failed');
  }

  /**
   * Queue operation for retry when connection is restored
   */
  public queueForRetry(operation: () => Promise<any>): void {
    this.retryQueue.push(operation);
    
    // If we're online, try to process the queue
    if (this.isOnline() && !this.isRetrying) {
      this.processRetryQueue();
    }
  }

  /**
   * Test network connectivity with a ping
   */
  public async testConnectivity(url?: string): Promise<boolean> {
    const testUrl = url || '/api/health'; // Fallback to a health check endpoint
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    size: number;
    entries: Array<{ key: string; timestamp: number; expiresAt: number }>;
  } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).map(entry => ({
        key: entry.key,
        timestamp: entry.timestamp,
        expiresAt: entry.expiresAt
      }))
    };
  }

  /**
   * Initialize connectivity monitoring
   */
  private initializeConnectivityMonitoring(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Monitor connection quality if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', this.handleConnectionChange.bind(this));
        this.updateConnectionInfo(connection);
      }
    }

    // Periodic connectivity check
    setInterval(() => {
      this.performConnectivityCheck();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.state = {
      ...this.state,
      isOnline: true,
      lastOnlineTime: Date.now()
    };
    
    this.notifyListeners();
    this.processRetryQueue();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.state = {
      ...this.state,
      isOnline: false,
      lastOfflineTime: Date.now()
    };
    
    this.notifyListeners();
  }

  /**
   * Handle connection change
   */
  private handleConnectionChange(event: Event): void {
    const connection = event.target as any;
    this.updateConnectionInfo(connection);
    this.notifyListeners();
  }

  /**
   * Update connection information
   */
  private updateConnectionInfo(connection: any): void {
    this.state = {
      ...this.state,
      connectionType: connection.type,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  /**
   * Perform periodic connectivity check
   */
  private async performConnectivityCheck(): Promise<void> {
    const isActuallyOnline = await this.testConnectivity();
    
    if (isActuallyOnline !== this.state.isOnline) {
      this.state = {
        ...this.state,
        isOnline: isActuallyOnline,
        lastOnlineTime: isActuallyOnline ? Date.now() : this.state.lastOnlineTime,
        lastOfflineTime: !isActuallyOnline ? Date.now() : this.state.lastOfflineTime
      };
      
      this.notifyListeners();
      
      if (isActuallyOnline) {
        this.processRetryQueue();
      }
    }
  }

  /**
   * Process queued operations when connection is restored
   */
  private async processRetryQueue(): Promise<void> {
    if (this.isRetrying || this.retryQueue.length === 0) return;
    
    this.isRetrying = true;
    
    const operations = [...this.retryQueue];
    this.retryQueue = [];
    
    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        console.error('Retry operation failed:', error);
        // Re-queue failed operations with exponential backoff
        setTimeout(() => {
          this.retryQueue.push(operation);
        }, this.RETRY_DELAY);
      }
    }
    
    this.isRetrying = false;
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error('Error in connectivity listener:', error);
      }
    });
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Evict oldest cache entries when cache is full
   */
  private evictOldestCacheEntries(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 10);
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  /**
   * Save cache to localStorage
   */
  private saveCacheToStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('mrs_api_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadCacheFromStorage(): void {
    try {
      const cacheData = localStorage.getItem('mrs_api_cache');
      if (cacheData) {
        const entries: Array<[string, CacheEntry]> = JSON.parse(cacheData);
        this.cache = new Map(entries);
        this.cleanupExpiredCache();
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
      this.cache.clear();
    }
  }
}

// Export singleton instance
export const connectivityService = ConnectivityService.getInstance();

// Cache key generators for consistency
export const CACHE_KEYS = {
  SPIN_ITEMS: 'spin_items',
  SPIN_SEQUENCES: 'spin_sequences',
  MEMBERS: 'members',
  MEMBER_DETAILS: (uuid: string) => `member_${uuid}`,
  USER_PROFILE: 'user_profile'
} as const;