import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

/**
 * TokenModule
 * Integrates token tracking and price charts into the backend context.
 */
@Module({
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
