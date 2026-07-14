import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EscrowsModule } from "./escrows/escrows.module";
import { DbModule } from "./db/db.module";
import { ContractModule } from "./contracts/contract.module";
import { KycModule } from "./kyc/kyc.module";
@Module({
  imports: [AuthModule, EscrowsModule, ContractModule, DbModule, KycModule],
})
export class AppModule {}
