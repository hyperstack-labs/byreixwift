import { Injectable } from "@nestjs/common";
import { createPublicClient, http, parseAbi, parseEventLogs, parseEther } from "viem";

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

    if (
      !rpc ||
      !contractAddress ||
      contractAddress === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn(
        "⚠️ RPC_URL or CONTRACT_ADDRESS is missing/placeholder. Blockchain integration will run in mock mode.",
      );
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
    "event EscrowCreated(uint256 indexed txId, address indexed buyer, address indexed seller, uint256 grossAmount, uint256 fixedFee, bytes32 agreementHash)",
    "event EscrowLocked(uint256 indexed txId, address indexed actor)",
    "event EscrowReleased(uint256 indexed txId, address indexed actor, uint256 sellerAmount, uint256 feeAmount)",
    "event EscrowRefunded(uint256 indexed txId, address indexed actor, uint256 refundedAmount)",
  ]);

  /**
   * Retrieves the next transaction ID from the contract.
   * If the contract client is not initialized, returns "0" to prevent runtime crashes.
   */
  async getNextTransactionId() {
    if (
      !this.client ||
      this.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn(
        "getNextTransactionId: Client not initialized or zero address. Returning fallback/mock value.",
      );
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
    if (
      !this.client ||
      this.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn(
        "getEscrow: Client not initialized or zero address. Returning mock escrow details.",
      );
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
        false,
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
        false,
      ];
    }
  }

  /**
   * Verifies that the EscrowCreated event matches the stored database record parameters.
   * Prevents fraudulent creation logs from being registered in the database.
   */
  async verifyOnChainCreation(
    txHash: string,
    onChainId: number,
    buyer: string,
    seller: string,
    amount: number,
    fixedFee: number,
  ): Promise<boolean> {
    if (
      !this.client ||
      this.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn(
        "verifyOnChainCreation: Running in mock mode. Automatically verifying creation.",
      );
      return true;
    }

    try {
      const receipt = await this.client.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
      if (receipt.status !== "success") {
        return false;
      }

      const logs = parseEventLogs({
        abi: this.abi,
        eventName: "EscrowCreated",
        logs: receipt.logs,
      });

      const grossWei = parseEther((amount + fixedFee).toFixed(18)).toString();
      const feeWei = parseEther(fixedFee.toFixed(18)).toString();

      const matchingLog = logs.find((log: any) => {
        const logTxId = log.args.txId;
        const logBuyer = log.args.buyer;
        const logSeller = log.args.seller;
        const logGross = log.args.grossAmount;
        const logFee = log.args.fixedFee;

        return (
          logTxId !== undefined &&
          logTxId.toString() === onChainId.toString() &&
          logBuyer !== undefined &&
          logBuyer.toLowerCase() === buyer.toLowerCase() &&
          logSeller !== undefined &&
          logSeller.toLowerCase() === seller.toLowerCase() &&
          logGross !== undefined &&
          logGross.toString() === grossWei &&
          logFee !== undefined &&
          logFee.toString() === feeWei
        );
      });

      return !!matchingLog;
    } catch (error) {
      console.error(
        `Failed to verify on-chain creation for tx ${txHash}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Verifies that the transition event was successfully broadcast to the chain.
   * Confirms status modification authenticity based on true event logs.
   */
  async verifyOnChainTransition(
    txHash: string,
    eventName: "EscrowLocked" | "EscrowReleased" | "EscrowRefunded",
    onChainId: number,
    actor: string,
  ): Promise<boolean> {
    if (
      !this.client ||
      this.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn(
        `verifyOnChainTransition(${eventName}): Running in mock mode. Automatically verifying transition.`,
      );
      return true;
    }

    try {
      const receipt = await this.client.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
      if (receipt.status !== "success") {
        return false;
      }

      const logs = parseEventLogs({
        abi: this.abi,
        eventName,
        logs: receipt.logs,
      });

      const matchingLog = logs.find((log: any) => {
        const logTxId = log.args.txId;
        const logActor = log.args.actor;

        return (
          logTxId !== undefined &&
          logTxId.toString() === onChainId.toString() &&
          logActor !== undefined &&
          logActor.toLowerCase() === actor.toLowerCase()
        );
      });

      return !!matchingLog;
    } catch (error) {
      console.error(
        `Failed to verify on-chain transition ${eventName} for tx ${txHash}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Serializes the contract response, transforming any BigInts recursively.
   * Needed because JSON.stringify throws errors on bigint values.
   */
  private serialize(data: any) {
    return JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }
}
