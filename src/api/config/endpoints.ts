/**
 * API Endpoints Configuration
 * Centralized configuration for all API endpoints
 */

// Base API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://staging-api.menangsininow.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
} as const;

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login/admin-access-token/',
  REFRESH: '/login/refresh-token/',
  VERIFY: '/login/verify-token/',
  LOGOUT: '/login/logout/',
} as const;

// Lucky Spin Items Endpoints
export const LUCKY_SPIN_ENDPOINTS = {
  LIST: '/lucky-spin/lucky-spin-items/',
  CREATE: '/lucky-spin/lucky-spin-items/',
  DETAIL: (uuid: string) => `/lucky-spin/lucky-spin-items/${uuid}/`,
  UPDATE: (uuid: string) => `/lucky-spin/lucky-spin-items/${uuid}/`,
  ARCHIVE: (uuid: string) => `/lucky-spin/lucky-spin-items/${uuid}/archive/`,
} as const;

// Spin Sequence Endpoints
export const SPIN_SEQUENCE_ENDPOINTS = {
  LIST: '/lucky-spin/lucky-spin-sequences/',
  CREATE: '/lucky-spin/lucky-spin-sequences/',
  DETAIL: (uuid: string) => `/lucky-spin/lucky-spin-sequences/${uuid}`,
  DELETE: (uuid: string) => `/lucky-spin/lucky-spin-sequences/${uuid}/`,
  BULK_REORDER: '/lucky-spin/lucky-spin-sequences/change-spin-sequences/',
} as const;

// Member Endpoints
export const MEMBER_ENDPOINTS = {
  LIST: '/member/members',
  DETAIL: (uuid: string) => `/member/members/`,
  LOGIN: '/login/member-code/',
  SINGLE_SPIN: (uuid: string) => `/member/${uuid}/one-spin`,
  TEN_SPINS: (uuid: string) => `/member/${uuid}/ten-spin`,
} as const;

// All Endpoints Combined
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  LUCKY_SPIN: LUCKY_SPIN_ENDPOINTS,
  SPIN_SEQUENCE: SPIN_SEQUENCE_ENDPOINTS,
  MEMBER: MEMBER_ENDPOINTS,
} as const;