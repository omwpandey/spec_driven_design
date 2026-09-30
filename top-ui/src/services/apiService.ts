import axiosInstance from './axios';
import { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

const inFlightGetRequests = new Map<string, Promise<ApiResponse<unknown>>>();

const dedupeGetRequest = <T>(
  key: string,
  request: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const existingRequest = inFlightGetRequests.get(key);
  if (existingRequest) return existingRequest as Promise<ApiResponse<T>>;

  const requestPromise = request().finally(() => {
    inFlightGetRequests.delete(key);
  });
  inFlightGetRequests.set(key, requestPromise as Promise<ApiResponse<unknown>>);
  return requestPromise;
};

const apiService = {
  get: <T>(url: string, params?: PaginationParams, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const request = async () => {
      const response = await axiosInstance.get<ApiResponse<T>>(url, {
        params,
        ...config,
      });
      return response.data;
    };

    const canDeduplicate =
      !config || Object.keys(config).every((key) => key === 'params');
    if (!canDeduplicate) return request();

    const key = JSON.stringify(['get', url, params ?? null, config?.params ?? null]);
    return dedupeGetRequest(key, request);
  },

  getById: <T>(url: string, id: string | number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const request = async () => {
      const response = await axiosInstance.get<ApiResponse<T>>(`${url}/${id}`, config);
      return response.data;
    };

    if (config) return request();

    const key = JSON.stringify(['getById', url, id]);
    return dedupeGetRequest(key, request);
  },

  post: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, id: string | number, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<ApiResponse<T>>(`${url}/${id}`, data, config);
    return response.data;
  },

  patch: async <T>(url: string, id: string | number, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(`${url}/${id}`, data, config);
    return response.data;
  },

  delete: async <T>(url: string, id: string | number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(`${url}/${id}`, config);
    return response.data;
  },

  upload: async <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
    return response.data;
  },
};

export default apiService;
