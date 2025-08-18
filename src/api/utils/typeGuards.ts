/**
 * Type guards for runtime type checking
 */

import type {
  APIResponse,
  PaginatedResponse,
  APIError,
  ErrorResponse,
  LuckySpinItem,
  Member,
  MemberDetails,
  SpinSequence,
  SpinResult,
  AuthResponse,
  AuthTokens,
  LoginCredentials,
  CreateSpinItemRequest,
  UpdateSpinItemRequest,
  CreateSequenceRequest,
  BulkReorderRequest
} from '../types';

// Type guard for APIResponse
export function isAPIResponse<T>(value: any): value is APIResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.status === 'number' &&
    (value.data !== undefined || value.message !== undefined)
  );
}

// Type guard for PaginatedResponse
export function isPaginatedResponse<T>(value: any): value is PaginatedResponse<T> {
  return (
    isAPIResponse(value) &&
    Array.isArray(value.data) &&
    typeof value.count === 'number' &&
    (value.next === null || typeof value.next === 'string') &&
    (value.previous === null || typeof value.previous === 'string')
  );
}

// Type guard for APIError
export function isAPIError(value: any): value is APIError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.status === 'number' &&
    typeof value.message === 'string'
  );
}

// Type guard for ErrorResponse
export function isErrorResponse(value: any): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.error === 'string' &&
    typeof value.message === 'string' &&
    typeof value.status === 'number'
  );
}

// Type guard for LuckySpinItem
export function isLuckySpinItem(value: any): value is LuckySpinItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.uuid === 'string' &&
    typeof value.reward_name === 'string' &&
    typeof value.probability === 'string' &&
    typeof value.unlimited === 'boolean' &&
    typeof value.quantity === 'number' &&
    (value.image === null || typeof value.image === 'string')
  );
}

// Type guard for Member
export function isMember(value: any): value is Member {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.uuid === 'string' &&
    typeof value.username === 'string' &&
    typeof value.tier === 'string' &&
    typeof value.current_points === 'number' &&
    typeof value.login_code === 'string'
  );
}

// Type guard for MemberDetails
export function isMemberDetails(value: any): value is MemberDetails {
  return (
    isMember(value) &&
    (value.email === undefined || value.email === null || typeof value.email === 'string') &&
    (value.first_name === undefined || value.first_name === null || typeof value.first_name === 'string') &&
    (value.last_name === undefined || value.last_name === null || typeof value.last_name === 'string')
  );
}

// Type guard for SpinSequence
export function isSpinSequence(value: any): value is SpinSequence {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.uuid === 'string' &&
    typeof value.item_order === 'number' &&
    typeof value.item_name === 'string' &&
    typeof value.item_uuid === 'string'
  );
}

// Type guard for SpinResult
export function isSpinResult(value: any): value is SpinResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.uuid === 'string' &&
    typeof value.reward_name === 'string' &&
    (value.image === null || typeof value.image === 'string')
  );
}

// Type guard for AuthResponse
export function isAuthResponse(value: any): value is AuthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.username === 'string' &&
    typeof value.access === 'string' &&
    typeof value.refresh === 'string' &&
    typeof value.role === 'string' &&
    (value.first_name === null || typeof value.first_name === 'string') &&
    (value.last_name === null || typeof value.last_name === 'string')
  );
}

// Type guard for AuthTokens
export function isAuthTokens(value: any): value is AuthTokens {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.access === 'string' &&
    typeof value.refresh === 'string'
  );
}

// Type guard for LoginCredentials
export function isLoginCredentials(value: any): value is LoginCredentials {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.username === 'string' &&
    typeof value.password === 'string'
  );
}

// Type guard for CreateSpinItemRequest
export function isCreateSpinItemRequest(value: any): value is CreateSpinItemRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.reward_name === 'string' &&
    typeof value.probability === 'number' &&
    typeof value.unlimited === 'boolean' &&
    (value.quantity === undefined || typeof value.quantity === 'number') &&
    (value.image === undefined || value.image instanceof File)
  );
}

// Type guard for UpdateSpinItemRequest
export function isUpdateSpinItemRequest(value: any): value is UpdateSpinItemRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.reward_name === undefined || typeof value.reward_name === 'string') &&
    (value.probability === undefined || typeof value.probability === 'number') &&
    (value.unlimited === undefined || typeof value.unlimited === 'boolean') &&
    (value.quantity === undefined || typeof value.quantity === 'number') &&
    (value.image === undefined || value.image instanceof File)
  );
}

// Type guard for CreateSequenceRequest
export function isCreateSequenceRequest(value: any): value is CreateSequenceRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.item_order === 'number' &&
    typeof value.item_uuid === 'string'
  );
}

// Type guard for BulkReorderRequest
export function isBulkReorderRequest(value: any): value is BulkReorderRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray(value.lucky_spins) &&
    value.lucky_spins.every((spin: any) =>
      typeof spin === 'object' &&
      spin !== null &&
      typeof spin.item_order === 'number' &&
      typeof spin.sequence_UUID === 'string'
    )
  );
}

// Type guard for array of specific type
export function isArrayOf<T>(value: any, itemGuard: (item: any) => item is T): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}

// Type guard for checking if response has pagination structure
export function hasPaginationStructure(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray(value.results) &&
    typeof value.count === 'number'
  );
}

// Type guard for checking if error has response structure
export function hasErrorResponseStructure(error: any): boolean {
  return (
    error &&
    error.response &&
    typeof error.response === 'object' &&
    typeof error.response.status === 'number'
  );
}

// Type guard for checking if value is a valid UUID
export function isValidUUID(value: any): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

// Type guard for checking if value is a valid email
export function isValidEmail(value: any): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// Type guard for checking if value is a positive number
export function isPositiveNumber(value: any): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

// Type guard for checking if value is a non-negative number
export function isNonNegativeNumber(value: any): value is number {
  return typeof value === 'number' && value >= 0 && !isNaN(value);
}