"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESCROW_EVENT_TYPES = exports.ESCROW_STATES = void 0;
exports.ESCROW_STATES = ["pending", "locked", "released", "refunded"];
exports.ESCROW_EVENT_TYPES = [
    "EscrowCreated",
    "TransactionLocked",
    "FundsReleased",
    "FundsRefunded",
];
