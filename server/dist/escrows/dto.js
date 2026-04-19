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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowActionDto = exports.CreateEscrowDto = void 0;
const class_validator_1 = require("class-validator");
const walletPattern = /^0x[a-fA-F0-9]{40}$/;
class CreateEscrowDto {
    buyer;
    seller;
    amount;
    tokenSymbol;
    description;
    fixedFee;
}
exports.CreateEscrowDto = CreateEscrowDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(walletPattern, { message: "buyer must be a valid wallet address" }),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "buyer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(walletPattern, { message: "seller must be a valid wallet address" }),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "seller", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 8 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateEscrowDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "tokenSymbol", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 8 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateEscrowDto.prototype, "fixedFee", void 0);
class EscrowActionDto {
    actor;
}
exports.EscrowActionDto = EscrowActionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(walletPattern, { message: "actor must be a valid wallet address" }),
    __metadata("design:type", String)
], EscrowActionDto.prototype, "actor", void 0);
