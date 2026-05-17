import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EscrowsModule } from "./escrows/escrows.module";
import { DbModule } from "./db/db.module";
@Module({
  imports: [AuthModule, EscrowsModule, DbModule],
})
export class AppModule {}
