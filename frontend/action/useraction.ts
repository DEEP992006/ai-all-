"use server"
import { db, usersTable } from "@repo/db"
import { eq } from "drizzle-orm"

// 📧 Fetch user email from database by Clerk ID
export const fetchEmail = async (userId: string) => {
  const user = await db.select().from(usersTable).where(eq(usersTable.ClerkId, userId))
  return user[0]?.email || null
}