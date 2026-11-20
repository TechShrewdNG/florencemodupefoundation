import { desc } from "drizzle-orm";
import { Download, Trash2 } from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteSubscriber } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { btn, Card, PageHeader } from "@/components/admin/ui";

export default async function SubscribersPage() {
  await requireUser();
  const subs = await db.select().from(schema.subscribers).orderBy(desc(schema.subscribers.createdAt));
  return (
    <>
      <PageHeader
        title="Subscribers"
        description={`${subs.length} newsletter sign-up${subs.length === 1 ? "" : "s"}.`}
        action={
          subs.length > 0 && (
            <a href="/admin/subscribers/export" download className={btn.secondary}>
              <Download className="size-4" /> Export CSV
            </a>
          )
        }
      />
      <Card className="overflow-hidden">
        {subs.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-500">No subscribers yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmButton action={deleteSubscriber.bind(null, s.id)} confirm={`Remove ${s.email}?`} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="size-4" />
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
