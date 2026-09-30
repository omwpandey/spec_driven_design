// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiService from '../apiService';
import axiosInstance from '../axios';

// Mock axios instance
vi.mock('../axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('calls axios.get with correct URL and params', async () => {
      const mockResponse = { data: { data: [], success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      const result = await apiService.get('/customers', { page: 1, pageSize: 10 });
      expect(axiosInstance.get).toHaveBeenCalledWith('/customers', {
        params: { page: 1, pageSize: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('calls axios.get without params', async () => {
      const mockResponse = { data: { data: [], success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      const result = await apiService.get('/customers');
      expect(axiosInstance.get).toHaveBeenCalledWith('/customers', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('shares an in-flight request for the same URL and params, then allows a later refresh', async () => {
      const mockResponse = { data: { data: [{ id: 1 }], success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      const firstRequest = apiService.get('/customers', { page: 1 });
      const duplicateRequest = apiService.get('/customers', { page: 1 });

      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
      await expect(firstRequest).resolves.toEqual(mockResponse.data);
      await expect(duplicateRequest).resolves.toEqual(mockResponse.data);

      await apiService.get('/customers', { page: 1 });
      expect(axiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('passes additional config', async () => {
      const mockResponse = { data: { data: [], success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      await apiService.get('/customers', { page: 1 }, { timeout: 5000 });
      expect(axiosInstance.get).toHaveBeenCalledWith('/customers', {
        params: { page: 1 },
        timeout: 5000,
      });
    });

    it('shares an in-flight request when config contains only params', async () => {
      const mockResponse = { data: { data: [], success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);
      const config = { params: { filter: '{"filter":{"active":true}}' } };

      const firstRequest = apiService.get('/customers', undefined, config);
      const duplicateRequest = apiService.get('/customers', undefined, config);

      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
      await expect(firstRequest).resolves.toEqual(mockResponse.data);
      await expect(duplicateRequest).resolves.toEqual(mockResponse.data);
    });
  });

  describe('getById', () => {
    it('calls axios.get with ID in URL', async () => {
      const mockResponse = { data: { data: { id: 1 }, success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      const result = await apiService.getById('/customers', '123');
      expect(axiosInstance.get).toHaveBeenCalledWith('/customers/123', undefined);
      expect(result.data).toEqual({ id: 1 });
    });

    it('calls axios.get with numeric ID', async () => {
      const mockResponse = { data: { data: { id: 456 }, success: true } };
      (axiosInstance.get as any).mockResolvedValue(mockResponse);

      const result = await apiService.getById('/customers', 456);
      expect(axiosInstance.get).toHaveBeenCalledWith('/customers/456', undefined);
      expect(result.data).toEqual({ id: 456 });
    });
  });

  describe('post', () => {
    it('calls axios.post with data', async () => {
      const mockResponse = { data: { data: { id: 1 }, success: true } };
      (axiosInstance.post as any).mockResolvedValue(mockResponse);

      const payload = { name: 'Test' };
      const result = await apiService.post('/customers', payload);
      expect(axiosInstance.post).toHaveBeenCalledWith('/customers', payload, undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('calls axios.post with config', async () => {
      const mockResponse = { data: { data: { id: 1 }, success: true } };
      (axiosInstance.post as any).mockResolvedValue(mockResponse);

      const payload = { name: 'Test' };
      await apiService.post('/customers', payload, { timeout: 3000 });
      expect(axiosInstance.post).toHaveBeenCalledWith('/customers', payload, { timeout: 3000 });
    });
  });

  describe('put', () => {
    it('calls axios.put with ID and data', async () => {
      const mockResponse = { data: { success: true } };
      (axiosInstance.put as any).mockResolvedValue(mockResponse);

      await apiService.put('/customers', '123', { name: 'Updated' });
      expect(axiosInstance.put).toHaveBeenCalledWith('/customers/123', { name: 'Updated' }, undefined);
    });

    it('calls axios.put with config', async () => {
      const mockResponse = { data: { success: true } };
      (axiosInstance.put as any).mockResolvedValue(mockResponse);

      await apiService.put('/customers', '123', { name: 'Updated' }, { timeout: 5000 });
      expect(axiosInstance.put).toHaveBeenCalledWith('/customers/123', { name: 'Updated' }, { timeout: 5000 });
    });
  });

  describe('patch', () => {
    it('calls axios.patch with ID and data', async () => {
      const mockResponse = { data: { success: true, data: { id: '123', name: 'Patched' } } };
      (axiosInstance.patch as any).mockResolvedValue(mockResponse);

      const result = await apiService.patch('/customers', '123', { name: 'Patched' });
      expect(axiosInstance.patch).toHaveBeenCalledWith('/customers/123', { name: 'Patched' }, undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('calls axios.patch with config', async () => {
      const mockResponse = { data: { success: true } };
      (axiosInstance.patch as any).mockResolvedValue(mockResponse);

      await apiService.patch('/customers', '456', { status: 'active' }, { timeout: 3000 });
      expect(axiosInstance.patch).toHaveBeenCalledWith('/customers/456', { status: 'active' }, { timeout: 3000 });
    });
  });

  describe('delete', () => {
    it('calls axios.delete with ID', async () => {
      const mockResponse = { data: { success: true } };
      (axiosInstance.delete as any).mockResolvedValue(mockResponse);

      const result = await apiService.delete('/customers', '123');
      expect(axiosInstance.delete).toHaveBeenCalledWith('/customers/123', undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('calls axios.delete with config', async () => {
      const mockResponse = { data: { success: true } };
      (axiosInstance.delete as any).mockResolvedValue(mockResponse);

      await apiService.delete('/customers', '123', { timeout: 3000 });
      expect(axiosInstance.delete).toHaveBeenCalledWith('/customers/123', { timeout: 3000 });
    });
  });

  describe('upload', () => {
    it('calls axios.post with FormData and multipart headers', async () => {
      const mockResponse = { data: { data: { fileUrl: '/uploads/file.pdf' }, success: true } };
      (axiosInstance.post as any).mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', 'test-file-content');

      const result = await apiService.upload('/upload', formData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('calls axios.post with FormData and additional config', async () => {
      const mockResponse = { data: { data: { fileUrl: '/uploads/file.pdf' }, success: true } };
      (axiosInstance.post as any).mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', 'test-file-content');

      await apiService.upload('/upload', formData, { timeout: 30000 });
      expect(axiosInstance.post).toHaveBeenCalledWith('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
    });
  });
});
