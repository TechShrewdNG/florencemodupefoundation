/**
 * Creates/migrates the database and seeds starter content on first run.
 * Safe to run repeatedly: seeding only happens when tables are empty.
 *
 *   npm run db:setup
 */
import { migrate } from "drizzle-orm/libsql/migrator";
import { count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import { db, databaseUrl, schema } from "../src/db";
import { seedContent } from "./seed-content";

async function main() {
  const url = databaseUrl();
  if (url.startsWith("file:")) {
    const file = url.slice("file:".length);
    const dir = file.split("/").slice(0, -1).join("/");
    if (dir) fs.mkdirSync(dir, { recursive: true });
  }

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Database migrated");

  await seedAdmin();

  const [{ n }] = await db.select({ n: count() }).from(schema.pages);
  if (n > 0) {
    console.log("✓ Content already present, skipping seed");
    return;
  }
  await seedContent();
  console.log("✓ Starter content seeded");
}

async function seedAdmin() {
  const [{ n }] = await db.select({ n: count() }).from(schema.users);
  if (n > 0) return;
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  await db.insert(schema.users).values({
    email,
    name: process.env.ADMIN_NAME || "Administrator",
    passwordHash: await bcrypt.hash(password, 12),
  });
  console.log(`✓ Admin user created: ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "  ⚠ Using the default password 'changeme123'. Sign in and change it under Admin → Users, or set ADMIN_EMAIL/ADMIN_PASSWORD before first setup.",
    );
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
