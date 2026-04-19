"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    address: (0, pg_core_1.text)("address").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.refreshTokens = (0, pg_core_1.pgTable)("refresh_tokens", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    token: (0, pg_core_1.text)("token").notNull(), // Hashed refresh token
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    revoked: (0, pg_core_1.boolean)("revoked").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
