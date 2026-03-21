import { Module } from "@nestjs/common";
import { EscrowsModule } from "./escrows/escrows.module";

@Module({
  imports: [EscrowsModule],
})
export class AppModule {}
