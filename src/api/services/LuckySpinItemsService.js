/**
 * LuckySpinItemsService - Lucky spin items management service
 * Handles CRUD operations for lucky spin items
 */

import { apiClient } from '../client/APIClient.js';
import { LUCKY_SPIN_ITEMS_ENDPOINTS } from '../config/endpoints.js';
import { featureFlags } from '../config/settings.js';

export class LuckySpinItemsService {
  /**
   * List all lucky spin items
   */
  async listItems() {
    try {
      if (featureFlags.enableRequestLogging) {
        console.log('🎰 Fetching all lucky spin items');
      }

      const response = await apiClient.get(
        LUCKY_SPIN_ITEMS_ENDPOINTS.LIST
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of items');
      }

      const items = this.transformItemList(response.data);

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
  }

  /**
   * Get single lucky spin item by UUID
   */
  async getItem(uuid) {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Fetching lucky spin item: ${uuid}`);
      }

      const response = await apiClient.get(
        LUCKY_SPIN_ITEMS_ENDPOINTS.DETAIL(uuid)
      );

      if (!response.data) {
        throw new Error('Lucky spin item not found');
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
   * Create new lucky spin item
   */
  async createItem(itemData) {
    try {
      this.validateItemData(itemData);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Creating lucky spin item: ${itemData.reward_name}`);
      }

      const response = await apiClient.post(
        LUCKY_SPIN_ITEMS_ENDPOINTS.CREATE,
        itemData
      );

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Created lucky spin item: ${item.reward_name}`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to create lucky spin item:`, error);
      }
      throw this.handleServiceError(error, 'Failed to create lucky spin item');
    }
  }

  /**
   * Create new lucky spin item with image (multipart form)
   */
  async createItemWithImage(itemData, imageFile) {
    try {
      this.validateItemData(itemData);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Creating lucky spin item with image: ${itemData.reward_name}`);
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('reward_name', itemData.reward_name);
      formData.append('probability', itemData.probability.toString());
      formData.append('unlimited', itemData.unlimited.toString());
      if (!itemData.unlimited && itemData.quantity !== undefined) {
        formData.append('quantity', itemData.quantity.toString());
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await apiClient.post(
        LUCKY_SPIN_ITEMS_ENDPOINTS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Created lucky spin item with image: ${item.reward_name}`);
      }

      return item;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to create lucky spin item with image:`, error);
      }
      throw this.handleServiceError(error, 'Failed to create lucky spin item with image');
    }
  }

  /**
   * Update lucky spin item
   */
  async updateItem(uuid, itemData) {
    try {
      this.validateUuid(uuid);
      this.validateItemData(itemData);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Updating lucky spin item: ${uuid}`);
      }

      const response = await apiClient.put(
        LUCKY_SPIN_ITEMS_ENDPOINTS.UPDATE(uuid),
        itemData
      );

      const item = this.transformItem(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Updated lucky spin item: ${item.reward_name}`);
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
   * Archive (soft delete) a lucky spin item
   */
  async archiveItem(uuid) {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🗄️ Archiving lucky spin item: ${uuid}`);
      }

      const response = await apiClient.patch(
        LUCKY_SPIN_ITEMS_ENDPOINTS.ARCHIVE(uuid),
        {} // Empty body as per API
      );

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Lucky spin item archived: ${uuid}`);
      }

      return this.transformItem(response.data);
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to archive lucky spin item ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to archive lucky spin item: ${uuid}`);
    }
  }

  /**
   * Transform item list data from API response format
   */
  transformItemList(items) {
    return items.map(item => this.transformItem(item));
  }

  /**
   * Transform single item data from API response format
   */
  transformItem(item) {
    // Validate required fields
    if (!item.uuid || !item.reward_name) {
      throw new Error('Invalid item data: missing required fields');
    }

    return {
      id: item.id,
      uuid: item.uuid,
      reward_name: item.reward_name.trim(),
      probability: parseFloat(item.probability) || 0,
      unlimited: item.unlimited === true,
      quantity: item.quantity || 0,
      image: item.image || null,
    };
  }

  /**
   * Validate item data for create/update operations
   */
  validateItemData(itemData) {
    if (!itemData.reward_name || typeof itemData.reward_name !== 'string') {
      throw new Error('Reward name is required and must be a string');
    }

    if (itemData.reward_name.trim().length === 0) {
      throw new Error('Reward name cannot be empty');
    }

    if (typeof itemData.probability !== 'number' || itemData.probability < 0 || itemData.probability > 1) {
      throw new Error('Probability must be a number between 0 and 1');
    }

    if (typeof itemData.unlimited !== 'boolean') {
      throw new Error('Unlimited must be a boolean value');
    }

    // If not unlimited, quantity is required
    if (!itemData.unlimited) {
      if (typeof itemData.quantity !== 'number' || itemData.quantity < 0) {
        throw new Error('Quantity is required and must be a positive number when unlimited is false');
      }
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