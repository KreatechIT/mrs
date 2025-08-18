/**
 * Lucky Spin Items related TypeScript interfaces
 */

// Lucky Spin Item Interface
export interface LuckySpinItem {
  id: number;
  uuid: string;
  reward_name: string;
  probability: string;
  unlimited: boolean;
  quantity: number;
  image: string | null;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}

// Create Spin Item Request Interface
export interface CreateSpinItemRequest {
  reward_name: string;
  probability: number;
  unlimited: boolean;
  quantity?: number;
  image?: File;
}

// Update Spin Item Request Interface
export interface UpdateSpinItemRequest {
  reward_name?: string;
  probability?: number;
  unlimited?: boolean;
  quantity?: number;
  image?: File;
}

// Archive Spin Item Request Interface
export interface ArchiveSpinItemRequest {
  archived: boolean;
}

// Spin Item List Response Interface
export interface SpinItemListResponse {
  results: LuckySpinItem[];
  count: number;
  next: string | null;
  previous: string | null;
}