import { useState, useEffect, useCallback } from 'react';
import { loadingService } from '../api/services/LoadingService';

/**
 * Hook for managing loading states in React components
 */
export function useLoading(operationId) {
  const [loadingState, setLoadingState] = useState(() => 
    loadingService.getLoadingState(operationId) || { isLoading: false }
  );

  useEffect(() => {
    const unsubscribe = loadingService.subscribe((state) => {
      if (state.operation === operationId || !operationId) {
        setLoadingState(state);
      }
    });

    // Get initial state
    const initialState = loadingService.getLoadingState(operationId);
    if (initialState) {
      setLoadingState(initialState);
    }

    return unsubscribe;
  }, [operationId]);

  const startLoading = useCallback((message) => {
    if (operationId) {
      loadingService.startLoading(operationId, message);
    }
  }, [operationId]);

  const stopLoading = useCallback(() => {
    if (operationId) {
      loadingService.stopLoading(operationId);
    }
  }, [operationId]);

  const updateProgress = useCallback((progress, message) => {
    if (operationId) {
      loadingService.updateProgress(operationId, { progress, message });
    }
  }, [operationId]);

  return {
    isLoading: loadingState.isLoading,
    progress: loadingState.progress,
    message: loadingState.message,
    startLoading,
    stopLoading,
    updateProgress
  };
}

/**
 * Hook for managing global loading state
 */
export function useGlobalLoading() {
  const [isAnyLoading, setIsAnyLoading] = useState(() => 
    loadingService.isAnyLoading()
  );
  const [loadingStates, setLoadingStates] = useState(() => 
    loadingService.getAllLoadingStates()
  );

  useEffect(() => {
    const unsubscribe = loadingService.subscribe(() => {
      setIsAnyLoading(loadingService.isAnyLoading());
      setLoadingStates(loadingService.getAllLoadingStates());
    });

    return unsubscribe;
  }, []);

  return {
    isAnyLoading,
    loadingStates,
    clearAll: loadingService.clearAll.bind(loadingService)
  };
}

/**
 * Hook for executing async operations with automatic loading management
 */
export function useAsyncOperation(operationId) {
  const { isLoading, progress, message } = useLoading(operationId);

  const execute = useCallback(async (operation, loadingMessage) => {
    return loadingService.withLoading(operationId, operation, loadingMessage);
  }, [operationId]);

  const executeWithProgress = useCallback(async (operation, initialMessage) => {
    return loadingService.withProgress(operationId, operation, initialMessage);
  }, [operationId]);

  return {
    isLoading,
    progress,
    message,
    execute,
    executeWithProgress
  };
}