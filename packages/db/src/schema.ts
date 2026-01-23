import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

// 👤 Users table
export const usersTable = pgTable("users", {
  ClerkId: varchar().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// Export types for use in application code
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export const ChatTable = pgTable("chats", {
  userId: varchar(),
  roomid: varchar({ length: 255 }).notNull(),
  message: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Export types for use in application code
export type Chat = typeof ChatTable.$inferSelect;
export type NewChat = typeof ChatTable.$inferInsert;
