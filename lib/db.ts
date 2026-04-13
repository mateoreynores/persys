import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { getDatabaseUrl, isDatabaseConfigured } from "@/lib/env";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }

  const client = neon(url);
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}
