import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { Check, ExternalLink, Lock, Plus } from "lucide-react";
import { db } from "@/db";
import { requireUser } from "@/lib/auth";
import { getCollection } from "@/lib/admin/collections";
import { btn, Card, Flash, PageHeader } from "@/components/admin/ui";

export default async function CollectionList({ params, searchParams }: PageProps<"/admin/[collection]">) {
  await requireUser();
  const { collection } = await params;
  const sp = await searchParams;
  const c = getCollection(collection);
  if (!c) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = c.table as any;
  const rows: Record<string, unknown>[] = await db
    .select()
    .from(t)
    .orderBy(c.orderBy === "publishedAt" ? desc(t.publishedAt) : asc(t.sortOrder), desc(t.id));

  return (
    <>
      <PageHeader
        title={c.label}
        description={c.description}
        action={
          <Link href={`/admin/${c.key}/new`} className={btn.primary}>
            <Plus className="size-4" /> New {c.singular.toLowerCase()}
          </Link>
        }
      />
      {sp.saved && <Flash message="Saved. Your changes are live on the website." />}
      {sp.deleted && <Flash message="Deleted." />}
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-500">Nothing here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  {c.columns.filter((col) => col.type === "image").map((col) => <th key={col.name} className="w-20 px-4 py-3" />)}
                  <th className="px-4 py-3">{c.fields.find((f) => f.name === c.titleField)?.label}</th>
                  {c.columns.filter((col) => col.type !== "image").map((col) => (
                    <th key={col.name} className="px-4 py-3">{col.label}</th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const href = `/admin/${c.key}/${row.id}`;
                  const publicPath = c.publicPath?.(row);
                  return (
                    <tr key={String(row.id)} className="hover:bg-gray-50">
                      {c.columns.filter((col) => col.type === "image").map((col) => (
                        <td key={col.name} className="px-4 py-2">
                          {row[col.name] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={String(row[col.name])} alt="" className="h-10 w-14 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-14 rounded bg-gray-100" />
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <Link href={href} className="font-medium text-gray-900 hover:text-brand-600">
                          {String(row[c.titleField] ?? "Untitled")}
                        </Link>
                        {Boolean(row.system) && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500" title="Built-in page">
                            <Lock className="size-3" /> built-in
                          </span>
                        )}
                      </td>
                      {c.columns.filter((col) => col.type !== "image").map((col) => (
                        <td key={col.name} className="max-w-xs truncate px-4 py-3 text-gray-600">
                          {col.type === "boolean" ? (
                            row[col.name] ? <Check className="size-4 text-emerald-600" /> : <span className="text-gray-400">Draft</span>
                          ) : col.name === "slug" ? (
                            `/${row.slug}`
                          ) : (
                            String(row[col.name] ?? "") || <span className="text-gray-300">—</span>
                          )}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {publicPath && (
                          <Link href={publicPath} target="_blank" className="mr-4 inline-flex text-gray-400 hover:text-brand-600" title="View on site">
                            <ExternalLink className="size-4" />
                          </Link>
                        )}
                        <Link href={href} className="font-semibold text-brand-600 hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
