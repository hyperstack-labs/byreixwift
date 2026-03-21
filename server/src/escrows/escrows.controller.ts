import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateEscrowDto, EscrowActionDto } from "./dto";
import { EscrowsService } from "./escrows.service";

@Controller("escrows")
export class EscrowsController {
  constructor(private readonly escrowsService: EscrowsService) {}

  @Get()
  listEscrows() {
    return this.escrowsService.listEscrows();
  }

  @Get(":id")
  getEscrow(@Param("id") id: string) {
    return this.escrowsService.getEscrow(id);
  }

  @Get(":id/events")
  getEscrowEvents(@Param("id") id: string) {
    return this.escrowsService.getEvents(id);
  }

  @Post()
  createEscrow(@Body() dto: CreateEscrowDto) {
    return this.escrowsService.createEscrow(dto);
  }

  @Post(":id/lock")
  lockEscrow(@Param("id") id: string, @Body() dto: EscrowActionDto) {
    return this.escrowsService.lockEscrow(id, dto);
  }

  @Post(":id/release")
  releaseEscrow(@Param("id") id: string, @Body() dto: EscrowActionDto) {
    return this.escrowsService.releaseEscrow(id, dto);
  }

  @Post(":id/refund")
  refundEscrow(@Param("id") id: string, @Body() dto: EscrowActionDto) {
    return this.escrowsService.refundEscrow(id, dto);
  }
}
