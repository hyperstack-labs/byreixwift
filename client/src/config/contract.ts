import { parseAbi } from "viem";

export const ESCROW_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const ESCROW_ABI = parseAbi([
  "function deposit(address _seller, bytes32 _agreementHash) payable returns (uint256)",
  "function lock(uint256 _txId)",
  "function release(uint256 _txId)",
  "function refund(uint256 _txId)",
  "function nextTransactionId() view returns (uint256)",
  "function transactions(uint256) view returns (address buyer, address seller, uint256 grossAmount, uint256 netAmount, bytes32 agreementHash, uint8 state, uint64 createdAt, uint64 lockedAt, uint64 resolvedAt, bool isInitialized)",
  "function fixedFee() view returns (uint256)",
  "event EscrowCreated(uint256 indexed txId, address indexed buyer, address indexed seller, uint256 grossAmount, uint256 fixedFee, bytes32 agreementHash)",
  "event EscrowLocked(uint256 indexed txId, address indexed actor)",
  "event EscrowReleased(uint256 indexed txId, address indexed actor, uint256 sellerAmount, uint256 feeAmount)",
  "event EscrowRefunded(uint256 indexed txId, address indexed actor, uint256 refundedAmount)",
]);
