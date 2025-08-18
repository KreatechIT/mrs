/**
 * Spin Sequence related TypeScript interfaces
 */

// Spin Sequence Interface
export interface SpinSequence {
  id: number;
  uuid: string;
  item_order: number;
  item_name: string;
  item_uuid: string;
  created_at?: string;
  updated_at?: string;
}

// Create Sequence Request Interface
export interface CreateSequenceRequest {
  item_order: number;
  item_uuid: string;
}

// Update Sequence Request Interface
export interface UpdateSequenceRequest {
  item_order?: number;
  item_uuid?: string;
}

// Bulk Reorder Request Interface
export interface BulkReorderRequest {
  lucky_spins: Array<{
    item_order: number;
    sequence_UUID: string;
  }>;
}

// Sequence List Response Interface
export interface SequenceListResponse {
  results: SpinSequence[];
  count: number;
  next: string | null;
  previous: string | null;
}