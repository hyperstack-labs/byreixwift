import { Module } from '@nestjs/common';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [ContractModule],
  controllers: [EscrowController],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class EscrowModule {}
