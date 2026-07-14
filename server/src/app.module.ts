import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EscrowsModule } from './escrows/escrows.module';
import { DbModule } from './db/db.module';
import { ContractModule } from './contracts/contract.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EscrowsModule,
    ContractModule,
    DbModule,
    KycModule,
  ],
})
export class AppModule {}
