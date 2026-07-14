import { Controller, Get, Param } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contract')
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @Get('next-id')
  async getNextId() {
    return await this.service.getNextTransactionId();
  }

  @Get('escrow/:id')
  async getEscrow(@Param('id') id: string) {
    return await this.service.getEscrow(Number(id));
  }
}
