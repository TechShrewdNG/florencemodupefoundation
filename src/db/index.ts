import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function databaseUrl() {
  return process.env.DATABASE_URL || "file:./data/fmf.db";
}

const globalForDb = globalThis as unknown as { __fmfClient?: Client };

const client =
  globalForDb.__fmfClient ??
  createClient({
    url: databaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__fmfClient = client;

export const db = drizzle(client, { schema });
export { schema };
