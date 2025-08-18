/**
 * APIClient - Base HTTP client with Axios configuration
 * Provides centralized API communication with interceptors and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { APIClientConfig, APIResponse, APIError, RequestConfig } from '../types';
import { apiClientConfig, requestSettings, errorSettings, featureFlags } from '../config/settings';
import { authManager } from '../auth/AuthManager';
import { errorHandler } from '../errors/ErrorHandler';

export class APIClient {
    private axiosInstance: AxiosInstance;
    private config: APIClientConfig;
    private retryCount: Map<string, number> = new Map();

    constructor(config?: Partial<APIClientConfig>) {
        this.config = { ...apiClientConfig, ...config };
        this.axiosInstance = this.createAxiosInstance();
        this.setupInterceptors();
    }

    /**
     * Create configured Axios instance
     */
    private createAxiosInstance(): AxiosInstance {
        const instance = axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            headers: requestSettings.defaultHeaders,
        });

        return instance;
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Add authentication token if available
                const token = await authManager.getValidAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Log request if enabled
                if (featureFlags.enableRequestLogging && this.config.enableLogging) {
                    console.log('🚀 API Request:', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        baseURL: config.baseURL,
                        headers: config.headers,
                        data: config.data,
                    });
                }

                return config;
            },
            (error) => {
                if (this.config.enableLogging) {
                    console.error('❌ Request Error:', error);
                }
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                // Log response if enabled
                if (featureFlags.enableResponseLogging && this.config.enableLogging) {
                    console.log('✅ API Response:', {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.config.url,
                        data: response.data,
                    });
                }

                // Reset retry count on successful response
                const requestKey = this.getRequestKey(response.config);
                this.retryCount.delete(requestKey);

                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config;

                if (!originalRequest) {
                    return Promise.reject(error);
                }

                // Handle retry logic
                if (this.shouldRetry(error, originalRequest)) {
                    return this.retryRequest(originalRequest);
                }

                // Handle authentication errors
                if (this.isAuthError(error)) {
                    const recovered = await this.handleAuthError(error);
                    if (recovered && originalRequest) {
                        // Retry the original request with new token
                        return this.axiosInstance.request(originalRequest);
                    }
                }

                // Log error if enabled
                if (this.config.enableLogging) {
                    console.error('❌ API Response Error:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        url: error.config?.url,
                        message: error.message,
                        data: error.response?.data,
                    });
                }

                // Process error through ErrorHandler
                const processedError = errorHandler.processError(error);
                return Promise.reject(processedError);
            }
        );
    }

    /**
     * Get authentication token from AuthManager
     */
    private async getAuthToken(): Promise<string | null> {
        return authManager.getValidAccessToken();
    }

    /**
     * Check if error is authentication related
     */
    private isAuthError(error: AxiosError): boolean {
        const status = error.response?.status;
        return status === 401 || status === 403;
    }

    /**
     * Handle authentication errors
     */
    private async handleAuthError(error: AxiosError): Promise<boolean> {
        if (error.response?.status === 401) {
            // Token expired or invalid - try to refresh
            return authManager.handleAuthError();
        }
        return false;
    }

    /**
     * Check if request should be retried
     */
    private shouldRetry(error: AxiosError, config: AxiosRequestConfig): boolean {
        const requestKey = this.getRequestKey(config);
        const currentRetries = this.retryCount.get(requestKey) || 0;

        // Process error to get retry information
        const processedError = errorHandler.processError(error);

        return errorHandler.shouldRetry(processedError, currentRetries, this.config.retryAttempts);
    }

    /**
     * Retry failed request
     */
    private async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        const requestKey = this.getRequestKey(config);
        const currentRetries = this.retryCount.get(requestKey) || 0;

        this.retryCount.set(requestKey, currentRetries + 1);

        // Calculate delay with exponential backoff
        const delay = errorHandler.calculateRetryDelay(currentRetries + 1, requestSettings.retryDelay);

        if (this.config.enableLogging) {
            console.log(`🔄 Retrying request (attempt ${currentRetries + 1}/${this.config.retryAttempts}) after ${delay}ms:`, config.url);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));

        return this.axiosInstance.request(config);
    }

    /**
     * Generate unique key for request tracking
     */
    private getRequestKey(config: AxiosRequestConfig): string {
        return `${config.method?.toUpperCase()}_${config.url}`;
    }

    /**
     * Transform Axios error to APIError
     */
    private transformError(error: AxiosError): APIError {
        const response = error.response;
        const status = response?.status || 0;
        const message = this.getErrorMessage(error);

        return {
            status,
            message,
            code: error.code,
            details: response?.data,
        };
    }

    /**
     * Extract user-friendly error message
     */
    private getErrorMessage(error: AxiosError): string {
        const response = error.response;

        // Try to get message from response data
        if (response?.data) {
            const data = response.data as any;
            if (data.message) return data.message;
            if (data.error) return data.error;
            if (data.detail) return data.detail;
        }

        // Fallback to status-based messages
        switch (response?.status) {
            case 400:
                return 'Invalid request data';
            case 401:
                return 'Authentication required';
            case 403:
                return 'Access denied';
            case 404:
                return 'Resource not found';
            case 422:
                return 'Validation failed';
            case 429:
                return 'Too many requests';
            case 500:
                return 'Internal server error';
            case 502:
                return 'Bad gateway';
            case 503:
                return 'Service unavailable';
            case 504:
                return 'Gateway timeout';
            default:
                return error.message || 'Network error occurred';
        }
    }

    /**
     * Make GET request
     */
    async get<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>> {
        const response = await this.axiosInstance.get<T>(url, config);
        return this.transformResponse(response);
    }

    /**
     * Make POST request
     */
    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return this.transformResponse(response);
    }

    /**
     * Make PUT request
     */
    async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return this.transformResponse(response);
    }

    /**
     * Make PATCH request
     */
    async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return this.transformResponse(response);
    }

    /**
     * Make DELETE request
     */
    async delete<T = any>(url: string, config?: RequestConfig): Promise<APIResponse<T>> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return this.transformResponse(response);
    }

    /**
     * Upload file with multipart/form-data
     */
    async uploadFile<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<APIResponse<T>> {
        const uploadConfig = {
            ...config,
            headers: {
                ...requestSettings.multipartHeaders,
                ...config?.headers,
            },
        };

        const response = await this.axiosInstance.post<T>(url, formData, uploadConfig);
        return this.transformResponse(response);
    }

    /**
     * Transform Axios response to APIResponse
     */
    private transformResponse<T>(response: AxiosResponse<T>): APIResponse<T> {
        return {
            data: response.data,
            status: response.status,
            message: response.statusText,
        };
    }

    /**
     * Update authentication token
     */
    updateAuthToken(token: string): void {
        // This will be used by AuthManager to update tokens
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Clear authentication token
     */
    clearAuthToken(): void {
        delete this.axiosInstance.defaults.headers.common['Authorization'];
    }

    /**
     * Initialize API client with AuthManager
     */
    initialize(): void {
        authManager.initialize();

        if (featureFlags.enableRequestLogging) {
            console.log('🚀 APIClient initialized');
        }
    }

    /**
     * Get current configuration
     */
    getConfig(): APIClientConfig {
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<APIClientConfig>): void {
        this.config = { ...this.config, ...newConfig };

        // Update axios instance if needed
        if (newConfig.baseURL) {
            this.axiosInstance.defaults.baseURL = newConfig.baseURL;
        }
        if (newConfig.timeout) {
            this.axiosInstance.defaults.timeout = newConfig.timeout;
        }
    }
}

// Export singleton instance
export const apiClient = new APIClient();