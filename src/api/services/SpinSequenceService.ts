/**
 * SpinSequenceService - Spin sequence management service
 * Handles CRUD operations for spin sequences including listing, creation, updates, and bulk reordering
 */

import type {
  SpinSequence,
  CreateSequenceRequest,
  UpdateSequenceRequest,
  BulkReorderRequest,
  SequenceListResponse,
  APIResponse
} from '../types';
import { apiClient } from '../client/APIClient';
import { SPIN_SEQUENCE_ENDPOINTS } from '../config/endpoints';
import { featureFlags } from '../config/settings';

export class SpinSequenceService {
  /**
   * List all spin sequences with pagination support
   */
  async listSequences(): Promise<SpinSequence[]> {
    try {
      if (featureFlags.enableRequestLogging) {
        console.log('📋 Fetching all spin sequences');
      }

      const response: APIResponse<SequenceListResponse> = await apiClient.get(
        SPIN_SEQUENCE_ENDPOINTS.LIST
      );

      if (!response.data?.results) {
        throw new Error('Invalid response format: missing results');
      }

      const sequences = this.transformSequenceList(response.data.results);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Retrieved ${sequences.length} spin sequences`);
      }

      return sequences;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to fetch spin sequences:', error);
      }
      throw this.handleServiceError(error, 'Failed to fetch spin sequences');
    }
  }

  /**
   * Get single spin sequence by UUID
   */
  async getSequence(uuid: string): Promise<SpinSequence> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🔍 Fetching spin sequence: ${uuid}`);
      }

      const response: APIResponse<SpinSequence> = await apiClient.get(
        SPIN_SEQUENCE_ENDPOINTS.DETAIL(uuid)
      );

      if (!response.data) {
        throw new Error('Sequence not found');
      }

