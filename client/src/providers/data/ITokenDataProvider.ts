import { SidraTokenMetric } from "@/types/sidra";

export interface ITokenDataProvider {
  getTokenList(): Promise<SidraTokenMetric[]>;

  getTokenMetrics(symbol: string): Promise<SidraTokenMetric | undefined>;
}
