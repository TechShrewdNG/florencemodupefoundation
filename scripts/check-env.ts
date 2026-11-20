/** Fails early with a readable list when required settings are missing. */
function checkEnv() {
  const onVercel = Boolean(process.env.VERCEL);
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL (a Postgres connection string, e.g. from Neon: postgresql://…)");
  }
  if (onVercel && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
    missing.push("SESSION_SECRET (at least 32 random characters)");
  }
  if (onVercel && !process.env.BLOB_READ_WRITE_TOKEN) {
    missing.push("BLOB_READ_WRITE_TOKEN (connect a Vercel Blob store to the project)");
  }
  if (!missing.length) return;
  console.error(
    [
      "",
      `✗ ${onVercel ? "This deployment" : "Your environment"} is missing required settings:`,
      ...missing.map((m) => `   • ${m}`),
      "",
      onVercel
        ? "  Add them in Vercel → Project → Settings → Environment Variables, then redeploy."
        : "  Add them to .env.local (see .env.example).",
      "  See the “Deploying” section of README.md for step-by-step instructions.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

checkEnv();
