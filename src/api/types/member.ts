/**
 * Member related TypeScript interfaces
 */

// Member Interface
export interface Member {
  id: number;
  uuid: string;
  username: string;
  tier: string;
  current_points: number;
  login_code: string;
  created_at?: string;
  updated_at?: string;
}

// Member Details Interface (extended information)
export interface MemberDetails extends Member {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  last_login?: string;
  active_section?: string;
  time_spent?: string;
  total_spins?: number;
  total_rewards?: number;
  is_active?: boolean;
}

// Spin Result Interface (matches API response)
export interface SpinResult {
  uuid: string;
  reward_name: string;
  image: string | null;
}

// Single Spin Request Interface
export interface SingleSpinRequest {
  member_uuid: string;
}

// Ten Spins Request Interface
export interface TenSpinsRequest {
  member_uuid: string;
}

// Single Spin Response Interface
export interface SingleSpinResponse extends SpinResult {}

// Ten Spins Response Interface
export interface TenSpinsResponse extends Array<SpinResult> {}

// Member List Response Interface
export interface MemberListResponse {
  results: Member[];
  count: number;
  next: string | null;
  previous: string | null;
}