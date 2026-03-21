import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateEscrowDto, EscrowActionDto } from "./dto";
import { EscrowEventRecord, EscrowRecord, EscrowState } from "./escrow.types";

@Injectable()
export class EscrowsService {
  private readonly escrows = new Map<string, EscrowRecord>();
  private readonly events = new Map<string, EscrowEventRecord[]>();

  listEscrows(): EscrowRecord[] {
    return Array.from(this.escrows.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getEscrow(id: string): EscrowRecord {
    const escrow = this.escrows.get(id);
    if (!escrow) {
      throw new NotFoundException("Escrow not found");
    }
    return escrow;
  }

  getEvents(id: string): EscrowEventRecord[] {
    this.getEscrow(id);
    return this.events.get(id) ?? [];
  }

  createEscrow(dto: CreateEscrowDto) {
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

    this.escrows.set(escrow.id, escrow);
    this.appendEvent(escrow.id, "EscrowCreated", escrow.state, {
      amount: escrow.amount,
      tokenSymbol: escrow.tokenSymbol,
      fixedFee: escrow.fixedFee,
    });

    return {
      escrow,
      events: this.getEvents(escrow.id),
    };
  }

  lockEscrow(id: string, dto: EscrowActionDto) {
    const escrow = this.getEscrow(id);
    this.assertActor(escrow.buyer, dto.actor, "Only the buyer can lock escrow");
    this.assertState(escrow.state, "pending", "Only pending escrow can be locked");

    return this.transition(id, "locked", "TransactionLocked", { actor: dto.actor });
  }

  releaseEscrow(id: string, dto: EscrowActionDto) {
    const escrow = this.getEscrow(id);
    this.assertActor(escrow.buyer, dto.actor, "Only the buyer can release escrow");
    this.assertState(escrow.state, "locked", "Only locked escrow can be released");

    return this.transition(id, "released", "FundsReleased", {
      actor: dto.actor,
      amountToSeller: Number((escrow.amount - escrow.fixedFee).toFixed(8)),
      fee: escrow.fixedFee,
    });
  }

  refundEscrow(id: string, dto: EscrowActionDto) {
    const escrow = this.getEscrow(id);
    this.assertActor(escrow.seller, dto.actor, "Only the seller can refund escrow");

    if (escrow.state === "released" || escrow.state === "refunded") {
      throw new BadRequestException("Escrow can no longer be refunded");
    }

    return this.transition(id, "refunded", "FundsRefunded", { actor: dto.actor });
  }

  private transition(
    id: string,
    nextState: EscrowState,
    eventType: EscrowEventRecord["type"],
    metadata?: Record<string, string | number>
  ) {
    const escrow = this.getEscrow(id);
    const updated: EscrowRecord = {
      ...escrow,
      state: nextState,
      updatedAt: new Date().toISOString(),
    };

    this.escrows.set(id, updated);
    this.appendEvent(id, eventType, nextState, metadata);

    return {
      escrow: updated,
      events: this.getEvents(id),
    };
  }

  private appendEvent(
    escrowId: string,
    type: EscrowEventRecord["type"],
    state: EscrowState,
    metadata?: Record<string, string | number>
  ) {
    const nextEvent: EscrowEventRecord = {
      id: randomUUID(),
      escrowId,
      type,
      state,
      occurredAt: new Date().toISOString(),
      metadata,
    };

    const currentEvents = this.events.get(escrowId) ?? [];
    currentEvents.push(nextEvent);
    this.events.set(escrowId, currentEvents);
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
