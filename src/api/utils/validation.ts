/**
 * Data validation utilities for API requests and responses
 */

import type {
  LoginCredentials,
  CreateSpinItemRequest,
  UpdateSpinItemRequest,
  CreateSequenceRequest,
  SingleSpinRequest,
  TenSpinsRequest,
  BulkReorderRequest,
  PaginationParams,
  FilterParams
} from '../types';

// Type guard for checking if value is defined
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// Type guard for checking if value is a string
export function isString(value: any): value is string {
  return typeof value === 'string';
}

// Type guard for checking if value is a number
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Type guard for checking if value is a boolean
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

// Type guard for checking if value is a File
export function isFile(value: any): value is File {
  return value instanceof File;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Login credentials validation
export function validateLoginCredentials(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Login credentials are required');
    return { isValid: false, errors };
  }

  if (!isString(data.username) || data.username.trim().length === 0) {
    errors.push('Username is required and must be a non-empty string');
  }

  if (!isString(data.password) || data.password.length === 0) {
    errors.push('Password is required and must be a non-empty string');
  }

  return { isValid: errors.length === 0, errors };
}

// Create spin item request validation
export function validateCreateSpinItemRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Spin item data is required');
    return { isValid: false, errors };
  }

  if (!isString(data.reward_name) || data.reward_name.trim().length === 0) {
    errors.push('Reward name is required and must be a non-empty string');
  }

  if (!isNumber(data.probability) || data.probability < 0 || data.probability > 100) {
    errors.push('Probability must be a number between 0 and 100');
  }

  if (!isBoolean(data.unlimited)) {
    errors.push('Unlimited must be a boolean value');
  }

  // Validate quantity based on unlimited flag
  if (data.unlimited === false) {
    if (!isNumber(data.quantity) || data.quantity <= 0) {
      errors.push('Quantity must be a positive number when unlimited is false');
    }
  }

  // Validate image if provided
  if (isDefined(data.image) && !isFile(data.image)) {
    errors.push('Image must be a valid File object');
  }

  return { isValid: errors.length === 0, errors };
}

// Update spin item request validation
export function validateUpdateSpinItemRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Update data is required');
    return { isValid: false, errors };
  }

  // Optional fields validation
  if (isDefined(data.reward_name) && (!isString(data.reward_name) || data.reward_name.trim().length === 0)) {
    errors.push('Reward name must be a non-empty string if provided');
  }

  if (isDefined(data.probability) && (!isNumber(data.probability) || data.probability < 0 || data.probability > 100)) {
    errors.push('Probability must be a number between 0 and 100 if provided');
  }

  if (isDefined(data.unlimited) && !isBoolean(data.unlimited)) {
    errors.push('Unlimited must be a boolean value if provided');
  }

  // Validate quantity based on unlimited flag
  if (isDefined(data.unlimited) && data.unlimited === false && isDefined(data.quantity)) {
    if (!isNumber(data.quantity) || data.quantity <= 0) {
      errors.push('Quantity must be a positive number when unlimited is false');
    }
  }

  // Validate image if provided
  if (isDefined(data.image) && !isFile(data.image)) {
    errors.push('Image must be a valid File object if provided');
  }

  return { isValid: errors.length === 0, errors };
}

// Create sequence request validation
export function validateCreateSequenceRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Sequence data is required');
    return { isValid: false, errors };
  }

  if (!isNumber(data.item_order) || data.item_order < 0) {
    errors.push('Item order must be a non-negative number');
  }

  if (!isString(data.item_uuid) || data.item_uuid.trim().length === 0) {
    errors.push('Item UUID is required and must be a non-empty string');
  }

  return { isValid: errors.length === 0, errors };
}

// Single spin request validation
export function validateSingleSpinRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Spin request data is required');
    return { isValid: false, errors };
  }

  if (!isString(data.member_uuid) || data.member_uuid.trim().length === 0) {
    errors.push('Member UUID is required and must be a non-empty string');
  }

  return { isValid: errors.length === 0, errors };
}

// Ten spins request validation
export function validateTenSpinsRequest(data: any): ValidationResult {
  return validateSingleSpinRequest(data); // Same validation as single spin
}

// Bulk reorder request validation
export function validateBulkReorderRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isDefined(data)) {
    errors.push('Bulk reorder data is required');
    return { isValid: false, errors };
  }

  if (!Array.isArray(data.lucky_spins)) {
    errors.push('Lucky spins must be an array');
    return { isValid: false, errors };
  }

  data.lucky_spins.forEach((spin: any, index: number) => {
    if (!isNumber(spin.item_order) || spin.item_order < 0) {
      errors.push(`Item order at index ${index} must be a non-negative number`);
    }

    if (!isString(spin.sequence_UUID) || spin.sequence_UUID.trim().length === 0) {
      errors.push(`Sequence UUID at index ${index} is required and must be a non-empty string`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

// Pagination parameters validation
export function validatePaginationParams(params: any): ValidationResult {
  const errors: string[] = [];

  if (isDefined(params.page) && (!isNumber(params.page) || params.page < 1)) {
    errors.push('Page must be a positive number');
  }

  if (isDefined(params.page_size) && (!isNumber(params.page_size) || params.page_size < 1)) {
    errors.push('Page size must be a positive number');
  }

  if (isDefined(params.limit) && (!isNumber(params.limit) || params.limit < 1)) {
    errors.push('Limit must be a positive number');
  }

  if (isDefined(params.offset) && (!isNumber(params.offset) || params.offset < 0)) {
    errors.push('Offset must be a non-negative number');
  }

  return { isValid: errors.length === 0, errors };
}

// Filter parameters validation
export function validateFilterParams(params: any): ValidationResult {
  const errors: string[] = [];

  if (isDefined(params.search) && !isString(params.search)) {
    errors.push('Search parameter must be a string');
  }

  if (isDefined(params.ordering) && !isString(params.ordering)) {
    errors.push('Ordering parameter must be a string');
  }

  return { isValid: errors.length === 0, errors };
}