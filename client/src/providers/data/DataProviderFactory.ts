import { ITokenDataProvider } from "./ITokenDataProvider";
import { ITrendDataProvider } from "./ITrendDataProvider";
import { MockTokenDataProvider } from "@/providers/data/mock/MockTokenDataProvider";
import { MockTrendDataProvider } from "@/providers/data/mock/MockTrendDataProvider";
import { SidraTokenDataProvider } from "@/providers/data/sidra/SidraTokenDataProvider";
import { SidraTrendDataProvider } from "@/providers/data/sidra/SidraTrendDataProvider";

/**
 * @integration-point
 *   Flip to false (or set NEXT_PUBLIC_USE_MOCK=false) when the Sidra API
 *   is available and credentials are in place.
 */
export const USE_MOCK: boolean = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Singleton instances — providers are stateless so one per app is fine.
let _tokenProvider: ITokenDataProvider | null = null;
let _trendProvider: ITrendDataProvider | null = null;

export const DataProviderFactory = {
  /**
   * Returns the active token data provider.
   * Call from hooks only — never from page or display components.
   */
  getTokenProvider(): ITokenDataProvider {
    if (!_tokenProvider) {
      _tokenProvider = USE_MOCK ? new MockTokenDataProvider() : new SidraTokenDataProvider();
    }
    return _tokenProvider;
  },

  /**
   * Returns the active trend / historical-price provider.
   * Call from hooks only — never from page or display components.
   */
  getTrendProvider(): ITrendDataProvider {
    if (!_trendProvider) {
      _trendProvider = USE_MOCK ? new MockTrendDataProvider() : new SidraTrendDataProvider();
    }
    return _trendProvider;
  },

  /**
   * Resets all cached provider instances.
   * Useful in tests to force a fresh provider per test case.
   *
   * @example
   *   beforeEach(() => DataProviderFactory.reset());
   */
  reset(): void {
    _tokenProvider = null;
    _trendProvider = null;
  },
} as const;
