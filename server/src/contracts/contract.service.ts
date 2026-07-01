import { Injectable } from "@nestjs/common";
import { createPublicClient, http, parseAbi } from "viem";

@Injectable()
export class ContractService {
  private client;
  private address: `0x${string}`;

  /**
   * Initializes the blockchain client if environment variables are provided.
   * If missing, defaults to mock mode to prevent NestJS eagerly crashing on startup.
   */
  constructor() {
    const rpc = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!rpc || !contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      console.warn("⚠️ RPC_URL or CONTRACT_ADDRESS is missing/placeholder. Blockchain integration will run in mock mode.");
      this.client = null;
      this.address = "0x0000000000000000000000000000000000000000";
      return;
    }

    this.address = contractAddress as `0x${string}`;
    try {
      this.client = createPublicClient({
        transport: http(rpc),
      });
    } catch (error) {
      console.error("❌ Failed to initialize blockchain client:", error);
      this.client = null;
    }
  }

  private abi = parseAbi([
    "function nextTransactionId() view returns (uint256)",
    "function transactions(uint256) view returns (address,address,uint256,uint256,bytes32,uint8,uint64,uint64,uint64,bool)",
  ]);

  /**
   * Retrieves the next transaction ID from the contract.
   * If the contract client is not initialized, returns "0" to prevent runtime crashes.
   */
  async getNextTransactionId() {
    if (!this.client || this.address === "0x0000000000000000000000000000000000000000") {
      console.warn("getNextTransactionId: Client not initialized or zero address. Returning fallback/mock value.");
      return "0";
    }
    try {
      const result = await this.client.readContract({
        address: this.address,
        abi: this.abi,
        functionName: "nextTransactionId",
      });
      return result.toString();
    } catch (error) {
      console.warn("getNextTransactionId failed, falling back to mock:", error);
      return "0";
    }
  }

  /**
   * Fetches escrow details from the contract for a given transaction ID.
   * If the contract client is not initialized, returns a mock transaction tuple representation.
   */
  async getEscrow(id: number) {
    if (!this.client || this.address === "0x0000000000000000000000000000000000000000") {
      console.warn("getEscrow: Client not initialized or zero address. Returning mock escrow details.");
      return [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "0",
        "0",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        "0",
        "0",
        "0",
        false
      ];
    }
    try {
      const data = await this.client.readContract({
        address: this.address,
        abi: this.abi,
        functionName: "transactions",
        args: [BigInt(id)],
      });
      return this.serialize(data);
    } catch (error) {
      console.warn(`getEscrow(${id}) failed, falling back to mock:`, error);
      return [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "0",
        "0",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        "0",
        "0",
        "0",
        false
      ];
    }
  }

  /**
   * Serializes the contract response, transforming any BigInts recursively.
   * Needed because JSON.stringify throws errors on bigint values.
   */
  private serialize(data: any) {
    return JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }
}