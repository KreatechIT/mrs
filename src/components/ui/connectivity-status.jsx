import { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";
import { useConnectivity } from "../../hooks/useConnectivity";
import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";
import { Badge } from "./badge";

/**
 * Simple connectivity indicator
 */
export function ConnectivityIndicator({ className, ...props }) {
  const { isOnline } = useConnectivity();

  return (
    <div 
      className={cn(
        "flex items-center space-x-2",
        className
      )} 
      {...props}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-sm text-gray-600">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

/**
 * Detailed connectivity status with connection info
 */
export function ConnectivityStatus({ className, showDetails = false, ...props }) {
  const { 
    isOnline, 
    connectionType, 
    effectiveType, 
    downlink, 
    rtt,
    lastOfflineTime,
    testConnectivity 
  } = useConnectivity();
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      await testConnectivity();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline';
    if (effectiveType === '4g' || (downlink && downlink > 10)) return 'excellent';
    if (effectiveType === '3g' || (downlink && downlink > 1.5)) return 'good';
    if (effectiveType === '2g' || (downlink && downlink > 0.5)) return 'fair';
    return 'poor';
  };

  const quality = getConnectionQuality();
  const qualityColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-yellow-500',
    poor: 'bg-orange-500',
    offline: 'bg-red-500'
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className={cn(
              "w-3 h-3 rounded-full",
              qualityColors[quality]
            )}
          />
          <div>
            <span className="font-medium">
              {isOnline ? "Connected" : "Disconnected"}
            </span>
            {quality !== 'offline' && (
              <Badge variant="outline" className="ml-2 text-xs">
                {quality}
              </Badge>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestConnection}
          disabled={isTestingConnection}
        >
          {isTestingConnection ? "Testing..." : "Test"}
        </Button>
      </div>

      {showDetails && (
        <div className="text-sm text-gray-600 space-y-1">
          {connectionType && (
            <div>Connection: {connectionType}</div>
          )}
          {effectiveType && (
            <div>Speed: {effectiveType.toUpperCase()}</div>
          )}
          {downlink && (
            <div>Bandwidth: {downlink} Mbps</div>
          )}
          {rtt && (
            <div>Latency: {rtt}ms</div>
          )}
          {lastOfflineTime && !isOnline && (
            <div>
              Offline since: {new Date(lastOfflineTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Offline banner that appears when connection is lost
 */
export function OfflineBanner({ className, ...props }) {
  const { isOnline, lastOfflineTime } = useConnectivity();
  const [showBanner, setShowBanner] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Hide banner after a short delay when coming back online
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <Alert className={cn("border-orange-200 bg-orange-50", className)} {...props}>
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span>
            {isOnline 
              ? "Connection restored!" 
              : "You're offline. Some features may be limited."
            }
          </span>
        </div>
        {!isOnline && lastOfflineTime && (
          <span className="text-xs text-gray-500">
            Since {new Date(lastOfflineTime).toLocaleTimeString()}
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Cache status component for debugging
 */
export function CacheStatus({ className, ...props }) {
  const { getCacheStats, clearCache } = useConnectivity();
  const [stats, setStats] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(getCacheStats());
    };
    
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [getCacheStats]);

  if (!stats) return null;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Cache: {stats.size} items
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Details"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCache}
            disabled={stats.size === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      {showDetails && stats.entries.length > 0 && (
        <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
          {stats.entries.map((entry, index) => (
            <div key={index} className="flex justify-between text-gray-600">
              <span className="truncate">{entry.key}</span>
              <span>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}