import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { Card, PageHeader } from "@/components/admin/ui";

export default async function Dashboard() {
  const user = await requireUser();
  const c = async (t: SQLiteTable) => (await db.select({ n: count() }).from(t))[0].n;
  const [pages, posts, photos, subs, team, unread, recent] = await Promise.all([
    c(schema.pages),
    c(schema.posts),
    c(schema.galleryImages),
    c(schema.subscribers),
    c(schema.teamMembers),
    db.select({ n: count() }).from(schema.messages).where(eq(schema.messages.read, false)).then((r) => r[0].n),
    db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt)).limit(5),
  ]);

  const stats = [
    { label: "Pages", value: pages, href: "/admin/pages" },
    { label: "News posts", value: posts, href: "/admin/posts" },
    { label: "Gallery photos", value: photos, href: "/admin/gallery" },
    { label: "Team members", value: team, href: "/admin/team" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
    { label: "Subscribers", value: subs, href: "/admin/subscribers" },
  ];

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description="Manage the content of the Florence Modupe Foundation website." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 transition hover:border-brand-300 hover:shadow-md">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/admin/posts/new" className="text-brand-600 hover:underline">+ Write a news post</Link>
            <Link href="/admin/gallery" className="text-brand-600 hover:underline">+ Upload gallery photos</Link>
            <Link href="/admin/pages" className="text-brand-600 hover:underline">Edit page content</Link>
            <Link href="/admin/settings" className="text-brand-600 hover:underline">Update contact details & home page text</Link>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {recent.length ? (
            <ul className="mt-4 divide-y divide-gray-100">
              {recent.map((m) => (
                <li key={m.id} className="py-2.5">
                  <Link href={`/admin/messages?id=${m.id}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className={`truncate ${m.read ? "text-gray-600" : "font-semibold"}`}>
                      {m.name} — {m.subject || m.body.slice(0, 60)}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">{m.createdAt.toLocaleDateString("en-GB")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No messages yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}
