import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EscrowsModule } from "./escrows/escrows.module";

@Module({
  imports: [AuthModule, EscrowsModule],
})
export class AppModule {}
