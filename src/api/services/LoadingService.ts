/**
 * LoadingService - Centralized loading state management for API operations
 */

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
  message?: string;
  startTime?: number;
}

export interface ProgressUpdate {
  progress: number;
  message?: string;
}

export type LoadingStateListener = (state: LoadingState) => void;

/**
 * LoadingService manages loading states for API operations
 * and provides progress tracking for long-running operations
 */
export class LoadingService {
  private static instance: LoadingService;
  private loadingStates: Map<string, LoadingState> = new Map();
  private listeners: Set<LoadingStateListener> = new Set();
  private globalLoadingCount = 0;

  private constructor() {}

  /**
   * Get singleton instance of LoadingService
   */
  public static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  /**
   * Start loading state for an operation
   */
  public startLoading(operationId: string, message?: string): void {
    const state: LoadingState = {
      isLoading: true,
      operation: operationId,
      message,
      startTime: Date.now(),
      progress: 0
    };

    this.loadingStates.set(operationId, state);
    this.globalLoadingCount++;
    this.notifyListeners(state);
  }

  /**
   * Update progress for a loading operation
   */
  public updateProgress(operationId: string, update: ProgressUpdate): void {
    const state = this.loadingStates.get(operationId);
    if (!state || !state.isLoading) return;

    const updatedState: LoadingState = {
      ...state,
      progress: Math.max(0, Math.min(100, update.progress)),
      message: update.message || state.message
    };

    this.loadingStates.set(operationId, updatedState);
    this.notifyListeners(updatedState);
  }

  /**
   * Stop loading state for an operation
   */
  public stopLoading(operationId: string): void {
    const state = this.loadingStates.get(operationId);
    if (!state || !state.isLoading) return;

    const finalState: LoadingState = {
      ...state,
      isLoading: false,
      progress: 100
    };

    this.loadingStates.set(operationId, finalState);
    this.globalLoadingCount = Math.max(0, this.globalLoadingCount - 1);
    this.notifyListeners(finalState);

    // Clean up completed operations after a delay
    setTimeout(() => {
      this.loadingStates.delete(operationId);
    }, 1000);
  }

  /**
   * Get loading state for a specific operation
   */
  public getLoadingState(operationId: string): LoadingState | null {
    return this.loadingStates.get(operationId) || null;
  }

  /**
   * Check if any operation is currently loading
   */
  public isAnyLoading(): boolean {
    return this.globalLoadingCount > 0;
  }

  /**
   * Check if a specific operation is loading
   */
  public isLoading(operationId: string): boolean {
    const state = this.loadingStates.get(operationId);
    return state?.isLoading || false;
  }

  /**
   * Get all current loading states
   */
  public getAllLoadingStates(): LoadingState[] {
    return Array.from(this.loadingStates.values()).filter(state => state.isLoading);
  }

  /**
   * Subscribe to loading state changes
   */
  public subscribe(listener: LoadingStateListener): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clear all loading states
   */
  public clearAll(): void {
    this.loadingStates.clear();
    this.globalLoadingCount = 0;
    this.notifyListeners({ isLoading: false });
  }

  /**
   * Execute an operation with automatic loading state management
   */
  public async withLoading<T>(
    operationId: string,
    operation: () => Promise<T>,
    message?: string
  ): Promise<T> {
    this.startLoading(operationId, message);
    
    try {
      const result = await operation();
      this.stopLoading(operationId);
      return result;
    } catch (error) {
      this.stopLoading(operationId);
      throw error;
    }
  }

  /**
   * Execute an operation with progress tracking
   */
  public async withProgress<T>(
    operationId: string,
    operation: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    initialMessage?: string
  ): Promise<T> {
    this.startLoading(operationId, initialMessage);
    
    const updateProgress = (progress: number, message?: string) => {
      this.updateProgress(operationId, { progress, message });
    };
    
    try {
      const result = await operation(updateProgress);
      this.stopLoading(operationId);
      return result;
    } catch (error) {
      this.stopLoading(operationId);
      throw error;
    }
  }

  /**
   * Get operation duration in milliseconds
   */
  public getOperationDuration(operationId: string): number | null {
    const state = this.loadingStates.get(operationId);
    if (!state?.startTime) return null;
    
    return Date.now() - state.startTime;
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(state: LoadingState): void {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in loading state listener:', error);
      }
    });
  }
}

// Export singleton instance
export const loadingService = LoadingService.getInstance();

// Common operation IDs for consistency
export const LOADING_OPERATIONS = {
  // Auth operations
  LOGIN: 'auth.login',
  LOGOUT: 'auth.logout',
  REFRESH_TOKEN: 'auth.refresh',
  VERIFY_TOKEN: 'auth.verify',
  
  // Lucky Spin Items operations
  FETCH_SPIN_ITEMS: 'spinItems.fetch',
  CREATE_SPIN_ITEM: 'spinItems.create',
  UPDATE_SPIN_ITEM: 'spinItems.update',
  DELETE_SPIN_ITEM: 'spinItems.delete',
  ARCHIVE_SPIN_ITEM: 'spinItems.archive',
  
  // Spin Sequences operations
  FETCH_SEQUENCES: 'sequences.fetch',
  CREATE_SEQUENCE: 'sequences.create',
  UPDATE_SEQUENCE: 'sequences.update',
  DELETE_SEQUENCE: 'sequences.delete',
  REORDER_SEQUENCES: 'sequences.reorder',
  
  // Member operations
  FETCH_MEMBERS: 'members.fetch',
  FETCH_MEMBER_DETAILS: 'members.fetchDetails',
  MEMBER_SPIN: 'members.spin',
  MEMBER_TEN_SPINS: 'members.tenSpins',
  
  // File operations
  UPLOAD_IMAGE: 'files.uploadImage',
  
  // Data refresh
  REFRESH_DATA: 'data.refresh'
} as const;

export type LoadingOperationId = typeof LOADING_OPERATIONS[keyof typeof LOADING_OPERATIONS];