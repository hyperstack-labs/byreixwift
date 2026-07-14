CREATE TABLE "kyc_states" (
	"state" text PRIMARY KEY NOT NULL,
	"code_verifier" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "escrows" ADD COLUMN "on_chain_id" integer;--> statement-breakpoint
ALTER TABLE "escrows" ADD COLUMN "tx_hash" text;--> statement-breakpoint
ALTER TABLE "kyc_states" ADD CONSTRAINT "kyc_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;