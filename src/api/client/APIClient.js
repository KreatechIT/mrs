/**
 * APIClient - Base HTTP client with Axios configuration
 * Provides centralized API communication with interceptors and error handling
 */

import axios from 'axios';
import { apiClientConfig, requestSettings, featureFlags } from '../config/settings.js';
import { authManager } from '../auth/AuthManager.js';

export class APIClient {
  constructor(config = {}) {
    this.config = { ...apiClientConfig, ...config };
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Create configured Axios instance
   */
  createAxiosInstance() {
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
  setupInterceptors() {
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

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle authentication errors
        if (this.isAuthError(error) && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          const recovered = await this.handleAuthError(error);
          if (recovered) {
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

        return Promise.reject(error);
      }
    );
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(error) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }

  /**
   * Handle authentication errors
   */
  async handleAuthError(error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - try to refresh
      return authManager.handleAuthError();
    }
    return false;
  }

  /**
   * Make GET request
   */
  async get(url, config = {}) {
    const response = await this.axiosInstance.get(url, config);
    return this.transformResponse(response);
  }

  /**
   * Make POST request
   */
  async post(url, data, config = {}) {
    const response = await this.axiosInstance.post(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make PUT request
   */
  async put(url, data, config = {}) {
    const response = await this.axiosInstance.put(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make PATCH request
   */
  async patch(url, data, config = {}) {
    const response = await this.axiosInstance.patch(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make DELETE request
   */
  async delete(url, config = {}) {
    const response = await this.axiosInstance.delete(url, config);
    return this.transformResponse(response);
  }

  /**
   * Transform Axios response to APIResponse
   */
  transformResponse(response) {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  /**
   * Update authentication token
   */
  updateAuthToken(token) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Initialize API client with AuthManager
   */
  initialize() {
    authManager.initialize();

    if (featureFlags.enableRequestLogging) {
      console.log('🚀 APIClient initialized');
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();