import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  const subs = await db.select().from(schema.subscribers).orderBy(desc(schema.subscribers.createdAt));
  const csv = ["email,joined", ...subs.map((s) => `"${s.email.replace(/"/g, '""')}",${s.createdAt.toISOString()}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers.csv"`,
    },
  });
}
