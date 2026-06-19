import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EscrowsModule } from "./escrows/escrows.module";
import { DbModule } from "./db/db.module";
import { ContractModule } from "./contracts/contract.module";
@Module({
  imports:[AuthModule,EscrowsModule,ContractModule,DbModule],
})
export class AppModule {}
