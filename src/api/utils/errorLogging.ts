/**
 * Error logging utilities with type safety
 */

import type {
  LoggableError,
  ErrorSeverity,
  APIError,
  AuthenticationError,
  ValidationErrorDetailed,
  NetworkErrorDetailed,
  ServerErrorDetailed,
  BusinessErrorDetailed
} from '../types';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// Logger interface
export interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
  fatal(message: string, data?: any): void;
}

// Console logger implementation
class ConsoleLogger implements Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  debug(message: string, data?: any): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.minLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.minLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, data?: any): void {
    if (this.minLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, data);
    }
  }

  fatal(message: string, data?: any): void {
    if (this.minLevel <= LogLevel.FATAL) {
      console.error(`[FATAL] ${message}`, data);
    }
  }
}

// Default logger instance
let logger: Logger = new ConsoleLogger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN
);

// Set custom logger
export function setLogger(customLogger: Logger): void {
  logger = customLogger;
}

// Get current logger
export function getLogger(): Logger {
  return logger;
}

// Map error severity to log level
function getLogLevelFromSeverity(severity: ErrorSeverity): LogLevel {
  switch (severity) {
    case 'LOW':
      return LogLevel.INFO;
    case 'MEDIUM':
      return LogLevel.WARN;
    case 'HIGH':
      return LogLevel.ERROR;
    case 'CRITICAL':
      return LogLevel.FATAL;
    default:
      return LogLevel.ERROR;
  }
}

// Log error with appropriate level
export function logError(error: LoggableError): void {
  const logLevel = getLogLevelFromSeverity(error.severity);
  const message = `API Error: ${error.message}`;
  
  const logData = {
    status: error.status,
    code: error.code,
    type: (error as any).type,
    subType: (error as any).subType,
    timestamp: error.timestamp,
    requestId: error.requestId,
    userId: error.userId,
    context: error.context,
    details: error.details,
    stackTrace: error.stackTrace
  };

  switch (logLevel) {
    case LogLevel.DEBUG:
      logger.debug(message, logData);
      break;
    case LogLevel.INFO:
      logger.info(message, logData);
      break;
    case LogLevel.WARN:
      logger.warn(message, logData);
      break;
    case LogLevel.ERROR:
      logger.error(message, logData);
      break;
    case LogLevel.FATAL:
      logger.fatal(message, logData);
      break;
  }
}

// Log authentication error
export function logAuthenticationError(error: AuthenticationError, context?: Record<string, any>): void {
  const loggableError: LoggableError = {
    ...error,
    severity: error.subType === 'INVALID_CREDENTIALS' ? 'MEDIUM' : 'LOW',
    timestamp: new Date().toISOString(),
    context
  };

  logError(loggableError);
}

// Log validation error
export function logValidationError(error: ValidationErrorDetailed, context?: Record<string, any>): void {
  const loggableError: LoggableError = {
    ...error,
    severity: 'LOW',
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      fieldErrors: error.fieldErrors
    }
  };

  logError(loggableError);
}

// Log network error
export function logNetworkError(error: NetworkErrorDetailed, context?: Record<string, any>): void {
  const severity: ErrorSeverity = error.subType === 'OFFLINE' ? 'LOW' : 'MEDIUM';
  
  const loggableError: LoggableError = {
    ...error,
    status: error.status || 0,
    severity,
    timestamp: new Date().toISOString(),
    context
  };

  logError(loggableError);
}

// Log server error
export function logServerError(error: ServerErrorDetailed, context?: Record<string, any>): void {
  const severity: ErrorSeverity = error.status >= 500 ? 'HIGH' : 'MEDIUM';
  
  const loggableError: LoggableError = {
    ...error,
    severity,
    timestamp: new Date().toISOString(),
    context
  };

  logError(loggableError);
}

// Log business error
export function logBusinessError(error: BusinessErrorDetailed, context?: Record<string, any>): void {
  const severity: ErrorSeverity = error.subType === 'INSUFFICIENT_PERMISSIONS' ? 'LOW' : 'MEDIUM';
  
  const loggableError: LoggableError = {
    ...error,
    severity,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      errorCode: error.errorCode,
      businessContext: error.context
    }
  };

  logError(loggableError);
}

// Log generic API error
export function logAPIError(error: APIError, severity: ErrorSeverity = 'MEDIUM', context?: Record<string, any>): void {
  const loggableError: LoggableError = {
    ...error,
    severity,
    timestamp: new Date().toISOString(),
    context
  };

  logError(loggableError);
}

// Log request/response for debugging
export function logRequest(method: string, url: string, data?: any, headers?: Record<string, string>): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`API Request: ${method} ${url}`, {
      data,
      headers: headers ? Object.keys(headers) : undefined // Don't log header values for security
    });
  }
}

export function logResponse(method: string, url: string, status: number, data?: any, duration?: number): void {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`API Response: ${method} ${url} - ${status}`, {
      status,
      dataSize: data ? JSON.stringify(data).length : 0,
      duration: duration ? `${duration}ms` : undefined
    });
  }
}

// Performance logging
export function logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
  const message = `Performance: ${operation} took ${duration}ms`;
  
  if (duration > 5000) { // Log slow operations as warnings
    logger.warn(message, context);
  } else if (process.env.NODE_ENV === 'development') {
    logger.debug(message, context);
  }
}

// Error statistics tracking
interface ErrorStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<number, number>;
  bySeverity: Record<ErrorSeverity, number>;
}

let errorStats: ErrorStats = {
  total: 0,
  byType: {},
  byStatus: {},
  bySeverity: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
};

// Track error statistics
export function trackErrorStats(error: LoggableError): void {
  errorStats.total++;
  
  const errorType = (error as any).type || 'UNKNOWN';
  errorStats.byType[errorType] = (errorStats.byType[errorType] || 0) + 1;
  
  errorStats.byStatus[error.status] = (errorStats.byStatus[error.status] || 0) + 1;
  errorStats.bySeverity[error.severity]++;
}

// Get error statistics
export function getErrorStats(): ErrorStats {
  return { ...errorStats };
}

// Reset error statistics
export function resetErrorStats(): void {
  errorStats = {
    total: 0,
    byType: {},
    byStatus: {},
    bySeverity: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
  };
}

// Log error statistics periodically
export function logErrorStats(): void {
  if (errorStats.total > 0) {
    logger.info('Error Statistics', errorStats);
  }
}