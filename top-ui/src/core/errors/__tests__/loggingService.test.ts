// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  logError,
  logWarning,
  logInfo,
  getErrorLogs,
  clearErrorLogs,
  exportErrorLogs,
  configureLogging,
} from '../loggingService';
import { normalizeError } from '../errorService';

describe('loggingService', () => {
  beforeEach(() => {
    clearErrorLogs();
    configureLogging({ enableConsole: false, enableRemote: false, minLevel: 'debug' });
  });

  describe('logError', () => {
    it('stores an error log entry', () => {
      const appError = normalizeError('Test error');
      logError(appError);
      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].error.code).toBe(appError.code);
    });

    it('stores error with context', () => {
      const appError = normalizeError('Test error');
      logError(appError, { component: 'TestPage', action: 'submit' });
      const logs = getErrorLogs();
      expect(logs[0].context.component).toBe('TestPage');
      expect(logs[0].context.action).toBe('submit');
    });

    it('logs to console when enableConsole is true', () => {
      configureLogging({ enableConsole: true, minLevel: 'debug' });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const appError = normalizeError(new Error('Console test'));
      logError(appError);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('respects minLevel configuration', () => {
      configureLogging({ minLevel: 'critical', enableConsole: true });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const appError = normalizeError(new Error('below threshold'));
      logError(appError);
      // error level is below critical, should not log
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('enforces maxStoredLogs limit', () => {
      configureLogging({ maxStoredLogs: 3 });
      for (let i = 0; i < 5; i++) {
        logError(normalizeError(`Error ${i}`));
      }
      const logs = getErrorLogs();
      expect(logs).toHaveLength(3);
    });
  });

  describe('logWarning', () => {
    it('logs a warning message to console', () => {
      configureLogging({ enableConsole: true, minLevel: 'debug' });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logWarning('Something might be wrong', { detail: 'test' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('respects minLevel for warnings', () => {
      configureLogging({ minLevel: 'error', enableConsole: true });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logWarning('should not log');
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('logInfo', () => {
    it('logs an info message to console', () => {
      configureLogging({ enableConsole: true, minLevel: 'debug' });
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      logInfo('Info message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getErrorLogs', () => {
    it('returns a copy of logs array', () => {
      logError(normalizeError('test'));
      const logs1 = getErrorLogs();
      const logs2 = getErrorLogs();
      expect(logs1).toEqual(logs2);
      expect(logs1).not.toBe(logs2); // different references
    });
  });

  describe('clearErrorLogs', () => {
    it('clears all stored logs', () => {
      logError(normalizeError('test'));
      expect(getErrorLogs()).toHaveLength(1);
      clearErrorLogs();
      expect(getErrorLogs()).toHaveLength(0);
    });
  });

  describe('exportErrorLogs', () => {
    it('returns JSON string of logs', () => {
      logError(normalizeError('export test'));
      const json = exportErrorLogs();
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
    });
  });
});
