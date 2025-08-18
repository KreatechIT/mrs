import { cn } from "../../lib/utils";
import { Progress } from "./progress";

/**
 * Simple loading spinner component
 */
export function LoadingSpinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

/**
 * Loading indicator with message
 */
export function LoadingIndicator({ 
  isLoading, 
  message, 
  progress, 
  className,
  showSpinner = true,
  showProgress = false,
  ...props 
}) {
  if (!isLoading) return null;

  return (
    <div className={cn("flex items-center space-x-3", className)} {...props}>
      {showSpinner && <LoadingSpinner size="sm" />}
      <div className="flex-1">
        {message && (
          <p className="text-sm text-gray-600 mb-1">{message}</p>
        )}
        {showProgress && typeof progress === 'number' && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay({ 
  isLoading, 
  message = "Loading...", 
  progress,
  className,
  ...props 
}) {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        className
      )}
      {...props}
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-700 mb-2">{message}</p>
          {typeof progress === 'number' && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline loading state for buttons
 */
export function ButtonLoading({ 
  isLoading, 
  children, 
  loadingText = "Loading...",
  className,
  ...props 
}) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      <span>{isLoading ? loadingText : children}</span>
    </div>
  );
}

/**
 * Loading skeleton for content placeholders
 */
export function LoadingSkeleton({ 
  lines = 3, 
  className,
  ...props 
}) {
  return (
    <div className={cn("animate-pulse space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-gray-200 rounded",
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Loading state for data tables
 */
export function TableLoading({ 
  rows = 5, 
  columns = 4, 
  className,
  ...props 
}) {
  return (
    <div className={cn("animate-pulse", className)} {...props}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Loading state for cards
 */
export function CardLoading({ className, ...props }) {
  return (
    <div className={cn("animate-pulse", className)} {...props}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}