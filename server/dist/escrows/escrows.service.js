"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let EscrowsService = class EscrowsService {
    escrows = new Map();
    events = new Map();
    listEscrows() {
        return Array.from(this.escrows.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    getEscrow(id) {
        const escrow = this.escrows.get(id);
        if (!escrow) {
            throw new common_1.NotFoundException("Escrow not found");
        }
        return escrow;
    }
    getEvents(id) {
        this.getEscrow(id);
        return this.events.get(id) ?? [];
    }
    createEscrow(dto) {
        if (dto.buyer.toLowerCase() === dto.seller.toLowerCase()) {
            throw new common_1.BadRequestException("buyer and seller must be different addresses");
        }
        const now = new Date().toISOString();
        const escrow = {
            id: (0, crypto_1.randomUUID)(),
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
    lockEscrow(id, dto) {
        const escrow = this.getEscrow(id);
        this.assertActor(escrow.buyer, dto.actor, "Only the buyer can lock escrow");
        this.assertState(escrow.state, "pending", "Only pending escrow can be locked");
        return this.transition(id, "locked", "TransactionLocked", { actor: dto.actor });
    }
    releaseEscrow(id, dto) {
        const escrow = this.getEscrow(id);
        this.assertActor(escrow.buyer, dto.actor, "Only the buyer can release escrow");
        this.assertState(escrow.state, "locked", "Only locked escrow can be released");
        return this.transition(id, "released", "FundsReleased", {
            actor: dto.actor,
            amountToSeller: Number((escrow.amount - escrow.fixedFee).toFixed(8)),
            fee: escrow.fixedFee,
        });
    }
    refundEscrow(id, dto) {
        const escrow = this.getEscrow(id);
        this.assertActor(escrow.seller, dto.actor, "Only the seller can refund escrow");
        if (escrow.state === "released" || escrow.state === "refunded") {
            throw new common_1.BadRequestException("Escrow can no longer be refunded");
        }
        return this.transition(id, "refunded", "FundsRefunded", { actor: dto.actor });
    }
    transition(id, nextState, eventType, metadata) {
        const escrow = this.getEscrow(id);
        const updated = {
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
    appendEvent(escrowId, type, state, metadata) {
        const nextEvent = {
            id: (0, crypto_1.randomUUID)(),
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
    assertActor(expectedActor, actor, message) {
        if (expectedActor.toLowerCase() !== actor.toLowerCase()) {
            throw new common_1.BadRequestException(message);
        }
    }
    assertState(currentState, expectedState, message) {
        if (currentState !== expectedState) {
            throw new common_1.BadRequestException(message);
        }
    }
};
exports.EscrowsService = EscrowsService;
exports.EscrowsService = EscrowsService = __decorate([
    (0, common_1.Injectable)()
], EscrowsService);
