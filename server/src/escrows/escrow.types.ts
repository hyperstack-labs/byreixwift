export const ESCROW_STATES = [
  "pending",
  "locked",
  "released",
  "refunded",
] as const;
export type EscrowState = (typeof ESCROW_STATES)[number];

export const ESCROW_EVENT_TYPES = [
  "EscrowCreated",
  "TransactionLocked",
  "FundsReleased",
  "FundsRefunded",
] as const;
export type EscrowEventType = (typeof ESCROW_EVENT_TYPES)[number];

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
  type: EscrowEventType;
  occurredAt: string;
  state: EscrowState;
  metadata?: Record<string, string | number>;
}
