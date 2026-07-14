import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
  Redirect,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { KycService } from "./kyc.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import type { Request } from "express";

@Controller("kyc")
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(JwtAuthGuard)
  @Get("status")
  async getStatus(@CurrentUser() user: { id: string; address: string }) {
    const [dbUser] = await db
      .select({
        kycStatus: users.kycStatus,
        kycTier: users.kycTier,
        kycVerifiedAt: users.kycVerifiedAt,
      })
      .from(users)
      .where(eq(users.id, user.id));

    return {
      kycStatus: dbUser?.kycStatus || "unverified",
      kycTier: dbUser?.kycTier || null,
      kycVerifiedAt: dbUser?.kycVerifiedAt || null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("authorize")
  async authorize(@CurrentUser() user: { id: string; address: string }) {
    const { url, state } = await this.kycService.getAuthorizeUrl(user.id);
    return { url, state };
  }

  @Get("callback")
  @Redirect()
  async callback(
    @Query("code") code: string,
    @Query("state") state: string,
  ) {
    if (!code || !state) {
      throw new UnauthorizedException("Missing code or state");
    }

    const { kycStatus, kycTier } = await this.kycService.handleCallback(code, state);
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    return {
      url: `${frontendUrl}/app/kyc/callback?status=${kycStatus}&tier=${kycTier || ""}`,
    };
  }

  @Post("webhook")
  async webhook(@Body() body: any, @Headers("x-webhook-signature") signature: string) {
    if (!signature) {
      throw new UnauthorizedException("Missing webhook signature");
    }
    await this.kycService.handleWebhook(body, signature);
    return { received: true };
  }
}
