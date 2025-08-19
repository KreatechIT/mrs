/**
 * MemberService - Member management and spin operations service
 * Handles member listing, details, and spin operations (single/ten spins)
 */

import { apiClient } from '../client/APIClient.js';
import { MEMBER_ENDPOINTS } from '../config/endpoints.js';
import { featureFlags } from '../config/settings.js';

export class MemberService {
  /**
   * Member login with username and login code
   */
  async loginMember(credentials) {
    try {
      this.validateLoginCredentials(credentials);

      if (featureFlags.enableRequestLogging) {
        console.log(`🔐 Member login attempt for: ${credentials.username}`);
      }

      const response = await apiClient.post(
        MEMBER_ENDPOINTS.LOGIN,
        credentials
      );

      if (!response.data) {
        throw new Error('Invalid login response');
      }

      const loginResult = this.transformLoginResponse(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Member login successful: ${credentials.username}`);
      }

      return loginResult;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Member login failed for ${credentials.username}:`, error);
      }
      throw this.handleServiceError(error, `Failed to login member: ${credentials.username}`);
    }
  }

  /**
   * List all members
   */
  async listMembers() {
    try {
      if (featureFlags.enableRequestLogging) {
        console.log('👥 Fetching all members');
      }

      const response = await apiClient.get(
        MEMBER_ENDPOINTS.LIST
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of members');
      }

      const members = this.transformMemberList(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Retrieved ${members.length} members`);
      }

      return members;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error('❌ Failed to fetch members:', error);
      }
      throw this.handleServiceError(error, 'Failed to fetch members');
    }
  }

  /**
   * Get single member by UUID
   */
  async getMember(uuid) {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`👤 Fetching member: ${uuid}`);
      }

      const response = await apiClient.get(
        MEMBER_ENDPOINTS.DETAIL(uuid)
      );

      if (!response.data) {
        throw new Error('Member not found');
      }

      const member = this.transformMember(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Retrieved member: ${member.username}`);
      }

      return member;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to fetch member ${uuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to fetch member: ${uuid}`);
    }
  }

  /**
   * Perform single spin for member
   */
  async performSingleSpin(memberUuid) {
    try {
      this.validateUuid(memberUuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Performing single spin for member: ${memberUuid}`);
      }

      const response = await apiClient.post(
        MEMBER_ENDPOINTS.SINGLE_SPIN(memberUuid),
        {} // Empty body as per API
      );

      if (!response.data) {
        throw new Error('Invalid spin response');
      }

      const spinResult = this.transformSpinResult(response.data);

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Single spin completed: ${spinResult.reward_name}`);
      }

      return spinResult;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to perform single spin for member ${memberUuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to perform single spin for member: ${memberUuid}`);
    }
  }

  /**
   * Perform ten spins for member
   */
  async performTenSpins(memberUuid) {
    try {
      this.validateUuid(memberUuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Performing ten spins for member: ${memberUuid}`);
      }

      const response = await apiClient.post(
        MEMBER_ENDPOINTS.TEN_SPINS(memberUuid),
        {} // Empty body as per API
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid ten spins response: expected array');
      }

      const spinResults = response.data.map(result => this.transformSpinResult(result));

      if (featureFlags.enableRequestLogging) {
        console.log(`✅ Ten spins completed: ${spinResults.length} results`);
      }

      return spinResults;
    } catch (error) {
      if (featureFlags.enableRequestLogging) {
        console.error(`❌ Failed to perform ten spins for member ${memberUuid}:`, error);
      }
      throw this.handleServiceError(error, `Failed to perform ten spins for member: ${memberUuid}`);
    }
  }

  /**
   * Transform member list data from API response format
   */
  transformMemberList(members) {
    return members.map(member => this.transformMember(member));
  }

  /**
   * Transform single member data from API response format
   */
  transformMember(member) {
    // Validate required fields
    if (!member.uuid || !member.username) {
      throw new Error('Invalid member data: missing required fields');
    }

    return {
      id: member.id,
      uuid: member.uuid,
      username: member.username.trim(),
      tier: member.tier || '-',
      current_points: member.current_points || 0,
      login_code: member.login_code || '',
    };
  }

  /**
   * Transform spin result data from API response format
   */
  transformSpinResult(result) {
    // Validate required fields
    if (!result.uuid || !result.reward_name) {
      throw new Error('Invalid spin result: missing required fields');
    }

    return {
      uuid: result.uuid,
      reward_name: result.reward_name.trim(),
      image: result.image || null,
    };
  }

  /**
   * Transform login response data from API response format
   */
  transformLoginResponse(response) {
    // Validate required fields
    if (!response.access || !response.refresh || !response.user_id || !response.member_id) {
      throw new Error('Invalid login response: missing required fields');
    }

    return {
      access: response.access,
      refresh: response.refresh,
      user_id: response.user_id,
      member_id: response.member_id,
    };
  }

  /**
   * Validate login credentials
   */
  validateLoginCredentials(credentials) {
    if (!credentials.username || typeof credentials.username !== 'string') {
      throw new Error('Username is required and must be a string');
    }

    if (!credentials.login_code || typeof credentials.login_code !== 'string') {
      throw new Error('Login code is required and must be a string');
    }

    if (credentials.username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    if (credentials.login_code.trim().length === 0) {
      throw new Error('Login code cannot be empty');
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
          return new Error('Member not found');
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
export const memberService = new MemberService();