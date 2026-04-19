"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const siwe_1 = require("siwe");
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    JWT_SECRET = process.env.JWT_SECRET || 'secret';
    REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';
    getNonce() {
        return (0, siwe_1.generateNonce)();
    }
    async verifySignature(message, signature) {
        try {
            const siweMessage = new siwe_1.SiweMessage(message);
            const { data: fields } = await siweMessage.verify({ signature });
            // 1. Find or create user
            let [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.address, fields.address));
            if (!user) {
                [user] = await db_1.db.insert(schema_1.users).values({ address: fields.address }).returning();
            }
            // 2. Generate tokens
            const accessToken = this.generateAccessToken(user.id, user.address);
            const refreshToken = this.generateRefreshToken();
            // 3. Store refresh token (hashed)
            const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
            await db_1.db.insert(schema_1.refreshTokens).values({
                userId: user.id,
                token: hashedToken,
                expiresAt,
            });
            return {
                accessToken,
                refreshToken,
                user: { id: user.id, address: user.address },
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
    }
    generateAccessToken(userId, address) {
        return jwt.sign({ sub: userId, address }, this.JWT_SECRET, { expiresIn: '15m' });
    }
    generateRefreshToken() {
        return crypto.randomBytes(40).toString('hex');
    }
    async refresh(token) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const [storedToken] = await db_1.db
            .select()
            .from(schema_1.refreshTokens)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, hashedToken), (0, drizzle_orm_1.eq)(schema_1.refreshTokens.revoked, false)));
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, storedToken.userId));
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            accessToken: this.generateAccessToken(user.id, user.address),
        };
    }
    async logout(token) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        await db_1.db
            .update(schema_1.refreshTokens)
            .set({ revoked: true })
            .where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, hashedToken));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
