import { configDotenv } from 'dotenv';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
configDotenv()
export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
