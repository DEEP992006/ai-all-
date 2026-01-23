import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  ClerkId: varchar().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
});
