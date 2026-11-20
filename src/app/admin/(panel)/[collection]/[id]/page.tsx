import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/db";
import { requireUser } from "@/lib/auth";
import { getCollection, toMeta } from "@/lib/admin/collections";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { CollectionForm } from "@/components/admin/collection-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { btn, Card, PageHeader } from "@/components/admin/ui";

const defaults: Record<string, Record<string, unknown>> = {
  pages: { published: true, showInNav: true },
  posts: { published: true },
};

export default async function EditItem({ params }: PageProps<"/admin/[collection]/[id]">) {
  await requireUser();
  const { collection, id: idParam } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  const meta = toMeta(c);

  const isNew = idParam === "new";
  const id = isNew ? null : Number(idParam);
  if (!isNew && !Number.isInteger(id)) notFound();

  let values: Record<string, unknown> = defaults[c.key] ?? {};
  if (id !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = c.table as any;
    const [row] = await db.select().from(t).where(eq(t.id, id));
    if (!row) notFound();
    values = row;
  }
  const isSystem = Boolean(values.system);
  const publicPath = id !== null ? c.publicPath?.(values) : null;

  return (
    <>
      <PageHeader
        back={{ href: `/admin/${c.key}`, label: c.label }}
        title={isNew ? `New ${c.singular.toLowerCase()}` : String(values[c.titleField] ?? c.singular)}
        action={
          publicPath ? (
            <Link href={publicPath} target="_blank" className={btn.secondary}>
              <ExternalLink className="size-4" /> View on site
            </Link>
          ) : undefined
        }
      />
      <CollectionForm
        fields={meta.fields}
        values={values}
        action={saveItem.bind(null, c.key, id)}
        lockedFields={isSystem ? ["slug"] : []}
        footer={
          id !== null && !isSystem ? (
            <Card className="p-5">
              <ConfirmButton
                action={deleteItem.bind(null, c.key, id)}
                confirm={`Delete this ${c.singular.toLowerCase()}? This can't be undone.`}
                className={`${btn.danger} w-full`}
              >
                <Trash2 className="size-4" /> Delete {c.singular.toLowerCase()}
              </ConfirmButton>
            </Card>
          ) : isSystem ? (
            <p className="px-1 text-xs text-gray-500">
              This is a built-in page. Its list content (e.g. team members, values) is managed in its own section.
            </p>
          ) : undefined
        }
      />
    </>
  );
}
