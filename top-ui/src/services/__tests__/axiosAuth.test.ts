// @vitest-environment jsdom
import { AxiosError, type AxiosAdapter } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { acquireApiToken, logWarning } = vi.hoisted(() => ({
  acquireApiToken: vi.fn(),
  logWarning: vi.fn(),
}));

vi.mock('@core/auth/msalConfig', () => ({
  isEntraAuthEnabled: true,
  isEntraConfigured: true,
  acquireApiToken,
  msalInstance: {},
}));

vi.mock('@core/errors', () => ({
  normalizeError: vi.fn((error: unknown) => error),
  logError: vi.fn(),
  logWarning,
}));

import axiosInstance from '../axios';

describe('Axios bearer authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends API requests with a silently acquired Entra bearer token', async () => {
    acquireApiToken.mockResolvedValue('entra-access-token');
    let requestAuthorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      requestAuthorization = config.headers.Authorization;
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    const response = await axiosInstance.get('/test', { adapter });

    expect(response.data).toEqual({ ok: true });
    expect(requestAuthorization).toBe('Bearer entra-access-token');
    expect(acquireApiToken).toHaveBeenCalledWith({});
    expect(logWarning).not.toHaveBeenCalled();
  });

  it('does not attempt legacy refresh when Entra token acquisition fails', async () => {
    acquireApiToken.mockRejectedValue(new Error('Token unavailable'));
    const adapter: AxiosAdapter = async (config) => {
      const response = {
        data: {},
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
      };
      throw new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, undefined, response);
    };

    await expect(axiosInstance.get('/test', { adapter })).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(logWarning).toHaveBeenCalledOnce();
  });
});
