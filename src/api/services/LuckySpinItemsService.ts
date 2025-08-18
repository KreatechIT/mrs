/**
 * LuckySpinItemsService - Lucky Spin Items service implementation
 * Handles CRUD operations for lucky spin items including listing, creation, updates, and archiving
 */

import type {
  LuckySpinItem,
  CreateSpinItemRequest,
  UpdateSpinItemRequest,
  ArchiveSpinItemRequest,
  SpinItemListResponse,
  APIResponse
} from '../types';
import { apiClient } from '../client/APIClient';
import { LUCKY_SPIN_ENDPOINTS } from '../config/endpoints';
import { featureFlags } from '../config/settings';
import { loadingService, LOADING_OPERATIONS } from './LoadingService';

export class LuckySpinItemsService {
  /**
   * List all spin items with pagination support
   */
  async listItems(): Promise<LuckySpinItem[]> {
    return loadingService.withLoading(
      LOADING_OPERATIONS.FETCH_SPIN_ITEMS,
      async () => {
        try {
          if (featureFlags.enableRequestLogging) {
            console.log('📋 Fetching all lucky spin items');
          }

          const response: APIResponse<SpinItemListResponse> = await apiClient.get(
            LUCKY_SPIN_ENDPOINTS.LIST
          );

          if (!response.data?.results) {
            throw new Error('Invalid response format: missing results');
          }

          const items = this.transformItemList(response.data.results);

          if (featureFlags.enableRequestLogging) {
            console.log(`✅ Retrieved ${items.length} lucky spin items`);
          }

          return items;
        } catch (error) {
          if (featureFlags.enableRequestLogging) {
            console.error('❌ Failed to fetch lucky spin items:', error);
          }
          throw this.handleServiceError(error, 'Failed to fetch lucky spin items');
        }
      },
      'Loading spin items...'
    );
  }

