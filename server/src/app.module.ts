import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EscrowModule } from './escrow/escrow.module';
import { DbModule } from './db/db.module';
import { ContractModule } from './contract/contract.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EscrowModule,
    ContractModule,
    DbModule,
    KycModule,
  ],
})
export class AppModule {}
