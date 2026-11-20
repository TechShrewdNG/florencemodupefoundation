import { Suspense } from "react";
import { count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";

// The admin always renders per request behind the session check.
export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-gray-500">Loading…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [{ n }] = await db.select({ n: count() }).from(schema.messages).where(eq(schema.messages.read, false));
  return (
    <>
      <Sidebar user={user} unread={n} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </>
  );
}
