import { useState, useEffect, useCallback } from 'react';
import { connectivityService } from '../api/services/ConnectivityService';

/**
 * Hook for managing network connectivity state
 */
export function useConnectivity() {
  const [connectivityState, setConnectivityState] = useState(() => 
    connectivityService.getState()
  );

  useEffect(() => {
    const unsubscribe = connectivityService.subscribe((state) => {
      setConnectivityState(state);
    });

    return unsubscribe;
  }, []);

  const testConnectivity = useCallback(async (url) => {
    return connectivityService.testConnectivity(url);
  }, []);

  const clearCache = useCallback(() => {
    connectivityService.clearAllCache();
  }, []);

  const getCacheStats = useCallback(() => {
    return connectivityService.getCacheStats();
  }, []);

  return {
    isOnline: connectivityState.isOnline,
    isOffline: !connectivityState.isOnline,
    connectionType: connectivityState.connectionType,
    effectiveType: connectivityState.effectiveType,
    downlink: connectivityState.downlink,
    rtt: connectivityState.rtt,
    lastOnlineTime: connectivityState.lastOnlineTime,
    lastOfflineTime: connectivityState.lastOfflineTime,
    testConnectivity,
    clearCache,
    getCacheStats
  };
}

/**
 * Hook for executing operations with offline fallback
 */
export function useOfflineCapable(cacheKey, cacheDuration) {
  const { isOnline } = useConnectivity();

  const executeWithFallback = useCallback(async (operation) => {
    return connectivityService.withOfflineFallback(
      cacheKey,
      operation,
      cacheDuration
    );
  }, [cacheKey, cacheDuration]);

  const getCachedData = useCallback(() => {
    return connectivityService.getCachedData(cacheKey);
  }, [cacheKey]);

  const hasCachedData = useCallback(() => {
    return connectivityService.hasCachedData(cacheKey);
  }, [cacheKey]);

  const clearCachedData = useCallback(() => {
    connectivityService.clearCachedData(cacheKey);
  }, [cacheKey]);

  return {
    isOnline,
    executeWithFallback,
    getCachedData,
    hasCachedData,
    clearCachedData
  };
}