import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SiweMessage, generateNonce } from "siwe";
import * as jwt from "jsonwebtoken";
import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import { eq, and } from "drizzle-orm";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "secret";
  private readonly REFRESH_SECRET =
    process.env.REFRESH_SECRET || "refresh-secret";

  getNonce(): string {
    return generateNonce();
  }

  async verifySignature(message: string, signature: string) {
    try {
      const siweMessage = new SiweMessage(message);
      const { data: fields } = await siweMessage.verify({ signature });
      const normalizedAddress = fields.address.toLowerCase();

      // 1. Find or create user
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.address, normalizedAddress));

      if (!user) {
        [user] = await db
          .insert(users)
          .values({ address: normalizedAddress })
          .returning();
      }

      // 2. Generate tokens
      const accessToken = this.generateAccessTokenWithKyc(
        user.id,
        user.address,
        user.kycStatus,
        user.kycTier,
      );
      const refreshToken = this.generateRefreshToken();

      // 3. Store refresh token (hashed)
      const hashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await db.insert(refreshTokens).values({
        userId: user.id,
        token: hashedToken,
        expiresAt,
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          address: user.address,
          kycStatus: user.kycStatus,
          kycTier: user.kycTier,
        },
      };
    } catch (e) {
      console.error("SIWE verify failed:", (e as Error).message, (e as Error).stack);
      throw new UnauthorizedException("Invalid signature");
    }
  }

  private generateAccessToken(userId: string, address: string): string {
    return jwt.sign({ sub: userId, address }, this.JWT_SECRET, {
      expiresIn: "15m",
    });
  }

  private generateAccessTokenWithKyc(
    userId: string,
    address: string,
    kycStatus: string | null,
    kycTier: string | null,
  ): string {
    return jwt.sign({ sub: userId, address, kycStatus, kycTier }, this.JWT_SECRET, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString("hex");
  }

  async refresh(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, hashedToken),
          eq(refreshTokens.revoked, false),
        ),
      );

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    // 1. Revoke the old refresh token immediately!
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.id, storedToken.id));

    // 2. Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, storedToken.userId));

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // 3. Issue a new access token AND a new rotated refresh token!
    const newAccessToken = this.generateAccessTokenWithKyc(
      user.id,
      user.address,
      user.kycStatus,
      user.kycTier,
    );
    const newRefreshToken = this.generateRefreshToken();

    // 4. Store new refresh token
    const newHashedToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: newHashedToken,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.token, hashedToken));
  }
}
