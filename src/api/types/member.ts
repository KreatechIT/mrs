/**
 * Member related TypeScript interfaces
 */

// Member Interface
export interface Member {
  uuid: string;
  username: string;
  email: string;
  vip_tier: string;
  last_login: string;
  active_section: string;
  time_spent: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Member Details Interface (extended information)
export interface MemberDetails extends Member {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_joined?: string;
  total_spins?: number;
  total_rewards?: number;
  current_balance?: number;
}

// Spin Result Interface
export interface SpinResult {
  item: {
    uuid: string;
    reward_name: string;
    probability: string;
    image: string | null;
  };
  success: boolean;
  message: string;
  timestamp?: string;
}

// Single Spin Request Interface
export interface SingleSpinRequest {
  member_uuid: string;
}

// Ten Spins Request Interface
export interface TenSpinsRequest {
  member_uuid: string;
}

// Spin Response Interface
export interface SpinResponse {
  results: SpinResult[];
  total_spins: number;
  success_count: number;
  member_balance?: number;
}

// Member List Response Interface
export interface MemberListResponse {
  results: Member[];
  count: number;
  next: string | null;
  previous: string | null;
}