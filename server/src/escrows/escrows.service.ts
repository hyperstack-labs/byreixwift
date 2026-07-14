import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateEscrowDto, EscrowActionDto } from "./dto";
import { EscrowEventRecord, EscrowRecord, EscrowState } from "./escrow.types";
import { escrows, escrowEvents } from "../db/schema";
import { eq } from "drizzle-orm";
import { ContractService } from "../contracts/contract.service";

@Injectable()
export class EscrowsService {
  /**
   * Initializes the escrow service with backend persistence and on-chain validator helpers.
   */
  constructor(
    @Inject("DB") private readonly db: any,
    private readonly contractService: ContractService,
  ) {}

  /**
   * Retrieves all escrow records ordered chronologically.
   * Required to display users' transactions.
   */
  async listEscrows(): Promise<EscrowRecord[]> {
    const rows = await this.db
      .select()
      .from(escrows)
      .orderBy(escrows.createdAt, "desc");
    return rows;
  }

  /**
   * Retrieves a single escrow record by its UUID.
   * Throws NotFoundException if record does not exist.
   */
  async getEscrow(id: string): Promise<EscrowRecord> {
    const [escrow] = await this.db
      .select()
      .from(escrows)
      .where(eq(escrows.id, id));
    if (!escrow) {
      throw new NotFoundException("Escrow not found");
    }
    return escrow;
  }

  /**
   * Retrieves audit logs and events associated with a specific escrow.
   */
  async getEvents(id: string): Promise<EscrowEventRecord[]> {
    await this.getEscrow(id); // ensure escrow exists
    const rows = await this.db
      .select()
      .from(escrowEvents)
      .where(eq(escrowEvents.escrowId, id));
    return rows;
  }

  /**
   * Registers a new escrow.
   * Verifies the on-chain creation log when running in live/on-chain mode.
   */
  async createEscrow(dto: CreateEscrowDto) {
    if (dto.buyer.toLowerCase() === dto.seller.toLowerCase()) {
      throw new BadRequestException(
        "buyer and seller must be different addresses",
      );
    }

    // Verify on-chain log if registering a live/on-chain escrow
    const onChainMatch = dto.description.match(/^\[OnChainId:\s*(\d+)\]/);
    if (onChainMatch) {
      const onChainId = parseInt(onChainMatch[1], 10);
      if (!dto.txHash) {
        throw new BadRequestException(
          "txHash is required for live/on-chain escrows",
        );
      }
      const isVerified = await this.contractService.verifyOnChainCreation(
        dto.txHash,
        onChainId,
        dto.buyer,
        dto.seller,
        dto.amount,
        dto.fixedFee ?? 0,
      );
      if (!isVerified) {
        throw new BadRequestException(
          "On-chain creation transaction verification failed",
        );
      }
    }

    const now = new Date().toISOString();
    const escrow: EscrowRecord = {
      id: randomUUID(),
      buyer: dto.buyer.toLowerCase(),
      seller: dto.seller.toLowerCase(),
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

  /**
   * Locks the escrow. Requires valid buyer signature and on-chain verification in live mode.
   */
  async lockEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(escrow.buyer, dto.actor, "Only the buyer can lock escrow");
    this.assertState(
      escrow.state,
      "pending",
      "Only pending escrow can be locked",
    );

    await this.verifyOnChainTransitionIfLive(escrow, dto, "EscrowLocked");

    return this.transition(id, "locked", "TransactionLocked", {
      actor: dto.actor,
    });
  }

  /**
   * Releases funds to the seller. Requires buyer action and on-chain verification in live mode.
   */
  async releaseEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(
      escrow.buyer,
      dto.actor,
      "Only the buyer can release escrow",
    );
    this.assertState(
      escrow.state,
      "locked",
      "Only locked escrow can be released",
    );

    await this.verifyOnChainTransitionIfLive(escrow, dto, "EscrowReleased");

    return this.transition(id, "released", "FundsReleased", {
      actor: dto.actor,
      amountToSeller: Number((escrow.amount - escrow.fixedFee).toFixed(8)),
      fee: escrow.fixedFee,
    });
  }

  /**
   * Refunds funds back to the buyer. Requires seller action and on-chain verification in live mode.
   */
  async refundEscrow(id: string, dto: EscrowActionDto) {
    const escrow = await this.getEscrow(id);
    this.assertActor(
      escrow.seller,
      dto.actor,
      "Only the seller can refund escrow",
    );

    if (escrow.state === "released" || escrow.state === "refunded") {
      throw new BadRequestException("Escrow can no longer be refunded");
    }

    await this.verifyOnChainTransitionIfLive(escrow, dto, "EscrowRefunded");

    return this.transition(id, "refunded", "FundsRefunded", {
      actor: dto.actor,
    });
  }

  /**
   * Internal helper to verify on-chain state change logs for live escrows.
   */
  private async verifyOnChainTransitionIfLive(
    escrow: EscrowRecord,
    dto: EscrowActionDto,
    eventName: "EscrowLocked" | "EscrowReleased" | "EscrowRefunded",
  ) {
    const onChainMatch = escrow.description.match(/^\[OnChainId:\s*(\d+)\]/);
    if (onChainMatch) {
      const onChainId = parseInt(onChainMatch[1], 10);
      if (!dto.txHash) {
        throw new BadRequestException(
          "txHash is required to transition live/on-chain escrows",
        );
      }
      const isVerified = await this.contractService.verifyOnChainTransition(
        dto.txHash,
        eventName,
        onChainId,
        dto.actor,
      );
      if (!isVerified) {
        throw new BadRequestException(
          `On-chain transition transaction verification failed for event: ${eventName}`,
        );
      }
    }
  }

  private async transition(
    id: string,
    nextState: EscrowState,
    eventType: EscrowEventRecord["type"],
    metadata?: Record<string, string | number>,
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
    metadata?: Record<string, string | number>,
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

  private assertState(
    currentState: EscrowState,
    expectedState: EscrowState,
    message: string,
  ) {
    if (currentState !== expectedState) {
      throw new BadRequestException(message);
    }
  }
}
