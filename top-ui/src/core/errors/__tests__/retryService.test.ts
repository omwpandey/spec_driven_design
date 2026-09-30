// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { withRetry, createRetryableOperation } from '../retryService';

describe('retryService', () => {
  describe('withRetry', () => {
    it('succeeds on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      const result = await withRetry(operation, { maxRetries: 3, baseDelay: 10 });
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and succeeds on second attempt', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('ok');
      const result = await withRetry(operation, { maxRetries: 3, baseDelay: 10, maxDelay: 50 });
      expect(result).toBe('ok');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('throws after exhausting retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('always fails'));
      await expect(
        withRetry(operation, { maxRetries: 2, baseDelay: 10, maxDelay: 50 })
      ).rejects.toThrow('always fails');
      expect(operation).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('calls onRetryAttempt callback', async () => {
      const onRetry = vi.fn();
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('fail1'))
        .mockRejectedValueOnce(new Error('fail2'))
        .mockResolvedValue('done');

      await withRetry(operation, { maxRetries: 3, baseDelay: 10, maxDelay: 50 }, onRetry);
      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
      expect(onRetry).toHaveBeenCalledWith(2, expect.any(Error));
    });

    it('works with zero retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('no retry'));
      await expect(
        withRetry(operation, { maxRetries: 0, baseDelay: 10 })
      ).rejects.toThrow('no retry');
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('createRetryableOperation', () => {
    it('executes successfully', async () => {
      const operation = vi.fn().mockResolvedValue('data');
      const { execute } = createRetryableOperation(operation, { maxRetries: 2, baseDelay: 10 });
      const result = await execute();
      expect(result).toBe('data');
    });

    it('retries and eventually succeeds', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('first fail'))
        .mockResolvedValue('recovered');
      const { execute } = createRetryableOperation(operation, { maxRetries: 2, baseDelay: 10, maxDelay: 50 });
      const result = await execute();
      expect(result).toBe('recovered');
    });

    it('can be cancelled', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('keep failing'));
      const { execute, cancel } = createRetryableOperation(operation, { maxRetries: 5, baseDelay: 10, maxDelay: 50 });

      cancel();
      await expect(execute()).rejects.toThrow('Operation cancelled');
    });

    it('throws after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('persistent'));
      const { execute } = createRetryableOperation(operation, { maxRetries: 1, baseDelay: 10, maxDelay: 50 });
      await expect(execute()).rejects.toThrow('persistent');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
});
