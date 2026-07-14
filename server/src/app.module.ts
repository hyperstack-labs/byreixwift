import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EscrowModule } from './escrow/escrow.module';
import { DbModule } from './db/db.module';
import { ContractModule } from './contract/contract.module';
import { KycModule } from './kyc/kyc.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    AuthModule,
    EscrowModule,
    ContractModule,
    DbModule,
    KycModule,
  ],
})
export class AppModule {}
