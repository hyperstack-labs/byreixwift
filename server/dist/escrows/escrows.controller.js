"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowsController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const escrows_service_1 = require("./escrows.service");
let EscrowsController = class EscrowsController {
    escrowsService;
    constructor(escrowsService) {
        this.escrowsService = escrowsService;
    }
    listEscrows() {
        return this.escrowsService.listEscrows();
    }
    getEscrow(id) {
        return this.escrowsService.getEscrow(id);
    }
    getEscrowEvents(id) {
        return this.escrowsService.getEvents(id);
    }
    createEscrow(dto) {
        return this.escrowsService.createEscrow(dto);
    }
    lockEscrow(id, dto) {
        return this.escrowsService.lockEscrow(id, dto);
    }
    releaseEscrow(id, dto) {
        return this.escrowsService.releaseEscrow(id, dto);
    }
    refundEscrow(id, dto) {
        return this.escrowsService.refundEscrow(id, dto);
    }
};
exports.EscrowsController = EscrowsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "listEscrows", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "getEscrow", null);
__decorate([
    (0, common_1.Get)(":id/events"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "getEscrowEvents", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEscrowDto]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "createEscrow", null);
__decorate([
    (0, common_1.Post)(":id/lock"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EscrowActionDto]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "lockEscrow", null);
__decorate([
    (0, common_1.Post)(":id/release"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EscrowActionDto]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "releaseEscrow", null);
__decorate([
    (0, common_1.Post)(":id/refund"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EscrowActionDto]),
    __metadata("design:returntype", void 0)
], EscrowsController.prototype, "refundEscrow", null);
exports.EscrowsController = EscrowsController = __decorate([
    (0, common_1.Controller)("escrows"),
    __metadata("design:paramtypes", [escrows_service_1.EscrowsService])
], EscrowsController);
