import { Injectable } from "@nestjs/common";
import { createPublicClient, http, parseAbi } from "viem";

@Injectable()
export class ContractService {
  private client;
  private address: `0x${string}`;

  constructor() {
    const rpc = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!rpc) throw new Error("RPC_URL missing in .env");
    if (!contractAddress) throw new Error("CONTRACT_ADDRESS missing in .env");

    this.address = contractAddress as `0x${string}`;

    this.client = createPublicClient({
      transport: http(rpc),
    });
  }

  private abi = parseAbi([
    "function nextTransactionId() view returns (uint256)",
    "function transactions(uint256) view returns (address,address,uint256,uint256,bytes32,uint8,uint64,uint64,uint64,bool)",
  ]);

  
  async getNextTransactionId() {
    const result = await this.client.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "nextTransactionId",
    });

    return result.toString();
  }

  
  async getEscrow(id: number) {
    const data = await this.client.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "transactions",
      args: [BigInt(id)],
    });

    return this.serialize(data);
  }

 
  private serialize(data: any) {
    return JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }
}