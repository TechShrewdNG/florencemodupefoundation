import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function databaseUrl() {
  return process.env.DATABASE_URL || "file:./data/fmf.db";
}

/** SQLite can't create missing folders, so make sure a local database's folder exists. */
function ensureLocalDir(url: string) {
  if (!url.startsWith("file:")) return;
  const dir = path.dirname(url.slice("file:".length));
  try {
    fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
  } catch {
    // Read-only file systems: let the client report the real error.
  }
}

const globalForDb = globalThis as unknown as { __fmfClient?: Client };

const client =
  globalForDb.__fmfClient ??
  (ensureLocalDir(databaseUrl()),
  createClient({
    url: databaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  }));

if (process.env.NODE_ENV !== "production") globalForDb.__fmfClient = client;

export const db = drizzle(client, { schema });
export { schema };
