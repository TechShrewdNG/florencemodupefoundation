/** On Vercel the file system is read-only and temporary, so a hosted database and storage are required. */
function checkHostedEnv() {
  if (!process.env.VERCEL) return;
  const missing: string[] = [];
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    missing.push("DATABASE_URL (a Turso database URL, libsql://…) and DATABASE_AUTH_TOKEN");
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    missing.push("SESSION_SECRET (at least 32 random characters)");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    missing.push("BLOB_READ_WRITE_TOKEN (connect a Vercel Blob store to the project)");
  }
  if (!missing.length) return;
  console.error(
    [
      "",
      "✗ This deployment is missing required environment variables:",
      ...missing.map((m) => `   • ${m}`),
      "",
      "  Add them in Vercel → Project → Settings → Environment Variables, then redeploy.",
      "  See the “Deploying” section of README.md for step-by-step instructions.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

checkHostedEnv();
