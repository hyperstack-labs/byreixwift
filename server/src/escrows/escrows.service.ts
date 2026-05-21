import { BadRequestException, Injectable, NotFoundException, Inject } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateEscrowDto, EscrowActionDto } from "./dto";
import { EscrowEventRecord, EscrowRecord, EscrowState } from "./escrow.types";
import { escrows, escrowEvents } from "../db/schema";
import { eq } from "drizzle-orm";


@Injectable()
export class EscrowsService {
  constructor(@Inject("DB") private readonly db: any) {}

  async listEscrows(): Promise<EscrowRecord[]> {
    const rows = await this.db.select().from(escrows).orderBy(escrows.createdAt, "desc");
    return rows;
  }

  async getEscrow(id: string): Promise<EscrowRecord> {
    const [escrow] = await this.db.select().from(escrows).where(eq(escrows.id, id));
    if (!escrow) {
      throw new NotFoundException("Escrow not found");
    }
    return escrow;
  }

  async getEvents(id: string): Promise<EscrowEventRecord[]> {
    await this.getEscrow(id); // ensure escrow exists
    const rows = await this.db.select().from(escrowEvents).where(eq(escrowEvents.escrowId, id));
    return rows;
  }

  async createEscrow(dto: CreateEscrowDto) {
    if (dto.buyer.toLowerCase() === dto.seller.toLowerCase()) {
      throw new BadRequestException("buyer and seller must be different addresses");
    }

    const now = new Date().toISOString();
    const escrow: EscrowRecord = {
      id: randomUUID(),
      buyer: dto.buyer,
      seller: dto.seller,
      amount: Number(dto.amount.toFixed(8)),
      tokenSymbol: dto.tokenSymbol.trim().toUpperCase(),
      description: dto.description.trim(),
      fixedFee: Number((dto.fixedFee ?? 0).toFixed(8)),
      state: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await this.db.insert(escrows).values(escrow);
    await this.appendEvent(escrow.id, "EscrowCreated", escrow.state, {
      amount: escrow.amount,
      tokenSymbol: escrow.tokenSymbol,
      fixedFee: escrow.fixedFee,
    });

    return {
      escrow,
      events: await this.getEvents(escrow.id),
    };
  }

  async lockEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(escrow.buyer, dto.actor, "Only the buyer can lock escrow");
    this.assertState(escrow.state, "pending", "Only pending escrow can be locked");

    return this.transition(id, "locked", "TransactionLocked", { actor: dto.actor });
  }

  async releaseEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(escrow.buyer, dto.actor, "Only the buyer can release escrow");
    this.assertState(escrow.state, "locked", "Only locked escrow can be released");

    return this.transition(id, "released", "FundsReleased", {
      actor: dto.actor,
      amountToSeller: Number((escrow.amount - escrow.fixedFee).toFixed(8)),
      fee: escrow.fixedFee,
    });
  }

  async refundEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(escrow.seller, dto.actor, "Only the seller can refund escrow");

    if (escrow.state === "released" || escrow.state === "refunded") {
      throw new BadRequestException("Escrow can no longer be refunded");
    }

    return this.transition(id, "refunded", "FundsRefunded", { actor: dto.actor });
  }

  private async transition(
    id: string,
    nextState: EscrowState,
    eventType: EscrowEventRecord["type"],
    metadata?: Record<string, string | number>
  ) {
    const escrow = await this.getEscrow(id);
    const updated: EscrowRecord = {
      ...escrow,
      state: nextState,
      updatedAt: new Date().toISOString(),
    };

    await this.db.update(escrows).set(updated).where(eq(escrows.id, id));
    await this.appendEvent(id, eventType, nextState, metadata);

    return {
      escrow: updated,
      events: await this.getEvents(id),
    };
  }

 private async appendEvent(
  escrowId: string,
  type: EscrowEventRecord["type"],
  state: EscrowState,
  metadata?: Record<string, string | number>
) {
  const nextEvent = {
    id: randomUUID(),
    escrowId,
    type,
    state,
    occurredAt: new Date().toISOString(),
    metadata: metadata ? JSON.stringify(metadata) : null,
  };

  await this.db.insert(escrowEvents).values(nextEvent);
}

  private assertActor(expectedActor: string, actor: string, message: string) {
    if (expectedActor.toLowerCase() !== actor.toLowerCase()) {
      throw new BadRequestException(message);
    }
  }

  private assertState(currentState: EscrowState, expectedState: EscrowState, message: string) {
    if (currentState !== expectedState) {
      throw new BadRequestException(message);
    }
  }
}
