import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type DB = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __fmfPool?: Pool; __fmfDb?: DB };

function getDb(): DB {
  if (!globalForDb.__fmfDb) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Create a Postgres database (e.g. a free Neon project at neon.tech) and put its connection string in .env.local. See README.md.",
      );
    }
    const pool = new Pool({ connectionString: url, max: 5 });
    // On Vercel, release idle connections before a function instance is suspended.
    attachDatabasePool(pool);
    globalForDb.__fmfPool = pool;
    globalForDb.__fmfDb = drizzle({ client: pool, schema });
  }
  return globalForDb.__fmfDb;
}

/** Connects on first use, so importing this module never needs DATABASE_URL. */
export const db = new Proxy({} as DB, {
  get(_target, key) {
    const real = getDb();
    const value = Reflect.get(real, key, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export async function closeDb() {
  await globalForDb.__fmfPool?.end();
  globalForDb.__fmfPool = undefined;
  globalForDb.__fmfDb = undefined;
}

export { schema };
