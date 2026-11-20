/**
 * Creates/migrates the database and seeds starter content on first run.
 * Safe to run repeatedly: seeding only happens when tables are empty.
 *
 *   npm run db:setup
 */
// Must run before anything opens the database.
import "./check-env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { closeDb, db, schema } from "../src/db";
import { seedContent } from "./seed-content";

async function main() {
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
  if (process.env.VERCEL && !process.env.ADMIN_PASSWORD) {
    console.error(
      "\n✗ Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel → Settings → Environment Variables to create the first admin, then redeploy.\n",
    );
    process.exit(1);
  }
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

main()
  .then(() => closeDb())
  .then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
