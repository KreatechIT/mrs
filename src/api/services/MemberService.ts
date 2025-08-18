/**
 * MemberService - Member management and spin operations service
 * Handles member listing, details, and spin operations (single/ten spins)
 */

import type {
  Member,
  SpinResult,
  SingleSpinResponse,
  TenSpinsResponse,
  APIResponse
} from '../types';
import { apiClient } from '../client/APIClient';
import { MEMBER_ENDPOINTS } from '../config/endpoints';
import { featureFlags } from '../config/settings';

export class MemberService {
  /**
   * List all members
   */
  async listMembers(): Promise<Member[]> {
    try {
      if (featureFlags.enableRequestLogging) {
        console.log('👥 Fetching all members');
      }

      const response: APIResponse<Member[]> = await apiClient.get(
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
  async getMember(uuid: string): Promise<Member> {
    try {
      this.validateUuid(uuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`👤 Fetching member: ${uuid}`);
      }

      const response: APIResponse<Member> = await apiClient.get(
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
  async performSingleSpin(memberUuid: string): Promise<SpinResult> {
    try {
      this.validateUuid(memberUuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Performing single spin for member: ${memberUuid}`);
      }

      const response: APIResponse<SingleSpinResponse> = await apiClient.post(
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
  async performTenSpins(memberUuid: string): Promise<SpinResult[]> {
    try {
      this.validateUuid(memberUuid);

      if (featureFlags.enableRequestLogging) {
        console.log(`🎰 Performing ten spins for member: ${memberUuid}`);
      }

      const response: APIResponse<TenSpinsResponse> = await apiClient.post(
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
  private transformMemberList(members: Member[]): Member[] {
    return members.map(member => this.transformMember(member));
  }

  /**
   * Transform single member data from API response format
   */
  private transformMember(member: Member): Member {
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
      created_at: member.created_at,
      updated_at: member.updated_at,
    };
  }

  /**
   * Transform spin result data from API response format
   */
  private transformSpinResult(result: SpinResult): SpinResult {
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