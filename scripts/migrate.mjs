import { existsSync } from "node:fs";
import { join } from "node:path";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const cwd = process.cwd();

for (const file of [".env.local", ".env"]) {
  const path = join(cwd, file);
  if (existsSync(path) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(path);
  }
}

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.NEON_POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL / NEON_DATABASE_URL / NEON_POSTGRES_URL.");
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

await migrate(db, {
  migrationsFolder: join(cwd, "drizzle"),
});

console.log("Drizzle migrations applied successfully.");
