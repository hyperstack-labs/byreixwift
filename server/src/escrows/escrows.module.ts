import { Module } from "@nestjs/common";
import { EscrowsController } from "./escrows.controller";
import { EscrowsService } from "./escrows.service";
import { ContractModule } from "../contracts/contract.module";

@Module({
  imports: [ContractModule],
  controllers: [EscrowsController],
  providers: [EscrowsService],
  exports: [EscrowsService],
})
export class EscrowsModule {}
