/**
 * Enterprise Error Handling - Logging Service
 *
 * Structured error logging for monitoring and debugging.
 * Captures contextual information without exposing sensitive data.
 * Supports integration with external monitoring tools.
 */

import { AppError, ErrorLogEntry, ErrorSeverity } from './types';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  minLevel: LogLevel;
  maxStoredLogs: number;
  remoteEndpoint?: string;
  appVersion: string;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

const SEVERITY_TO_LOG_LEVEL: Record<ErrorSeverity, LogLevel> = {
  warning: 'warn',
  error: 'error',
  critical: 'critical',
};

// In-memory log store (for debugging/export)
const errorLogs: ErrorLogEntry[] = [];

// Default config
let config: LogConfig = {
  enableConsole: import.meta.env.DEV,
  enableRemote: import.meta.env.PROD,
  minLevel: import.meta.env.DEV ? 'debug' : 'warn',
  maxStoredLogs: 100,
  appVersion: '1.0.0',
};

/**
 * Configure the logging service
 */
export function configureLogging(overrides: Partial<LogConfig>): void {
  config = { ...config, ...overrides };
}

/**
 * Log an AppError with full context
 */
export function logError(error: AppError, context?: { component?: string; action?: string }): void {
  const logLevel = SEVERITY_TO_LOG_LEVEL[error.severity] || 'error';

  if (!shouldLog(logLevel)) return;

  const logEntry: ErrorLogEntry = {
    id: error.id,
    error: sanitizeError(error),
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      route: typeof window !== 'undefined' ? window.location.pathname : '',
      component: context?.component,
      action: context?.action,
    },
    environment: {
      browser: error.metadata?.browser || 'unknown',
      os: getOS(),
      appVersion: config.appVersion,
      timestamp: error.timestamp,
    },
  };

  // Store in memory
  storeLog(logEntry);

  // Console output (development)
  if (config.enableConsole) {
    logToConsole(logLevel, logEntry);
  }

  // Remote logging (production)
  if (config.enableRemote && config.remoteEndpoint) {
    logToRemote(logEntry).catch(() => {
      // Silently fail on remote logging errors - don't cause cascade
    });
  }
}

/**
 * Log a warning message (not from an AppError)
 */
export function logWarning(message: string, metadata?: Record<string, unknown>): void {
  if (!shouldLog('warn')) return;

  if (config.enableConsole) {
    console.warn(`[WARN] ${message}`, metadata || '');
  }
}

/**
 * Log an info message
 */
export function logInfo(message: string, metadata?: Record<string, unknown>): void {
  if (!shouldLog('info')) return;

  if (config.enableConsole) {
    console.info(`[INFO] ${message}`, metadata || '');
  }
}

/**
 * Get stored error logs (for debugging or export)
 */
export function getErrorLogs(): ErrorLogEntry[] {
  return [...errorLogs];
}

/**
 * Clear stored logs
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Export logs as JSON string
 */
export function exportErrorLogs(): string {
  return JSON.stringify(errorLogs, null, 2);
}

// --- Private helpers ---

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[config.minLevel];
}

function storeLog(entry: ErrorLogEntry): void {
  errorLogs.push(entry);
  if (errorLogs.length > config.maxStoredLogs) {
    errorLogs.shift();
  }
}

function logToConsole(level: LogLevel, entry: ErrorLogEntry): void {
  const prefix = `[${level.toUpperCase()}] [${entry.error.code}]`;
  const message = entry.error.message;

  switch (level) {
    case 'critical':
    case 'error':
      console.error(prefix, message, {
        category: entry.error.category,
        endpoint: entry.error.metadata?.endpoint,
        route: entry.context.route,
      });
      break;
    case 'warn':
      console.warn(prefix, message, {
        category: entry.error.category,
        endpoint: entry.error.metadata?.endpoint,
      });
      break;
    default:
      console.log(prefix, message);
  }
}

async function logToRemote(entry: ErrorLogEntry): Promise<void> {
  if (!config.remoteEndpoint) return;

  try {
    await fetch(config.remoteEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      keepalive: true,
    });
  } catch {
    // Silent fail - remote logging should never break the app
  }
}

/**
 * Remove sensitive data before logging
 */
function sanitizeError(error: AppError): AppError {
  const sanitized = { ...error };
  // Remove originalError to prevent circular references & sensitive data
  delete sanitized.originalError;
  return sanitized;
}

function getOS(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone')) return 'iOS';
  return 'unknown';
}
