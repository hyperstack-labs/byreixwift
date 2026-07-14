import { Injectable, UnauthorizedException, ServiceUnavailableException } from "@nestjs/common";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class KycService {
  private readonly clientId = process.env.KYCPORT_CLIENT_ID || "";
  private readonly clientSecret = process.env.KYCPORT_CLIENT_SECRET || "";
  private readonly redirectUri =
    process.env.KYCPORT_REDIRECT_URI ||
    "http://localhost:3001/api/kyc/callback";
  private readonly webhookSecret =
    process.env.KYCPORT_WEBHOOK_SECRET || "";
  private readonly issuer =
    process.env.KYCPORT_ISSUER || "https://www.kycport.com";
  private readonly oidcConfigUrl = this.issuer
    ? `${this.issuer}/api/oidc/.well-known/openid-configuration`
    : "";

  private oidcConfig: Record<string, any> | null = null;
  private jwks: Record<string, any> | null = null;

  private readonly stateStore = new Map<
    string,
    { codeVerifier: string; userId: string }
  >();

  private assertConfigured(): void {
    if (!this.clientId) {
      throw new ServiceUnavailableException(
        "KYCPort is not configured. Set KYCPORT_CLIENT_ID.",
      );
    }
  }

  private async getOidcConfig(): Promise<Record<string, any>> {
    this.assertConfigured();
    if (this.oidcConfig) return this.oidcConfig;
    const res = await fetch(this.oidcConfigUrl);
    if (!res.ok) {
      throw new ServiceUnavailableException(
        `Failed to fetch KYCPort OIDC config: ${res.status}`,
      );
    }
    this.oidcConfig = await res.json();
    return this.oidcConfig!;
  }

  private async getJwks(): Promise<Record<string, any>> {
    this.assertConfigured();
    if (this.jwks) return this.jwks;
    const config = await this.getOidcConfig();
    const res = await fetch(config.jwks_uri);
    if (!res.ok) {
      throw new ServiceUnavailableException(
        `Failed to fetch KYCPort JWKS: ${res.status}`,
      );
    }
    this.jwks = await res.json();
    return this.jwks!;
  }

  async getAuthorizeUrl(
    userId: string,
  ): Promise<{ url: string; state: string }> {
    const config = await this.getOidcConfig();
    const state = crypto.randomUUID();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    this.stateStore.set(state, { codeVerifier, userId });

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "openid email kyc",
      state,
      nonce: crypto.randomUUID(),
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    return {
      url: `${config.authorization_endpoint}?${params.toString()}`,
      state,
    };
  }

  async handleCallback(
    code: string,
    state: string,
  ): Promise<{ kycStatus: string; kycTier: string | null }> {
    const stored = this.stateStore.get(state);
    if (!stored) {
      throw new UnauthorizedException("Invalid or expired state");
    }
    this.stateStore.delete(state);

    const config = await this.getOidcConfig();
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code_verifier: stored.codeVerifier,
    });

    const tokenRes = await fetch(config.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody.toString(),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new ServiceUnavailableException(
        `KYCPort token exchange failed: ${tokenData.error_description || tokenData.error}`,
      );
    }

    const idToken = tokenData.id_token as string;
    const payload = await this.verifyIdToken(idToken);

    const kycStatus = (payload.kyc_status as string) || "unverified";
    const kycTier = (payload.kyc_tier as string) || null;

    const update: Record<string, any> = { kycStatus, kycTier };
    if (kycStatus === "verified") {
      update.kycVerifiedAt = new Date();
    }

    await db.update(users).set(update).where(eq(users.id, stored.userId));

    return { kycStatus, kycTier };
  }

  private generateCodeVerifier(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let result = "";
    const bytes = crypto.getRandomValues(new Uint8Array(64));
    for (let i = 0; i < 64; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Buffer.from(hash)
      .toString("base64url");
  }

  private async verifyIdToken(token: string): Promise<Record<string, any>> {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid ID token format");
    }

    const header = JSON.parse(
      Buffer.from(parts[0], "base64url").toString(),
    );
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString(),
    );

    const jwks = await this.getJwks();
    const jwk = jwks.keys?.find((k: any) => k.kid === header.kid);
    if (!jwk) {
      throw new Error("JWK not found for token kid");
    }

    const key = await crypto.subtle.importKey(
      "jwk",
      jwk as JsonWebKey,
      { name: "Ed25519", namedCurve: "Ed25519" } as any,
      true,
      ["verify"],
    );

    const sig = Buffer.from(parts[2], "base64url");
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const valid = await crypto.subtle.verify("Ed25519", key, sig, data);
    if (!valid) {
      throw new Error("ID token signature invalid");
    }

    if (payload.iss !== this.issuer) {
      throw new Error("Invalid token issuer");
    }
    if (payload.aud !== this.clientId) {
      throw new Error("Invalid token audience");
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired");
    }

    return payload;
  }

  async handleWebhook(
    body: any,
    signature: string,
  ): Promise<void> {
    const expectedSig = await this.computeHmac(body);
    if (signature !== expectedSig) {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    const userAddress = body.address as string;
    if (!userAddress) return;

    const update: Record<string, any> = {};
    if (body.kyc_status) update.kycStatus = body.kyc_status;
    if (body.kyc_tier) update.kycTier = body.kyc_tier;
    if (body.kyc_status === "verified") {
      update.kycVerifiedAt = new Date();
    }

    await db
      .update(users)
      .set(update)
      .where(eq(users.address, userAddress.toLowerCase()));
  }

  private async computeHmac(body: any): Promise<string> {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(JSON.stringify(body)),
    );
    return Buffer.from(sig).toString("hex");
  }
}

