import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateEscrowDto } from "./dto";
import { EscrowsService } from "./escrows.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("escrows")
@UseGuards(JwtAuthGuard)
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
  lockEscrow(@Param("id") id: string, @CurrentUser() user: any) {
    return this.escrowsService.lockEscrow(id, { actor: user.address });
  }

  @Post(":id/release")
  releaseEscrow(@Param("id") id: string, @CurrentUser() user: any) {
    return this.escrowsService.releaseEscrow(id, { actor: user.address });
  }

  @Post(":id/refund")
  refundEscrow(@Param("id") id: string, @CurrentUser() user: any) {
    return this.escrowsService.refundEscrow(id, { actor: user.address });
  }
}
