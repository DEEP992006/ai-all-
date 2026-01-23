import { configDotenv } from 'dotenv';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// 🔧 Load environment variables
configDotenv()

// ⚙️ Drizzle Kit configuration for frontend (uses shared schema)
export default defineConfig({
  out: './drizzle',                         // 📁 Migration output directory
  schema: '../packages/db/src/schema.ts',  // 📋 Shared schema from monorepo
  dialect: 'postgresql',                   // 🗄️ Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,        // 🔗 Database connection URL
  },
});
