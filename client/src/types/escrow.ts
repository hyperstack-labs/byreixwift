export type EscrowState = "pending" | "locked" | "released" | "refunded";

export interface EscrowRecord {
  id: string;
  buyer: string;
  seller: string;
  amount: number;
  tokenSymbol: string;
  description: string;
  fixedFee: number;
  state: EscrowState;
  createdAt: string;
  updatedAt: string;
}

export interface EscrowEventRecord {
  id: string;
  escrowId: string;
  type: "EscrowCreated" | "TransactionLocked" | "FundsReleased" | "FundsRefunded";
  occurredAt: string;
  state: EscrowState;
  metadata?: Record<string, string | number>;
}

export interface EscrowDetailResponse {
  escrow: EscrowRecord;
  events: EscrowEventRecord[];
}

export interface CreateEscrowPayload {
  buyer: string;
  seller: string;
  amount: number;
  tokenSymbol: string;
  description: string;
  fixedFee?: number;
}

export interface EscrowActionPayload {
  actor: string;
}
