import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@repo/db/schema';

// Re-export schema for convenience
export * from '@repo/db/schema';

// Create database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the database client with schema
export const db = drizzle(pool, { schema });
