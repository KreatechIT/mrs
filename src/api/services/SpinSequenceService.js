/**
 * SpinSequenceService - Handle spin sequence operations
 */

import { apiClient } from '../client/APIClient.js';
import { SPIN_SEQUENCE_ENDPOINTS } from '../config/endpoints.js';

export class SpinSequenceService {
  constructor() {
    this.apiClient = apiClient;
  }

  /**
   * Initialize the service
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
  }

  /**
   * Get spin sequences
   */
  async getSpinSequences(params) {
    try {
      const response = await this.apiClient.get(SPIN_SEQUENCE_ENDPOINTS.LIST, { params });
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of sequences');
      }

      const sequences = this.transformSequenceList(response.data);
      return sequences;
    } catch (error) {
      console.error('Error fetching spin sequences:', error);
      throw this.handleServiceError(error, 'Failed to fetch spin sequences');
    }
  }

  /**
   * Get spin sequence by UUID
   */
  async getSpinSequenceById(uuid) {
    try {
      this.validateUuid(uuid);
      const response = await this.apiClient.get(SPIN_SEQUENCE_ENDPOINTS.DETAIL(uuid));
      
      if (!response.data) {
        throw new Error('Spin sequence not found');
      }

      const sequence = this.transformSequence(response.data);
      return sequence;
    } catch (error) {
      console.error('Error fetching spin sequence:', error);
      throw this.handleServiceError(error, `Failed to fetch spin sequence: ${uuid}`);
    }
  }

  /**
   * Create spin sequence
   */
  async createSpinSequence(data) {
    try {
      this.validateSequenceData(data);
      const response = await this.apiClient.post(SPIN_SEQUENCE_ENDPOINTS.CREATE, data);
      
      const sequence = this.transformSequence(response.data);
      return sequence;
    } catch (error) {
      console.error('Error creating spin sequence:', error);
      throw this.handleServiceError(error, 'Failed to create spin sequence');
    }
  }

  /**
   * Update spin sequence - Not supported by API
   */
  async updateSpinSequence(uuid, data) {
    throw new Error('Update spin sequence operation is not supported by the API');
  }

  /**
   * Delete spin sequence
   */
  async deleteSpinSequence(uuid) {
    try {
      this.validateUuid(uuid);
      const response = await this.apiClient.delete(SPIN_SEQUENCE_ENDPOINTS.DELETE(uuid));
      
      // API returns 204 No Content on successful delete
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting spin sequence:', error);
      throw this.handleServiceError(error, `Failed to delete spin sequence: ${uuid}`);
    }
  }

  /**
   * Update spin sequence order (PATCH) - Not implemented based on API spec
   * The API spec shows DELETE for sequences, not PATCH for ordering
   */

  /**
   * Transform sequence list data from API response format
   */
  transformSequenceList(sequences) {
    return sequences.map(sequence => this.transformSequence(sequence));
  }

  /**
   * Transform single sequence data from API response format
   */
  transformSequence(sequence) {
    // Validate required fields
    if (!sequence.uuid || !sequence.item_name || !sequence.item_uuid) {
      throw new Error('Invalid sequence data: missing required fields');
    }

    return {
      id: sequence.id,
      uuid: sequence.uuid,
      item_order: sequence.item_order || 1,
      item_name: sequence.item_name.trim(),
      item_uuid: sequence.item_uuid,
    };
  }

  /**
   * Validate sequence data for create operations
   */
  validateSequenceData(sequenceData) {
    if (typeof sequenceData.item_order !== 'number' || sequenceData.item_order < 1) {
      throw new Error('Item order must be a positive number');
    }

    if (!sequenceData.item_uuid || typeof sequenceData.item_uuid !== 'string') {
      throw new Error('Item UUID is required and must be a string');
    }

    if (sequenceData.item_uuid.trim().length === 0) {
      throw new Error('Item UUID cannot be empty');
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sequenceData.item_uuid)) {
      throw new Error('Invalid item UUID format');
    }
  }

  /**
   * Validate UUID format
   */
  validateUuid(uuid) {
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
  handleServiceError(error, defaultMessage) {
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
