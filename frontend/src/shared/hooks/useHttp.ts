import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

interface UseHttpOptions extends AxiosRequestConfig {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

interface UseHttpReturn<T = any> {
    data: T | null;
    error: any;
    loading: boolean;
    sendRequest: (config?: AxiosRequestConfig) => Promise<T | null>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/web';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export function useHttp<T = any>(options?: UseHttpOptions): UseHttpReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const sendRequest = useCallback(
        async (config?: AxiosRequestConfig): Promise<T | null> => {
            setLoading(true);
            setError(null);

            try {
                const mergedConfig: AxiosRequestConfig = {
                    ...options,
                    ...config,
                };

                const response: AxiosResponse<T> = await axiosInstance(mergedConfig);

                setData(response.data);

                if (options?.onSuccess) {
                    options.onSuccess(response.data);
                }

                return response.data;
            } catch (err: any) {
                const errorData = err.response?.data || err.message;
                setError(errorData);

                if (options?.onError) {
                    options.onError(errorData);
                }

                return null;
            } finally {
                setLoading(false);
            }
        },
        [options]
    );

    return { data, error, loading, sendRequest };
}

export { axiosInstance };