import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(), // Hashed refresh token
  expiresAt: timestamp("expires_at").notNull(),
  revoked: boolean("revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const escrows = pgTable("escrows", {
  id: uuid("id").primaryKey().defaultRandom(),

  buyer: text("buyer").notNull(),

  seller: text("seller").notNull(),

  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),

  tokenSymbol: text("token_symbol").notNull(),

  description: text("description").notNull(),

  fixedFee: numeric("fixed_fee", { precision: 20, scale: 8 }).notNull(),

  state: text("state").notNull().default("pending"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const escrowEvents = pgTable("escrow_events", {
  id: uuid("id").primaryKey().defaultRandom(),

  escrowId: uuid("escrow_id")
    .references(() => escrows.id, { onDelete: "cascade" })
    .notNull(),

  type: text("type").notNull(),

  state: text("state").notNull(),

  occurredAt: timestamp("occurred_at").defaultNow().notNull(),

  metadata: text("metadata"), // optional JSON/string log
});