  /**
   * Get single spin item by UUID
   */
  async getItem(uuid: string): Promise<LuckySpinItem> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🔍 Fetching lucky spin item: ${uuid}`);
      }

      const response: APIResponse<LuckySpinItem> = await apiClient.get(
        LUCKY_SPIN_ENDPOINTS.DETAIL(uuid)
      );

      if (!response.data) {
        throw new Error('Item not found');
      }

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Retrieved lucky spin item: ${item.reward_name}`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to fetch lucky spin item ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to fetch lucky spin item: ${uuid}`);
    }
  }

  /**
   * Create new spin item with validation and image support
   */
  async createItem(itemData: CreateSpinItemRequest): Promise<LuckySpinItem> {
    try {
      this.validateCreateRequest(itemData);

      if (featureFlags.enableRequestLogging) {
        console.log('➕ Creating new lucky spin item:', itemData.reward_name);
      }

      // Prepare form data for multipart upload
      const formData = this.prepareFormData(itemData);

      const response: APIResponse<LuckySpinItem> = await apiClient.uploadFile(
        LUCKY_SPIN_ENDPOINTS.CREATE,
        formData
      );

      if (!response.data) {
        throw new Error('Invalid response: missing item data');
      }

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Created lucky spin item: ${item.reward_name} (${item.uuid})`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to create lucky spin item:', error);
      }
      throw this.handleServiceError(error, 'Failed to create lucky spin item');
    }
  }

  /**
   * Update existing spin item with partial data support
   */
  async updateItem(uuid: string, updateData: UpdateSpinItemRequest): Promise<LuckySpinItem> {
    try {
      this.validateUuid(uuid);
      this.validateUpdateRequest(updateData);

      if (featureFlags.enableRequestLogging) {
        console.log(`✏️ Updating lucky spin item: ${uuid}`);
      }

      // Prepare form data for multipart upload (in case image is being updated)
      const formData = this.prepareUpdateFormData(updateData);

      const response: APIResponse<LuckySpinItem> = await apiClient.uploadFile(
        LUCKY_SPIN_ENDPOINTS.UPDATE(uuid),
        formData
      );

      if (!response.data) {
        throw new Error('Invalid response: missing item data');
      }

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Updated lucky spin item: ${item.reward_name} (${item.uuid})`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to update lucky spin item ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to update lucky spin item: ${uuid}`);
    }
  }

  /**
   * Archive spin item (mark as inactive)
   */
  async archiveItem(uuid: string): Promise<LuckySpinItem> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🗄️ Archiving lucky spin item: ${uuid}`);
      }

      const archiveData: ArchiveSpinItemRequest = {
        archived: true,
      };

      const response: APIResponse<LuckySpinItem> = await apiClient.patch(
        LUCKY_SPIN_ENDPOINTS.ARCHIVE(uuid),
        archiveData
      );

      if (!response.data) {
        throw new Error('Invalid response: missing item data');
      }

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Archived lucky spin item: ${item.reward_name} (${item.uuid})`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to archive lucky spin item ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to archive lucky spin item: ${uuid}`);
    }
  }

  /**
   * Unarchive spin item (mark as active)
   */
  async unarchiveItem(uuid: string): Promise<LuckySpinItem> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`📤 Unarchiving lucky spin item: ${uuid}`);
      }

      const archiveData: ArchiveSpinItemRequest = {
        archived: false,
      };

      const response: APIResponse<LuckySpinItem> = await apiClient.patch(
        LUCKY_SPIN_ENDPOINTS.ARCHIVE(uuid),
        archiveData
      );

      if (!response.data) {
        throw new Error('Invalid response: missing item data');
      }

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Unarchived lucky spin item: ${item.reward_name} (${item.uuid})`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to unarchive lucky spin item ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to unarchive lucky spin item: ${uuid}`);
    }
  }

  /**
   * Transform item list data from API response format
   */
  private transformItemList(items: LuckySpinItem[]): LuckySpinItem[] {
    return items.map(item => this.transformItem(item));
  }

  /**
   * Transform single item data from API response format
   */
  private transformItem(item: LuckySpinItem): LuckySpinItem {
    // Validate required fields
    if (!item.uuid || !item.reward_name) {
      throw new Error('Invalid item data: missing required fields');
    }

    // Ensure probability is a string (API returns string)
    const probability = typeof item.probability === 'number'
      ? String(item.probability)
      : item.probability;

    // Handle unlimited/quantity relationship
    const quantity = item.unlimited ? 0 : (item.quantity || 0);

    return {
      id: item.id,
      uuid: item.uuid,
      reward_name: item.reward_name.trim(),
      probability: probability,
      unlimited: Boolean(item.unlimited),
      quantity: quantity,
      image: item.image || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      archived: Boolean(item.archived),
    };
  }

  /**
   * Validate create request data
   */
  private validateCreateRequest(itemData: CreateSpinItemRequest): void {
    if (!itemData.reward_name || typeof itemData.reward_name !== 'string') {
      throw new Error('Reward name is required and must be a string');
    }

    if (itemData.reward_name.trim().length === 0) {
      throw new Error('Reward name cannot be empty');
    }

    if (itemData.reward_name.length > 255) {
      throw new Error('Reward name must be 255 characters or less');
    }

    if (typeof itemData.probability !== 'number') {
      throw new Error('Probability is required and must be a number');
    }

    if (itemData.probability < 0 || itemData.probability > 100) {
      throw new Error('Probability must be between 0 and 100');
    }

    if (typeof itemData.unlimited !== 'boolean') {
      throw new Error('Unlimited flag is required and must be a boolean');
    }

    // Validate unlimited/quantity relationship
    if (!itemData.unlimited) {
      if (typeof itemData.quantity !== 'number' || itemData.quantity <= 0) {
        throw new Error('Quantity must be a positive number when unlimited is false');
      }
    } else {
      // When unlimited is true, quantity should be 0 or undefined
      if (itemData.quantity !== undefined && itemData.quantity !== 0) {
        throw new Error('Quantity must be 0 or undefined when unlimited is true');
      }
    }

    // Validate image if provided
    if (itemData.image) {
      this.validateImageFile(itemData.image);
    }
  }

  /**
   * Validate image file
   */
  private validateImageFile(file: File): void {
    if (!(file instanceof File)) {
      throw new Error('Image must be a valid File object');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image file size must be less than 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Image must be JPEG, PNG, GIF, or WebP format');
    }
  }

  /**
   * Validate update request data
   */
  private validateUpdateRequest(updateData: UpdateSpinItemRequest): void {
    // Validate reward_name if provided
    if (updateData.reward_name !== undefined) {
      if (typeof updateData.reward_name !== 'string') {
        throw new Error('Reward name must be a string');
      }

      if (updateData.reward_name.trim().length === 0) {
        throw new Error('Reward name cannot be empty');
      }

      if (updateData.reward_name.length > 255) {
        throw new Error('Reward name must be 255 characters or less');
      }
    }

    // Validate probability if provided
    if (updateData.probability !== undefined) {
      if (typeof updateData.probability !== 'number') {
        throw new Error('Probability must be a number');
      }

      if (updateData.probability < 0 || updateData.probability > 100) {
        throw new Error('Probability must be between 0 and 100');
      }
    }

    // Validate unlimited flag if provided
    if (updateData.unlimited !== undefined) {
      if (typeof updateData.unlimited !== 'boolean') {
        throw new Error('Unlimited flag must be a boolean');
      }
    }

    // Validate unlimited/quantity relationship
    if (updateData.unlimited !== undefined || updateData.quantity !== undefined) {
      const unlimited = updateData.unlimited;
      const quantity = updateData.quantity;

      if (unlimited === false && (quantity === undefined || quantity <= 0)) {
        throw new Error('Quantity must be a positive number when unlimited is false');
      }

      if (unlimited === true && quantity !== undefined && quantity !== 0) {
        throw new Error('Quantity must be 0 or undefined when unlimited is true');
      }
    }

    // Validate image if provided
    if (updateData.image) {
      this.validateImageFile(updateData.image);
    }
  }

  /**
   * Prepare form data for multipart upload
   */
  private prepareFormData(itemData: CreateSpinItemRequest): FormData {
    const formData = new FormData();

    // Add required fields
    formData.append('reward_name', itemData.reward_name.trim());
    formData.append('probability', itemData.probability.toString());
    formData.append('unlimited', itemData.unlimited.toString());

    // Add quantity based on unlimited flag
    if (itemData.unlimited) {
      formData.append('quantity', '0');
    } else {
      formData.append('quantity', (itemData.quantity || 0).toString());
    }

    // Add image if provided
    if (itemData.image) {
      formData.append('image', itemData.image);
    }

    return formData;
  }

  /**
   * Prepare form data for update operations
   */
  private prepareUpdateFormData(updateData: UpdateSpinItemRequest): FormData {
    const formData = new FormData();

    // Add fields only if they are provided (partial update)
    if (updateData.reward_name !== undefined) {
      formData.append('reward_name', updateData.reward_name.trim());
    }

    if (updateData.probability !== undefined) {
      formData.append('probability', updateData.probability.toString());
    }

    if (updateData.unlimited !== undefined) {
      formData.append('unlimited', updateData.unlimited.toString());

      // Handle quantity based on unlimited flag
      if (updateData.unlimited) {
        formData.append('quantity', '0');
      } else if (updateData.quantity !== undefined) {
        formData.append('quantity', updateData.quantity.toString());
      }
    } else if (updateData.quantity !== undefined) {
      formData.append('quantity', updateData.quantity.toString());
    }

    // Add image if provided
    if (updateData.image) {
      formData.append('image', updateData.image);
    }

    return formData;
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

    // Basic UUID format validation (can be enhanced)
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
          return new Error('Lucky spin item not found');
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
export const luckySpinItemsService = new LuckySpinItemsService();