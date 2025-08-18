/**
 * Data transformation utilities for API requests and responses
 */

import type {
  APIResponse,
  PaginatedResponse,
  LuckySpinItem,
  Member,
  MemberDetails,
  SpinSequence,
  SpinResult,
  AuthResponse,
  CreateSpinItemRequest,
  UpdateSpinItemRequest,
  MultipartFormData
} from '../types';

// Transform API response to consistent format
export function transformAPIResponse<T>(response: any): APIResponse<T> {
  return {
    data: response.data || response,
    status: response.status || 200,
    message: response.message || response.statusText
  };
}

// Transform paginated API response
export function transformPaginatedResponse<T>(response: any): PaginatedResponse<T> {
  const results = response.results || response.data || [];
  
  return {
    data: results,
    status: response.status || 200,
    message: response.message || response.statusText,
    count: response.count || results.length,
    next: response.next || null,
    previous: response.previous || null
  };
}

// Transform lucky spin item from API response
export function transformLuckySpinItem(item: any): LuckySpinItem {
  return {
    id: item.id,
    uuid: item.uuid,
    reward_name: item.reward_name || item.rewardName || '',
    probability: item.probability || '0',
    unlimited: Boolean(item.unlimited),
    quantity: item.quantity || 0,
    image: item.image || null,
    created_at: item.created_at || item.createdAt,
    updated_at: item.updated_at || item.updatedAt,
    archived: Boolean(item.archived)
  };
}

// Transform member from API response
export function transformMember(member: any): Member {
  return {
    id: member.id,
    uuid: member.uuid,
    username: member.username || '',
    tier: member.tier || member.vip_tier || '',
    current_points: member.current_points || member.currentPoints || 0,
    login_code: member.login_code || member.loginCode || '',
    created_at: member.created_at || member.createdAt,
    updated_at: member.updated_at || member.updatedAt
  };
}

// Transform member details from API response
export function transformMemberDetails(member: any): MemberDetails {
  const baseMember = transformMember(member);
  
  return {
    ...baseMember,
    email: member.email || null,
    first_name: member.first_name || member.firstName || null,
    last_name: member.last_name || member.lastName || null,
    phone_number: member.phone_number || member.phoneNumber || null,
    last_login: member.last_login || member.lastLogin || null,
    active_section: member.active_section || member.activeSection || null,
    time_spent: member.time_spent || member.timeSpent || null,
    total_spins: member.total_spins || member.totalSpins || 0,
    total_rewards: member.total_rewards || member.totalRewards || 0,
    is_active: Boolean(member.is_active ?? member.isActive ?? true)
  };
}

// Transform spin sequence from API response
export function transformSpinSequence(sequence: any): SpinSequence {
  return {
    id: sequence.id,
    uuid: sequence.uuid,
    item_order: sequence.item_order || sequence.itemOrder || 0,
    item_name: sequence.item_name || sequence.itemName || '',
    item_uuid: sequence.item_uuid || sequence.itemUuid || '',
    created_at: sequence.created_at || sequence.createdAt,
    updated_at: sequence.updated_at || sequence.updatedAt
  };
}

// Transform spin result from API response
export function transformSpinResult(result: any): SpinResult {
  return {
    uuid: result.uuid || '',
    reward_name: result.reward_name || result.rewardName || '',
    image: result.image || null
  };
}

// Transform auth response from API
export function transformAuthResponse(response: any): AuthResponse {
  return {
    id: response.id,
    username: response.username || '',
    access: response.access || '',
    refresh: response.refresh || '',
    first_name: response.first_name || response.firstName || null,
    last_name: response.last_name || response.lastName || null,
    role: response.role || 'user'
  };
}

// Transform create spin item request to API format
export function transformCreateSpinItemRequest(request: CreateSpinItemRequest): MultipartFormData {
  const formData: MultipartFormData = {
    reward_name: request.reward_name,
    probability: request.probability,
    unlimited: request.unlimited
  };

  // Handle quantity based on unlimited flag
  if (!request.unlimited && request.quantity !== undefined) {
    formData.quantity = request.quantity;
  } else if (request.unlimited) {
    formData.quantity = 0;
  }

  // Handle image upload
  if (request.image) {
    formData.image = request.image;
  }

  return formData;
}

// Transform update spin item request to API format
export function transformUpdateSpinItemRequest(request: UpdateSpinItemRequest): MultipartFormData {
  const formData: MultipartFormData = {};

  if (request.reward_name !== undefined) {
    formData.reward_name = request.reward_name;
  }

  if (request.probability !== undefined) {
    formData.probability = request.probability;
  }

  if (request.unlimited !== undefined) {
    formData.unlimited = request.unlimited;
    
    // Handle quantity based on unlimited flag
    if (!request.unlimited && request.quantity !== undefined) {
      formData.quantity = request.quantity;
    } else if (request.unlimited) {
      formData.quantity = 0;
    }
  } else if (request.quantity !== undefined) {
    formData.quantity = request.quantity;
  }

  // Handle image upload
  if (request.image) {
    formData.image = request.image;
  }

  return formData;
}

// Transform array of items using a transformer function
export function transformArray<T, U>(items: T[], transformer: (item: T) => U): U[] {
  return items.map(transformer);
}

// Transform error response to consistent format
export function transformErrorResponse(error: any): { message: string; status: number; details?: any } {
  if (error.response) {
    return {
      message: error.response.data?.message || error.response.data?.error || error.message || 'An error occurred',
      status: error.response.status || 500,
      details: error.response.data
    };
  }

  return {
    message: error.message || 'Network error occurred',
    status: error.status || 0,
    details: error
  };
}

// Normalize field names from snake_case to camelCase
export function normalizeFieldNames(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeFieldNames);
  }

  if (typeof obj === 'object') {
    const normalized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      normalized[camelKey] = normalizeFieldNames(value);
    }
    
    return normalized;
  }

  return obj;
}

// Convert field names from camelCase to snake_case
export function denormalizeFieldNames(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(denormalizeFieldNames);
  }

  if (typeof obj === 'object') {
    const denormalized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      denormalized[snakeKey] = denormalizeFieldNames(value);
    }
    
    return denormalized;
  }

  return obj;
}