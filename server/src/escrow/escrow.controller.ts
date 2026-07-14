import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateEscrowDto, EscrowActionDto } from './dto';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('escrows')
@UseGuards(JwtAuthGuard)
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Get()
  listEscrows() {
    return this.escrowService.listEscrows();
  }

  @Get(':id')
  getEscrow(@Param('id') id: string) {
    return this.escrowService.getEscrow(id);
  }

  @Get(':id/events')
  getEscrowEvents(@Param('id') id: string) {
    return this.escrowService.getEvents(id);
  }

  @Post()
  createEscrow(@Body() dto: CreateEscrowDto) {
    return this.escrowService.createEscrow(dto);
  }

  @Post(':id/lock')
  lockEscrow(
    @Param('id') id: string,
    @Body() dto: EscrowActionDto,
    @CurrentUser() user: any,
  ) {
    if (dto.actor.toLowerCase() !== user.address.toLowerCase()) {
      throw new BadRequestException('Actor does not match authenticated user');
    }
    return this.escrowService.lockEscrow(id, dto);
  }

  @Post(':id/release')
  releaseEscrow(
    @Param('id') id: string,
    @Body() dto: EscrowActionDto,
    @CurrentUser() user: any,
  ) {
    if (dto.actor.toLowerCase() !== user.address.toLowerCase()) {
      throw new BadRequestException('Actor does not match authenticated user');
    }
    return this.escrowService.releaseEscrow(id, dto);
  }

  @Post(':id/refund')
  refundEscrow(
    @Param('id') id: string,
    @Body() dto: EscrowActionDto,
    @CurrentUser() user: any,
  ) {
    if (dto.actor.toLowerCase() !== user.address.toLowerCase()) {
      throw new BadRequestException('Actor does not match authenticated user');
    }
    return this.escrowService.refundEscrow(id, dto);
  }
}
