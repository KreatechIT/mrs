/**
 * API Endpoints Configuration
 * Centralized configuration for all API endpoints
 */

// Base API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://mrs-staging.onrender.com/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
} as const;

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REFRESH: '/auth/refresh/',
  VERIFY: '/auth/verify/',
  LOGOUT: '/auth/logout/',
} as const;

// Lucky Spin Items Endpoints
export const LUCKY_SPIN_ENDPOINTS = {
  LIST: '/lucky-spin-items/',
  CREATE: '/lucky-spin-items/',
  DETAIL: (uuid: string) => `/lucky-spin-items/${uuid}/`,
  UPDATE: (uuid: string) => `/lucky-spin-items/${uuid}/`,
  ARCHIVE: (uuid: string) => `/lucky-spin-items/${uuid}/archive/`,
} as const;

// Spin Sequence Endpoints
export const SPIN_SEQUENCE_ENDPOINTS = {
  LIST: '/lucky-spin-sequences/',
  CREATE: '/lucky-spin-sequences/',
  DETAIL: (uuid: string) => `/lucky-spin-sequences/${uuid}/`,
  DELETE: (uuid: string) => `/lucky-spin-sequences/${uuid}/`,
  BULK_REORDER: '/lucky-spin-sequences/bulk-reorder/',
} as const;

// Member Endpoints
export const MEMBER_ENDPOINTS = {
  LIST: '/members/',
  DETAIL: (uuid: string) => `/members/${uuid}/`,
  SINGLE_SPIN: (uuid: string) => `/members/${uuid}/spin/`,
  TEN_SPINS: (uuid: string) => `/members/${uuid}/ten-spins/`,
} as const;

// All Endpoints Combined
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  LUCKY_SPIN: LUCKY_SPIN_ENDPOINTS,
  SPIN_SEQUENCE: SPIN_SEQUENCE_ENDPOINTS,
  MEMBER: MEMBER_ENDPOINTS,
} as const;