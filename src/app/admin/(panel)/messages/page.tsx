import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { btn, Card, PageHeader } from "@/components/admin/ui";

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireUser();
  const sp = await searchParams;
  const selectedId = Number(sp.id) || null;
  const all = await db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
  let selected = all.find((m) => m.id === selectedId) ?? null;
  if (selected && !selected.read) {
    await db.update(schema.messages).set({ read: true }).where(eq(schema.messages.id, selected.id));
    selected = { ...selected, read: true };
  }

  return (
    <>
      <PageHeader title="Messages" description="Submissions from the contact form." />
      {all.length === 0 ? (
        <Card className="p-10 text-center text-sm text-gray-500">No messages yet.</Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto">
            {all.map((m) => (
              <Link
                key={m.id}
                href={`/admin/messages?id=${m.id}`}
                className={`block px-4 py-3 text-sm transition hover:bg-gray-50 ${m.id === selected?.id ? "bg-brand-50" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate ${m.read || m.id === selected?.id ? "text-gray-700" : "font-bold text-gray-900"}`}>{m.name}</span>
                  <span className="shrink-0 text-xs text-gray-400">{m.createdAt.toLocaleDateString("en-GB")}</span>
                </div>
                <p className="truncate text-gray-500">{m.subject || m.body}</p>
              </Link>
            ))}
          </Card>
          {selected ? (
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{selected.subject || "(no subject)"}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selected.name} · <a className="text-brand-600 hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>
                    {selected.phone && <> · {selected.phone}</>}
                  </p>
                  <p className="text-xs text-gray-400">{selected.createdAt.toLocaleString("en-GB")}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + (selected.subject || "Your message"))}`} className={btn.primary}>
                    <Mail className="size-4" /> Reply
                  </a>
                  <form action={setMessageRead.bind(null, selected.id, false)}>
                    <button className={btn.secondary} title="Mark as unread">
                      <MailOpen className="size-4" />
                    </button>
                  </form>
                  <ConfirmButton action={deleteMessage.bind(null, selected.id)} confirm="Delete this message?" className={btn.danger}>
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </div>
              </div>
              <p className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-800">{selected.body}</p>
            </Card>
          ) : (
            <Card className="grid place-items-center p-10 text-sm text-gray-500">Select a message to read it.</Card>
          )}
        </div>
      )}
    </>
  );
}
