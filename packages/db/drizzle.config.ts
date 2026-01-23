import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// ⚙️ Drizzle Kit configuration for database migrations
export default defineConfig({
  schema: "./src/schema.ts",     // 📋 Schema file location
  out: "./drizzle",              // 📁 Migration output directory
  dialect: "postgresql",         // 🗄️ Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // 🔗 Database connection URL
  },
});
