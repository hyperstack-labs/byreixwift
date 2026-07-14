ALTER TABLE "users" ADD COLUMN "kyc_status" text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_tier" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_verified_at" timestamp;