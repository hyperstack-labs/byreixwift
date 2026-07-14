import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { TokenService } from './token.service';

/**
 * TokenController
 * Exposes endpoints for token price details and historical charts.
 */
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * Retrieves the current list of supported tokens and their primary market metrics.
   */
  @Get('list')
  async getList() {
    return await this.tokenService.getTokens();
  }

  /**
   * Retrieves detailed metrics for a single token using its ticker symbol (e.g. SDA).
   */
  @Get('metrics')
  async getMetrics(@Query('symbol') symbol: string) {
    if (!symbol) {
      throw new NotFoundException('Token symbol parameter is required');
    }
    const token = await this.tokenService.getTokenBySymbol(symbol);
    if (!token) {
      throw new NotFoundException(`Token with symbol ${symbol} not found`);
    }
    return token;
  }

  /**
   * Returns price trend history for chart visualization based on range (e.g., 24H, 7D, 1Y).
   */
  @Get('history')
  async getHistory(
    @Query('symbol') symbol: string,
    @Query('range') range: string,
  ) {
    if (!symbol || !range) {
      throw new NotFoundException('Symbol and range parameters are required');
    }
    return await this.tokenService.getTokenHistory(symbol, range);
  }
}
