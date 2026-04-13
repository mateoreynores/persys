import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      process.env.NEON_DATABASE_URL ??
      process.env.NEON_POSTGRES_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/persys",
  },
});
