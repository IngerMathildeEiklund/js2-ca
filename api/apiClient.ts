
import { storage } from "../storage/storage";

const BASE_URL = 'https://v2.api.noroff.dev';

import { ApiError } from '../errors/apiError';

interface ApiOptions extends RequestInit {
  body?: any;
}

async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T | null>  {
  const { body, ...customOptions } = options;


  const apiKey = storage.load<string>('apiKey');
  const accessToken = storage.load<string>('accessToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(apiKey && { 'X-Noroff-API-Key': apiKey }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...customOptions.headers,
  };

  const config: RequestInit = {
    ...customOptions,
    headers,
    method: customOptions.method ?? (body ? 'POST' : 'GET'),
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 204) return null;

    const responseData = await response.json();

    if (!response.ok) {
        const message = responseData.errors?.[0]?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, response.status);
    }

    return responseData as T;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}


export const get = <T = unknown>(endpoint: string): Promise<T | null> =>
  apiClient<T>(endpoint);

export const post = <T = unknown>(endpoint: string, body: unknown): Promise<T | null> =>
  apiClient<T>(endpoint, { body });

export const put = <T = unknown>(endpoint: string, body: unknown): Promise<T | null> =>
  apiClient<T>(endpoint, { method: 'PUT', body });

export const del = <T = unknown>(endpoint: string): Promise<T | null> =>
  apiClient<T>(endpoint, { method: 'DELETE' });

