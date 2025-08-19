/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API services
 */

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login/admin-access-token/',
  LOGOUT: '/login/logout/',
  REFRESH: '/login/refresh-token/',
  VERIFY: '/login/verify-token/',
};

// Member Endpoints
export const MEMBER_ENDPOINTS = {
  LOGIN: '/login/member-code/',
  LIST: '/member/members/',
  DETAIL: (uuid) => `/member/members/${uuid}/`,
  SINGLE_SPIN: (memberUuid) => `/member/${memberUuid}/one-spin/`,
  TEN_SPINS: (memberUuid) => `/member/${memberUuid}/ten-spin/`,
};

// Lucky Spin Items Endpoints
export const LUCKY_SPIN_ITEMS_ENDPOINTS = {
  LIST: '/lucky-spin/lucky-spin-items/',
  DETAIL: (uuid) => `/lucky-spin/lucky-spin-items/${uuid}/`,
  CREATE: '/lucky-spin/lucky-spin-items/',
  UPDATE: (uuid) => `/lucky-spin/lucky-spin-items/${uuid}/`,
  DELETE: (uuid) => `/lucky-spin/lucky-spin-items/${uuid}/`,
  ARCHIVE: (uuid) => `/lucky-spin/lucky-spin-items/${uuid}/archive/`,
};

// Spin Sequence Endpoints
export const SPIN_SEQUENCE_ENDPOINTS = {
  LIST: '/lucky-spin/lucky-spin-sequences/',
  DETAIL: (uuid) => `/lucky-spin/lucky-spin-sequences/${uuid}/`,
  CREATE: '/lucky-spin/lucky-spin-sequences/',
  UPDATE: (uuid) => `/lucky-spin/lucky-spin-sequences/${uuid}/`,
  DELETE: (uuid) => `/lucky-spin/lucky-spin-sequences/${uuid}/`,
  ORDER: (uuid) => `/lucky-spin/lucky-spin-sequences/${uuid}/`,
};