      const sequence = this.transformSequence(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Retrieved spin sequence: ${sequence.item_name} (order: ${sequence.item_order})`);
      }

      return sequence;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to fetch spin sequence ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to fetch spin sequence: ${uuid}`);
    }
  }

  /**
   * Create new spin sequence entry
   */
  async createSequence(sequenceData: CreateSequenceRequest): Promise<SpinSequence> {
    try {
      this.validateCreateRequest(sequenceData);

      if (featureFlags.enableRequestLogging) {
        console.log('➕ Creating new spin sequence:', sequenceData);
      }

      const response: APIResponse<SpinSequence> = await apiClient.post(
        SPIN_SEQUENCE_ENDPOINTS.CREATE,
        sequenceData
      );

      if (!response.data) {
        throw new Error('Invalid response: missing sequence data');
      }

      const sequence = this.transformSequence(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Created spin sequence: ${sequence.item_name} (${sequence.uuid})`);
      }

      return sequence;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to create spin sequence:', error);
      }
      throw this.handleServiceError(error, 'Failed to create spin sequence');
    }
  }

  /**
   * Delete spin sequence entry
   */
  async deleteSequence(uuid: string): Promise<void> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🗑️ Deleting spin sequence: ${uuid}`);
      }

      await apiClient.delete(SPIN_SEQUENCE_ENDPOINTS.DELETE(uuid));

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Deleted spin sequence: ${uuid}`);
      }
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to delete spin sequence ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to delete spin sequence: ${uuid}`);
    }
  }

  /**
   * Bulk reorder multiple sequences
   */
  async bulkReorderSequences(reorderData: BulkReorderRequest): Promise<void> {
    try {
      this.validateBulkReorderRequest(reorderData);

      if (featureFlags.enableRequestLogging) {
        console.log(`🔄 Bulk reordering ${reorderData.lucky_spins.length} sequences`);
      }

      await apiClient.post(
        SPIN_SEQUENCE_ENDPOINTS.BULK_REORDER,
        reorderData
      );

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Bulk reorder completed for ${reorderData.lucky_spins.length} sequences`);
      }
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to bulk reorder sequences:', error);
      }
      throw this.handleServiceError(error, 'Failed to bulk reorder sequences');
    }
  }

  /**
   * Transform sequence list data from API response format
   */
  private transformSequenceList(sequences: SpinSequence[]): SpinSequence[] {
    return sequences.map(sequence => this.transformSequence(sequence));
  }

  /**
   * Transform single sequence data from API response format
   */
  private transformSequence(sequence: SpinSequence): SpinSequence {
    // Validate required fields
    if (!sequence.uuid || !sequence.item_uuid) {
      throw new Error('Invalid sequence data: missing required fields');
    }

    return {
      id: sequence.id,
      uuid: sequence.uuid,
      item_order: sequence.item_order || 0,
      item_name: sequence.item_name?.trim() || '',
      item_uuid: sequence.item_uuid,
      created_at: sequence.created_at,
      updated_at: sequence.updated_at,
    };
  }

  /**
   * Validate create request data
   */
  private validateCreateRequest(sequenceData: CreateSequenceRequest): void {
    if (typeof sequenceData.item_order !== 'number') {
      throw new Error('Item order is required and must be a number');
    }

    if (sequenceData.item_order < 0) {
      throw new Error('Item order must be a non-negative number');
    }

    if (!sequenceData.item_uuid || typeof sequenceData.item_uuid !== 'string') {
      throw new Error('Item UUID is required and must be a string');
    }

    this.validateUuid(sequenceData.item_uuid);
  }

  /**
   * Validate bulk reorder request data
   */
  private validateBulkReorderRequest(reorderData: BulkReorderRequest): void {
    if (!Array.isArray(reorderData.lucky_spins)) {
      throw new Error('Lucky spins must be an array');
    }

    if (reorderData.lucky_spins.length === 0) {
      throw new Error('Lucky spins array cannot be empty');
    }

    // Validate each reorder entry
    reorderData.lucky_spins.forEach((entry, index) => {
      if (typeof entry.item_order !== 'number') {
        throw new Error(`Item order at index ${index} must be a number`);
      }

      if (entry.item_order < 0) {
        throw new Error(`Item order at index ${index} must be non-negative`);
      }

      if (!entry.sequence_UUID || typeof entry.sequence_UUID !== 'string') {
        throw new Error(`Sequence UUID at index ${index} is required and must be a string`);
      }

      this.validateUuid(entry.sequence_UUID);
    });

    // Check for duplicate orders
    const orders = reorderData.lucky_spins.map(entry => entry.item_order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new Error('Duplicate item orders are not allowed');
    }

    // Check for duplicate sequence UUIDs
    const uuids = reorderData.lucky_spins.map(entry => entry.sequence_UUID);
    const uniqueUuids = new Set(uuids);
    if (uuids.length !== uniqueUuids.size) {
      throw new Error('Duplicate sequence UUIDs are not allowed');
    }
  }

  /**
   * Validate UUID format
   */
  private validateUuid(uuid: string): void {
    if (!uuid || typeof uuid !== 'string') {
      throw new Error('UUID is required and must be a string');
    }

    if (uuid.trim().length === 0) {
      throw new Error('UUID cannot be empty');
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new Error('Invalid UUID format');
    }
  }

  /**
   * Handle service errors with proper error transformation
   */
  private handleServiceError(error: any, defaultMessage: string): Error {
    if (error instanceof Error) {
      return error;
    }

    // Handle API error responses
    if (error?.response?.data) {
      const errorData = error.response.data;

      if (errorData.message) {
        return new Error(errorData.message);
      }

      if (errorData.error) {
        return new Error(errorData.error);
      }

      if (errorData.detail) {
        return new Error(errorData.detail);
      }
    }

    // Handle HTTP status codes
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return new Error('Invalid request data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Access denied');
        case 404:
          return new Error('Spin sequence not found');
        case 422:
          return new Error('Validation failed');
        case 500:
          return new Error('Server error - please try again later');
        default:
          return new Error(`Service error (${error.response.status})`);
      }
    }

    return new Error(defaultMessage);
  }
}

// Export singleton instance
export const spinSequenceService = new SpinSequenceService();